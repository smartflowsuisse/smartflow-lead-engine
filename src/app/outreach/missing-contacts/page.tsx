import Link from "next/link";

import { getMissingContactQueueLeads } from "@/lib/leads/missing-contact-queue";

function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Missing";
  }

  return String(value);
}

export default function MissingContactsPage() {
  const leads = getMissingContactQueueLeads();

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
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Leads without an email, but with a website or phone. Use this queue
            to open the company site, find a usable email address, then update
            the lead before starting email outreach.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
          <p className="text-xs text-slate-500">missing email leads</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/outreach/session"
          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          Start Email Session
        </Link>

        <Link
          href="/outreach"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800"
        >
          Back to Outreach
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Website</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Status</th>
              <th className="w-32 px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top">
                <td className="px-4 py-4 font-medium text-slate-900">
                  {formatValue(lead.company)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {lead.lead_score ?? 0}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {lead.website ? (
                    <a
                      href={lead.website}
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
                <td className="px-4 py-4 text-slate-700">
                  {formatValue(lead.phone)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {formatValue(lead.city)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {formatValue(lead.industry)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {formatValue(lead.status)} / {formatValue(lead.outreach_status)}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="inline-flex min-w-20 items-center justify-center whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800"
                    >
                      Open Lead
                    </Link>

                    <Link
                      href={`/leads/${lead.id}/edit?returnTo=/outreach/session`}
                      className="inline-flex min-w-20 items-center justify-center whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs font-medium text-white"
                    >
                      Add Email
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {leads.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={8}>
                  No missing-contact leads found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
