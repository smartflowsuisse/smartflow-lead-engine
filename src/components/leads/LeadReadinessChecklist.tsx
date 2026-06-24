import type { Lead } from "@/lib/types";
import type { LeadOpportunitySummary } from "@/lib/leads/opportunity-summary";
import { getLeadReadinessChecklist } from "@/lib/leads/contact-enrichment";
import { cn } from "@/lib/utils";

interface LeadReadinessChecklistProps {
  lead: Lead;
  hasAnalysis: boolean;
  opportunitySummary?: LeadOpportunitySummary | null;
  openTaskCount?: number;
}

function ChecklistRow({
  label,
  present,
}: {
  label: string;
  present: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-slate-700">{label}</span>
      <span
        className={cn(
          "rounded-full border px-2 py-0.5 text-xs font-medium",
          present
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        )}
      >
        {present ? "Done" : "Pending"}
      </span>
    </li>
  );
}

export function LeadReadinessChecklist({
  lead,
  hasAnalysis,
  opportunitySummary,
  openTaskCount,
}: LeadReadinessChecklistProps) {
  const items = getLeadReadinessChecklist({
    lead,
    hasAnalysis,
    opportunitySummary,
    openTaskCount,
  });
  const completedCount = items.filter((item) => item.present).length;
  const miniAuditReady = items.at(-1)?.present ?? false;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-1">
        <h2 className="font-semibold text-slate-900">Mini-Audit Readiness</h2>
        <p className="text-xs leading-5 text-slate-500">
          Quick check before preparing a first-client mini-audit or proposal.
        </p>
      </div>

      <div
        className={cn(
          "mb-4 rounded-lg border px-3 py-2 text-xs",
          miniAuditReady
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-slate-200 bg-slate-50 text-slate-700"
        )}
      >
        {miniAuditReady
          ? "Ready for mini-audit / proposal preparation."
          : `${completedCount} of ${items.length} checks complete.`}
      </div>

      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <ChecklistRow
            key={item.label}
            label={item.label}
            present={item.present}
          />
        ))}
      </ul>
    </section>
  );
}
