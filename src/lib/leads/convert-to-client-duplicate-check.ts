import type { ConvertToClientDuplicateCheck } from "./convert-to-client-contract";

export type ConvertToClientDuplicateCandidate = {
  id: string;
  sourceLeadId?: string;
  company: string;
  email?: string;
};

export type ConvertToClientDuplicateResult = {
  hasDuplicate: boolean;
  matchedBy: Array<"sourceLeadId" | "company" | "email">;
  duplicateIds: string[];
};

function normalizeValue(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function checkConvertToClientDuplicate(
  input: ConvertToClientDuplicateCheck,
  existingClients: ConvertToClientDuplicateCandidate[],
): ConvertToClientDuplicateResult {
  const matchedBy = new Set<"sourceLeadId" | "company" | "email">();
  const duplicateIds = new Set<string>();

  const inputCompany = normalizeValue(input.company);
  const inputEmail = normalizeValue(input.email);

  for (const client of existingClients) {
    if (client.sourceLeadId === input.sourceLeadId) {
      matchedBy.add("sourceLeadId");
      duplicateIds.add(client.id);
    }

    if (inputCompany && normalizeValue(client.company) === inputCompany) {
      matchedBy.add("company");
      duplicateIds.add(client.id);
    }

    if (inputEmail && normalizeValue(client.email) === inputEmail) {
      matchedBy.add("email");
      duplicateIds.add(client.id);
    }
  }

  return {
    hasDuplicate: duplicateIds.size > 0,
    matchedBy: Array.from(matchedBy),
    duplicateIds: Array.from(duplicateIds),
  };
}
