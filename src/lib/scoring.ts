import { isKnownScore } from "./analysis/score-values";
import type { Lead, LeadAnalysis, WebsiteAnalysisResult } from "./types";

export interface LeadScoreBreakdown {
  contactability: number;
  websiteGap: number;
  automation: number;
  swissSmbFit: number;
  total: number;
}

export type LeadScoreInput = Pick<
  Lead,
  | "email"
  | "phone"
  | "contact_page_url"
  | "website"
  | "company"
  | "city"
  | "industry"
>;

const SWISS_CITY_PATTERN =
  /\b(zürich|zurich|genève|geneva|genf|basel|bern|berne|lausanne|luzern|lucerne|winterthur|st\.?\s*gallen|lugano|biel|thun|koniz|schaffhausen|fribourg|freiburg|chur|neuchâtel|neuenburg|sion|sitten|aarau|schwyz|zug|solothurn|locarno|bellinzona|uster|emmen|kriens|yverdon|uster|rapperswil|dübendorf|dietikon|montreux|nyon|morges|vevey|baden|wettingen|olten|wil|frauenfeld|kreuzlingen|uster)\b/i;

const SMB_INDUSTRY_PATTERN =
  /bau|construction|handwerk|craft|metall|metal|gastro|hotel|tourism|tourismus|immobilien|real estate|consult|beratung|dienstleistung|service|retail|handel|garten|gärtner|sanitär|elektro|maler|schreiner|plumber|roofing|dach|bildhau|architekt/i;

const ENTERPRISE_PATTERN =
  /university|universität|schulen|school|holding|konzern|international group|global|ministry|ministerium|stadtverwaltung|kanton|bundesamt/i;

/** Leads without email, phone, or contact page cannot exceed this total. */
export const MAX_SCORE_WITHOUT_CONTACTABILITY = 49;

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

export function leadAnalysisToWebsiteResult(
  analysis: LeadAnalysis
): WebsiteAnalysisResult {
  let details: WebsiteAnalysisResult["details"] = { mode: "live" };

  try {
    details = {
      mode: "live",
      ...JSON.parse(analysis.raw_analysis),
    };
  } catch {
    details = { mode: "live" };
  }

  let quickWins: string[] = [];
  let automationOpportunities: string[] = [];

  try {
    quickWins = JSON.parse(analysis.quick_wins) as string[];
  } catch {
    quickWins = [];
  }

  try {
    automationOpportunities = JSON.parse(
      analysis.automation_opportunities
    ) as string[];
  } catch {
    automationOpportunities = [];
  }

  return {
    websiteQuality: analysis.website_quality,
    mobileFriendliness: analysis.mobile_friendliness,
    speedScore: analysis.speed_score,
    seoScore: analysis.seo_score,
    hasContactForm: analysis.has_contact_form,
    trustScore: analysis.trust_score,
    quickWins,
    automationOpportunities,
    details,
  };
}

export function scoreContactability(lead: LeadScoreInput): number {
  let score = 0;

  if (lead.email?.trim()) {
    score += 10;
  }

  if (lead.phone?.trim()) {
    score += 10;
  }

  if (lead.contact_page_url?.trim()) {
    score += 10;
  }

  return score;
}

export function scoreWebsiteGap(
  analysis: WebsiteAnalysisResult | null | undefined
): number {
  if (!analysis || analysis.details.mode === "unavailable") {
    return 0;
  }

  const quality = calculateWebsiteQualityScore(analysis);

  if (quality !== null) {
    return Math.round(30 * (1 - quality / 100));
  }

  return Math.min(analysis.quickWins.length * 3, 30);
}

export function scoreAutomationOpportunities(
  analysis: WebsiteAnalysisResult | null | undefined
): number {
  if (!analysis || analysis.details.mode === "unavailable") {
    return 0;
  }

  return Math.min(analysis.automationOpportunities.length * 5, 25);
}

function hasSwissPhone(phone: string | null | undefined): boolean {
  if (!phone?.trim()) {
    return false;
  }

  const digits = phone.replace(/\D/g, "");
  return (
    digits.startsWith("41") ||
    (digits.startsWith("0") && digits.length >= 10)
  );
}

function hasSwissWebsite(website: string | null | undefined): boolean {
  if (!website?.trim()) {
    return false;
  }

  try {
    return new URL(website).hostname.toLowerCase().endsWith(".ch");
  } catch {
    return website.toLowerCase().includes(".ch");
  }
}

