import type {
  ConvertToClientAuditAction,
  ConvertToClientAuditEvent,
  ConvertToClientAuditResult,
} from "./convert-to-client-contract";

export type BuildConvertToClientAuditEventInput = {
  id: string;
  sourceLeadId: string;
  generatedClientId: string;
  actor: string;
  timestamp: string;
  action: ConvertToClientAuditAction;
  previousLeadStatus: string;
  newLeadStatus?: string;
  result: ConvertToClientAuditResult;
  rollbackAvailable: boolean;
  note?: string;
};

export function buildConvertToClientAuditEvent(
  input: BuildConvertToClientAuditEventInput,
): ConvertToClientAuditEvent {
  return {
    id: input.id,
    sourceLeadId: input.sourceLeadId,
    generatedClientId: input.generatedClientId,
    actor: input.actor,
    timestamp: input.timestamp,
    action: input.action,
    previousLeadStatus: input.previousLeadStatus,
    newLeadStatus: input.newLeadStatus,
    result: input.result,
    rollbackAvailable: input.rollbackAvailable,
    note: input.note ?? "",
  };
}

export function buildConvertPreviewAuditEvent(input: {
  id: string;
  sourceLeadId: string;
  generatedClientId: string;
  actor: string;
  timestamp: string;
  previousLeadStatus: string;
  note?: string;
}): ConvertToClientAuditEvent {
  return buildConvertToClientAuditEvent({
    id: input.id,
    sourceLeadId: input.sourceLeadId,
    generatedClientId: input.generatedClientId,
    actor: input.actor,
    timestamp: input.timestamp,
    action: "convert_to_client_preview",
    previousLeadStatus: input.previousLeadStatus,
    result: "prepared",
    rollbackAvailable: false,
    note: input.note ?? "Convert to Client preview prepared for human review",
  });
}

export function buildConvertBlockedAuditEvent(input: {
  id: string;
  sourceLeadId: string;
  generatedClientId: string;
  actor: string;
  timestamp: string;
  previousLeadStatus: string;
  note: string;
}): ConvertToClientAuditEvent {
  return buildConvertToClientAuditEvent({
    id: input.id,
    sourceLeadId: input.sourceLeadId,
    generatedClientId: input.generatedClientId,
    actor: input.actor,
    timestamp: input.timestamp,
    action: "convert_to_client_blocked",
    previousLeadStatus: input.previousLeadStatus,
    result: "blocked",
    rollbackAvailable: false,
    note: input.note,
  });
}
