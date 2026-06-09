import Link from "next/link";
import { Building2, MapPin, Pencil } from "lucide-react";
import type { Lead } from "@/lib/types";
import { LeadStatusSelect } from "@/components/leads/LeadStatusSelect";
import { DeleteLeadButton } from "@/components/leads/DeleteLeadButton";
import { cn, formatDateTime, scoreColor } from "@/lib/utils";
import { getScoreLabel, getRecommendedAction } from "@/lib/scoring";

interface LeadProfileHeaderProps {
  lead: Lead;
}

export function LeadProfileHeader({ lead }: LeadProfileHeaderProps) {
  const hasScore = lead.lead_score > 0;

  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Lead Profile
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{lead.company}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              hasScore
                ? scoreColor(lead.lead_score)
                : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            Score: {hasScore ? lead.lead_score : "—"} — {getScoreLabel(lead.lead_score)}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          {getRecommendedAction(lead.lead_score, lead.status)}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Added {formatDateTime(lead.created_at)}
          {lead.updated_at !== lead.created_at && (
            <> · Updated {formatDateTime(lead.updated_at)}</>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/leads/${lead.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          Edit Lead
        </Link>
        <DeleteLeadButton leadId={lead.id} companyName={lead.company} />
      </div>
    </div>
  );
}

interface LeadCompanySectionProps {
  lead: Lead;
}

export function LeadCompanySection({ lead }: LeadCompanySectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Company Information</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">Company</dt>
            <dd className="font-medium text-slate-900">{lead.company}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">City</dt>
            <dd className="text-slate-900">{lead.city ?? "—"}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">Industry</dt>
            <dd className="text-slate-900">{lead.industry ?? "—"}</dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
