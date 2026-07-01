import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateConvertToClientSafetyGuard } from "../convert-to-client-safety-guard";

describe("evaluateConvertToClientSafetyGuard", () => {
  it("allows proceeding when all safety requirements are met", () => {
    const result = evaluateConvertToClientSafetyGuard({
      lead: {
        id: "lead-001",
        company: "Demo Construction Genève",
        status: "Won",
      },
      duplicateResult: {
        hasDuplicate: false,
        matchedBy: [],
        duplicateIds: [],
      },
      rollbackContext: {
        sourceLeadId: "lead-001",
        generatedClientId: "client-lead-001",
        previousLeadStatus: "Won",
        actor: "Human reviewer",
        timestamp: "2026-07-01T10:08:00.000Z",
        persistedRecordCreated: false,
      },
      auditEventPrepared: true,
    });

    assert.equal(result.canProceed, true);
    assert.deepEqual(result.blockedReasons, []);
  });

  it("blocks non-eligible lead", () => {
    const result = evaluateConvertToClientSafetyGuard({
      lead: {
        id: "lead-002",
        company: "Demo New Lead",
        status: "New",
      },
      duplicateResult: {
        hasDuplicate: false,
        matchedBy: [],
        duplicateIds: [],
      },
      rollbackContext: {
        sourceLeadId: "lead-002",
        generatedClientId: "client-lead-002",
        previousLeadStatus: "New",
        actor: "Human reviewer",
        timestamp: "2026-07-01T10:09:00.000Z",
        persistedRecordCreated: false,
      },
      auditEventPrepared: true,
    });

    assert.equal(result.canProceed, false);
    assert.deepEqual(result.blockedReasons, ["lead-not-eligible"]);
  });

  it("blocks duplicate client", () => {
    const result = evaluateConvertToClientSafetyGuard({
      lead: {
        id: "lead-003",
        company: "Demo Duplicate",
        status: "Won",
      },
      duplicateResult: {
        hasDuplicate: true,
        matchedBy: ["sourceLeadId"],
        duplicateIds: ["client-003"],
      },
      rollbackContext: {
        sourceLeadId: "lead-003",
        generatedClientId: "client-lead-003",
        previousLeadStatus: "Won",
        actor: "Human reviewer",
        timestamp: "2026-07-01T10:10:00.000Z",
        persistedRecordCreated: false,
      },
      auditEventPrepared: true,
    });

    assert.equal(result.canProceed, false);
    assert.deepEqual(result.blockedReasons, ["duplicate-client-detected"]);
  });

  it("blocks incomplete rollback context", () => {
    const result = evaluateConvertToClientSafetyGuard({
      lead: {
        id: "lead-004",
        company: "Demo Rollback Missing",
        status: "Won",
      },
      duplicateResult: {
        hasDuplicate: false,
        matchedBy: [],
        duplicateIds: [],
      },
      rollbackContext: {
        sourceLeadId: "",
        generatedClientId: "client-lead-004",
        previousLeadStatus: "Won",
        actor: "Human reviewer",
        timestamp: "2026-07-01T10:11:00.000Z",
        persistedRecordCreated: false,
      },
      auditEventPrepared: true,
    });

    assert.equal(result.canProceed, false);
    assert.deepEqual(result.blockedReasons, ["rollback-context-incomplete"]);
  });

  it("blocks when audit event is not prepared", () => {
    const result = evaluateConvertToClientSafetyGuard({
      lead: {
        id: "lead-005",
        company: "Demo Audit Missing",
        status: "Won",
      },
      duplicateResult: {
        hasDuplicate: false,
        matchedBy: [],
        duplicateIds: [],
      },
      rollbackContext: {
        sourceLeadId: "lead-005",
        generatedClientId: "client-lead-005",
        previousLeadStatus: "Won",
        actor: "Human reviewer",
        timestamp: "2026-07-01T10:12:00.000Z",
        persistedRecordCreated: false,
      },
      auditEventPrepared: false,
    });

    assert.equal(result.canProceed, false);
    assert.deepEqual(result.blockedReasons, ["audit-event-not-prepared"]);
  });
});
