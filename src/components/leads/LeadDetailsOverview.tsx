import {
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Lead } from "@/lib/types";
import { LeadStatusSelect } from "@/components/leads/LeadStatusSelect";
import { LeadQualificationIndicators } from "@/components/leads/LeadQualificationIndicators";
import { cn, scoreColor } from "@/lib/utils";
import { getScoreLabel } from "@/lib/scoring";
import { formatLeadQualification } from "@/lib/leads/export-csv";

interface LeadDetailsOverviewProps {
  lead: Lead;
}

function externalHref(value: string): string {
  return value.startsWith("http") ? value : `https://${value}`;
}

export function LeadDetailsOverview({ lead }: LeadDetailsOverviewProps) {
  const hasScore = lead.lead_score > 0;
  const websiteHref = lead.website ? externalHref(lead.website) : null;
  const contactPageHref = lead.contact_page_url
    ? externalHref(lead.contact_page_url)
    : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Lead Details</h2>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DetailItem icon={<Building2 className="h-4 w-4" />} label="Company">
          {lead.company}
        </DetailItem>

        <DetailItem icon={<Globe className="h-4 w-4" />} label="Website">
          {websiteHref ? (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              {lead.website}
            </a>
          ) : (
            "—"
          )}
        </DetailItem>

        <DetailItem icon={<MapPin className="h-4 w-4" />} label="City">
          {lead.city ?? "—"}
        </DetailItem>

        <DetailItem icon={<Building2 className="h-4 w-4" />} label="Industry">
          {lead.industry ?? "—"}
        </DetailItem>

        <DetailItem icon={<Building2 className="h-4 w-4" />} label="Lead Score">
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              hasScore
                ? scoreColor(lead.lead_score)
                : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            {hasScore ? `${lead.lead_score}/100` : "—"} — {getScoreLabel(lead.lead_score)}
          </span>
        </DetailItem>

        <DetailItem icon={<Building2 className="h-4 w-4" />} label="Qualification">
          <div className="space-y-2">
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                hasScore
                  ? scoreColor(lead.lead_score)
                  : "border-slate-200 bg-slate-50 text-slate-600"
              )}
            >
              {formatLeadQualification(lead.lead_score)}
            </span>
            <LeadQualificationIndicators lead={lead} />
          </div>
        </DetailItem>

        <DetailItem icon={<Building2 className="h-4 w-4" />} label="Status">
          <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
        </DetailItem>

        <DetailItem icon={<Mail className="h-4 w-4" />} label="Email">
          {lead.email ? (
            <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">
              {lead.email}
            </a>
          ) : (
            "—"
          )}
        </DetailItem>

        <DetailItem icon={<Phone className="h-4 w-4" />} label="Phone">
          {lead.phone ?? "—"}
        </DetailItem>

        <DetailItem icon={<ExternalLink className="h-4 w-4" />} label="Contact Page">
          {contactPageHref ? (
            <a
              href={contactPageHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              {lead.contact_page_url}
            </a>
          ) : (
            "—"
          )}
        </DetailItem>
      </dl>
    </section>
  );
}

function DetailItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{children}</dd>
    </div>
  );
}
