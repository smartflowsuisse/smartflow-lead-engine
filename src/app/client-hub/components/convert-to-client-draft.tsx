type ConvertToClientDraftProps = {
  eligibility: {
    isEligible: boolean;
    reason: string;
  };
  draft: {
    id: string;
    sourceLeadId: string;
    company: string;
    contactName: string;
    email: string;
    phone: string;
    language: string;
    status: "Draft";
  };
};

export function ConvertToClientDraft({
  draft,
  eligibility,
}: ConvertToClientDraftProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-400">
            Convert to Client
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Mock client draft from won lead
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-slate-400">
          This panel shows the expected result of converting a won Lead Engine
          lead into a Client Hub client draft. It is display-only.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Eligibility</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {eligibility.isEligible ? "Eligible for draft conversion" : "Not eligible"}
            </p>
          </div>

          <span className="rounded-full border border-red-900 bg-red-950 px-3 py-1 text-xs text-red-300">
            Human review still required
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {eligibility.reason}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">Client draft</p>
          <h3 className="mt-2 text-lg font-semibold">{draft.company}</h3>
          <p className="mt-2 text-sm text-slate-400">{draft.contactName}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">Source lead</p>
          <p className="mt-2 text-sm font-medium text-slate-200">
            {draft.sourceLeadId}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Language: {draft.language}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">Draft status</p>
          <p className="mt-2 text-lg font-semibold text-red-300">
            {draft.status}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            No database write has happened.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm font-medium text-slate-200">Safety rule</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This is a mock draft only. It does not create a real client, update a
          lead, write to a database, send emails, call Make or call OpenAI.
        </p>
      </div>
    </div>
  );
}
