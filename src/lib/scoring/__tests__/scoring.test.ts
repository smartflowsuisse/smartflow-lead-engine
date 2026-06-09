import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateLeadScore,
  calculateWebsiteQualityScore,
  formatAnalysisScore,
  getScoreLabel,
} from "../../scoring";
import type { WebsiteAnalysisResult } from "../../types";

function buildResult(
  overrides: Partial<WebsiteAnalysisResult> = {}
): WebsiteAnalysisResult {
  return {
    websiteQuality: 55,
    mobileFriendliness: 45,
    speedScore: null,
    seoScore: 50,
    hasContactForm: false,
    trustScore: 40,
    quickWins: ["Add HTTPS", "Add meta description"],
    automationOpportunities: ["Chatbot", "CRM form"],
    details: { mode: "live" },
    ...overrides,
  };
}

describe("calculateWebsiteQualityScore", () => {
  it("excludes unknown dimensions from the average", () => {
    const score = calculateWebsiteQualityScore(buildResult());
    assert.equal(score, 48);
  });

  it("returns null when every dimension is unknown", () => {
    const score = calculateWebsiteQualityScore(
      buildResult({
        websiteQuality: null,
        mobileFriendliness: null,
        speedScore: null,
        seoScore: null,
        trustScore: null,
      })
    );
    assert.equal(score, null);
  });
});

describe("calculateLeadScore", () => {
  it("rewards opportunity gaps instead of perfect site quality", () => {
    const weakSite = buildResult({
      websiteQuality: 30,
      mobileFriendliness: 25,
      seoScore: 35,
      trustScore: 20,
      hasContactForm: false,
      quickWins: ["Add HTTPS", "Add contact form", "Add Impressum"],
      automationOpportunities: ["Chatbot", "CRM form", "Booking"],
    });

    const polishedSite = buildResult({
      websiteQuality: 78,
      mobileFriendliness: 68,
      seoScore: 72,
      trustScore: 70,
      hasContactForm: true,
      quickWins: [],
      automationOpportunities: [],
    });

    assert.ok(calculateLeadScore(weakSite) > calculateLeadScore(polishedSite));
  });

  it("never returns a perfect 100", () => {
    const score = calculateLeadScore(
      buildResult({
        hasContactForm: false,
        quickWins: Array.from({ length: 10 }, (_, i) => `Win ${i}`),
        automationOpportunities: Array.from({ length: 10 }, (_, i) => `Op ${i}`),
      })
    );
    assert.ok(score <= 85);
  });

  it("returns 0 for unavailable analysis", () => {
    assert.equal(
      calculateLeadScore(buildResult({ details: { mode: "unavailable" } })),
      0
    );
  });

  it("does not bonus an unknown contact form state", () => {
    const withUnknownForm = calculateLeadScore(
      buildResult({ hasContactForm: null, quickWins: [], automationOpportunities: [] })
    );
    const withMissingForm = calculateLeadScore(
      buildResult({ hasContactForm: false, quickWins: [], automationOpportunities: [] })
    );
    assert.ok(withMissingForm > withUnknownForm);
  });
});

describe("formatAnalysisScore", () => {
  it("shows Unknown for missing values", () => {
    assert.equal(formatAnalysisScore(null), "Unknown");
    assert.equal(formatAnalysisScore(62), "62/100");
  });
});

describe("getScoreLabel", () => {
  it("labels zero as not scored", () => {
    assert.equal(getScoreLabel(0), "Not Scored");
  });
});
