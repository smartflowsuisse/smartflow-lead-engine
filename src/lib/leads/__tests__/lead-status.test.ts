import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeLeadStatus } from "../lead-status";
import { getSalesPipelineStages } from "../pipeline";
import { LEAD_STATUSES } from "../../types";

describe("normalizeLeadStatus", () => {
  it("maps legacy CRM statuses to the sales pipeline", () => {
    assert.equal(normalizeLeadStatus("New Lead"), "New");
    assert.equal(normalizeLeadStatus("Follow Up"), "Replied");
    assert.equal(normalizeLeadStatus("Proposal Sent"), "Proposal");
    assert.equal(normalizeLeadStatus("Client"), "Won");
  });

  it("keeps current pipeline statuses unchanged", () => {
    for (const status of LEAD_STATUSES) {
      assert.equal(normalizeLeadStatus(status), status);
    }
  });
});

describe("getSalesPipelineStages", () => {
  it("includes all dashboard pipeline stages", () => {
    assert.deepEqual(getSalesPipelineStages(), [...LEAD_STATUSES]);
  });
});
