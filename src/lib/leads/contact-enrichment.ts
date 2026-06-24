import type { Lead } from "../types";
import type { LeadOpportunitySummary } from "./opportunity-summary";
import {
  hasLeadContactPage,
  hasLeadEmail,
  hasLeadPhone,
} from "./list-view";

export interface LeadReadinessItem {
  label: string;
  present: boolean;
}

export interface LeadReadinessInput {
  lead: Lead;
  hasAnalysis: boolean;
  opportunitySummary?: LeadOpportunitySummary | null;
  openTaskCount?: number;
}

export function hasLeadWebsite(lead: Lead): boolean {
  return Boolean(lead.website?.trim());
}

export function hasLeadContactPath(lead: Lead): boolean {
  return (
    hasLeadEmail(lead) || hasLeadPhone(lead) || hasLeadContactPage(lead)
  );
}

export function hasStructuredNoteSection(
  notes: string | null | undefined,
  section: string
): boolean {
  if (!notes?.trim()) {
    return false;
  }

  const pattern = new RegExp(`${section}:\\s*\\S`, "i");
  return pattern.test(notes);
}

export function needsContactEnrichment(lead: Lead): boolean {
  return (
    !hasLeadEmail(lead) || !hasLeadPhone(lead) || !hasLeadContactPage(lead)
  );
}

export function getLeadReadinessChecklist(
  input: LeadReadinessInput
): LeadReadinessItem[] {
  const { lead, hasAnalysis, opportunitySummary, openTaskCount = 0 } = input;
  const notes = lead.notes;

  const websiteReviewed = hasLeadWebsite(lead) ? hasAnalysis : false;
  const contactPathConfirmed = hasLeadContactPath(lead);
  const businessProblemIdentified = Boolean(
    opportunitySummary?.problems.length
  );
  const recommendedOfferSelected =
    Boolean(opportunitySummary?.recommendedService?.trim()) ||
    hasStructuredNoteSection(notes, "Recommended offer");
  const nextManualActionDefined =
    openTaskCount > 0 || hasStructuredNoteSection(notes, "Next manual action");
  const miniAuditReady =
    websiteReviewed &&
    contactPathConfirmed &&
    businessProblemIdentified &&
    recommendedOfferSelected &&
    nextManualActionDefined;

  return [
    { label: "Website reviewed", present: websiteReviewed },
    { label: "Contact path confirmed", present: contactPathConfirmed },
    { label: "Business problem identified", present: businessProblemIdentified },
    { label: "Recommended offer selected", present: recommendedOfferSelected },
    { label: "Next manual action defined", present: nextManualActionDefined },
    { label: "Mini-audit ready", present: miniAuditReady },
  ];
}
