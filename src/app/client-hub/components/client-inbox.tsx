type Request = {
  id: string;
  client: string;
  title: string;
  source: string;
  urgency: string;
  status: string;
  summary: string;
  suggestedReply: string;
};

type ClientInboxProps = {
  requests: Request[];
};

export function ClientInbox({ requests }: ClientInboxProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">Client Inbox</h2>

      <div className="mt-5 space-y-5">
        {requests.map((request) => (
          <article
            key={request.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {request.source}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{request.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{request.client}</p>
              </div>

              <div className="flex gap-2 text-xs">
                <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
                  {request.urgency}
                </span>
                <span className="rounded-full border border-red-900 bg-red-950 px-3 py-1 text-red-300">
                  {request.status}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm font-medium text-slate-200">
                Mock AI summary
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {request.summary}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm font-medium text-slate-200">
                Mock suggested reply
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {request.suggestedReply}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
