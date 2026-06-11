import type { OutreachQueueSummary } from "@/lib/leads/outreach-queue";

interface OutreachQueueSummaryBarProps {
  summary: OutreachQueueSummary;
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function OutreachQueueSummaryBar({
  summary,
}: OutreachQueueSummaryBarProps) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <SummaryItem label="Ready for outreach" value={summary.readyForOutreach} />
      <SummaryItem label="Contacted" value={summary.contacted} />
      <SummaryItem label="Replied" value={summary.replied} />
      <SummaryItem label="Meetings" value={summary.meetings} />
      <SummaryItem label="Won" value={summary.won} />
      <SummaryItem label="Total actionable" value={summary.total} />
    </div>
  );
}
