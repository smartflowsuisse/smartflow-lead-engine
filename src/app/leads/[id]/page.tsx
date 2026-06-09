import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLeadById } from "@/lib/leads";
import { getTasksByLeadId } from "@/lib/tasks";
import { AnalysisPanel } from "@/components/leads/AnalysisPanel";
import { OutreachDraftPanel } from "@/components/leads/OutreachDraftPanel";
import { LeadNotesPanel } from "@/components/leads/LeadNotesPanel";
import { LeadTasksPanel } from "@/components/leads/LeadTasksPanel";
import { LeadContactSection } from "@/components/leads/LeadContactSection";
import {
  LeadCompanySection,
  LeadProfileHeader,
} from "@/components/leads/LeadProfileSections";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) notFound();

  const lead = getLeadById(leadId);
  if (!lead) notFound();

  const tasks = getTasksByLeadId(leadId);

  return (
    <div className="p-8">
      <Link
        href="/leads"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <LeadProfileHeader lead={lead} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <LeadCompanySection lead={lead} />
          <LeadContactSection lead={lead} />
          <LeadNotesPanel
            leadId={lead.id}
            initialNotes={lead.notes}
            updatedAt={lead.updated_at}
          />
          <LeadTasksPanel leadId={lead.id} initialTasks={tasks} />
          <OutreachDraftPanel
            leadId={lead.id}
            hasAnalysis={Boolean(lead.analysis)}
          />
        </div>

        <div className="lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <AnalysisPanel
              leadId={lead.id}
              website={lead.website}
              leadScore={lead.lead_score}
              analysis={lead.analysis}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
