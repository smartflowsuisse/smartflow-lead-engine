"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { OutreachQueueTable } from "@/components/outreach/OutreachQueueTable";
import { filterTemplatePackMatchedLeads } from "@/lib/leads/template-pack-lead-matching";
import { isTemplatePackId } from "@/lib/templates/template-pack-context";

interface TemplatePackFilteredOutreachTableProps {
  leads: Parameters<typeof OutreachQueueTable>[0]["leads"];
}

export function TemplatePackFilteredOutreachTable({
  leads,
}: TemplatePackFilteredOutreachTableProps) {
  const searchParams = useSearchParams();
  const selectedTemplatePack = searchParams.get("templatePack");
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);

  const matchingEnabled = isTemplatePackId(selectedTemplatePack);

  const matchedLeads = useMemo(() => {
    if (!matchingEnabled) {
      return [];
    }

    return filterTemplatePackMatchedLeads(leads, selectedTemplatePack);
  }, [leads, matchingEnabled, selectedTemplatePack]);

  const visibleLeads =
    matchingEnabled && showMatchedOnly ? matchedLeads : leads;

  if (!matchingEnabled) {
    return <OutreachQueueTable leads={leads} />;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Outreach table filter
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Showing {visibleLeads.length} of {leads.length} actionable leads.
            {showMatchedOnly
              ? " Only leads matching the selected template pack are shown."
              : " All actionable leads are shown."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowMatchedOnly(false)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              showMatchedOnly
                ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                : "border-brand-200 bg-brand-50 text-brand-700"
            }`}
          >
            Show all leads
          </button>

          <button
            type="button"
            onClick={() => setShowMatchedOnly(true)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              showMatchedOnly
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Show matched only ({matchedLeads.length})
          </button>
        </div>
      </div>

      <OutreachQueueTable leads={visibleLeads} />
    </section>
  );
}
