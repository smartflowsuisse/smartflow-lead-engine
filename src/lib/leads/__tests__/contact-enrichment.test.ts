import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Lead } from "../../types";
import {
  getLeadReadinessChecklist,
  hasLeadContactPath,
  hasStructuredNoteSection,
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
    status: "New",
    outreach_status: "New",
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

describe("hasLeadContactPath", () => {
  it("accepts email, phone, or contact page", () => {
    assert.equal(hasLeadContactPath(sampleLead()), false);
    assert.equal(
      hasLeadContactPath(sampleLead({ email: "info@acme.ch" })),
      true
    );
  });
});

describe("hasStructuredNoteSection", () => {
  it("detects filled structured note sections", () => {
    assert.equal(
      hasStructuredNoteSection(
        "Recommended offer: SmartFlow digital growth package",
        "Recommended offer"
      ),
      true
    );
    assert.equal(
      hasStructuredNoteSection("Recommended offer:", "Recommended offer"),
      false
    );
  });
});

describe("getLeadReadinessChecklist", () => {
  it("tracks mini-audit readiness from lead data", () => {
    const checklist = getLeadReadinessChecklist({
      lead: sampleLead({
        email: "info@acme.ch",
        phone: "+41 21 555 66 77",
      }),
      hasAnalysis: false,
    });

    assert.deepEqual(
      checklist.map((item) => [item.label, item.present]),
      [
        ["Website reviewed", false],
        ["Contact path confirmed", true],
        ["Business problem identified", false],
        ["Recommended offer selected", false],
        ["Next manual action defined", false],
        ["Mini-audit ready", false],
      ]
    );
  });

  it("marks mini-audit ready when all checks pass", () => {
    const checklist = getLeadReadinessChecklist({
      lead: sampleLead({
        email: "info@acme.ch",
        notes: "Next manual action: Call tomorrow",
      }),
      hasAnalysis: true,
      opportunitySummary: {
        problems: ["Mobile experience needs improvement"],
        recommendedService: "Mobile-first website optimization",
        estimatedValueChf: 8500,
      },
      openTaskCount: 1,
    });

    assert.equal(checklist.at(-1)?.present, true);
  });
});
