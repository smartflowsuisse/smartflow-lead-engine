import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LEAD_STATUSES } from "../types";
import { statusColor } from "../utils";

describe("LEAD_STATUSES", () => {
  it("includes all CRM sales workflow statuses", () => {
    const expected = [
      "New Lead",
      "Analyzed",
      "Contacted",
      "Follow Up",
      "Proposal Sent",
      "Client",
      "Lost",
    ];
    assert.deepEqual([...LEAD_STATUSES], expected);
  });
});

describe("statusColor", () => {
  it("returns a color class for Lost status", () => {
    assert.match(statusColor("Lost"), /red/);
  });
});
