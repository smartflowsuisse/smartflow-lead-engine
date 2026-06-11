import { LEAD_STATUSES, type LeadStatus } from "../types";

const SALES_PIPELINE: LeadStatus[] = [
  "New Lead",
  "Analyzed",
  "Contacted",
  "Follow Up",
  "Proposal Sent",
  "Client",
];

export function getNextLeadStatus(current: LeadStatus): LeadStatus | null {
  const index = SALES_PIPELINE.indexOf(current);
  if (index === -1 || index >= SALES_PIPELINE.length - 1) {
    return null;
  }

  return SALES_PIPELINE[index + 1] ?? null;
}

export function isPipelineStatus(status: LeadStatus): boolean {
  return LEAD_STATUSES.includes(status);
}
