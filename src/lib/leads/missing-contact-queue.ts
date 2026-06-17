import type { Lead } from "../types";
import { getAllLeads } from "../leads";

const CLOSED_CRM_STATUSES = new Set(["Won", "Lost"]);
const CLOSED_OUTREACH_STATUSES = new Set([
  "Contacted",
  "Replied",
  "Meeting",
  "Proposal",
  "Won",
  "Lost",
]);

export interface MissingContactLead {
  id: number;
  company?: string | null;
  website?: string | null;
  phone?: string | null;
  city?: string | null;
  industry?: string | null;
  lead_score?: number | null;
  status?: string | null;
  outreach_status?: string | null;
}

export function hasMissingEmail(lead: Pick<Lead, "email">): boolean {
  return !lead.email?.trim();
}

export function hasManualContactPath(
  lead: Pick<Lead, "phone" | "website">,
): boolean {
  return Boolean(lead.phone?.trim() || lead.website?.trim());
}

export function isMissingContactQueueLead(
  lead: Pick<
    Lead,
    | "email"
    | "phone"
    | "website"
    | "status"
    | "outreach_status"
  >,
): boolean {
  if (!hasMissingEmail(lead)) {
    return false;
  }

  if (!hasManualContactPath(lead)) {
    return false;
  }

  if (lead.status && CLOSED_CRM_STATUSES.has(lead.status)) {
    return false;
  }

  if (
    lead.outreach_status &&
    CLOSED_OUTREACH_STATUSES.has(lead.outreach_status)
  ) {
    return false;
  }

  return true;
}

export function sortMissingContactQueueLeads<T extends MissingContactLead>(
  leads: T[],
): T[] {
  return [...leads].sort((left, right) => {
    const rightScore = right.lead_score ?? 0;
    const leftScore = left.lead_score ?? 0;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return (left.company ?? "").localeCompare(right.company ?? "");
  });
}

export function getMissingContactQueueLeads(): MissingContactLead[] {
  return sortMissingContactQueueLeads(
    getAllLeads().filter(isMissingContactQueueLead),
  );
}
