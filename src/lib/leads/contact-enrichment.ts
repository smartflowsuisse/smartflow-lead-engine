import type { Lead } from "../types";
import {
  hasLeadContactPage,
  hasLeadEmail,
  hasLeadPhone,
} from "./list-view";

export interface LeadReadinessItem {
  label: string;
  present: boolean;
}

export function hasLeadWebsite(lead: Lead): boolean {
  return Boolean(lead.website?.trim());
}

export function needsContactEnrichment(lead: Lead): boolean {
  return (
    !hasLeadEmail(lead) || !hasLeadPhone(lead) || !hasLeadContactPage(lead)
  );
}

export function getLeadReadinessChecklist(
  lead: Lead,
  hasAnalysis: boolean
): LeadReadinessItem[] {
  return [
    { label: "Website", present: hasLeadWebsite(lead) },
    { label: "Email", present: hasLeadEmail(lead) },
    { label: "Phone", present: hasLeadPhone(lead) },
    { label: "Contact page", present: hasLeadContactPage(lead) },
    { label: "Analysis", present: hasAnalysis },
  ];
}
