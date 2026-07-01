type RequestDetail = {
  client: string;
  title: string;
  source: string;
  urgency: string;
  status: string;
  summary: string;
};

type RequestDetailProps = {
  selectedRequest: RequestDetail;
};

export function RequestDetail({ selectedRequest }: RequestDetailProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-400">
            Selected request detail
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {selectedRequest.title}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {selectedRequest.client} · {selectedRequest.source}
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
            Urgency: {selectedRequest.urgency}
          </span>
          <span className="rounded-full border border-red-900 bg-red-950 px-3 py-1 text-red-300">
            {selectedRequest.status}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm font-medium text-slate-200">
            Request summary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {selectedRequest.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm font-medium text-slate-200">
            Suggested next task
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Prepare a manual follow-up task and review the request before any
            external action.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm font-medium text-slate-200">
            Approval status
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The suggested reply is still a draft and requires human approval
            before any Gmail draft or external action can happen.
          </p>
        </div>
      </div>
    </div>
  );
}
