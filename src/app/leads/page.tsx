import Link from "next/link";
import { Plus } from "lucide-react";
import { getAnalyzedLeadIdSet, searchLeads } from "@/lib/leads";
import { LeadCard } from "@/components/leads/LeadCard";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { LeadListSummaryBar } from "@/components/leads/LeadListSummary";
import { LeadExportButton } from "@/components/leads/LeadExportButton";
import {
  computeLeadListSummary,
  getLeadsForListView,
  parseLeadContactFilter,
  parseLeadScoreFilter,
  parseLeadSortOption,
} from "@/lib/leads/list-view";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    contact?: string;
    score?: string;
    sort?: string;
  }>;
}

function parseStatus(value?: string): LeadStatus | undefined {
  if (!value) return undefined;
  return LEAD_STATUSES.includes(value as LeadStatus)
    ? (value as LeadStatus)
    : undefined;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const status = parseStatus(params.status);
  const contactFilter = parseLeadContactFilter(params.contact);
  const scoreFilter = parseLeadScoreFilter(params.score);
  const sortOption = parseLeadSortOption(params.sort);

  const baseLeads = searchLeads({ q, status });
  const analyzedLeadIds = getAnalyzedLeadIdSet();
  const summary = computeLeadListSummary(baseLeads, analyzedLeadIds);
  const leads = getLeadsForListView(baseLeads, {
    contact: contactFilter,
    score: scoreFilter,
    sort: sortOption,
  });

  const hasFilters = Boolean(
    q ||
      status ||
      contactFilter !== "all" ||
      scoreFilter !== "all" ||
      sortOption !== "newest"
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-slate-500">
            {leads.length} {hasFilters ? "matching" : ""} companies
            {hasFilters ? " shown" : " in your database"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LeadExportButton
            q={q}
            status={status}
            contact={contactFilter}
            score={scoreFilter}
            sort={sortOption}
          />
          <Link
            href="/leads/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </div>
      </div>

      <LeadListSummaryBar summary={summary} />

      <LeadFilters
        initialQ={q}
        initialStatus={status}
        initialContact={contactFilter}
        initialScore={scoreFilter}
        initialSort={sortOption}
      />

      {leads.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <p className="text-lg font-medium text-slate-700">
            {hasFilters ? "No leads match your filters" : "No leads yet"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasFilters
              ? "Try a different search term or filter."
              : "Start building your pipeline by adding Swiss business leads."}
          </p>
          {!hasFilters && (
            <Link
              href="/leads/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" />
              Add First Lead
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
