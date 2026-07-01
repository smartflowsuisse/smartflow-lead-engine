import type { ConvertToClientRollbackContext } from "./convert-to-client-contract";

export type BuildConvertToClientRollbackContextInput = {
  sourceLeadId: string;
  generatedClientId: string;
  previousLeadStatus: string;
  actor: string;
  timestamp: string;
  persistedRecordCreated?: boolean;
};

export function buildConvertToClientRollbackContext(
  input: BuildConvertToClientRollbackContextInput,
): ConvertToClientRollbackContext {
  return {
    sourceLeadId: input.sourceLeadId,
    generatedClientId: input.generatedClientId,
    previousLeadStatus: input.previousLeadStatus,
    actor: input.actor,
    timestamp: input.timestamp,
    persistedRecordCreated: input.persistedRecordCreated ?? false,
  };
}

export function canRollbackConvertToClient(
  context: ConvertToClientRollbackContext,
): boolean {
  return Boolean(
    context.sourceLeadId &&
      context.generatedClientId &&
      context.previousLeadStatus &&
      context.actor &&
      context.timestamp,
  );
}
