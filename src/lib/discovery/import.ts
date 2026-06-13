import { createLead, findDuplicateLead } from "../leads";
import { enrichLeadWithDiscoveredContact } from "../contact/enrich-lead-contact";
import { queueLeadWebsiteAnalysisAfterDiscoveryImport } from "../analysis/queue-lead-analysis";
import { normalizeOptionalWebsite } from "../leads/website-display";
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

export function parseDiscoveryImportCandidate(
  body: unknown
): DiscoveryCandidate | null {
  if (!body || typeof body !== "object") return null;

  const candidate = body as Partial<DiscoveryCandidate>;
  if (!candidate.company || typeof candidate.company !== "string") return null;
  if (!candidate.city || typeof candidate.city !== "string") return null;
  if (!candidate.industry || typeof candidate.industry !== "string") return null;

  const website =
    candidate.website === undefined || candidate.website === null
      ? ""
      : typeof candidate.website === "string"
        ? candidate.website.trim()
        : null;

  if (website === null) return null;

  return {
    company: candidate.company.trim(),
    website,
    city: candidate.city.trim(),
    industry: candidate.industry.trim(),
  };
}

export function buildDiscoveryLeadInput(
  candidate: DiscoveryCandidate
): CreateLeadInput {
  return {
    company: candidate.company.trim(),
    website: normalizeOptionalWebsite(candidate.website),
    city: candidate.city?.trim() || undefined,
    industry: candidate.industry?.trim() || undefined,
    status: "New",
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

  queueLeadWebsiteAnalysisAfterDiscoveryImport(lead);

  return {
    ok: true,
    lead,
    message: `${lead.company} imported successfully`,
  };
}
