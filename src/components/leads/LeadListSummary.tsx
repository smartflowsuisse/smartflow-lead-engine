import type { LeadListSummary } from "@/lib/leads/list-view";

interface LeadListSummaryProps {
  summary: LeadListSummary;
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function LeadListSummaryBar({ summary }: LeadListSummaryProps) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryItem label="Total leads" value={summary.total} />
      <SummaryItem label="With email" value={summary.withEmail} />
      <SummaryItem label="Missing email" value={summary.missingEmail} />
      <SummaryItem label="With phone" value={summary.withPhone} />
      <SummaryItem label="Missing phone" value={summary.missingPhone} />
      <SummaryItem label="With contact page" value={summary.withContactPage} />
      <SummaryItem label="Missing contact page" value={summary.missingContactPage} />
      <SummaryItem label="Analyzed" value={summary.analyzed} />
      <SummaryItem label="High priority" value={summary.highPriority} />
    </div>
  );
}