export function scoreSwissPresence(lead: LeadScoreInput): number {
  let score = 0;

  if (hasSwissWebsite(lead.website)) {
    score += 3;
  }

  if (hasSwissPhone(lead.phone)) {
    score += 3;
  }

  if (lead.city?.trim() && SWISS_CITY_PATTERN.test(lead.city)) {
    score += 2;
  }

  return Math.min(score, 5);
}

export function scoreSmbIndicators(lead: LeadScoreInput): number {
  let score = 0;

  if (lead.industry?.trim() && SMB_INDUSTRY_PATTERN.test(lead.industry)) {
    score += 3;
  }

  if (/\b(AG|GmbH|SA|Sàrl|Sarl|GmbH)\b/i.test(lead.company)) {
    score += 2;
  }

  if (
    lead.industry?.trim() &&
    !ENTERPRISE_PATTERN.test(`${lead.company} ${lead.industry}`)
  ) {
    score += 1;
  }

  return Math.min(score, 5);
}

export function scoreLocalBusiness(lead: LeadScoreInput): number {
  let score = 0;

  if (lead.city?.trim()) {
    score += 3;
  }

  if (!ENTERPRISE_PATTERN.test(lead.company)) {
    score += 2;
  }

  return Math.min(score, 5);
}

export function scoreSwissSmbFit(lead: LeadScoreInput): number {
  return (
    scoreSwissPresence(lead) +
    scoreSmbIndicators(lead) +
    scoreLocalBusiness(lead)
  );
}

export function calculateLeadScoreBreakdown(
  lead: LeadScoreInput,
  analysis?: WebsiteAnalysisResult | null
): LeadScoreBreakdown {
  const contactability = scoreContactability(lead);
  const websiteGap = scoreWebsiteGap(analysis);
  const automation = scoreAutomationOpportunities(analysis);
  const swissSmbFit = scoreSwissSmbFit(lead);

  let total = Math.round(contactability + websiteGap + automation + swissSmbFit);

  if (contactability === 0) {
    total = Math.min(total, MAX_SCORE_WITHOUT_CONTACTABILITY);
  }

  total = Math.max(0, Math.min(100, total));

  return {
    contactability,
    websiteGap,
    automation,
    swissSmbFit,
    total,
  };
}

/**
 * SmartFlow Suisse lead score (0–100): contactability, website gaps,
 * automation fit, and Swiss SMB indicators.
 */
export function calculateLeadScore(
  lead: LeadScoreInput,
  analysis?: WebsiteAnalysisResult | null
): number {
  return calculateLeadScoreBreakdown(lead, analysis).total;
}

export function getScoreLabel(score: number): string {
  if (score <= 0) return "Not Scored";
  if (score >= 80) return "Hot Lead";
  if (score >= 65) return "High Priority";
  if (score >= 45) return "Qualified";
  if (score >= 25) return "Nurture";
  return "Cold";
}

export function getScorePriority(
  score: number
): "critical" | "high" | "medium" | "low" {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function getRecommendedAction(
  score: number,
  status: string
): string {
  if (status === "Won") return "Maintain relationship and upsell automation services";
  if (status === "Lost") return "No further action — lead closed";
  if (status === "Proposal") return "Follow up within 3 business days";
  if (status === "Meeting") return "Confirm agenda and send pre-meeting summary";
  if (status === "Replied") return "Respond promptly and propose next step";
  if (score >= 80 && status === "Analyzed") {
    return "Send personalized outreach email today";
  }
  if (score >= 80) return "Run analysis and prepare outreach";
  if (score >= 65) return "Schedule discovery call this week";
  if (score >= 45) return "Add to qualified outreach queue";
  if (score >= 25) return "Add to nurture sequence";
  return "Enrich contact data and run website analysis";
}

export function formatAnalysisScore(score: number | null | undefined): string {
  return isKnownScore(score) ? `${score}/100` : "Unknown";
}

export const LEAD_SCORE_PILLARS = [
  { key: "contactability", label: "Contact", max: 30 },
  { key: "websiteGap", label: "Website gap", max: 30 },
  { key: "automation", label: "Automation", max: 25 },
  { key: "swissSmbFit", label: "Swiss SMB", max: 15 },
] as const;
