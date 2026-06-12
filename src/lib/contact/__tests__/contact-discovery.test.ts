import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONTACT_PAGE_PATHS,
  isContactLikeUrl,
  isHtmlPageUrl,
} from "../contact-paths";
import {
  extractContactPageLinksFromHtml,
  extractContactsFromHtml,
  mergeContactDiscovery,
} from "../extract-contacts";
import {
  buildContactDiscoveryUpdate,
  shouldDiscoverContact,
} from "../enrich-lead-contact";
import { buildContactPageCandidates } from "../fetch-website-html";
import type { Lead } from "../../types";

const sampleLead = (overrides: Partial<Lead> = {}): Lead => ({
  id: 1,
  company: "Acme SA",
  website: "https://acme.ch",
  email: null,
  phone: null,
  city: "Zürich",
  industry: "Construction",
  lead_score: 0,
  status: "New",
  outreach_status: "New",
  notes: null,
  contacted_at: null,
  contacted_language: null,
  contact_page_url: null,
  email_confidence: null,
  phone_confidence: null,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  ...overrides,
});

describe("extractContactsFromHtml", () => {
  it("extracts mailto and tel links from homepage HTML", () => {
    const html = `
      <html>
        <body>
          <a href="mailto:info@acme.ch">Email us</a>
          <a href="tel:+41215556677">Call</a>
          <a href="/kontakt">Kontakt</a>
        </body>
      </html>
    `;

    const result = extractContactsFromHtml(html, "https://acme.ch");

    assert.equal(result.email?.value, "info@acme.ch");
    assert.equal(result.email?.confidence, 95);
    assert.equal(result.phone?.value, "+41 21 555 66 77");
    assert.equal(result.contactPageUrl, "https://acme.ch/kontakt");
  });

  it("filters obvious false-positive emails", () => {
    const html = `<a href="mailto:noreply@example.com">Hidden</a>`;
    const result = extractContactsFromHtml(html, "https://acme.ch");
    assert.equal(result.email, null);
  });

  it("prefers higher-confidence matches when merging pages", () => {
    const homepage = extractContactsFromHtml(
      `<a href="mailto:info@acme.ch">Email</a>`,
      "https://acme.ch"
    );
    const contactPage = extractContactsFromHtml(
      `<a href="mailto:contact@acme.ch">Contact</a>`,
      "https://acme.ch/kontakt"
    );

    const merged = mergeContactDiscovery(homepage, contactPage);
    assert.equal(merged.email?.value, "info@acme.ch");
  });

  it("extracts obfuscated email from plain text", () => {
    const html = `<p>Reach us at info [at] acme [dot] ch</p>`;
    const result = extractContactsFromHtml(html, "https://acme.ch/kontakt");
    assert.equal(result.email?.value, "info@acme.ch");
    assert.equal(result.email?.source, "text:contact-page");
  });

  it("prefers structured JSON-LD contact data on contact pages", () => {
    const html = `
      <script type="application/ld+json">
        {"email":"office@acme.ch","telephone":"+41 44 492 06 71"}
      </script>
    `;
    const result = extractContactsFromHtml(html, "https://acme.ch/kontakt");
    assert.equal(result.email?.value, "office@acme.ch");
    assert.equal(result.phone?.value, "+41 44 492 06 71");
  });

  it("extracts microdata email and Swiss phone from text", () => {
    const html = `
      <span itemprop="email">kontakt@acme.ch</span>
      <p>Telefon 044 492 06 70</p>
    `;
    const result = extractContactsFromHtml(html, "https://acme.ch/impressum");
    assert.equal(result.email?.value, "kontakt@acme.ch");
    assert.equal(result.phone?.value, "044 492 06 70");
  });

  it("detects contact page links for about and contact-us paths", () => {
    const html = `
      <a href="/contact-us">Contact us</a>
      <a href="/about">About</a>
      <a href="/datenschutz">Privacy</a>
    `;

    const links = extractContactPageLinksFromHtml(html, "https://acme.ch");
    assert.ok(links.includes("https://acme.ch/contact-us"));
    assert.ok(links.includes("https://acme.ch/about"));
    assert.ok(links.includes("https://acme.ch/datenschutz"));
    assert.equal(
      extractContactsFromHtml(html, "https://acme.ch").contactPageUrl,
      "https://acme.ch/contact-us"
    );
  });
});

