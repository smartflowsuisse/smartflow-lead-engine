import Link from "next/link";

import { MissingContactActions } from "@/components/outreach/MissingContactActions";
import { getMissingContactQueueLeads } from "@/lib/leads/missing-contact-queue";
import { getScoreLabel } from "@/lib/scoring";
import { cn, scoreColor } from "@/lib/utils";

function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Missing";
  }

  return String(value);
}

function getWebsiteHref(website: string): string {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
}

function getContactPathLabel(lead: {
  website?: string | null;
  phone?: string | null;
}): string {
  const hasWebsite = Boolean(lead.website?.trim());
  const hasPhone = Boolean(lead.phone?.trim());

  if (hasWebsite && hasPhone) {
    return "Website + Phone";
  }

  if (hasWebsite) {
    return "Website";
  }

  if (hasPhone) {
    return "Phone";
  }

  return "Manual review";
}

export default function MissingContactsPage() {
  const leads = getMissingContactQueueLeads();
  const withWebsite = leads.filter((lead) => lead.website?.trim()).length;
  const withPhone = leads.filter((lead) => lead.phone?.trim()).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            SmartFlow Outreach
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Missing Contact Queue
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Leads without an email, but with a website or phone. Use this queue
            to find a usable email address, update the lead, then continue with
            the outreach session.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
            <p className="text-xs text-slate-500">missing email leads</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{withWebsite}</p>
            <p className="text-xs text-slate-500">with website</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{withPhone}</p>
            <p className="text-xs text-slate-500">with phone</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/outreach/session"
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Start Email Session
          </Link>

          <Link
            href="/outreach"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
          >
            Back to Outreach
          </Link>
        </div>

        <p className="text-sm text-slate-500">
          Priority order: highest score first, then company name.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            No missing-contact leads found.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Leads with a usable email can be handled from the outreach session.
          </p>
          <Link
            href="/outreach/session"
            className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Go to Email Session
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-56 px-4 py-3">Company</th>
                  <th className="w-32 px-4 py-3">Score</th>
                  <th className="w-36 px-4 py-3">Contact Path</th>
                  <th className="w-32 px-4 py-3">Website</th>
                  <th className="w-36 px-4 py-3">Phone</th>
                  <th className="w-28 px-4 py-3">City</th>
                  <th className="w-40 px-4 py-3">Industry</th>
                  <th className="w-36 px-4 py-3">Status</th>
                  <th className="w-40 px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const score = lead.lead_score ?? 0;
                  const website = lead.website?.trim();

                  return (
                    <tr key={lead.id} className="align-top hover:bg-slate-50/80">
                      <td className="w-56 px-4 py-4 font-medium text-slate-900">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="block max-w-48 whitespace-normal break-words hover:text-brand-700"
                        >
                          {formatValue(lead.company)}
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold",
                            scoreColor(score)
                          )}
                        >
                          {score} — {getScoreLabel(score)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          {getContactPathLabel(lead)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {website ? (
                          <a
                            href={getWebsiteHref(website)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 underline underline-offset-2"
                          >
                            Open website
                          </a>
                        ) : (
                          "Missing"
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                        {formatValue(lead.phone)}
                      </td>

                      <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                        {formatValue(lead.city)}
                      </td>

                      <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                        {formatValue(lead.industry)}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        <div className="space-y-1">
                          <p>CRM: {formatValue(lead.status)}</p>
                          <p>Outreach: {formatValue(lead.outreach_status)}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <MissingContactActions
                          leadId={lead.id}
                          website={lead.website}
                          phone={lead.phone}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
