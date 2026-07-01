type ConvertActionPreview = {
  title: string;
  mode: string;
  approvalStatus: string;
  resultPreview: string;
  blockedActions: string[];
};

type ConvertActionPanelProps = {
  action: ConvertActionPreview;
};

export function ConvertActionPanel({ action }: ConvertActionPanelProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-400">
            Mock action panel
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{action.title}</h2>
        </div>

        <span className="rounded-full border border-red-900 bg-red-950 px-3 py-1 text-xs text-red-300">
          {action.mode}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">Approval status</p>
          <p className="mt-2 text-lg font-semibold text-slate-100">
            {action.approvalStatus}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {action.resultPreview}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm font-medium text-slate-200">
            Blocked external actions
          </p>

          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {action.blockedActions.map((blockedAction) => (
              <li key={blockedAction}>- {blockedAction}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm font-medium text-slate-200">Safety rule</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This panel is visual only. It does not create a client, update a lead,
          write to a database, send email, call Make, call OpenAI or trigger any
          external action.
        </p>
      </div>
    </div>
  );
}