describe("isHtmlPageUrl", () => {
  it("rejects CSS, JS, and plugin asset URLs", () => {
    assert.equal(
      isHtmlPageUrl(
        "https://www.marti.ch/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.1.4"
      ),
      false
    );
    assert.equal(isHtmlPageUrl("https://acme.ch/assets/app.js"), false);
    assert.equal(isHtmlPageUrl("https://acme.ch/static/logo.png"), false);
    assert.equal(isHtmlPageUrl("https://acme.ch/kontakt"), true);
    assert.equal(isHtmlPageUrl("https://acme.ch/de/contact"), true);
  });
});

describe("isContactLikeUrl", () => {
  it("rejects plugin and asset URLs even when they contain contact keywords", () => {
    assert.equal(
      isContactLikeUrl(
        "https://www.marti.ch/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.1.4"
      ),
      false
    );
    assert.equal(isContactLikeUrl("https://acme.ch/wp-content/plugins/contact-form-7/includes/js/scripts.js"), false);
    assert.equal(isContactLikeUrl("https://acme.ch/kontakt"), true);
    assert.equal(isContactLikeUrl("https://acme.ch/de/kontakt"), true);
    assert.equal(isContactLikeUrl("https://acme.ch/contact-us"), true);
  });
});

describe("extractContactsFromHtml contact page detection", () => {
  it("ignores contact-form plugin CSS links and prefers real kontakt pages", () => {
    const html = `
      <link rel="stylesheet" href="/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.1.4" />
      <a href="/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.1.4">Broken</a>
      <a href="/kontakt">Kontakt</a>
      <a href="mailto:marti@marti.ch">Email</a>
    `;

    const links = extractContactPageLinksFromHtml(html, "https://www.marti.ch");
    assert.ok(!links.some((url) => url.includes("styles.css")));
    assert.ok(links.includes("https://www.marti.ch/kontakt"));

    const result = extractContactsFromHtml(html, "https://www.marti.ch");
    assert.equal(result.contactPageUrl, "https://www.marti.ch/kontakt");
  });
});

describe("buildContactPageCandidates", () => {
  it("builds common Swiss contact paths from website origin", () => {
    const candidates = buildContactPageCandidates("https://acme.ch/about");
    assert.ok(candidates.includes("https://acme.ch/contact"));
    assert.ok(candidates.includes("https://acme.ch/kontakt"));
    assert.ok(candidates.includes("https://acme.ch/impressum"));
    assert.ok(candidates.includes("https://acme.ch/datenschutz"));
    assert.ok(candidates.includes("https://acme.ch/contact-us"));
    assert.ok(candidates.includes("https://acme.ch/contactez-nous"));
    assert.equal(candidates.length, CONTACT_PAGE_PATHS.length);
  });
});

describe("shouldDiscoverContact", () => {
  it("runs when website exists and contact fields are missing", () => {
    assert.equal(shouldDiscoverContact(sampleLead()), true);
    assert.equal(
      shouldDiscoverContact(
        sampleLead({ email: "info@acme.ch", phone: "+41 21 555 66 77", contact_page_url: "https://acme.ch/kontakt" })
      ),
      false
    );
  });
});

describe("buildContactDiscoveryUpdate", () => {
  it("fills only missing contact fields", () => {
    const updates = buildContactDiscoveryUpdate(sampleLead({ email: "existing@acme.ch" }), {
      email: { value: "info@acme.ch", confidence: 95, source: "mailto:homepage" },
      phone: { value: "+41 21 555 66 77", confidence: 94, source: "tel:homepage" },
      contactPageUrl: "https://acme.ch/kontakt",
      pagesCrawled: ["https://acme.ch"],
    });

    assert.equal(updates?.email, undefined);
    assert.equal(updates?.phone, "+41 21 555 66 77");
    assert.equal(updates?.phone_confidence, 94);
    assert.equal(updates?.contact_page_url, "https://acme.ch/kontakt");
  });
});
