import { LeadForm } from "@/components/leads/LeadForm";

export default function NewLeadPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add New Lead</h1>
        <p className="mt-1 text-slate-500">
          Enter company details to add a lead to your pipeline
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <LeadForm mode="create" />
      </div>
    </div>
  );
}
