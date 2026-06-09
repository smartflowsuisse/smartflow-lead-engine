import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  Pencil,
} from "lucide-react";
import { getLeadById } from "@/lib/leads";
import { AnalysisPanel } from "@/components/leads/AnalysisPanel";
import { OutreachDraftPanel } from "@/components/leads/OutreachDraftPanel";
import { LeadStatusSelect } from "@/components/leads/LeadStatusSelect";
import { DeleteLeadButton } from "@/components/leads/DeleteLeadButton";
import { cn, formatDateTime, scoreColor } from "@/lib/utils";
import { getScoreLabel, getRecommendedAction } from "@/lib/scoring";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) notFound();

  const lead = getLeadById(leadId);
  if (!lead) notFound();

  return (
    <div className="p-8">
      <Link
        href="/leads"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lead.company}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
            {lead.lead_score > 0 && (
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  scoreColor(lead.lead_score)
                )}
              >
                Score: {lead.lead_score} — {getScoreLabel(lead.lead_score)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Added {formatDateTime(lead.created_at)}
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Contact Info</h2>
            <dl className="space-y-3 text-sm">
              {lead.website && (
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-slate-500">Website</dt>
                    <dd>
                      <a
                        href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline"
                      >
                        {lead.website}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-slate-500">Email</dt>
                    <dd>
                      <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">
                        {lead.email}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-slate-500">Phone</dt>
                    <dd>{lead.phone}</dd>
                  </div>
                </div>
              )}
              {lead.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-slate-500">City</dt>
                    <dd>{lead.city}</dd>
                  </div>
                </div>
              )}
              {lead.industry && (
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-slate-500">Industry</dt>
                    <dd>{lead.industry}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
            <h3 className="font-semibold text-slate-900">Recommended Action</h3>
            <p className="mt-2 text-sm text-slate-700">
              {getRecommendedAction(lead.lead_score, lead.status)}
            </p>
          </div>

          <OutreachDraftPanel
            leadId={lead.id}
            hasAnalysis={Boolean(lead.analysis)}
          />

          {lead.notes && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                {lead.notes}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <AnalysisPanel
              leadId={lead.id}
              website={lead.website}
              leadScore={lead.lead_score}
              analysis={lead.analysis}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
