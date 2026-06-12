export function getAnalyzeActionLabel(hasAnalysis: boolean): "Analyze" | "Re-analyze" {
  return hasAnalysis ? "Re-analyze" : "Analyze";
}
