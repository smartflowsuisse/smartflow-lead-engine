import type { TemplatePackId } from "../templates/template-pack-registry";

export interface TemplatePackMatchableLead {
  industry?: string | null;
  company?: string | null;
  website?: string | null;
  email?: string | null;
}

export interface TemplatePackLeadMatchSummary {
  templatePackId: TemplatePackId;
  totalLeads: number;
  matchedLeads: number;
  topMatchedLeadNames: string[];
}

const TEMPLATE_PACK_INDUSTRY_PATTERNS: Record<TemplatePackId, RegExp[]> = {
  construction: [
    /construction/i,
    /bau/i,
    /bâtiment/i,
    /batiment/i,
    /renovation/i,
    /rénovation/i,
    /contractor/i,
  ],
  retail: [
    /retail/i,
    /shop/i,
    /store/i,
    /commerce/i,
    /magasin/i,
    /e-?commerce/i,
  ],
  fiduciary: [
    /fiduciary/i,
    /accounting/i,
    /comptable/i,
    /fiduciaire/i,
    /tax/i,
    /treuhand/i,
  ],
};

function getLeadName(lead: TemplatePackMatchableLead): string {
  return lead.company || lead.website || lead.email || "Unnamed lead";
}

export function isLeadMatchedToTemplatePack(
  lead: TemplatePackMatchableLead,
  templatePackId: TemplatePackId,
): boolean {
  const industry = lead.industry?.trim();

  if (!industry) {
    return false;
  }

  return TEMPLATE_PACK_INDUSTRY_PATTERNS[templatePackId].some((pattern) =>
    pattern.test(industry),
  );
}

export function filterTemplatePackMatchedLeads<T extends TemplatePackMatchableLead>(
  leads: T[],
  templatePackId: TemplatePackId,
): T[] {
  return leads.filter((lead) =>
    isLeadMatchedToTemplatePack(lead, templatePackId),
  );
}

export function summarizeTemplatePackLeadMatches<T extends TemplatePackMatchableLead>(
  leads: T[],
  templatePackId: TemplatePackId,
): TemplatePackLeadMatchSummary {
  const matched = filterTemplatePackMatchedLeads(leads, templatePackId);

  return {
    templatePackId,
    totalLeads: leads.length,
    matchedLeads: matched.length,
    topMatchedLeadNames: matched.slice(0, 3).map(getLeadName),
  };
}
