import Link from "next/link";
import type { Lead } from "@/lib/types";
import { getScoreLabel } from "@/lib/scoring";
import { cn, scoreColor } from "@/lib/utils";
import { OutreachStatusSelect } from "./OutreachStatusSelect";
import { OutreachQueueActions } from "./OutreachQueueActions";
import { LEAD_SCORE_THRESHOLDS } from "@/lib/leads/scoring-thresholds";

interface OutreachQueueTableProps {
  leads: Lead[];
}

function displayValue(value: string | null | undefined): string {
  return value?.trim() || "—";
}

export function OutreachQueueTable({ leads }: OutreachQueueTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-900">
          No actionable leads in the outreach queue
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {`Leads need a score of at least ${LEAD_SCORE_THRESHOLDS.OUTREACH_READY} and an email or phone number.`}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Company",
                "Score",
                "Email",
                "Phone",
                "City",
                "Industry",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="hover:text-brand-700"
                  >
                    {lead.company}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold",
                      scoreColor(lead.lead_score)
                    )}
                  >
                    {lead.lead_score} — {getScoreLabel(lead.lead_score)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {displayValue(lead.email)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {displayValue(lead.phone)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {displayValue(lead.city)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {displayValue(lead.industry)}
                </td>
                <td className="px-4 py-3">
                  <OutreachStatusSelect
                    leadId={lead.id}
                    currentStatus={lead.outreach_status}
                  />
                </td>
                <td className="px-4 py-3">
                  <OutreachQueueActions leadId={lead.id} email={lead.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
