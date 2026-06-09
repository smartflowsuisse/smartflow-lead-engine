import type { Lead, LeadAnalysis } from "../types";
import { getScoreLabel } from "../scoring";

export interface OutreachDraftInput {
  company: string;
  city: string | null;
  industry: string | null;
  website: string | null;
  leadScore: number;
  analysisSummary: string | null;
  quickWins: string[];
  automationOpportunities: string[];
}

export interface OutreachDraft {
  subject: string;
  body: string;
  generatedAt: string;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function extractSummary(rawAnalysis: string): string | null {
  try {
    const parsed = JSON.parse(rawAnalysis) as Record<string, unknown>;
    return typeof parsed.summary === "string" ? parsed.summary : null;
  } catch {
    return null;
  }
}

export function buildOutreachInput(
  lead: Lead,
  analysis?: LeadAnalysis | null
): OutreachDraftInput {
  return {
    company: lead.company,
    city: lead.city,
    industry: lead.industry,
    website: lead.website,
    leadScore: lead.lead_score,
    analysisSummary: analysis ? extractSummary(analysis.raw_analysis) : null,
    quickWins: analysis ? parseJsonArray(analysis.quick_wins) : [],
    automationOpportunities: analysis
      ? parseJsonArray(analysis.automation_opportunities)
      : [],
  };
}

function formatList(items: string[], fallback: string): string {
  if (items.length === 0) return fallback;
  return items.map((item) => `• ${item}`).join("\n");
}

function priorityHook(score: number): string {
  if (score >= 70) {
    return "significant growth opportunities on your website";
  }
  if (score >= 40) {
    return "concrete improvements for your online presence";
  }
  return "a quick review of your digital presence";
}

function openingLine(input: OutreachDraftInput): string {
  const location = input.city ? ` in ${input.city}` : "";
  const sector = input.industry ? ` (${input.industry})` : "";

  if (input.leadScore >= 60) {
    return `We reviewed ${input.company}${location}${sector} and identified several high-impact opportunities where SmartFlow Suisse can help you win more qualified leads online.`;
  }

  if (input.leadScore > 0) {
    return `We took a look at ${input.company}${location}${sector} and believe SmartFlow Suisse can support you with practical digital improvements tailored to Swiss businesses.`;
  }

  return `I'm reaching out to ${input.company}${location}${sector} because SmartFlow Suisse helps Swiss companies strengthen their online presence and lead generation.`;
}

export function generateOutreachDraft(input: OutreachDraftInput): OutreachDraft {
  const scoreLabel =
    input.leadScore > 0 ? getScoreLabel(input.leadScore) : "Not yet scored";
  const websiteLine = input.website
    ? `Website reviewed: ${input.website}`
    : "Website: not provided";

  const summaryBlock = input.analysisSummary
    ? `Analysis summary:\n${input.analysisSummary}`
    : "Analysis summary:\nNo website analysis available yet — we can run a full review during a first call.";

  const quickWinsBlock = formatList(
    input.quickWins.slice(0, 4),
    "• Run a full website analysis to identify quick wins"
  );

  const opportunitiesBlock = formatList(
    input.automationOpportunities.slice(0, 3),
    "• Smart contact forms with CRM integration\n• Automated follow-up sequences\n• AI-assisted lead qualification"
  );

  const subject = `SmartFlow Suisse — ${priorityHook(input.leadScore)} for ${input.company}`;

  const body = [
    "Bonjour,",
    "",
    openingLine(input),
    "",
    websiteLine,
    input.leadScore > 0
      ? `Lead opportunity score: ${input.leadScore}/100 (${scoreLabel})`
      : "Lead opportunity score: not yet calculated",
    "",
    summaryBlock,
    "",
    "Quick wins we identified:",
    quickWinsBlock,
    "",
    "SmartFlow automation opportunities:",
    opportunitiesBlock,
    "",
    "Would you be open to a 15-minute call this week to explore what fits best for your team?",
    "",
    "Best regards,",
    "SmartFlow Suisse",
    "AI-powered lead generation & automation for Swiss businesses",
  ].join("\n");

  return {
    subject,
    body,
    generatedAt: new Date().toISOString(),
  };
}
