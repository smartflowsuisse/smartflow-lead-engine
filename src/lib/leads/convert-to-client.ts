export type ConvertToClientLeadInput = {
  id: string;
  company: string;
  contactName?: string;
  email?: string;
  phone?: string;
  language?: string;
  status: string;
};

export type ClientHubClientDraft = {
  id: string;
  sourceLeadId: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  language: string;
  status: "Draft";
};

const WON_STATUSES = new Set(["won", "closed-won", "client-won"]);

export function canConvertLeadToClient(lead: ConvertToClientLeadInput): boolean {
  return WON_STATUSES.has(lead.status.trim().toLowerCase());
}

export function createClientDraftFromLead(
  lead: ConvertToClientLeadInput,
): ClientHubClientDraft {
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
