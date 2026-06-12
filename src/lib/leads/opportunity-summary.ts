import { isKnownScore } from "../analysis/score-values";
import type { Lead, LeadAnalysis } from "../types";

export interface LeadOpportunitySummary {
  problems: string[];
  recommendedService: string;
  estimatedValueChf: number;
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function auditProblems(analysis: LeadAnalysis): string[] {
  const problems: string[] = [];

  if (isKnownScore(analysis.website_quality) && analysis.website_quality < 55) {
    problems.push("Website quality is below modern SMB standards");
  }
  if (
    isKnownScore(analysis.mobile_friendliness) &&
    analysis.mobile_friendliness < 55
  ) {
    problems.push("Mobile experience needs improvement");
  }
  if (isKnownScore(analysis.seo_score) && analysis.seo_score < 55) {
    problems.push("SEO fundamentals are weak or missing");
  }
  if (isKnownScore(analysis.trust_score) && analysis.trust_score < 55) {
    problems.push("Trust signals are limited on the website");
  }
  if (analysis.has_contact_form === false) {
    problems.push("No reliable contact or lead capture form detected");
  }

  return problems;
}

function recommendService(
  analysis: LeadAnalysis,
  automationOps: string[]
): string {
  if (automationOps[0]) {
    return automationOps[0];
  }

  if (analysis.has_contact_form === false) {
    return "Smart lead capture & CRM integration";
  }
  if (
    isKnownScore(analysis.mobile_friendliness) &&
    analysis.mobile_friendliness < 55
  ) {
    return "Mobile-first website optimization";
  }
  if (isKnownScore(analysis.seo_score) && analysis.seo_score < 55) {
    return "SEO & local visibility package";
  }
  if (
    isKnownScore(analysis.website_quality) &&
    analysis.website_quality < 55
  ) {
    return "Website modernization & conversion uplift";
  }

  return "SmartFlow digital growth package";
}

function estimateProjectValueChf(
  problemCount: number,
  analysis: LeadAnalysis,
  leadScore: number
): number {
  let value = 3500;

  value += problemCount * 1200;

  const automationCount = safeJsonParse<string[]>(
    analysis.automation_opportunities,
    []
  ).length;
  value += automationCount * 1800;

  if (leadScore >= 70) {
    value += 2500;
  } else if (leadScore >= 45) {
    value += 1200;
  }

  if (
    isKnownScore(analysis.website_quality) &&
    analysis.website_quality < 40
  ) {
    value += 2000;
  }

  const capped = Math.min(Math.max(value, 3500), 28000);
  return Math.round(capped / 500) * 500;
}

export function buildLeadOpportunitySummary(
  lead: Pick<Lead, "lead_score">,
  analysis?: LeadAnalysis | null
): LeadOpportunitySummary | null {
  if (!analysis) {
    return null;
  }

  const quickWins = safeJsonParse<string[]>(analysis.quick_wins, []);
  const automationOps = safeJsonParse<string[]>(
    analysis.automation_opportunities,
    []
  );
  const rawDetails = safeJsonParse<Record<string, unknown> | null>(
    analysis.raw_analysis,
    null
  );
  const executiveSummary =
    typeof rawDetails?.summary === "string" ? rawDetails.summary : null;

  const problems = [
    ...quickWins,
    ...auditProblems(analysis).filter(
      (problem) => !quickWins.some((win) => win.toLowerCase().includes(problem.slice(0, 20).toLowerCase()))
    ),
  ];

  if (problems.length === 0 && executiveSummary) {
    problems.push(executiveSummary);
  }

  if (problems.length === 0) {
    problems.push("Website has room for measurable SmartFlow improvements");
  }

  return {
    problems,
    recommendedService: recommendService(analysis, automationOps),
    estimatedValueChf: estimateProjectValueChf(
      problems.length,
      analysis,
      lead.lead_score
    ),
  };
}
