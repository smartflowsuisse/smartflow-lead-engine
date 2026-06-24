interface LeadClientWorkflowPanelProps {
  status?: string | null;
  outreachStatus?: string | null;
  leadScore?: number | null;
  hasAnalysis?: boolean;
  hasContactPath?: boolean;
  hasBusinessProblem?: boolean;
  hasRecommendedOffer?: boolean;
  hasNextAction?: boolean;
}

function WorkflowRow({
  label,
  description,
  active,
}: {
  label: string;
  description: string;
  active: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={
          active
            ? "mt-0.5 h-2.5 w-2.5 rounded-full bg-brand-600"
            : "mt-0.5 h-2.5 w-2.5 rounded-full bg-slate-300"
        }
      />
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs leading-5 text-slate-600">{description}</p>
      </div>
    </li>
  );
}

export function LeadClientWorkflowPanel({
  status,
  outreachStatus,
  leadScore,
  hasAnalysis = false,
  hasContactPath = false,
  hasBusinessProblem = false,
  hasRecommendedOffer = false,
  hasNextAction = false,
}: LeadClientWorkflowPanelProps) {
  const normalizedStatus = status?.toLowerCase() ?? "";
  const normalizedOutreach = outreachStatus?.toLowerCase() ?? "";

  const hasContacted =
    normalizedStatus === "contacted" || normalizedOutreach === "contacted";

  const hasReply =
    normalizedStatus === "replied" ||
    normalizedStatus === "meeting" ||
    normalizedStatus === "proposal" ||
    normalizedStatus === "won";

  const hasFollowUp =
    normalizedStatus === "replied" ||
    normalizedStatus === "meeting" ||
    normalizedStatus === "proposal" ||
    normalizedStatus === "won" ||
    normalizedStatus === "contacted";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Internal workflow
        </p>
        <h2 className="text-lg font-semibold text-slate-950">
          Mini-audit preparation path
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Practical steps for preparing a first SmartFlow Suisse client
          mini-audit. Read-only — does not change CRM data.
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
        <p>
          Current status:{" "}
          <span className="font-semibold text-slate-950">
            {status ?? "Unknown"}
          </span>
        </p>
        <p>
          Outreach:{" "}
          <span className="font-semibold text-slate-950">
            {outreachStatus ?? "Unknown"}
          </span>
        </p>
        <p>
          Score:{" "}
          <span className="font-semibold text-slate-950">
            {typeof leadScore === "number" ? leadScore : "Unknown"}
          </span>
        </p>
      </div>

      <ol className="mt-5 space-y-4">
        <WorkflowRow
          label="1. Review website and contact path"
          description="Confirm the site, CTA, and how you can reach this company."
          active={hasAnalysis && hasContactPath}
        />
        <WorkflowRow
          label="2. Identify business problem"
          description="Capture the main gap, follow-up weakness, or automation opportunity."
          active={hasBusinessProblem}
        />
        <WorkflowRow
          label="3. Prepare mini-audit"
          description="Summarize findings in internal notes before client-facing material."
          active={hasBusinessProblem && hasRecommendedOffer}
        />
        <WorkflowRow
          label="4. Select SmartFlow offer"
          description="Choose the service package that matches the identified problem."
          active={hasRecommendedOffer}
        />
        <WorkflowRow
          label="5. Send only after manual review"
          description="Use the email draft as a helper — send manually and mark Contacted after."
          active={hasContacted && hasNextAction}
        />
        <WorkflowRow
          label="6. Follow up manually"
          description="Track replies, calls, and next steps in tasks and CRM status."
          active={hasFollowUp && hasReply}
        />
      </ol>
    </section>
  );
}
