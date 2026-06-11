import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLeadById } from "@/lib/leads";
import { getTasksByLeadId } from "@/lib/tasks";
import { getActivitiesByLeadId } from "@/lib/activities";
import { AnalysisPanel } from "@/components/leads/AnalysisPanel";
import { EmailGeneratorPanel } from "@/components/leads/EmailGeneratorPanel";
import { LeadNotesPanel } from "@/components/leads/LeadNotesPanel";
import { LeadTasksPanel } from "@/components/leads/LeadTasksPanel";
import { LeadActivityHistory } from "@/components/leads/LeadActivityHistory";
import { LeadContactSection } from "@/components/leads/LeadContactSection";
import { LeadReadinessChecklist } from "@/components/leads/LeadReadinessChecklist";
import {
  LeadCompanySection,
  LeadProfileHeader,
} from "@/components/leads/LeadProfileSections";
import {
  calculateLeadScoreBreakdown,
  leadAnalysisToWebsiteResult,
} from "@/lib/scoring";

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
  const activities = getActivitiesByLeadId(leadId);
  const scoreBreakdown = calculateLeadScoreBreakdown(
    lead,
    lead.analysis ? leadAnalysisToWebsiteResult(lead.analysis) : null
  );

  return (
    <div className="p-8">
      <Link
        href="/leads"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <LeadProfileHeader lead={lead} scoreBreakdown={scoreBreakdown} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <LeadCompanySection lead={lead} />
          <LeadContactSection lead={lead} />
          <LeadReadinessChecklist
            lead={lead}
            hasAnalysis={Boolean(lead.analysis)}
          />
          <LeadNotesPanel
            leadId={lead.id}
            initialNotes={lead.notes}
            updatedAt={lead.updated_at}
          />
          <LeadTasksPanel leadId={lead.id} initialTasks={tasks} />
          <LeadActivityHistory activities={activities} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <AnalysisPanel
              leadId={lead.id}
              website={lead.website}
              leadScore={lead.lead_score}
              scoreBreakdown={scoreBreakdown}
              analysis={lead.analysis}
            />
          </section>

          <EmailGeneratorPanel
            leadId={lead.id}
            leadEmail={lead.email}
            hasAnalysis={Boolean(lead.analysis)}
            contactedAt={lead.contacted_at}
            contactedLanguage={lead.contacted_language}
          />
        </div>
      </div>
    </div>
  );
}
