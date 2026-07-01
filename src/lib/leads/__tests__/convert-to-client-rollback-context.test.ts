import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildConvertToClientRollbackContext,
  canRollbackConvertToClient,
} from "../convert-to-client-rollback-context";

describe("convert-to-client-rollback-context", () => {
  it("builds rollback context with safe persistedRecordCreated default", () => {
    const context = buildConvertToClientRollbackContext({
      sourceLeadId: "lead-001",
      generatedClientId: "client-lead-001",
      previousLeadStatus: "Won",
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:04:00.000Z",
    });

    assert.deepEqual(context, {
      sourceLeadId: "lead-001",
      generatedClientId: "client-lead-001",
      previousLeadStatus: "Won",
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:04:00.000Z",
      persistedRecordCreated: false,
    });
  });

  it("preserves persistedRecordCreated when explicitly true", () => {
    const context = buildConvertToClientRollbackContext({
      sourceLeadId: "lead-002",
      generatedClientId: "client-lead-002",
      previousLeadStatus: "Won",
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:05:00.000Z",
      persistedRecordCreated: true,
    });

    assert.equal(context.persistedRecordCreated, true);
  });

  it("allows rollback when required fields are present", () => {
    const context = buildConvertToClientRollbackContext({
      sourceLeadId: "lead-003",
      generatedClientId: "client-lead-003",
      previousLeadStatus: "Won",
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:06:00.000Z",
    });

    assert.equal(canRollbackConvertToClient(context), true);
  });

  it("blocks rollback when required fields are missing", () => {
    assert.equal(
      canRollbackConvertToClient({
        sourceLeadId: "",
        generatedClientId: "client-lead-004",
        previousLeadStatus: "Won",
        actor: "Human reviewer",
        timestamp: "2026-07-01T10:07:00.000Z",
        persistedRecordCreated: false,
      }),
      false,
    );
  });
});
