import type { Lead } from "@/lib/types";
import { getLeadReadinessChecklist } from "@/lib/leads/contact-enrichment";
import { cn } from "@/lib/utils";

interface LeadReadinessChecklistProps {
  lead: Lead;
  hasAnalysis: boolean;
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
            : "border-red-200 bg-red-50 text-red-600"
        )}
      >
        {present ? "Present" : "Missing"}
      </span>
    </li>
  );
}

export function LeadReadinessChecklist({
  lead,
  hasAnalysis,
}: LeadReadinessChecklistProps) {
  const items = getLeadReadinessChecklist(lead, hasAnalysis);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Lead Readiness</h2>
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
