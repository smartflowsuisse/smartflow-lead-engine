import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLeadOpportunitySummary } from "../opportunity-summary";
import type { LeadAnalysis } from "../../types";

const baseAnalysis: LeadAnalysis = {
  id: 1,
  lead_id: 1,
  website_quality: 42,
  mobile_friendliness: 38,
  speed_score: 50,
  seo_score: 35,
  has_contact_form: false,
  trust_score: 40,
  quick_wins: JSON.stringify(["Add HTTPS/SSL certificate", "Add meta description"]),
  automation_opportunities: JSON.stringify([
    "Smart contact form with CRM integration",
  ]),
  raw_analysis: JSON.stringify({
    summary: "Missing contact form and weak mobile layout.",
  }),
  analyzed_at: "2026-06-09T08:00:00Z",
};

describe("buildLeadOpportunitySummary", () => {
  it("returns null when analysis is missing", () => {
    assert.equal(buildLeadOpportunitySummary({ lead_score: 0 }, null), null);
  });

  it("builds problems, service recommendation, and CHF estimate", () => {
    const summary = buildLeadOpportunitySummary(
      { lead_score: 72 },
      baseAnalysis
    );

    assert.ok(summary);
    assert.ok(summary.problems.length >= 2);
    assert.match(summary.recommendedService, /Smart contact form/i);
    assert.ok(summary.estimatedValueChf >= 3500);
    assert.equal(summary.estimatedValueChf % 500, 0);
  });

  it("falls back to a default service when scores are healthy", () => {
    const summary = buildLeadOpportunitySummary(
      { lead_score: 55 },
      {
        ...baseAnalysis,
        website_quality: 78,
        mobile_friendliness: 80,
        seo_score: 75,
        trust_score: 72,
        has_contact_form: true,
        quick_wins: JSON.stringify([]),
        automation_opportunities: JSON.stringify([]),
        raw_analysis: "{}",
      }
    );

    assert.ok(summary);
    assert.equal(summary.recommendedService, "SmartFlow digital growth package");
  });
});
