import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllLeads } from "@/lib/leads";
import { LeadCard } from "@/components/leads/LeadCard";

export default function LeadsPage() {
  const leads = getAllLeads();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-slate-500">
            {leads.length} companies in your database
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Link>
      </div>

      {leads.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <p className="text-lg font-medium text-slate-700">No leads yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Start building your pipeline by adding Swiss business leads.
          </p>
          <Link
            href="/leads/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Add First Lead
          </Link>
        </div>
      )}
    </div>
  );
}
