import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildTemplatePackOutreachEmail,
  buildTemplatePackOutreachMailtoHref,
  buildTemplatePackOutreachMessage,
  buildTemplatePackOutreachSubject,
} from "../template-pack-outreach-message";

describe("template pack outreach message", () => {
  it("builds an English construction message for a lead", () => {
    const message = buildTemplatePackOutreachMessage({
      templatePackId: "construction",
      language: "en",
      lead: {
        company: "Stahl- & Traumfabrik AG",
        city: "Zürich",
        industry: "Bauunternehmen",
      },
    });

    assert.ok(message.includes("Hello Stahl- & Traumfabrik AG,"));
    assert.ok(message.includes("Construction Automation Starter"));
    assert.ok(message.includes("Context: Zürich · Bauunternehmen."));
    assert.equal(message.includes("\n\nHello,"), false);
  });

  it("builds a French fiduciary message", () => {
    const message = buildTemplatePackOutreachMessage({
      templatePackId: "fiduciary",
      language: "fr",
      lead: {
        company: "Fiduciaire Exemple SA",
        city: "Lausanne",
        industry: "Fiduciaire",
      },
    });

    assert.ok(message.includes("Bonjour Fiduciaire Exemple SA,"));
    assert.ok(message.includes("Fiduciary Automation Starter"));
    assert.ok(message.includes("Contexte: Lausanne · Fiduciaire."));
  });

  it("falls back to website when company is missing", () => {
    const message = buildTemplatePackOutreachMessage({
      templatePackId: "retail",
      language: "en",
      lead: {
        website: "https://shop.example.ch",
        email: "info@shop.example.ch",
      },
    });

    assert.ok(message.includes("Hello https://shop.example.ch,"));
    assert.ok(message.includes("Retail Automation Starter"));
  });

  it("builds localized subjects", () => {
    assert.equal(
      buildTemplatePackOutreachSubject("construction", "en"),
      "Free workflow audit — Construction Automation Starter",
    );

    assert.equal(
      buildTemplatePackOutreachSubject("retail", "fr"),
      "Audit gratuit — Retail Automation Starter",
    );

    assert.equal(
      buildTemplatePackOutreachSubject("fiduciary", "de"),
      "Kostenloser Audit — Fiduciary Automation Starter",
    );
  });

  it("builds a full copy-ready email with subject and body", () => {
    const email = buildTemplatePackOutreachEmail({
      templatePackId: "construction",
      language: "en",
      lead: {
        company: "Construction Perret SA",
        city: "Satigny",
        industry: "Construction",
      },
    });

    assert.ok(
      email.startsWith(
        "Subject: Free workflow audit — Construction Automation Starter",
      ),
    );
    assert.ok(email.includes("Hello Construction Perret SA,"));
    assert.ok(email.includes("Construction Automation Starter"));
    assert.ok(email.includes("Context: Satigny · Construction."));
    assert.equal(email.includes("\n\nHello,"), false);
  });

  it("builds a mailto link with recipient, subject, and body", () => {
    const href = buildTemplatePackOutreachMailtoHref({
      templatePackId: "construction",
      language: "en",
      lead: {
        email: "cpsa@cpsa.ch",
        company: "Construction Perret SA",
        city: "Satigny",
        industry: "Construction",
      },
    });

    assert.ok(href);
    assert.ok(href.startsWith("mailto:cpsa%40cpsa.ch?subject="));
    assert.ok(href.includes("Free%20workflow%20audit"));
    assert.ok(href.includes("Hello%20Construction%20Perret%20SA"));
  });

  it("returns null for mailto link when recipient email is missing", () => {
    const href = buildTemplatePackOutreachMailtoHref({
      templatePackId: "construction",
      language: "en",
      lead: {
        company: "Construction Perret SA",
      },
    });

    assert.equal(href, null);
  });
});
