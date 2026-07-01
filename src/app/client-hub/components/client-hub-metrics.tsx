type ClientHubMetricsProps = {
  clientsCount: number;
  requestsCount: number;
  approvalItemsCount: number;
};

export function ClientHubMetrics({
  clientsCount,
  requestsCount,
  approvalItemsCount,
}: ClientHubMetricsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Clients</p>
        <p className="mt-2 text-3xl font-semibold">{clientsCount}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Requests</p>
        <p className="mt-2 text-3xl font-semibold">{requestsCount}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Approval queue</p>
        <p className="mt-2 text-3xl font-semibold">{approvalItemsCount}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">External actions</p>
        <p className="mt-2 text-3xl font-semibold text-red-400">0</p>
      </div>
    </section>
  );
}
