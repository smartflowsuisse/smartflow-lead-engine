import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ANALYSIS_UNAVAILABLE_ACTION,
  ANALYSIS_UNAVAILABLE_MESSAGE,
  ANALYSIS_UNAVAILABLE_REASON,
  buildAnalysisUnavailablePayload,
  isAnalysisUnavailablePayload,
  isLegacyUnavailableError,
} from "../unavailable-display";

describe("buildAnalysisUnavailablePayload", () => {
  it("returns user-friendly unavailable fields", () => {
    const payload = buildAnalysisUnavailablePayload();
    assert.equal(payload.message, ANALYSIS_UNAVAILABLE_MESSAGE);
    assert.equal(payload.reason, ANALYSIS_UNAVAILABLE_REASON);
    assert.equal(payload.recommendedAction, ANALYSIS_UNAVAILABLE_ACTION);
    assert.equal(payload.unavailable, true);
  });
});

describe("isAnalysisUnavailablePayload", () => {
  it("detects structured unavailable responses", () => {
    assert.equal(
      isAnalysisUnavailablePayload(buildAnalysisUnavailablePayload()),
      true
    );
    assert.equal(isAnalysisUnavailablePayload({ error: "fetch failed" }), false);
  });
});

describe("isLegacyUnavailableError", () => {
  it("detects old technical unavailable messages", () => {
    assert.equal(
      isLegacyUnavailableError("Website analysis unavailable: fetch failed"),
      true
    );
    assert.equal(isLegacyUnavailableError("Analysis failed"), false);
  });
});
