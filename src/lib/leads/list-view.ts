import type { Lead, LeadStatus } from "../types";

export const LEAD_CONTACT_FILTERS = [
  "all",
  "has_email",
  "no_email",
  "has_phone",
  "no_phone",
  "has_contact_page",
  "no_contact_page",
] as const;

export type LeadContactFilter = (typeof LEAD_CONTACT_FILTERS)[number];

export const LEAD_SORT_OPTIONS = [
  "newest",
  "oldest",
  "score_high",
  "score_low",
] as const;

export type LeadSortOption = (typeof LEAD_SORT_OPTIONS)[number];

export const LEAD_SCORE_FILTERS = [
  "all",
  "score_0_20",
  "score_21_40",
  "score_41_60",
  "score_61_plus",
] as const;

export type LeadScoreFilter = (typeof LEAD_SCORE_FILTERS)[number];

const CONTACT_FILTER_ALIASES: Record<string, LeadContactFilter> = {
  missing_email: "no_email",
  missing_phone: "no_phone",
  missing_contact_page: "no_contact_page",
};

const POST_PRIORITY_STATUSES: LeadStatus[] = ["Client", "Proposal Sent", "Lost"];

export function parseLeadContactFilter(value?: string): LeadContactFilter {
  if (!value) {
    return "all";
  }

  const normalized = CONTACT_FILTER_ALIASES[value] ?? value;

  if (LEAD_CONTACT_FILTERS.includes(normalized as LeadContactFilter)) {
    return normalized as LeadContactFilter;
  }

  return "all";
}

export function parseLeadSortOption(value?: string): LeadSortOption {
  if (value && LEAD_SORT_OPTIONS.includes(value as LeadSortOption)) {
    return value as LeadSortOption;
  }

  return "newest";
}

export function parseLeadScoreFilter(value?: string): LeadScoreFilter {
  if (value && LEAD_SCORE_FILTERS.includes(value as LeadScoreFilter)) {
    return value as LeadScoreFilter;
  }

  return "all";
}

export function hasLeadEmail(lead: Lead): boolean {
  return Boolean(lead.email?.trim());
}

export function hasLeadPhone(lead: Lead): boolean {
  return Boolean(lead.phone?.trim());
}

export function hasLeadContactPage(lead: Lead): boolean {
  return Boolean(lead.contact_page_url?.trim());
}

export function isHighPriorityLead(lead: Lead): boolean {
  return (
    lead.lead_score >= 60 && !POST_PRIORITY_STATUSES.includes(lead.status)
  );
}

export function filterLeadsByContact(
  leads: Lead[],
  contactFilter: LeadContactFilter
): Lead[] {
  switch (contactFilter) {
    case "has_email":
      return leads.filter(hasLeadEmail);
    case "no_email":
      return leads.filter((lead) => !hasLeadEmail(lead));
    case "has_phone":
      return leads.filter(hasLeadPhone);
    case "no_phone":
      return leads.filter((lead) => !hasLeadPhone(lead));
    case "has_contact_page":
      return leads.filter(hasLeadContactPage);
    case "no_contact_page":
      return leads.filter((lead) => !hasLeadContactPage(lead));
    default:
      return leads;
  }
}

export function filterLeadsByScore(
  leads: Lead[],
  scoreFilter: LeadScoreFilter
): Lead[] {
  switch (scoreFilter) {
    case "score_0_20":
      return leads.filter((lead) => lead.lead_score >= 0 && lead.lead_score <= 20);
    case "score_21_40":
      return leads.filter((lead) => lead.lead_score >= 21 && lead.lead_score <= 40);
    case "score_41_60":
      return leads.filter((lead) => lead.lead_score >= 41 && lead.lead_score <= 60);
    case "score_61_plus":
      return leads.filter((lead) => lead.lead_score >= 61);
    default:
      return leads;
  }
}

export function getLeadsForListView(
  baseLeads: Lead[],
  filters: {
    contact: LeadContactFilter;
    score: LeadScoreFilter;
    sort: LeadSortOption;
  }
): Lead[] {
  return sortLeads(
    filterLeadsByScore(
      filterLeadsByContact(baseLeads, filters.contact),
      filters.score
    ),
    filters.sort
  );
}

export function sortLeads(
  leads: Lead[],
  sortOption: LeadSortOption
): Lead[] {
  const sorted = [...leads];

  switch (sortOption) {
    case "oldest":
      return sorted.sort(
        (left, right) =>
          new Date(left.created_at).getTime() -
          new Date(right.created_at).getTime()
      );
    case "score_high":
      return sorted.sort((left, right) => {
        if (right.lead_score !== left.lead_score) {
          return right.lead_score - left.lead_score;
        }

        return (
          new Date(right.created_at).getTime() -
          new Date(left.created_at).getTime()
        );
      });
    case "score_low":
      return sorted.sort((left, right) => {
        if (left.lead_score !== right.lead_score) {
          return left.lead_score - right.lead_score;
        }

        return (
          new Date(right.created_at).getTime() -
          new Date(left.created_at).getTime()
        );
      });
    case "newest":
    default:
      return sorted.sort(
        (left, right) =>
          new Date(right.created_at).getTime() -
          new Date(left.created_at).getTime()
      );
  }
}

export interface LeadListSummary {
  total: number;
  withEmail: number;
  withPhone: number;
  withContactPage: number;
  missingEmail: number;
  missingPhone: number;
  missingContactPage: number;
  analyzed: number;
  highPriority: number;
}

export function computeLeadListSummary(
  leads: Lead[],
  analyzedLeadIds: Set<number> = new Set()
): LeadListSummary {
  const withEmail = leads.filter(hasLeadEmail).length;
  const withPhone = leads.filter(hasLeadPhone).length;
  const withContactPage = leads.filter(hasLeadContactPage).length;

  return {
    total: leads.length,
    withEmail,
    withPhone,
    withContactPage,
    missingEmail: leads.length - withEmail,
    missingPhone: leads.length - withPhone,
    missingContactPage: leads.length - withContactPage,
    analyzed: leads.filter((lead) => analyzedLeadIds.has(lead.id)).length,
    highPriority: leads.filter(isHighPriorityLead).length,
  };
}
