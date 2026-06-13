import { Banknote, Bot, CircleAlert } from "lucide-react";
import type { LeadOpportunitySummary as LeadOpportunitySummaryType } from "@/lib/leads/opportunity-summary";
import { ANALYSIS_REQUIRES_WEBSITE_MESSAGE } from "@/lib/leads/website-display";

interface LeadOpportunitySummaryProps {
  summary: LeadOpportunitySummaryType | null;
  hasWebsite?: boolean;
}

function formatChf(value: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(value);
}

export function LeadOpportunitySummary({
  summary,
  hasWebsite = true,
}: LeadOpportunitySummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Opportunity Summary</h2>
        <p className="mt-1 text-sm text-slate-500">
          SmartFlow service fit and estimated project value
        </p>
      </div>

      {!hasWebsite ? (
        <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/50 px-4 py-8 text-center text-sm text-amber-800">
          {ANALYSIS_REQUIRES_WEBSITE_MESSAGE}
        </div>
      ) : !summary ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Run AI analysis to generate problems, service recommendations, and value
          estimates.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <CircleAlert className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-slate-900">Problems Found</h3>
            </div>
            <ul className="space-y-2">
              {summary.problems.map((problem, index) => (
                <li key={`${problem}-${index}`} className="flex gap-2 text-sm text-slate-700">
                  <span className="font-bold text-amber-600">{index + 1}.</span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-600" />
                <h3 className="font-semibold text-slate-900">Recommended SmartFlow Service</h3>
              </div>
              <p className="text-sm text-slate-700">{summary.recommendedService}</p>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-900">Estimated Project Value</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatChf(summary.estimatedValueChf)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
