import { LEAD_SCORE_THRESHOLDS } from "./scoring-thresholds";
import { getScoreLabel } from "../scoring";
import type { Lead, LeadAnalysis } from "../types";
import {
  hasLeadContactPage,
  hasLeadEmail,
  hasLeadPhone,
} from "./list-view";
import { hasLeadWebsite } from "./contact-enrichment";

export type NextBestActionPriority = "High" | "Medium" | "Low";

export interface NextBestActionRecommendation {
  priority: NextBestActionPriority;
  action: string;
  reason: string;
}

export type NextBestActionInput = Pick<
  Lead,
  | "email"
  | "phone"
  | "website"
  | "contact_page_url"
  | "lead_score"
  | "status"
  | "industry"
> & {
  hasAnalysis?: boolean;
};

function qualificationLabel(score: number): string {
  return getScoreLabel(score);
}

function industrySuffix(industry: string | null): string {
  return industry?.trim() ? ` for this ${industry.trim()} lead` : "";
}

export function buildNextBestAction(
  input: NextBestActionInput
): NextBestActionRecommendation {
  const score = input.lead_score ?? 0;
  const label = qualificationLabel(score);
  const hasEmail = hasLeadEmail(input as Lead);
  const hasPhone = hasLeadPhone(input as Lead);
  const hasContactPage = hasLeadContactPage(input as Lead);
  const hasWebsite = hasLeadWebsite(input as Lead);
  const hasAnalysis = Boolean(input.hasAnalysis);
  const hasAnyContact = hasEmail || hasPhone || hasContactPage;

  if (input.status === "Won") {
    return {
      priority: "Low",
      action: "Maintain client relationship",
      reason: "Lead is Won — focus on delivery, upsell, and referrals.",
    };
  }

  if (input.status === "Lost") {
    return {
      priority: "Low",
      action: "No outreach needed",
      reason: "Lead is marked Lost — no active sales work required.",
    };
  }

  if (hasWebsite && !hasAnalysis) {
    return {
      priority: score >= LEAD_SCORE_THRESHOLDS.HIGH_PRIORITY ? "High" : "Medium",
      action: "Run website analysis",
      reason: `Website on file but no AI audit yet (${label}, ${score}/100).`,
    };
  }

  if (score < 50) {
    return {
      priority: "Low",
      action: "Review before outreach",
      reason: `Score ${score}/100 (${label})${industrySuffix(input.industry)} — confirm fit and contact quality first.`,
    };
  }

  if (hasPhone && score >= LEAD_SCORE_THRESHOLDS.STRONG_SCORE) {
    return {
      priority: "High",
      action: "Call company",
      reason: `Phone available with strong score ${score}/100 (${label}).`,
    };
  }

  if (hasEmail && !hasPhone) {
    return {
      priority: score >= LEAD_SCORE_THRESHOLDS.HIGH_PRIORITY ? "High" : "Medium",
      action: "Send email",
      reason: `Email on file without phone; score ${score}/100 (${label}).`,
    };
  }

  if (hasPhone) {
    return {
      priority: "Medium",
      action: "Call company",
      reason: `Phone available; score ${score}/100 (${label}).`,
    };
  }

  if (hasContactPage && !hasEmail && !hasPhone) {
    return {
      priority: "Medium",
      action: "Use contact page",
      reason: "Contact page URL found — no direct email or phone yet.",
    };
  }

  if (!hasAnyContact) {
    return {
      priority: "Low",
      action: "Research contact manually",
      reason: hasWebsite
        ? `No email, phone, or contact page discovered${industrySuffix(input.industry)}.`
        : `No website or contact channels on file${industrySuffix(input.industry)}.`,
    };
  }

  if (hasEmail) {
    return {
      priority: "Medium",
      action: "Send email",
      reason: `Email available; score ${score}/100 (${label}).`,
    };
  }

  return {
    priority: "Medium",
    action: "Review lead record",
    reason: `Score ${score}/100 (${label}) — confirm the best channel before outreach.`,
  };
}

export function buildNextBestActionForLead(
  lead: Pick<
    Lead,
    | "email"
    | "phone"
    | "website"
    | "contact_page_url"
    | "lead_score"
    | "status"
    | "industry"
  > & {
    analysis?: LeadAnalysis | null;
  }
): NextBestActionRecommendation {
  return buildNextBestAction({
    email: lead.email,
    phone: lead.phone,
    website: lead.website,
    contact_page_url: lead.contact_page_url,
    lead_score: lead.lead_score,
    status: lead.status,
    industry: lead.industry,
    hasAnalysis: Boolean(lead.analysis),
  });
}

export function nextBestActionPriorityClass(
  priority: NextBestActionPriority
): string {
  switch (priority) {
    case "High":
      return "border-red-200 bg-red-50 text-red-700";
    case "Medium":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "Low":
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}
