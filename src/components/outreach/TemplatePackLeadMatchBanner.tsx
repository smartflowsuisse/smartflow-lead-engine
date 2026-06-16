"use client";

import { useSearchParams } from "next/navigation";

import { summarizeTemplatePackLeadMatches } from "@/lib/leads/template-pack-lead-matching";
import {
  getTemplatePackContext,
  isTemplatePackId,
} from "@/lib/templates/template-pack-context";

interface TemplatePackLeadMatchBannerProps {
  leads: Parameters<typeof summarizeTemplatePackLeadMatches>[0];
}

export function TemplatePackLeadMatchBanner({
  leads,
}: TemplatePackLeadMatchBannerProps) {
  const searchParams = useSearchParams();
  const selectedTemplatePack = searchParams.get("templatePack");

  if (!isTemplatePackId(selectedTemplatePack)) {
    return null;
  }

  const pack = getTemplatePackContext(selectedTemplatePack);

  if (!pack) {
    return null;
  }

  const summary = summarizeTemplatePackLeadMatches(leads, selectedTemplatePack);
  const hasMatches = summary.topMatchedLeadNames.length > 0;

  return (
    <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Best matching leads
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">
            {summary.matchedLeads} of {summary.totalLeads} leads match{" "}
            {pack.label}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Matching is based on the lead industry field and the selected
            template pack.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 lg:max-w-sm">
          <p className="font-semibold text-slate-900">Best fit</p>
          <p className="mt-1 text-slate-600">{pack.bestFor}</p>
        </div>
      </div>

      {hasMatches ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top matched leads
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {summary.topMatchedLeadNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          No strong lead match found for this template pack yet.
        </p>
      )}
    </section>
  );
}
