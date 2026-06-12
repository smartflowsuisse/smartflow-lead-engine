import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAnalyzeActionLabel } from "../lead-details";
import { formatLeadQualification } from "../export-csv";

describe("getAnalyzeActionLabel", () => {
  it("returns Analyze when the lead has no analysis yet", () => {
    assert.equal(getAnalyzeActionLabel(false), "Analyze");
  });

  it("returns Re-analyze when analysis already exists", () => {
    assert.equal(getAnalyzeActionLabel(true), "Re-analyze");
  });
});

describe("Lead Details qualification display", () => {
  it("uses score-based qualification labels", () => {
    assert.equal(formatLeadQualification(0), "Not Scored");
    assert.equal(formatLeadQualification(72), "High Priority");
  });
});
