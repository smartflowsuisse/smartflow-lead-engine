type FollowUpItem = {
  id: string;
  client: string;
  request: string;
  dueDate: string;
  owner: string;
  status: string;
  nextAction: string;
};

type FollowUpPanelProps = {
  items: FollowUpItem[];
};

export function FollowUpPanel({ items }: FollowUpPanelProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-red-400">
            Follow-up
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Pending manual follow-ups
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Mock-only follow-up queue showing what should be reviewed next. No
          reminder, email or external action is triggered from this block.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-100">{item.client}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.request}</p>
              </div>

              <span className="rounded-full border border-red-900 bg-red-950 px-3 py-1 text-xs text-red-300">
                {item.status}
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-400">
              <p>
                <span className="text-slate-200">Due:</span> {item.dueDate}
              </p>
              <p>
                <span className="text-slate-200">Owner:</span> {item.owner}
              </p>
              <p className="leading-6">
                <span className="text-slate-200">Next action:</span>{" "}
                {item.nextAction}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm font-medium text-slate-200">Safety rule</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Follow-up items are visual mock data only. They do not create calendar
          events, send emails, call Make, call OpenAI or write to a database.
        </p>
      </div>
    </div>
  );
}
