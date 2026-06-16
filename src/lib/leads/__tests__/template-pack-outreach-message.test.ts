import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
});
