import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Lead } from "../../types";
import {
  computeLeadListSummary,
  filterLeadsByContact,
  filterLeadsByScore,
  isHighPriorityLead,
  parseLeadContactFilter,
  parseLeadScoreFilter,
  sortLeads,
} from "../list-view";

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
    notes: null,
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

describe("parseLeadContactFilter", () => {
  it("accepts missing-* filter aliases", () => {
    assert.equal(parseLeadContactFilter("missing_email"), "no_email");
    assert.equal(parseLeadContactFilter("missing_phone"), "no_phone");
    assert.equal(
      parseLeadContactFilter("missing_contact_page"),
      "no_contact_page"
    );
  });
});

describe("filterLeadsByContact", () => {
  const leads = [
    sampleLead({ id: 1, email: "info@acme.ch" }),
    sampleLead({ id: 2, phone: "+41 21 555 66 77" }),
    sampleLead({
      id: 3,
      contact_page_url: "https://acme.ch/kontakt",
    }),
    sampleLead({ id: 4 }),
  ];

  it("filters leads with email", () => {
    const filtered = filterLeadsByContact(leads, "has_email");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.id, 1);
  });

  it("filters leads without phone", () => {
    const filtered = filterLeadsByContact(leads, "no_phone");
    assert.equal(filtered.length, 3);
  });

  it("filters leads with contact page", () => {
    const filtered = filterLeadsByContact(leads, "has_contact_page");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.id, 3);
  });
});

describe("filterLeadsByScore", () => {
  const leads = [
    sampleLead({ id: 1, lead_score: 10 }),
    sampleLead({ id: 2, lead_score: 30 }),
    sampleLead({ id: 3, lead_score: 55 }),
    sampleLead({ id: 4, lead_score: 72 }),
  ];

  it("filters score buckets", () => {
    assert.deepEqual(
      filterLeadsByScore(leads, "score_0_20").map((lead) => lead.id),
      [1]
    );
    assert.deepEqual(
      filterLeadsByScore(leads, "score_21_40").map((lead) => lead.id),
      [2]
    );
    assert.deepEqual(
      filterLeadsByScore(leads, "score_41_60").map((lead) => lead.id),
      [3]
    );
    assert.deepEqual(
      filterLeadsByScore(leads, "score_61_plus").map((lead) => lead.id),
      [4]
    );
  });
});

describe("sortLeads", () => {
  const leads = [
    sampleLead({ id: 1, created_at: "2026-01-03T10:00:00.000Z", lead_score: 20 }),
    sampleLead({ id: 2, created_at: "2026-01-01T10:00:00.000Z", lead_score: 80 }),
    sampleLead({ id: 3, created_at: "2026-01-02T10:00:00.000Z", lead_score: 50 }),
  ];

  it("sorts newest first by default", () => {
    const sorted = sortLeads(leads, "newest");
    assert.deepEqual(sorted.map((lead) => lead.id), [1, 3, 2]);
  });

  it("sorts highest score first", () => {
    const sorted = sortLeads(leads, "score_high");
    assert.deepEqual(sorted.map((lead) => lead.id), [2, 3, 1]);
  });

  it("sorts lowest score first", () => {
    const sorted = sortLeads(leads, "score_low");
    assert.deepEqual(sorted.map((lead) => lead.id), [1, 3, 2]);
  });
});

describe("computeLeadListSummary", () => {
  it("counts contact coverage and analyzed leads", () => {
    const leads = [
      sampleLead({ id: 1, email: "info@acme.ch", lead_score: 70 }),
      sampleLead({
        id: 2,
        phone: "+41 21 555 66 77",
        contact_page_url: "https://acme.ch/kontakt",
        lead_score: 65,
      }),
      sampleLead({ id: 3 }),
    ];

    const summary = computeLeadListSummary(leads, new Set([1, 2]));

    assert.equal(summary.total, 3);
    assert.equal(summary.withEmail, 1);
    assert.equal(summary.withPhone, 1);
    assert.equal(summary.withContactPage, 1);
    assert.equal(summary.missingEmail, 2);
    assert.equal(summary.missingPhone, 2);
    assert.equal(summary.missingContactPage, 2);
    assert.equal(summary.analyzed, 2);
    assert.equal(summary.highPriority, 2);
  });
});

describe("isHighPriorityLead", () => {
  it("excludes closed pipeline statuses", () => {
    assert.equal(
      isHighPriorityLead(
        sampleLead({ lead_score: 80, status: "Won" })
      ),
      false
    );
    assert.equal(
      isHighPriorityLead(
        sampleLead({ lead_score: 80, status: "Analyzed" })
      ),
      true
    );
  });
});
