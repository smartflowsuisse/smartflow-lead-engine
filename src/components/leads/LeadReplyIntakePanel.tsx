interface LeadReplyIntakePanelProps {
  status?: string | null;
  contactedAt?: string | null;
}

function IntakeStep({
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
            ? "mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600"
            : "mt-1 h-2.5 w-2.5 rounded-full bg-slate-300"
        }
      />
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs leading-5 text-slate-600">{description}</p>
      </div>
    </li>
  );
}

export function LeadReplyIntakePanel({
  status,
  contactedAt,
}: LeadReplyIntakePanelProps) {
  const normalizedStatus = status?.toLowerCase() ?? "";

  const hasContacted = Boolean(contactedAt) || normalizedStatus === "contacted";
  const hasReply =
    normalizedStatus === "replied" ||
    normalizedStatus === "meeting" ||
    normalizedStatus === "proposal" ||
    normalizedStatus === "won";

  const hasMeeting =
    normalizedStatus === "meeting" ||
    normalizedStatus === "proposal" ||
    normalizedStatus === "won";

  const hasProposal = normalizedStatus === "proposal" || normalizedStatus === "won";
  const hasWon = normalizedStatus === "won";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Reply / intake
        </p>
        <h2 className="text-lg font-semibold text-slate-950">
          Client response workflow
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Internal checklist for handling replies after outreach. This panel is
          read-only and does not change CRM data.
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
          Contacted at:{" "}
          <span className="font-semibold text-slate-950">
            {contactedAt ?? "Not contacted yet"}
          </span>
        </p>
      </div>

      <ol className="mt-5 space-y-4">
        <IntakeStep
          label="1. Outreach sent"
          description="Manual outreach was sent and confirmed by a human. Automatic sending remains disabled."
          active={hasContacted}
        />
        <IntakeStep
          label="2. Reply received"
          description="Reply handling is manual. Add a short reply summary in notes before choosing the next action."
          active={hasReply}
        />
        <IntakeStep
          label="3. Discovery call"
          description="If a call is planned or completed, capture the business problem, urgency, tools, and decision context before updating CRM status. Use the first client call sheet before a demo call."
          active={hasMeeting}
        />
        <IntakeStep
          label="4. Proposal decision"
          description="Choose the next step only after human review: audit, quick win, proposal, lead task, follow-up, or no fit."
          active={hasProposal}
        />
        <IntakeStep
          label="5. Client accepted"
          description="Move to Won only after real agreement. Create lead tasks for onboarding, follow-up, and any next manual action."
          active={hasWon}
        />
      </ol>
    </section>
  );
}
