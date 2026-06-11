"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";
import type { LeadContactFilter, LeadScoreFilter, LeadSortOption } from "@/lib/leads/list-view";

interface LeadFiltersProps {
  initialQ?: string;
  initialStatus?: LeadStatus;
  initialContact?: LeadContactFilter;
  initialScore?: LeadScoreFilter;
  initialSort?: LeadSortOption;
}

export function LeadFilters({
  initialQ = "",
  initialStatus,
  initialContact = "all",
  initialScore = "all",
  initialSort = "newest",
}: LeadFiltersProps) {
  const router = useRouter();

  const updateFilters = (
    q: string,
    status: string,
    contact: string,
    score: string,
    sort: string
  ) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (contact && contact !== "all") params.set("contact", contact);
    if (score && score !== "all") params.set("score", score);
    if (sort && sort !== "newest") params.set("sort", sort);
    const query = params.toString();
    router.push(query ? `/leads?${query}` : "/leads");
  };

  return (
    <form
      className="mb-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const q = (form.elements.namedItem("q") as HTMLInputElement).value;
        const status = (form.elements.namedItem("status") as HTMLSelectElement)
          .value;
        const contact = (
          form.elements.namedItem("contact") as HTMLSelectElement
        ).value;
        const score = (form.elements.namedItem("score") as HTMLSelectElement)
          .value;
        const sort = (form.elements.namedItem("sort") as HTMLSelectElement).value;
        updateFilters(q, status, contact, score, sort);
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            type="search"
            defaultValue={initialQ}
            placeholder="Search company, city, industry, email..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <select
          name="status"
          defaultValue={initialStatus ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Apply
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          name="contact"
          defaultValue={initialContact}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:min-w-[220px]"
        >
          <option value="all">All leads</option>
          <option value="has_email">Has email</option>
          <option value="no_email">Missing email</option>
          <option value="has_phone">Has phone</option>
          <option value="no_phone">Missing phone</option>
          <option value="has_contact_page">Has contact page</option>
          <option value="no_contact_page">Missing contact page</option>
        </select>
        <select
          name="score"
          defaultValue={initialScore}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:min-w-[220px]"
        >
          <option value="all">All scores</option>
          <option value="score_0_20">Score 0–20</option>
          <option value="score_21_40">Score 21–40</option>
          <option value="score_41_60">Score 41–60</option>
          <option value="score_61_plus">Score 61+</option>
        </select>
        <select
          name="sort"
          defaultValue={initialSort}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:min-w-[220px]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="score_high">Highest score first</option>
          <option value="score_low">Lowest score first</option>
        </select>
      </div>
    </form>
  );
}
