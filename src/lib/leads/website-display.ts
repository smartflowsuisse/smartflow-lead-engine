import { hasLeadWebsite } from "./contact-enrichment";
import type { Lead } from "../types";

export const WEBSITE_MISSING_LABEL = "Missing";

export const ANALYSIS_REQUIRES_WEBSITE_MESSAGE =
  "Not available until website is added";

function leadWebsiteRef(website: string | null | undefined): Pick<Lead, "website"> {
  return { website: website ?? null };
}

export function formatLeadWebsiteLabel(
  website: string | null | undefined
): string {
  const ref = leadWebsiteRef(website);
  return hasLeadWebsite(ref as Lead)
    ? (website as string).trim()
    : WEBSITE_MISSING_LABEL;
}

export function formatLeadAnalysisStatus(
  website: string | null | undefined,
  hasAnalysis: boolean
): string {
  if (hasAnalysis) {
    return "Available";
  }

  if (!hasLeadWebsite(leadWebsiteRef(website) as Lead)) {
    return ANALYSIS_REQUIRES_WEBSITE_MESSAGE;
  }

  return "Not run yet";
}

export function normalizeOptionalWebsite(
  website: string | null | undefined
): string | undefined {
  const trimmed = website?.trim();
  return trimmed ? trimmed : undefined;
}
