import type { LeadStatus, OutreachStatus } from "../types";

export const CLOSED_CRM_STATUSES: LeadStatus[] = ["Won", "Lost"];

export function isClosedCrmStatus(status: LeadStatus): boolean {
  return status === "Won" || status === "Lost";
}

/** Map canonical CRM status to outreach queue status. */
export function syncOutreachStatusFromCrm(status: LeadStatus): OutreachStatus {
  switch (status) {
    case "New":
    case "Analyzed":
      return "New";
    case "Contacted":
      return "Contacted";
    case "Replied":
      return "Replied";
    case "Meeting":
    case "Proposal":
      return "Meeting";
    case "Won":
      return "Won";
    case "Lost":
      return "Lost";
  }
}

/** Map outreach queue status back to canonical CRM status. */
export function syncCrmStatusFromOutreach(
  outreachStatus: OutreachStatus,
  currentCrmStatus: LeadStatus
): LeadStatus {
  switch (outreachStatus) {
    case "New":
      return currentCrmStatus === "Analyzed" ? "Analyzed" : "New";
    case "Contacted":
      return "Contacted";
    case "Replied":
      return "Replied";
    case "Meeting":
      return currentCrmStatus === "Proposal" ? "Proposal" : "Meeting";
    case "Won":
      return "Won";
    case "Lost":
      return "Lost";
  }
}

export function resolveSyncedLeadStatuses(input: {
  existingStatus: LeadStatus;
  existingOutreachStatus: OutreachStatus;
  nextStatus?: LeadStatus;
  nextOutreachStatus?: OutreachStatus;
}): { status: LeadStatus; outreach_status: OutreachStatus } {
  const status = input.nextStatus ?? input.existingStatus;
  let outreach_status = input.nextOutreachStatus ?? input.existingOutreachStatus;

  if (input.nextStatus !== undefined && input.nextOutreachStatus === undefined) {
    outreach_status = syncOutreachStatusFromCrm(input.nextStatus);
  } else if (
    input.nextOutreachStatus !== undefined &&
    input.nextStatus === undefined
  ) {
    return {
      status: syncCrmStatusFromOutreach(
        input.nextOutreachStatus,
        input.existingStatus
      ),
      outreach_status: input.nextOutreachStatus,
    };
  }

  return { status, outreach_status };
}
