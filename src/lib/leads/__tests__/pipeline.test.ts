import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getNextLeadStatus } from "../pipeline";

describe("getNextLeadStatus", () => {
  it("advances through the sales pipeline", () => {
    assert.equal(getNextLeadStatus("New Lead"), "Analyzed");
    assert.equal(getNextLeadStatus("Analyzed"), "Contacted");
    assert.equal(getNextLeadStatus("Contacted"), "Follow Up");
    assert.equal(getNextLeadStatus("Follow Up"), "Proposal Sent");
    assert.equal(getNextLeadStatus("Proposal Sent"), "Client");
  });

  it("returns null at the end of the pipeline or for Lost", () => {
    assert.equal(getNextLeadStatus("Client"), null);
    assert.equal(getNextLeadStatus("Lost"), null);
  });
});
