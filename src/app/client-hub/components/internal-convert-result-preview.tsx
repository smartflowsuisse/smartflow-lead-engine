import type { ConvertToClientInternalActionResult } from "@/lib/leads/convert-to-client-internal-action";

type InternalConvertResultPreviewProps = {
  result: ConvertToClientInternalActionResult;
};

export function InternalConvertResultPreview({
  result,
}: InternalConvertResultPreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Internal helper result
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-100">
            Convert to Client internal action
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This block is generated from the real internal helper layer. It is
            still preview-only and does not create a client, update a lead, write
            to a database, send email, call Make or call OpenAI.
          </p>
        </div>

        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
          {result.mode}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Can proceed
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {result.canProceed ? "Yes" : "No"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Safety guard result: {result.safetyGuard.canProceed ? "allowed" : "blocked"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Action type
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-100">
            {result.actionType}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Human approval is still required before any real conversion.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-medium text-slate-200">Blocked reasons</p>
          {result.blockedReasons.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {result.blockedReasons.map((reason) => (
                <li key={reason}>- {reason}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              No blocking reason returned by the internal helper.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-medium text-slate-200">Client draft</p>
          {result.clientDraft ? (
            <div className="mt-3 space-y-1 text-sm text-slate-400">
              <p>Company: {result.clientDraft.company}</p>
              <p>Contact: {result.clientDraft.contactName}</p>
              <p>Email: {result.clientDraft.email || "Not provided"}</p>
              <p>Status: {result.clientDraft.status}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              No client draft prepared because the conversion is blocked.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-medium text-slate-200">Audit preview</p>
          <div className="mt-3 space-y-1 text-sm text-slate-400">
            <p>Action: {result.auditEvent.action}</p>
            <p>Result: {result.auditEvent.result}</p>
            <p>Actor: {result.auditEvent.actor}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-medium text-slate-200">Rollback preview</p>
          <div className="mt-3 space-y-1 text-sm text-slate-400">
            <p>Source lead: {result.rollbackContext.sourceLeadId}</p>
            <p>Rollback context prepared: Yes</p>
            <p>Mode: preview only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
