import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeOutreachQueueSummary,
  filterOutreachQueueLeads,
  isActionableOutreachLead,
  MIN_OUTREACH_SCORE,
} from "../outreach-queue";
import type { Lead } from "../../types";

function sampleLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 1,
    company: "Acme AG",
    website: "https://acme.ch",
    email: "info@acme.ch",
    phone: "+41 44 111 22 33",
    city: "Zürich",
    industry: "Construction",
    lead_score: 72,
    status: "Analyzed",
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
  };
}

describe("isActionableOutreachLead", () => {
  it("requires score >= 45 and email or phone", () => {
    assert.equal(isActionableOutreachLead(sampleLead()), true);
    assert.equal(
      isActionableOutreachLead(sampleLead({ lead_score: MIN_OUTREACH_SCORE - 1 })),
      false
    );
    assert.equal(
      isActionableOutreachLead(
        sampleLead({ email: null, phone: null, lead_score: 80 })
      ),
      false
    );
    assert.equal(
      isActionableOutreachLead(sampleLead({ email: null, phone: "+41 44 111 22 33" })),
      true
    );
  });
});

describe("filterOutreachQueueLeads", () => {
  it("sorts actionable leads by score descending", () => {
    const leads = filterOutreachQueueLeads([
      sampleLead({ id: 1, lead_score: 50 }),
      sampleLead({ id: 2, lead_score: 80 }),
      sampleLead({ id: 3, lead_score: 30, email: null, phone: null }),
      sampleLead({ id: 4, lead_score: 65 }),
    ]);

    assert.deepEqual(
      leads.map((lead) => lead.id),
      [2, 4, 1]
    );
  });
});

describe("computeOutreachQueueSummary", () => {
  it("counts outreach statuses for actionable leads", () => {
    const summary = computeOutreachQueueSummary([
      sampleLead({ id: 1, outreach_status: "New" }),
      sampleLead({ id: 2, outreach_status: "Contacted" }),
      sampleLead({ id: 3, outreach_status: "Replied" }),
      sampleLead({ id: 4, outreach_status: "Meeting" }),
      sampleLead({ id: 5, outreach_status: "Won" }),
      sampleLead({ id: 6, outreach_status: "New", lead_score: 20 }),
    ]);

    assert.equal(summary.readyForOutreach, 1);
    assert.equal(summary.contacted, 1);
    assert.equal(summary.replied, 1);
    assert.equal(summary.meetings, 1);
    assert.equal(summary.won, 1);
    assert.equal(summary.total, 5);
  });
});
