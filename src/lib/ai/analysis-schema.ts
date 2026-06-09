import type { AiConfidence, LlmEnrichmentResult } from "./types";
import { getAiConfig } from "./config";

const CONFIDENCE_VALUES = new Set<AiConfidence>(["high", "medium", "low"]);

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function normalizeStringArray(
  value: unknown,
  maxItems: number
): string[] | null {
  if (!isStringArray(value)) return null;
  const trimmed = value.map((item) => item.trim()).filter(Boolean);
  if (trimmed.length === 0) return null;
  return [...new Set(trimmed)].slice(0, maxItems);
}

export function parseLlmEnrichmentResponse(
  raw: unknown
): LlmEnrichmentResult | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const config = getAiConfig();

  const executiveSummary =
    typeof data.executiveSummary === "string"
      ? data.executiveSummary.trim()
      : "";
  const salesAngle =
    typeof data.salesAngle === "string" ? data.salesAngle.trim() : "";

  const quickWins = normalizeStringArray(data.quickWins, config.maxQuickWins);
  const automationOpportunities = normalizeStringArray(
    data.automationOpportunities,
    config.maxAutomationOps
  );

  const confidence = CONFIDENCE_VALUES.has(data.confidence as AiConfidence)
    ? (data.confidence as AiConfidence)
    : "medium";

  if (!executiveSummary || !quickWins || !automationOpportunities) {
    return null;
  }

  return {
    executiveSummary,
    quickWins,
    automationOpportunities,
    salesAngle: salesAngle || executiveSummary,
    confidence,
  };
}

export function extractJsonFromModelText(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}
