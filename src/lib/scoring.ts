import type { WebsiteAnalysisResult } from "./types";
import { isKnownScore } from "./analysis/score-values";

interface OpportunityWeights {
  missingContactForm: number;
  quickWinPoints: number;
  quickWinCap: number;
  automationPoints: number;
  automationCap: number;
  maxScore: number;
}

const OPPORTUNITY_WEIGHTS: OpportunityWeights = {
  missingContactForm: 12,
  quickWinPoints: 2,
  quickWinCap: 16,
  automationPoints: 2,
  automationCap: 10,
  maxScore: 85,
};

/**
 * Average of measured website-quality dimensions.
 * Unknown dimensions are excluded rather than treated as perfect.
 */
export function calculateWebsiteQualityScore(
  analysis: WebsiteAnalysisResult
): number | null {
  const dimensions = [
    analysis.websiteQuality,
    analysis.mobileFriendliness,
    analysis.speedScore,
    analysis.seoScore,
    analysis.trustScore,
  ].filter(isKnownScore);

  if (dimensions.length === 0) return null;

  const average =
    dimensions.reduce((total, score) => total + score, 0) / dimensions.length;

  return Math.max(0, Math.min(100, Math.round(average)));
}

/**
 * SmartFlow opportunity score — gaps and upsell potential, not site quality.
 */
export function calculateLeadScore(
  analysis: WebsiteAnalysisResult,
  weights: OpportunityWeights = OPPORTUNITY_WEIGHTS
): number {
  if (analysis.details.mode === "unavailable") {
    return 0;
  }

  let score = 0;

  if (analysis.hasContactForm === false) {
    score += weights.missingContactForm;
  }

  score += Math.min(
    analysis.quickWins.length * weights.quickWinPoints,
    weights.quickWinCap
  );

  score += Math.min(
    analysis.automationOpportunities.length * weights.automationPoints,
    weights.automationCap
  );

  return Math.max(0, Math.min(weights.maxScore, Math.round(score)));
}

export function getScoreLabel(score: number): string {
  if (score <= 0) return "Not Scored";
  if (score >= 80) return "Hot Lead";
  if (score >= 60) return "High Priority";
  if (score >= 40) return "Medium Priority";
  if (score >= 20) return "Low Priority";
  return "Not Qualified";
}

export function getScorePriority(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function getRecommendedAction(
  score: number,
  status: string
): string {
  if (status === "Client") return "Maintain relationship and upsell automation services";
  if (status === "Proposal Sent") return "Follow up within 3 business days";
  if (score >= 70 && status === "New Lead") return "Run AI analysis and prepare outreach";
  if (score >= 70 && status === "Analyzed") return "Send personalized outreach email today";
  if (score >= 50) return "Schedule discovery call";
  if (score >= 30) return "Add to nurture sequence";
  return "Monitor or deprioritize";
}

export function formatAnalysisScore(score: number | null | undefined): string {
  return isKnownScore(score) ? `${score}/100` : "Unknown";
}
