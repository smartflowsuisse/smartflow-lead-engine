import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractJsonFromModelText,
  parseLlmEnrichmentResponse,
} from "../analysis-schema";

describe("parseLlmEnrichmentResponse", () => {
  it("accepts valid enrichment payloads", () => {
    const parsed = parseLlmEnrichmentResponse({
      executiveSummary: "Strong opportunity for automation.",
      quickWins: ["Add contact form"],
      automationOpportunities: ["CRM integration"],
      salesAngle: "Pitch lead capture automation.",
      confidence: "high",
    });

    assert.ok(parsed);
    assert.equal(parsed?.confidence, "high");
    assert.equal(parsed?.quickWins.length, 1);
  });

  it("rejects incomplete payloads", () => {
    const parsed = parseLlmEnrichmentResponse({
      executiveSummary: "Missing lists",
    });

    assert.equal(parsed, null);
  });
});

describe("extractJsonFromModelText", () => {
  it("parses JSON wrapped in extra text", () => {
    const parsed = extractJsonFromModelText(
      'Here is the result: {"executiveSummary":"ok","quickWins":["a"],"automationOpportunities":["b"],"salesAngle":"c","confidence":"low"}'
    );

    assert.ok(parsed && typeof parsed === "object");
  });
});
