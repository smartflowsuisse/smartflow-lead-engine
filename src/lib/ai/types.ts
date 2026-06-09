import type { WebsiteAnalysisResult } from "../types";

export type AnalysisEngine = "heuristic" | "heuristic+llm";

export type AiConfidence = "high" | "medium" | "low";

export interface LlmEnrichmentResult {
  executiveSummary: string;
  quickWins: string[];
  automationOpportunities: string[];
  salesAngle: string;
  confidence: AiConfidence;
}

export interface LeadAnalysisContext {
  company?: string;
  city?: string | null;
  industry?: string | null;
  website?: string;
}

export interface EnrichmentInput {
  heuristic: WebsiteAnalysisResult;
  context: LeadAnalysisContext;
  signals: Record<string, unknown>;
  pageExcerpt?: string;
}

export interface LlmCallMeta {
  provider: string;
  model: string;
  skippedReason?: string;
}

export interface AnalysisDetailsMeta {
  analysisEngine: AnalysisEngine;
  heuristic?: {
    scores: {
      websiteQuality: number;
      mobileFriendliness: number;
      speedScore: number;
      seoScore: number;
      trustScore: number;
    };
  };
  llm?: LlmCallMeta & {
    parsed?: LlmEnrichmentResult;
    error?: string;
  };
  summary?: string;
  salesAngle?: string;
  aiSkippedReason?: string;
  [key: string]: unknown;
}
