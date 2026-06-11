import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Lead } from "../../types";
import {
  getLeadReadinessChecklist,
  needsContactEnrichment,
} from "../contact-enrichment";

function sampleLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 1,
    company: "Acme SA",
    website: "https://acme.ch",
    email: null,
    phone: null,
    city: "Zürich",
    industry: "Construction",
    lead_score: 0,
    status: "New Lead",
    notes: "Imported from Discovery",
    contacted_at: null,
    contacted_language: null,
    contact_page_url: null,
    email_confidence: null,
    phone_confidence: null,
    created_at: "2026-01-01T10:00:00.000Z",
    updated_at: "2026-01-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("needsContactEnrichment", () => {
  it("flags leads missing email, phone, or contact page", () => {
    assert.equal(needsContactEnrichment(sampleLead()), true);
    assert.equal(
      needsContactEnrichment(
        sampleLead({
          email: "info@acme.ch",
          phone: "+41 21 555 66 77",
          contact_page_url: "https://acme.ch/kontakt",
        })
      ),
      false
    );
  });
});

describe("getLeadReadinessChecklist", () => {
  it("lists website, contact, and analysis readiness", () => {
    const checklist = getLeadReadinessChecklist(
      sampleLead({
        email: "info@acme.ch",
        phone: "+41 21 555 66 77",
      }),
      false
    );

    assert.deepEqual(
      checklist.map((item) => [item.label, item.present]),
      [
        ["Website", true],
        ["Email", true],
        ["Phone", true],
        ["Contact page", false],
        ["Analysis", false],
      ]
    );
  });
});
