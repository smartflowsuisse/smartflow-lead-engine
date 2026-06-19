import type { Lead, OutreachStatus } from "../types";
import { isClosedCrmStatus } from "./status-sync";
import { hasLeadEmail, hasLeadPhone } from "./list-view";
import { LEAD_SCORE_THRESHOLDS } from "./scoring-thresholds";

export const MIN_OUTREACH_SCORE = LEAD_SCORE_THRESHOLDS.OUTREACH_READY;

export interface OutreachQueueSummary {
  readyForOutreach: number;
  contacted: number;
  replied: number;
  meetings: number;
  won: number;
  total: number;
}

export function isActionableOutreachLead(lead: Lead): boolean {
  return (
    !isClosedCrmStatus(lead.status) &&
    lead.status !== "Contacted" &&
    lead.lead_score >= MIN_OUTREACH_SCORE &&
    (hasLeadEmail(lead) || hasLeadPhone(lead))
  );
}

export function filterOutreachQueueLeads(leads: Lead[]): Lead[] {
  return leads
    .filter(isActionableOutreachLead)
    .sort((left, right) => {
      if (right.lead_score !== left.lead_score) {
        return right.lead_score - left.lead_score;
      }

      return right.created_at.localeCompare(left.created_at);
    });
}

export function computeOutreachQueueSummary(
  leads: Lead[]
): OutreachQueueSummary {
  const actionable = filterOutreachQueueLeads(leads);

  return {
    readyForOutreach: actionable.filter((lead) => lead.outreach_status === "New")
      .length,
    contacted: actionable.filter((lead) => lead.outreach_status === "Contacted")
      .length,
    replied: actionable.filter((lead) => lead.outreach_status === "Replied").length,
    meetings: actionable.filter((lead) => lead.outreach_status === "Meeting")
      .length,
    won: actionable.filter((lead) => lead.outreach_status === "Won").length,
    total: actionable.length,
  };
}

export function parseOutreachStatus(
  value: string | null | undefined
): OutreachStatus | null {
  if (!value) {
    return null;
  }

  const statuses: OutreachStatus[] = [
    "New",
    "Contacted",
    "Replied",
    "Meeting",
    "Won",
    "Lost",
  ];

  return statuses.includes(value as OutreachStatus)
    ? (value as OutreachStatus)
    : null;
}
