import type { AnalysisEngine } from "../types";

export function getAnalysisEngine(
  details: Record<string, unknown> | undefined
): AnalysisEngine {
  const engine = details?.analysisEngine;
  return engine === "heuristic+llm" ? "heuristic+llm" : "heuristic";
}
