import {
  CONVERT_TO_CLIENT_ALLOWED_STATUSES,
  type ConvertToClientContractClientDraft,
  type ConvertToClientContractLeadInput,
} from "./convert-to-client-contract";

export function canConvertLeadToClient(
  lead: ConvertToClientContractLeadInput,
): boolean {
  return CONVERT_TO_CLIENT_ALLOWED_STATUSES.includes(
    lead.status as (typeof CONVERT_TO_CLIENT_ALLOWED_STATUSES)[number],
  );
}

export function createClientDraftFromLead(
  lead: ConvertToClientContractLeadInput,
): ConvertToClientContractClientDraft {
  if (!canConvertLeadToClient(lead)) {
    throw new Error("Lead is not eligible for client conversion");
  }

  return {
    id: `client-${lead.id}`,
    sourceLeadId: lead.id,
    company: lead.company,
    contactName: lead.contactName ?? "Unknown contact",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    language: lead.language ?? "FR",
    status: "Draft",
  };
}
