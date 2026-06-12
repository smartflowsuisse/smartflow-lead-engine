import { analyzeWebsite } from "../ai-analysis";
import { WebsiteAnalysisUnavailableError } from "./unavailable";
import { getLeadById, saveLeadAnalysis } from "../leads";
import { calculateLeadScore } from "../scoring";
import type { Lead, LeadAnalysis } from "../types";

export type RunLeadAnalysisResult =
  | {
      ok: true;
      lead: Lead;
      analysis: LeadAnalysis;
      score: number;
    }
  | {
      ok: false;
      reason: "not_found" | "no_website" | "unavailable" | "error";
      error?: string;
    };

export async function runLeadWebsiteAnalysis(
  leadId: number
): Promise<RunLeadAnalysisResult> {
  const lead = getLeadById(leadId);
  if (!lead) {
    return { ok: false, reason: "not_found" };
  }

  if (!lead.website?.trim()) {
    return { ok: false, reason: "no_website" };
  }

  try {
    const analysis = await analyzeWebsite(lead.website, lead.industry, {
      company: lead.company,
      city: lead.city,
      industry: lead.industry,
    });
    const leadScore = calculateLeadScore(lead, analysis);

    const savedAnalysis = saveLeadAnalysis(leadId, {
      websiteQuality: analysis.websiteQuality,
      mobileFriendliness: analysis.mobileFriendliness,
      speedScore: analysis.speedScore,
      seoScore: analysis.seoScore,
      hasContactForm: analysis.hasContactForm,
      trustScore: analysis.trustScore,
      quickWins: analysis.quickWins,
      automationOpportunities: analysis.automationOpportunities,
      rawAnalysis: analysis.details,
      leadScore,
    });

    const updatedLead = getLeadById(leadId);
    if (!updatedLead) {
      return { ok: false, reason: "error", error: "Lead not found after analysis" };
    }

    return {
      ok: true,
      lead: updatedLead,
      analysis: savedAnalysis,
      score: leadScore,
    };
  } catch (error) {
    if (error instanceof WebsiteAnalysisUnavailableError) {
      return { ok: false, reason: "unavailable" };
    }

    return {
      ok: false,
      reason: "error",
      error: error instanceof Error ? error.message : "Analysis could not be completed",
    };
  }
}
