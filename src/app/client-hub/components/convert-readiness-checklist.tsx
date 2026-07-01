type ConvertReadinessItem = {
  id: string;
  label: string;
  status: string;
  detail: string;
};

type ConvertReadinessChecklistProps = {
  items: ConvertReadinessItem[];
};

export function ConvertReadinessChecklist({
  items,
}: ConvertReadinessChecklistProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-400">
            Conversion readiness
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Before Convert to Client
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Mock-only checklist for the conditions that must be true before a won
          lead can become a Client Hub client.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-medium text-slate-100">{item.label}</h3>
              <span className="rounded-full border border-red-900 bg-red-950 px-3 py-1 text-xs text-red-300">
                {item.status}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {item.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm font-medium text-slate-200">Safety rule</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This checklist is visual only. It does not convert leads, create
          clients, update statuses, write to a database or call external
          services.
        </p>
      </div>
    </div>
  );
}
