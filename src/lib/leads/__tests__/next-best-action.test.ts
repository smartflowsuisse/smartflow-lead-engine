import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildNextBestAction } from "../next-best-action";

const baseInput = {
  email: null,
  phone: null,
  website: null,
  contact_page_url: null,
  lead_score: 0,
  status: "New" as const,
  industry: "Construction",
  hasAnalysis: false,
};

describe("buildNextBestAction", () => {
  it("recommends calling when phone exists and score is at least 70", () => {
    const result = buildNextBestAction({
      ...baseInput,
      phone: "+41 44 123 45 67",
      lead_score: 72,
      hasAnalysis: true,
      website: "https://example.ch",
    });

    assert.equal(result.priority, "High");
    assert.equal(result.action, "Call company");
    assert.match(result.reason, /72\/100/);
  });

  it("recommends email when email exists without phone", () => {
    const result = buildNextBestAction({
      ...baseInput,
      email: "info@acme.ch",
      lead_score: 55,
      hasAnalysis: true,
      website: "https://acme.ch",
    });

    assert.equal(result.action, "Send email");
    assert.equal(result.priority, "Medium");
  });

  it("recommends contact page when only contact page exists", () => {
    const result = buildNextBestAction({
      ...baseInput,
      contact_page_url: "https://acme.ch/kontakt",
      lead_score: 60,
      hasAnalysis: true,
      website: "https://acme.ch",
    });

    assert.equal(result.action, "Use contact page");
    assert.equal(result.priority, "Medium");
  });

  it("recommends manual research when no contact data exists", () => {
    const result = buildNextBestAction({
      ...baseInput,
      lead_score: 60,
      hasAnalysis: true,
      website: "https://acme.ch",
    });

    assert.equal(result.action, "Research contact manually");
    assert.equal(result.priority, "Low");
  });

  it("recommends review before outreach when score is below 50", () => {
    const result = buildNextBestAction({
      ...baseInput,
      email: "info@acme.ch",
      phone: "+41 44 123 45 67",
      lead_score: 42,
      hasAnalysis: true,
      website: "https://acme.ch",
    });

    assert.equal(result.action, "Review before outreach");
    assert.equal(result.priority, "Low");
    assert.match(result.reason, /42\/100/);
  });

  it("prioritizes website analysis when website exists but analysis is missing", () => {
    const result = buildNextBestAction({
      ...baseInput,
      website: "https://acme.ch",
      email: "info@acme.ch",
      lead_score: 68,
      hasAnalysis: false,
    });

    assert.equal(result.action, "Run website analysis");
    assert.equal(result.priority, "High");
  });

  it("returns low-priority guidance for closed Won and Lost leads", () => {
    assert.equal(
      buildNextBestAction({ ...baseInput, status: "Won", lead_score: 80 }).action,
      "Maintain client relationship"
    );
    assert.equal(
      buildNextBestAction({ ...baseInput, status: "Lost", lead_score: 80 }).action,
      "No outreach needed"
    );
  });
});
