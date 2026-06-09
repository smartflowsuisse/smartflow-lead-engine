import type { WebsiteAnalysisResult } from "./types";

interface ScoringWeights {
  websiteQuality: number;
  mobileFriendliness: number;
  speedScore: number;
  seoScore: number;
  trustScore: number;
  contactFormBonus: number;
  quickWinBonus: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  websiteQuality: 0.2,
  mobileFriendliness: 0.15,
  speedScore: 0.15,
  seoScore: 0.15,
  trustScore: 0.15,
  contactFormBonus: 5,
  quickWinBonus: 2,
};

export function calculateLeadScore(
  analysis: WebsiteAnalysisResult,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  const baseScore =
    analysis.websiteQuality * weights.websiteQuality +
    analysis.mobileFriendliness * weights.mobileFriendliness +
    analysis.speedScore * weights.speedScore +
    analysis.seoScore * weights.seoScore +
    analysis.trustScore * weights.trustScore;

  let bonus = 0;
  if (!analysis.hasContactForm) {
    bonus += weights.contactFormBonus;
  }
  bonus += Math.min(analysis.quickWins.length * weights.quickWinBonus, 15);
  bonus += Math.min(analysis.automationOpportunities.length, 5);

  const rawScore = baseScore + bonus;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Hot Lead";
  if (score >= 60) return "High Priority";
  if (score >= 40) return "Medium Priority";
  if (score >= 20) return "Low Priority";
  return "Not Qualified";
}

export function getScorePriority(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
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
