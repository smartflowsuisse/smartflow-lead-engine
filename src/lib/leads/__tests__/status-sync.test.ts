import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isClosedCrmStatus,
  resolveSyncedLeadStatuses,
  syncCrmStatusFromOutreach,
  syncOutreachStatusFromCrm,
} from "../status-sync";

describe("syncOutreachStatusFromCrm", () => {
  it("maps CRM stages to outreach queue stages", () => {
    assert.equal(syncOutreachStatusFromCrm("New"), "New");
    assert.equal(syncOutreachStatusFromCrm("Analyzed"), "New");
    assert.equal(syncOutreachStatusFromCrm("Contacted"), "Contacted");
    assert.equal(syncOutreachStatusFromCrm("Replied"), "Replied");
    assert.equal(syncOutreachStatusFromCrm("Meeting"), "Meeting");
    assert.equal(syncOutreachStatusFromCrm("Proposal"), "Meeting");
    assert.equal(syncOutreachStatusFromCrm("Won"), "Won");
    assert.equal(syncOutreachStatusFromCrm("Lost"), "Lost");
  });
});

describe("syncCrmStatusFromOutreach", () => {
  it("maps outreach updates back to CRM status", () => {
    assert.equal(syncCrmStatusFromOutreach("New", "Analyzed"), "Analyzed");
    assert.equal(syncCrmStatusFromOutreach("New", "Contacted"), "New");
    assert.equal(syncCrmStatusFromOutreach("Contacted", "Analyzed"), "Contacted");
    assert.equal(syncCrmStatusFromOutreach("Meeting", "Proposal"), "Proposal");
    assert.equal(syncCrmStatusFromOutreach("Meeting", "Contacted"), "Meeting");
    assert.equal(syncCrmStatusFromOutreach("Won", "Meeting"), "Won");
  });
});

describe("resolveSyncedLeadStatuses", () => {
  it("syncs outreach when CRM status changes", () => {
    const synced = resolveSyncedLeadStatuses({
      existingStatus: "Analyzed",
      existingOutreachStatus: "New",
      nextStatus: "Contacted",
    });

    assert.deepEqual(synced, {
      status: "Contacted",
      outreach_status: "Contacted",
    });
  });

  it("syncs CRM when outreach status changes", () => {
    const synced = resolveSyncedLeadStatuses({
      existingStatus: "Analyzed",
      existingOutreachStatus: "New",
      nextOutreachStatus: "Contacted",
    });

    assert.deepEqual(synced, {
      status: "Contacted",
      outreach_status: "Contacted",
    });
  });

  it("keeps explicit paired updates when both fields are provided", () => {
    const synced = resolveSyncedLeadStatuses({
      existingStatus: "New",
      existingOutreachStatus: "New",
      nextStatus: "Meeting",
      nextOutreachStatus: "Meeting",
    });

    assert.deepEqual(synced, {
      status: "Meeting",
      outreach_status: "Meeting",
    });
  });
});

describe("isClosedCrmStatus", () => {
  it("identifies Won and Lost as closed", () => {
    assert.equal(isClosedCrmStatus("Won"), true);
    assert.equal(isClosedCrmStatus("Lost"), true);
    assert.equal(isClosedCrmStatus("Proposal"), false);
    assert.equal(isClosedCrmStatus("Contacted"), false);
  });
});
