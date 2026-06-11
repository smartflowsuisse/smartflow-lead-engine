import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LEAD_STATUSES, OUTREACH_STATUSES } from "../types";
import { outreachStatusColor, statusColor } from "../utils";

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

describe("OUTREACH_STATUSES", () => {
  it("includes outreach workflow statuses", () => {
    assert.deepEqual([...OUTREACH_STATUSES], [
      "New",
      "Contacted",
      "Replied",
      "Meeting",
      "Won",
      "Lost",
    ]);
  });
});

describe("statusColor", () => {
  it("returns a color class for Lost status", () => {
    assert.match(statusColor("Lost"), /red/);
  });
});

describe("outreachStatusColor", () => {
  it("returns a color class for outreach statuses", () => {
    assert.match(outreachStatusColor("New"), /sky/);
    assert.match(outreachStatusColor("Won"), /emerald/);
  });
});
