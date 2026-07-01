import type {
  ConvertToClientContractLeadInput,
  ConvertToClientRollbackContext,
} from "./convert-to-client-contract";
import { canConvertLeadToClient } from "./convert-to-client";
import type { ConvertToClientDuplicateResult } from "./convert-to-client-duplicate-check";
import { canRollbackConvertToClient } from "./convert-to-client-rollback-context";

export type ConvertToClientSafetyGuardInput = {
  lead: ConvertToClientContractLeadInput;
  duplicateResult: ConvertToClientDuplicateResult;
  rollbackContext: ConvertToClientRollbackContext;
  auditEventPrepared: boolean;
};

export type ConvertToClientSafetyGuardResult = {
  canProceed: boolean;
  blockedReasons: string[];
};

export function evaluateConvertToClientSafetyGuard(
  input: ConvertToClientSafetyGuardInput,
): ConvertToClientSafetyGuardResult {
  const blockedReasons: string[] = [];

  if (!canConvertLeadToClient(input.lead)) {
    blockedReasons.push("lead-not-eligible");
  }

  if (input.duplicateResult.hasDuplicate) {
    blockedReasons.push("duplicate-client-detected");
  }

  if (!canRollbackConvertToClient(input.rollbackContext)) {
    blockedReasons.push("rollback-context-incomplete");
  }

  if (!input.auditEventPrepared) {
    blockedReasons.push("audit-event-not-prepared");
  }

  return {
    canProceed: blockedReasons.length === 0,
    blockedReasons,
  };
}
