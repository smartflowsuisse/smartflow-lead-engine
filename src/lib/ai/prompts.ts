import type { EnrichmentInput } from "./types";

export const AI_ANALYSIS_SYSTEM_PROMPT = `You are a B2B sales analyst for SmartFlow Suisse, a Swiss automation and digital services company.
Analyze the provided website signals and produce practical sales recommendations.
Respond with valid JSON only — no markdown fences.
Focus on concrete website improvements (quick wins) and SmartFlow automation opportunities.
Be factual; do not invent metrics not supported by the signals.`;

export function buildEnrichmentUserPrompt(input: EnrichmentInput): string {
  const { heuristic, context, signals, pageExcerpt } = input;

  return JSON.stringify(
    {
      task: "Enrich website analysis for SmartFlow lead scoring outreach",
      lead: {
        company: context.company ?? null,
        website: context.website ?? null,
        city: context.city ?? null,
        industry: context.industry ?? null,
      },
      heuristicScores: {
        websiteQuality: heuristic.websiteQuality,
        mobileFriendliness: heuristic.mobileFriendliness,
        speedScore: heuristic.speedScore,
        seoScore: heuristic.seoScore,
        trustScore: heuristic.trustScore,
        hasContactForm: heuristic.hasContactForm,
      },
      heuristicQuickWins: heuristic.quickWins,
      heuristicAutomationOpportunities: heuristic.automationOpportunities,
      signals,
      pageExcerpt: pageExcerpt ?? null,
      outputSchema: {
        executiveSummary: "string (2-3 sentences)",
        quickWins: "string[] (max 8 actionable items)",
        automationOpportunities:
          "string[] (max 6 SmartFlow-specific automation ideas)",
        salesAngle: "string (one sentence outreach angle)",
        confidence: "high | medium | low",
      },
    },
    null,
    2
  );
}
