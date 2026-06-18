interface LeadClientWorkflowPanelProps {
  status?: string | null;
  outreachStatus?: string | null;
  leadScore?: number | null;
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
}: LeadClientWorkflowPanelProps) {
  const normalizedStatus = status?.toLowerCase() ?? "";
  const normalizedOutreach = outreachStatus?.toLowerCase() ?? "";

  const hasAnalysis =
    normalizedStatus === "analyzed" ||
    normalizedStatus === "contacted" ||
    normalizedStatus === "replied" ||
    normalizedStatus === "meeting" ||
    normalizedStatus === "proposal" ||
    normalizedStatus === "won";

  const hasContacted =
    normalizedStatus === "contacted" || normalizedOutreach === "contacted";

  const hasReply =
    normalizedStatus === "replied" ||
    normalizedStatus === "meeting" ||
    normalizedStatus === "proposal" ||
    normalizedStatus === "won";

  const hasProposal =
    normalizedStatus === "proposal" || normalizedStatus === "won";

  const hasWon = normalizedStatus === "won";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Internal workflow
        </p>
        <h2 className="text-lg font-semibold text-slate-950">
          Client readiness path
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Internal checklist for moving a lead from analysis to first client
          conversation. This block is read-only and does not change CRM data.
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
          label="1. Analyze"
          description="Website reviewed, score available, main opportunity identified."
          active={hasAnalysis}
        />
        <WorkflowRow
          label="2. Manual outreach"
          description="Email sent manually. Mark Contacted only after real sending."
          active={hasContacted}
        />
        <WorkflowRow
          label="3. Reply / intake"
          description="If the company replies, collect basic needs, urgency and decision context."
          active={hasReply}
        />
        <WorkflowRow
          label="4. Mini audit / proposal"
          description="Prepare a short audit and choose the right offer before sending a proposal."
          active={hasProposal}
        />
        <WorkflowRow
          label="5. Project / onboarding"
          description="After agreement, collect assets, confirm timeline and start delivery checklist."
          active={hasWon}
        />
      </ol>
    </section>
  );
}
