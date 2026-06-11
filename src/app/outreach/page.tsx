import { getOutreachQueueLeads } from "@/lib/leads";
import { computeOutreachQueueSummary } from "@/lib/leads/outreach-queue";
import { OutreachQueueSummaryBar } from "@/components/outreach/OutreachQueueSummary";
import { OutreachQueueTable } from "@/components/outreach/OutreachQueueTable";

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
      </div>

      <OutreachQueueSummaryBar summary={summary} />
      <OutreachQueueTable leads={leads} />
    </div>
  );
}
