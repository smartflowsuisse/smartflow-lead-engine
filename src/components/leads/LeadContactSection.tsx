import { ExternalLink, Globe, Mail, Phone } from "lucide-react";
import type { Lead } from "@/lib/types";

interface LeadContactSectionProps {
  lead: Lead;
}

function ConfidenceBadge({ confidence }: { confidence: number | null }) {
  if (confidence == null) {
    return null;
  }

  return (
    <span className="ml-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      {confidence}% confidence
    </span>
  );
}

export function LeadContactSection({ lead }: LeadContactSectionProps) {
  const websiteHref = lead.website
    ? lead.website.startsWith("http")
      ? lead.website
      : `https://${lead.website}`
    : null;

  const contactPageHref = lead.contact_page_url
    ? lead.contact_page_url.startsWith("http")
      ? lead.contact_page_url
      : `https://${lead.contact_page_url}`
    : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Contact Information</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">Website</dt>
            <dd>
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
                <span className="text-slate-400">—</span>
              )}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">Contact page</dt>
            <dd>
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
                <span className="text-slate-400">—</span>
              )}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="flex flex-wrap items-center gap-y-1">
              {lead.email ? (
                <>
                  <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">
                    {lead.email}
                  </a>
                  <ConfidenceBadge confidence={lead.email_confidence} />
                </>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd className="flex flex-wrap items-center gap-y-1 text-slate-900">
              {lead.phone ? (
                <>
                  <span>{lead.phone}</span>
                  <ConfidenceBadge confidence={lead.phone_confidence} />
                </>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
