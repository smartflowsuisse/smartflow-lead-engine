import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLeadById } from "@/lib/leads";
import { LeadForm } from "@/components/leads/LeadForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: PageProps) {
  const { id } = await params;
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) notFound();

  const lead = getLeadById(leadId);
  if (!lead) notFound();

  return (
    <div className="p-8">
      <Link
        href={`/leads/${lead.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to lead
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Edit Lead</h1>
        <p className="mt-1 text-slate-500">{lead.company}</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <LeadForm
          mode="edit"
          leadId={lead.id}
          initialData={{
            company: lead.company,
            website: lead.website ?? "",
            email: lead.email ?? "",
            phone: lead.phone ?? "",
            city: lead.city ?? "",
            industry: lead.industry ?? "",
            status: lead.status,
            notes: lead.notes ?? "",
          }}
        />
      </div>
    </div>
  );
}
