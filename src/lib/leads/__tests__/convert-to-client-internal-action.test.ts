import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildConvertToClientInternalAction } from "../convert-to-client-internal-action";

describe("buildConvertToClientInternalAction", () => {
  it("returns a preview-only internal conversion result for an eligible won lead", () => {
    const result = buildConvertToClientInternalAction({
      lead: {
        id: "lead-027",
        company: "Demo Internal Action",
        status: "Won",
        email: "internal-action@example.com",
      },
      existingClients: [],
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:27:00.000Z",
    });

    assert.equal(result.actionType, "convert-to-client");
    assert.equal(result.mode, "preview-only");
    assert.equal(result.canProceed, result.safetyGuard.canProceed);
    assert.deepEqual(result.blockedReasons, result.safetyGuard.blockedReasons);
    assert.equal(result.canProceed, true);
    assert.deepEqual(result.blockedReasons, []);
    assert.equal(result.clientDraft?.id, "client-lead-027");
    assert.equal(result.auditEvent.actor, "Human reviewer");
    assert.equal(result.rollbackContext.sourceLeadId, "lead-027");
  });

  it("returns blockedReasons when the internal action is not safe to proceed", () => {
    const result = buildConvertToClientInternalAction({
      lead: {
        id: "lead-028",
        company: "Demo Duplicate Internal Action",
        status: "Won",
        email: "duplicate-internal@example.com",
      },
      existingClients: [
        {
          id: "client-existing-028",
          sourceLeadId: "lead-028",
          company: "Demo Duplicate Internal Action",
          email: "duplicate-internal@example.com",
        },
      ],
      actor: "Human reviewer",
      timestamp: "2026-07-01T10:28:00.000Z",
    });

    assert.equal(result.actionType, "convert-to-client");
    assert.equal(result.mode, "preview-only");
    assert.equal(result.canProceed, result.safetyGuard.canProceed);
    assert.deepEqual(result.blockedReasons, result.safetyGuard.blockedReasons);
    assert.equal(result.canProceed, false);
    assert.deepEqual(result.blockedReasons, ["duplicate-client-detected"]);
    assert.equal(result.duplicateResult.hasDuplicate, true);
    assert.deepEqual(result.duplicateResult.duplicateIds, ["client-existing-028"]);
  });
});
