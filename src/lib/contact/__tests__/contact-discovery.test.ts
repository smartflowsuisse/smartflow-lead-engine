import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
  status: "New Lead",
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
    assert.match(result.phone?.value ?? "", /41215556677/);
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
});

describe("buildContactPageCandidates", () => {
  it("builds common Swiss contact paths from website origin", () => {
    const candidates = buildContactPageCandidates("https://acme.ch/about");
    assert.ok(candidates.includes("https://acme.ch/contact"));
    assert.ok(candidates.includes("https://acme.ch/kontakt"));
    assert.ok(candidates.includes("https://acme.ch/impressum"));
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
