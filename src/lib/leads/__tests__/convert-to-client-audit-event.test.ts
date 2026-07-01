import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildConvertBlockedAuditEvent,
  buildConvertPreviewAuditEvent,
  buildConvertToClientAuditEvent,
} from "../convert-to-client-audit-event";

describe("convert-to-client-audit-event", () => {
  it("builds a generic audit event", () => {
    const event = buildConvertToClientAuditEvent({
      id: "audit-001",
      sourceLeadId: "lead-001",
      generatedClientId: "client-lead-001",
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:00:00.000Z",
      action: "convert_to_client_approved",
      previousLeadStatus: "Won",
      newLeadStatus: "Converted",
      result: "approved",
      rollbackAvailable: true,
      note: "Approved after human review",
    });

    assert.deepEqual(event, {
      id: "audit-001",
      sourceLeadId: "lead-001",
      generatedClientId: "client-lead-001",
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:00:00.000Z",
      action: "convert_to_client_approved",
      previousLeadStatus: "Won",
      newLeadStatus: "Converted",
      result: "approved",
      rollbackAvailable: true,
      note: "Approved after human review",
    });
  });

  it("uses safe empty note default", () => {
    const event = buildConvertToClientAuditEvent({
      id: "audit-002",
      sourceLeadId: "lead-002",
      generatedClientId: "client-lead-002",
      actor: "System preview",
      timestamp: "2026-07-01T10:01:00.000Z",
      action: "convert_to_client_preview",
      previousLeadStatus: "Won",
      result: "prepared",
      rollbackAvailable: false,
    });

    assert.equal(event.note, "");
  });

  it("builds a preview audit event with default human-review note", () => {
    const event = buildConvertPreviewAuditEvent({
      id: "audit-preview-001",
      sourceLeadId: "lead-003",
      generatedClientId: "client-lead-003",
      actor: "Convert Preview",
      timestamp: "2026-07-01T10:02:00.000Z",
      previousLeadStatus: "Won",
    });

    assert.equal(event.action, "convert_to_client_preview");
    assert.equal(event.result, "prepared");
    assert.equal(event.rollbackAvailable, false);
    assert.equal(
      event.note,
      "Convert to Client preview prepared for human review",
    );
  });

  it("builds a blocked audit event with explicit reason", () => {
    const event = buildConvertBlockedAuditEvent({
      id: "audit-blocked-001",
      sourceLeadId: "lead-004",
      generatedClientId: "client-lead-004",
      actor: "Convert Preview",
      timestamp: "2026-07-01T10:03:00.000Z",
      previousLeadStatus: "New",
      note: "Lead is not eligible for client conversion",
    });

    assert.equal(event.action, "convert_to_client_blocked");
    assert.equal(event.result, "blocked");
    assert.equal(event.rollbackAvailable, false);
    assert.equal(event.note, "Lead is not eligible for client conversion");
  });
});
