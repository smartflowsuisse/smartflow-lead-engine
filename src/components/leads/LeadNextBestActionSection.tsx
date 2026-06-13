import { Compass, Lightbulb, Target } from "lucide-react";
import type { LeadWithAnalysis } from "@/lib/types";
import {
  buildNextBestActionForLead,
  nextBestActionPriorityClass,
} from "@/lib/leads/next-best-action";
import { cn } from "@/lib/utils";

interface LeadNextBestActionSectionProps {
  lead: LeadWithAnalysis;
}

export function LeadNextBestActionSection({
  lead,
}: LeadNextBestActionSectionProps) {
  const recommendation = buildNextBestActionForLead(lead);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Next Best Action</h2>
        <p className="mt-1 text-sm text-slate-500">
          Recommended sales step based on contact data and lead score
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3">
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Target className="h-4 w-4" />
            Priority
          </dt>
          <dd className="mt-2">
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                nextBestActionPriorityClass(recommendation.priority)
              )}
            >
              {recommendation.priority}
            </span>
          </dd>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 sm:col-span-2">
          <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Compass className="h-4 w-4" />
            Next Best Action
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {recommendation.action}
          </dd>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50/40 px-4 py-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
              Reason
            </p>
            <p className="mt-1 text-sm text-slate-700">{recommendation.reason}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
