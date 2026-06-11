import { createLead, findDuplicateLead } from "../leads";
import { enrichLeadWithDiscoveredContact } from "../contact/enrich-lead-contact";
import type { CreateLeadInput, Lead } from "../types";
import { getCandidateKey } from "./dedup";
import type { DiscoveryCandidate } from "./types";

export interface DiscoveryImportResult {
  ok: true;
  lead: Lead;
  message: string;
}

export interface DiscoveryImportDuplicate {
  ok: false;
  duplicate: true;
  existingLead: Lead;
  message: string;
}

export interface DiscoveryImportError {
  ok: false;
  duplicate: false;
  message: string;
}

export type DiscoveryImportResponse =
  | DiscoveryImportResult
  | DiscoveryImportDuplicate
  | DiscoveryImportError;

export function getImportStatusForCandidates(
  candidates: DiscoveryCandidate[]
): Record<string, number> {
  const status: Record<string, number> = {};

  for (const candidate of candidates) {
    const existing = findDuplicateLead({
      company: candidate.company,
      website: candidate.website,
    });
    if (existing) {
      status[getCandidateKey(candidate)] = existing.id;
    }
  }

  return status;
}

export function buildDiscoveryLeadInput(
  candidate: DiscoveryCandidate
): CreateLeadInput {
  return {
    company: candidate.company.trim(),
    website: candidate.website?.trim() || undefined,
    city: candidate.city?.trim() || undefined,
    industry: candidate.industry?.trim() || undefined,
    status: "New Lead",
    notes: "Imported from Discovery",
  };
}

export async function importDiscoveryCandidate(
  candidate: DiscoveryCandidate
): Promise<DiscoveryImportResponse> {
  if (!candidate.company?.trim()) {
    return {
      ok: false,
      duplicate: false,
      message: "Company name is required",
    };
  }

  const existing = findDuplicateLead({
    company: candidate.company,
    website: candidate.website,
  });

  if (existing) {
    return {
      ok: false,
      duplicate: true,
      existingLead: existing,
      message: `${candidate.company} is already in your CRM`,
    };
  }

  const lead = await enrichLeadWithDiscoveredContact(
    createLead(buildDiscoveryLeadInput(candidate))
  );

  return {
    ok: true,
    lead,
    message: `${lead.company} imported successfully`,
  };
}
