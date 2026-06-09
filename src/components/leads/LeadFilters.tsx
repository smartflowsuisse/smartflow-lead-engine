"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

interface LeadFiltersProps {
  initialQ?: string;
  initialStatus?: LeadStatus;
}

export function LeadFilters({ initialQ = "", initialStatus }: LeadFiltersProps) {
  const router = useRouter();

  const updateFilters = (q: string, status: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    const query = params.toString();
    router.push(query ? `/leads?${query}` : "/leads");
  };

  return (
    <form
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const q = (form.elements.namedItem("q") as HTMLInputElement).value;
        const status = (form.elements.namedItem("status") as HTMLSelectElement).value;
        updateFilters(q, status);
      }}
    >
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
    </form>
  );
}
