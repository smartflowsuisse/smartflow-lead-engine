export const ANALYSIS_UNAVAILABLE_MESSAGE = "Analysis unavailable";
export const ANALYSIS_UNAVAILABLE_REASON = "Website could not be reached";
export const ANALYSIS_UNAVAILABLE_ACTION = "Manual review";

export interface AnalysisUnavailablePayload {
  unavailable: true;
  message: string;
  reason: string;
  recommendedAction: string;
}

export function buildAnalysisUnavailablePayload(): AnalysisUnavailablePayload {
  return {
    unavailable: true,
    message: ANALYSIS_UNAVAILABLE_MESSAGE,
    reason: ANALYSIS_UNAVAILABLE_REASON,
    recommendedAction: ANALYSIS_UNAVAILABLE_ACTION,
  };
}

export function isAnalysisUnavailablePayload(
  data: unknown
): data is AnalysisUnavailablePayload {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as AnalysisUnavailablePayload).unavailable === true
  );
}

export function isLegacyUnavailableError(message: string): boolean {
  return message.startsWith("Website analysis unavailable:");
}
