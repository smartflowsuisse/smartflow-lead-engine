import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateLeadScore,
  calculateLeadScoreBreakdown,
  calculateWebsiteQualityScore,
  formatAnalysisScore,
  getScoreLabel,
  getScorePriority,
  MAX_SCORE_WITHOUT_CONTACTABILITY,
  scoreAutomationOpportunities,
  scoreContactability,
  scoreSwissSmbFit,
  scoreWebsiteGap,
} from "../../scoring";
import type { Lead, WebsiteAnalysisResult } from "../../types";

function sampleLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 1,
    company: "Bau Holzwerker AG",
    website: "https://bau-holzwerker.ch",
    email: "info@bau-holzwerker.ch",
    phone: "+41 44 493 07 07",
    city: "Zürich",
    industry: "Construction",
    lead_score: 0,
    status: "New Lead",
    outreach_status: "New",
    notes: null,
    contacted_at: null,
    contacted_language: null,
    contact_page_url: "https://bau-holzwerker.ch/kontakt",
    email_confidence: 95,
    phone_confidence: 90,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    ...overrides,
  };
}

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

describe("scoreContactability", () => {
  it("awards 10 points per contact channel", () => {
    assert.equal(scoreContactability(sampleLead()), 30);
    assert.equal(
      scoreContactability(sampleLead({ email: null, phone: null, contact_page_url: null })),
      0
    );
    assert.equal(scoreContactability(sampleLead({ phone: null })), 20);
  });
});

describe("scoreWebsiteGap", () => {
  it("rewards weaker website quality with a higher gap score", () => {
    const weak = scoreWebsiteGap(
      buildResult({
        websiteQuality: 20,
        mobileFriendliness: 20,
        seoScore: 20,
        trustScore: 20,
      })
    );
    const strong = scoreWebsiteGap(
      buildResult({
        websiteQuality: 90,
        mobileFriendliness: 90,
        seoScore: 90,
        trustScore: 90,
        hasContactForm: true,
        quickWins: [],
      })
    );

    assert.ok(weak > strong);
    assert.equal(strong, 3);
  });
});

describe("scoreAutomationOpportunities", () => {
  it("awards up to 25 points from automation opportunities", () => {
    assert.equal(scoreAutomationOpportunities(buildResult()), 10);
    assert.equal(
      scoreAutomationOpportunities(
        buildResult({
          automationOpportunities: Array.from({ length: 6 }, (_, i) => `Op ${i}`),
        })
      ),
      25
    );
  });
});

describe("scoreSwissSmbFit", () => {
  it("rewards Swiss SMB indicators", () => {
    assert.ok(scoreSwissSmbFit(sampleLead()) >= 10);
    assert.ok(
      scoreSwissSmbFit(
        sampleLead({
          company: "Global University Network",
          website: "https://example.com",
          city: null,
          industry: "Education",
        })
      ) < scoreSwissSmbFit(sampleLead())
    );
  });
});

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
  it("combines all four pillars into a 0-100 score", () => {
    const breakdown = calculateLeadScoreBreakdown(sampleLead(), buildResult());
    assert.equal(breakdown.total, calculateLeadScore(sampleLead(), buildResult()));
    assert.ok(breakdown.total > 0);
    assert.ok(breakdown.total <= 100);
  });

  it("rewards weaker sites more than polished sites when contact data matches", () => {
    const lead = sampleLead();
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
      websiteQuality: 90,
      mobileFriendliness: 88,
      seoScore: 92,
      trustScore: 90,
      hasContactForm: true,
      quickWins: [],
      automationOpportunities: [],
    });

    assert.ok(
      calculateLeadScore(lead, weakSite) > calculateLeadScore(lead, polishedSite)
    );
  });

  it("scores contactability and Swiss fit without analysis", () => {
    const score = calculateLeadScore(sampleLead(), null);
    assert.ok(score >= 30);
    assert.equal(scoreWebsiteGap(null), 0);
    assert.equal(scoreAutomationOpportunities(null), 0);
  });

  it("returns 0 when lead has no contact data and no analysis", () => {
    const score = calculateLeadScore(
      sampleLead({
        email: null,
        phone: null,
        contact_page_url: null,
        website: null,
        city: null,
        industry: null,
        company: "Global University Network",
      }),
      null
    );
    assert.equal(score, 0);
  });

  it("caps total at 49 when contactability is zero", () => {
    const lead = sampleLead({
      email: null,
      phone: null,
      contact_page_url: null,
    });
    const analysis = buildResult({
      websiteQuality: 10,
      mobileFriendliness: 10,
      seoScore: 10,
      trustScore: 10,
      automationOpportunities: Array.from({ length: 6 }, (_, i) => `Op ${i}`),
    });

    const breakdown = calculateLeadScoreBreakdown(lead, analysis);

    assert.equal(breakdown.contactability, 0);
    assert.ok(breakdown.websiteGap + breakdown.automation + breakdown.swissSmbFit > 49);
    assert.equal(breakdown.total, MAX_SCORE_WITHOUT_CONTACTABILITY);
    assert.ok(getScoreLabel(breakdown.total) !== "High Priority");
    assert.ok(getScoreLabel(breakdown.total) !== "Hot Lead");
  });

  it("allows scores above 49 when contact data exists", () => {
    const score = calculateLeadScore(sampleLead(), buildResult());
    assert.ok(score > MAX_SCORE_WITHOUT_CONTACTABILITY);
  });
});

describe("formatAnalysisScore", () => {
  it("shows Unknown for missing values", () => {
    assert.equal(formatAnalysisScore(null), "Unknown");
    assert.equal(formatAnalysisScore(62), "62/100");
  });
});

describe("getScoreLabel", () => {
  it("maps score ranges to priority labels", () => {
    assert.equal(getScoreLabel(0), "Not Scored");
    assert.equal(getScoreLabel(10), "Cold");
    assert.equal(getScoreLabel(30), "Nurture");
    assert.equal(getScoreLabel(50), "Qualified");
    assert.equal(getScoreLabel(70), "High Priority");
    assert.equal(getScoreLabel(85), "Hot Lead");
  });
});

describe("getScorePriority", () => {
  it("maps score ranges to priority tiers", () => {
    assert.equal(getScorePriority(85), "critical");
    assert.equal(getScorePriority(70), "high");
    assert.equal(getScorePriority(50), "medium");
    assert.equal(getScorePriority(20), "low");
  });
});
