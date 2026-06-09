import type { WebsiteAnalysisResult } from "../types";
import { getAiConfig, hasAiCredentials } from "./config";
import { callLlmEnrichment } from "./llm-client";
import type {
  AnalysisDetailsMeta,
  EnrichmentInput,
  LeadAnalysisContext,
  LlmEnrichmentResult,
} from "./types";

function buildHeuristicMeta(
  result: WebsiteAnalysisResult
): AnalysisDetailsMeta["heuristic"] {
  return {
    scores: {
      websiteQuality: result.websiteQuality,
      mobileFriendliness: result.mobileFriendliness,
      speedScore: result.speedScore,
      seoScore: result.seoScore,
      trustScore: result.trustScore,
    },
  };
}

function tagHeuristicResult(
  result: WebsiteAnalysisResult,
  extra: Partial<AnalysisDetailsMeta> = {}
): WebsiteAnalysisResult {
  const details: AnalysisDetailsMeta = {
    ...(result.details as AnalysisDetailsMeta),
    analysisEngine: "heuristic",
    heuristic: buildHeuristicMeta(result),
    ...extra,
  };

  return {
    ...result,
    details,
  };
}

function mergeLlmIntoResult(
  heuristic: WebsiteAnalysisResult,
  llm: LlmEnrichmentResult,
  config = getAiConfig()
): WebsiteAnalysisResult {
  const details: AnalysisDetailsMeta = {
    ...(heuristic.details as AnalysisDetailsMeta),
    analysisEngine: "heuristic+llm",
    heuristic: buildHeuristicMeta(heuristic),
    summary: llm.executiveSummary,
    salesAngle: llm.salesAngle,
    llm: {
      provider: config.provider,
      model: config.model,
      parsed: llm,
    },
  };

  return {
    ...heuristic,
    quickWins: llm.quickWins.slice(0, config.maxQuickWins),
    automationOpportunities: llm.automationOpportunities.slice(
      0,
      config.maxAutomationOps
    ),
    details,
  };
}

export async function enrichAnalysisWithAi(
  heuristic: WebsiteAnalysisResult,
  context: LeadAnalysisContext,
  signals: Record<string, unknown>,
  pageExcerpt?: string
): Promise<WebsiteAnalysisResult> {
  const config = getAiConfig();

  if (!config.enabled) {
    return tagHeuristicResult(heuristic);
  }

  if (!hasAiCredentials(config)) {
    return tagHeuristicResult(heuristic, {
      aiSkippedReason: "missing_api_key",
      llm: {
        provider: config.provider,
        model: config.model,
        skippedReason: "missing_api_key",
      },
    });
  }

  const input: EnrichmentInput = {
    heuristic,
    context,
    signals,
    pageExcerpt,
  };

  try {
    const llm = await callLlmEnrichment(input);
    if (!llm) {
      return tagHeuristicResult(heuristic, {
        aiSkippedReason: "llm_unavailable",
        llm: {
          provider: config.provider,
          model: config.model,
          skippedReason: "llm_unavailable",
        },
      });
    }

    return mergeLlmIntoResult(heuristic, llm, config);
  } catch (error) {
    return tagHeuristicResult(heuristic, {
      aiSkippedReason: "llm_error",
      llm: {
        provider: config.provider,
        model: config.model,
        skippedReason: "llm_error",
        error: error instanceof Error ? error.message : "unknown_error",
      },
    });
  }
}
