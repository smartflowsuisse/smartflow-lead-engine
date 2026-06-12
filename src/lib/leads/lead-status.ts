import { LEAD_STATUSES, type LeadStatus } from "../types";

const LEGACY_LEAD_STATUS_MAP: Record<string, LeadStatus> = {
  "New Lead": "New",
  "Follow Up": "Replied",
  "Proposal Sent": "Proposal",
  Client: "Won",
};

export function normalizeLeadStatus(status: string): LeadStatus {
  const mapped = LEGACY_LEAD_STATUS_MAP[status] ?? status;
  if (LEAD_STATUSES.includes(mapped as LeadStatus)) {
    return mapped as LeadStatus;
  }

  return "New";
}

export function isClosedPipelineStatus(status: LeadStatus): boolean {
  return status === "Won" || status === "Lost" || status === "Proposal";
}
