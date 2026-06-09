import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAnalysisEngine } from "../display";
import type { WebsiteAnalysisResult } from "../../types";

const baseResult: WebsiteAnalysisResult = {
  websiteQuality: 70,
  mobileFriendliness: 60,
  speedScore: 55,
  seoScore: 65,
  hasContactForm: false,
  trustScore: 50,
  quickWins: ["Add HTTPS"],
  automationOpportunities: ["Chatbot"],
  details: {
    mode: "live",
    analysisEngine: "heuristic",
  },
};

describe("getAnalysisEngine", () => {
  it("returns heuristic by default", () => {
    assert.equal(getAnalysisEngine(baseResult.details), "heuristic");
  });

  it("returns heuristic+llm when tagged", () => {
    assert.equal(
      getAnalysisEngine({ ...baseResult.details, analysisEngine: "heuristic+llm" }),
      "heuristic+llm"
    );
  });
});
