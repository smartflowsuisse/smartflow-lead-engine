import { buildConvertToClientOrchestrationPreview } from "./convert-to-client-orchestration-preview";

export type BuildConvertToClientInternalActionInput = Parameters<
  typeof buildConvertToClientOrchestrationPreview
>[0];

export type ConvertToClientInternalActionResult = ReturnType<
  typeof buildConvertToClientOrchestrationPreview
> & {
  actionType: "convert-to-client";
  mode: "preview-only";
  canProceed: boolean;
  blockedReasons: string[];
};

export function buildConvertToClientInternalAction(
  input: BuildConvertToClientInternalActionInput,
): ConvertToClientInternalActionResult {
  const preview = buildConvertToClientOrchestrationPreview(input);

  return {
    ...preview,
    actionType: "convert-to-client",
    mode: "preview-only",
    canProceed: preview.safetyGuard.canProceed,
    blockedReasons: preview.safetyGuard.blockedReasons,
  };
}
