import type { Lead } from "../types";
import { runLeadWebsiteAnalysis } from "./run-lead-analysis";

export function shouldAutoAnalyzeAfterDiscoveryImport(
  lead: Pick<Lead, "website">
): boolean {
  return Boolean(lead.website?.trim());
}

export function queueLeadWebsiteAnalysis(leadId: number): void {
  void runLeadWebsiteAnalysis(leadId).catch((error) => {
    console.error(
      `Background website analysis failed for lead ${leadId}:`,
      error
    );
  });
}

export function queueLeadWebsiteAnalysisAfterDiscoveryImport(
  lead: Pick<Lead, "id" | "website">
): void {
  if (!shouldAutoAnalyzeAfterDiscoveryImport(lead)) {
    return;
  }

  queueLeadWebsiteAnalysis(lead.id);
}
