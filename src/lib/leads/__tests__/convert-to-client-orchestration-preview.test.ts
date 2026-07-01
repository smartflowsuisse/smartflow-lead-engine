import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildConvertToClientOrchestrationPreview } from "../convert-to-client-orchestration-preview";

describe("buildConvertToClientOrchestrationPreview", () => {
  it("builds a safe preview for an eligible lead", () => {
    const preview = buildConvertToClientOrchestrationPreview({
      lead: {
        id: "lead-001",
        company: "Demo Construction Genève",
        status: "Won",
        contactName: "Claire Demo",
        email: "claire@example.com",
        phone: "+41000000000",
        language: "FR",
      },
      existingClients: [],
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:13:00.000Z",
    });

    assert.equal(preview.clientDraft?.id, "client-lead-001");
    assert.equal(preview.clientDraft?.sourceLeadId, "lead-001");
    assert.equal(preview.duplicateResult.hasDuplicate, false);
    assert.equal(preview.rollbackContext.persistedRecordCreated, false);
    assert.equal(preview.auditEvent.action, "convert_to_client_preview");
    assert.equal(preview.auditEvent.result, "prepared");
    assert.equal(preview.safetyGuard.canProceed, true);
    assert.deepEqual(preview.safetyGuard.blockedReasons, []);
  });

  it("blocks preview for a non-eligible lead", () => {
    const preview = buildConvertToClientOrchestrationPreview({
      lead: {
        id: "lead-002",
        company: "Demo New Lead",
        status: "New",
      },
      existingClients: [],
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:14:00.000Z",
    });

    assert.equal(preview.clientDraft, undefined);
    assert.equal(preview.auditEvent.action, "convert_to_client_blocked");
    assert.equal(preview.auditEvent.result, "blocked");
    assert.equal(
      preview.auditEvent.note,
      "Lead is not eligible for client conversion",
    );
    assert.equal(preview.safetyGuard.canProceed, false);
    assert.deepEqual(preview.safetyGuard.blockedReasons, ["lead-not-eligible"]);
  });

  it("blocks proceeding when duplicate exists", () => {
    const preview = buildConvertToClientOrchestrationPreview({
      lead: {
        id: "lead-003",
        company: "Demo Duplicate",
        status: "Won",
        email: "duplicate@example.com",
      },
      existingClients: [
        {
          id: "client-existing-003",
          sourceLeadId: "lead-003",
          company: "Demo Duplicate",
          email: "duplicate@example.com",
        },
      ],
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:15:00.000Z",
    });

    assert.equal(preview.clientDraft?.id, "client-lead-003");
    assert.equal(preview.duplicateResult.hasDuplicate, true);
    assert.deepEqual(preview.duplicateResult.duplicateIds, [
      "client-existing-003",
    ]);
    assert.equal(preview.safetyGuard.canProceed, false);
    assert.deepEqual(preview.safetyGuard.blockedReasons, [
      "duplicate-client-detected",
    ]);
  });
});
