type ActivityLogItem = {
  id: string;
  time: string;
  actor: string;
  action: string;
  entity: string;
};

type ActivityLogProps = {
  items: ActivityLogItem[];
};

export function ActivityLog({ items }: ActivityLogProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-400">
            Audit log
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Recent activity</h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Mock-only activity trail showing how important Client Hub actions will
          be recorded before any real automation is connected.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm md:grid-cols-[80px_140px_1fr_120px]"
          >
            <p className="text-slate-500">{item.time}</p>
            <p className="font-medium text-slate-200">{item.actor}</p>
            <p className="text-slate-400">{item.action}</p>
            <p className="text-slate-500">{item.entity}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm font-medium text-slate-200">Safety rule</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This log is visual only. It does not write to a database, trigger
          Gmail, call Make, call OpenAI or execute external actions.
        </p>
      </div>
    </div>
  );
}
