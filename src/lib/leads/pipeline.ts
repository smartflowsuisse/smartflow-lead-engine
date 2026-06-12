import type { LeadStatus } from "../types";

const SALES_PIPELINE: LeadStatus[] = [
  "New",
  "Analyzed",
  "Contacted",
  "Replied",
  "Meeting",
  "Proposal",
  "Won",
];

export function getNextLeadStatus(current: LeadStatus): LeadStatus | null {
  const index = SALES_PIPELINE.indexOf(current);
  if (index === -1 || index >= SALES_PIPELINE.length - 1) {
    return null;
  }

  return SALES_PIPELINE[index + 1] ?? null;
}

export function getSalesPipelineStages(): LeadStatus[] {
  return [...SALES_PIPELINE, "Lost"];
}
