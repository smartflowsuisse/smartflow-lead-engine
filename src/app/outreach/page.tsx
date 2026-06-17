import Link from "next/link";
import { Suspense } from "react";
import { TemplatePackContextBanner } from "@/components/outreach/TemplatePackContextBanner";
import { TemplatePackLeadMatchBanner } from "@/components/outreach/TemplatePackLeadMatchBanner";
import { getOutreachQueueLeads } from "@/lib/leads";
import { computeOutreachQueueSummary } from "@/lib/leads/outreach-queue";
import { OutreachQueueSummaryBar } from "@/components/outreach/OutreachQueueSummary";
import { TemplatePackFilteredOutreachTable } from "@/components/outreach/TemplatePackFilteredOutreachTable";


function OutreachQueueTableFallback() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
      Loading outreach table...
    </div>
  );
}

export default function OutreachPage() {
  const leads = getOutreachQueueLeads();
  const summary = computeOutreachQueueSummary(leads);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          SmartFlow Outreach
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Outreach Queue
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Actionable leads with score 45+ and at least one contact channel.
          Sorted by score, highest first.
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Start with high-priority leads. Open the lead, copy the email when available,
          generate a message, then mark the lead as contacted.
        </div>
      </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/outreach/session"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            >
              Start Session
            </Link>

            <Link
              href="/outreach?templatePack=construction"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800"
            >
              Construction Queue
            </Link>
          </div>


      <Suspense fallback={null}>
        <TemplatePackContextBanner />
        <TemplatePackLeadMatchBanner leads={leads} />
      </Suspense>
      <OutreachQueueSummaryBar summary={summary} />
      <Suspense fallback={<OutreachQueueTableFallback />}>
        <TemplatePackFilteredOutreachTable leads={leads} />
      </Suspense>
    </div>
  );
}
