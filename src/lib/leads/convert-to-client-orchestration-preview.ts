import type {
  ConvertToClientAuditEvent,
  ConvertToClientContractClientDraft,
  ConvertToClientContractLeadInput,
  ConvertToClientRollbackContext,
} from "./convert-to-client-contract";
import { createClientDraftFromLead } from "./convert-to-client";
import {
  checkConvertToClientDuplicate,
  type ConvertToClientDuplicateCandidate,
  type ConvertToClientDuplicateResult,
} from "./convert-to-client-duplicate-check";
import {
  buildConvertBlockedAuditEvent,
  buildConvertPreviewAuditEvent,
} from "./convert-to-client-audit-event";
import { buildConvertToClientRollbackContext } from "./convert-to-client-rollback-context";
import {
  evaluateConvertToClientSafetyGuard,
  type ConvertToClientSafetyGuardResult,
} from "./convert-to-client-safety-guard";

export type BuildConvertToClientOrchestrationPreviewInput = {
  lead: ConvertToClientContractLeadInput;
  existingClients: ConvertToClientDuplicateCandidate[];
  actor: string;
  timestamp: string;
};

export type ConvertToClientOrchestrationPreview = {
  clientDraft?: ConvertToClientContractClientDraft;
  duplicateResult: ConvertToClientDuplicateResult;
  rollbackContext: ConvertToClientRollbackContext;
  auditEvent: ConvertToClientAuditEvent;
  safetyGuard: ConvertToClientSafetyGuardResult;
};

export function buildConvertToClientOrchestrationPreview(
  input: BuildConvertToClientOrchestrationPreviewInput,
): ConvertToClientOrchestrationPreview {
  const duplicateResult = checkConvertToClientDuplicate(
    {
      sourceLeadId: input.lead.id,
      company: input.lead.company,
      email: input.lead.email,
    },
    input.existingClients,
  );

  const generatedClientId = `client-${input.lead.id}`;

  const rollbackContext = buildConvertToClientRollbackContext({
    sourceLeadId: input.lead.id,
    generatedClientId,
    previousLeadStatus: input.lead.status,
    actor: input.actor,
    timestamp: input.timestamp,
    persistedRecordCreated: false,
  });

  try {
    const clientDraft = createClientDraftFromLead(input.lead);

    const auditEvent = buildConvertPreviewAuditEvent({
      id: `audit-${input.lead.id}`,
      sourceLeadId: input.lead.id,
      generatedClientId: clientDraft.id,
      actor: input.actor,
      timestamp: input.timestamp,
      previousLeadStatus: input.lead.status,
    });

    const safetyGuard = evaluateConvertToClientSafetyGuard({
      lead: input.lead,
      duplicateResult,
      rollbackContext,
      auditEventPrepared: true,
    });

    return {
      clientDraft,
      duplicateResult,
      rollbackContext,
      auditEvent,
      safetyGuard,
    };
  } catch (error) {
    const auditEvent = buildConvertBlockedAuditEvent({
      id: `audit-${input.lead.id}`,
      sourceLeadId: input.lead.id,
      generatedClientId,
      actor: input.actor,
      timestamp: input.timestamp,
      previousLeadStatus: input.lead.status,
      note:
        error instanceof Error
          ? error.message
          : "Convert to Client preview blocked",
    });

    const safetyGuard = evaluateConvertToClientSafetyGuard({
      lead: input.lead,
      duplicateResult,
      rollbackContext,
      auditEventPrepared: true,
    });

    return {
      duplicateResult,
      rollbackContext,
      auditEvent,
      safetyGuard,
    };
  }
}
