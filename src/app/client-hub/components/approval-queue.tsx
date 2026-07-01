type ApprovalItem = {
  id: string;
  type: string;
  client: string;
  status: string;
};

type ApprovalQueueProps = {
  approvalItems: ApprovalItem[];
};

export function ApprovalQueue({ approvalItems }: ApprovalQueueProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">Approval Queue</h2>

      <div className="mt-5 space-y-4">
        {approvalItems.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
          >
            <p className="text-sm font-medium">{item.type}</p>
            <p className="mt-1 text-sm text-slate-400">{item.client}</p>
            <p className="mt-3 rounded-full border border-red-900 bg-red-950 px-3 py-1 text-xs text-red-300">
              {item.status}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm font-medium text-slate-200">Safety</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li>No auto-send</li>
          <li>No Gmail connection</li>
          <li>No Make webhook</li>
          <li>No production action</li>
        </ul>
      </div>
    </div>
  );
}
