import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getNextLeadStatus } from "../pipeline";

describe("getNextLeadStatus", () => {
  it("advances through the sales pipeline", () => {
    assert.equal(getNextLeadStatus("New"), "Analyzed");
    assert.equal(getNextLeadStatus("Analyzed"), "Contacted");
    assert.equal(getNextLeadStatus("Contacted"), "Replied");
    assert.equal(getNextLeadStatus("Replied"), "Meeting");
    assert.equal(getNextLeadStatus("Meeting"), "Proposal");
    assert.equal(getNextLeadStatus("Proposal"), "Won");
  });

  it("returns null at the end of the pipeline or for Lost", () => {
    assert.equal(getNextLeadStatus("Won"), null);
    assert.equal(getNextLeadStatus("Lost"), null);
  });
});
