export function ClientHubHeader() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400">
        SmartFlow AI Operations
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        Client Hub
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
        MVP1 mock screen for managing clients, incoming requests, AI summaries,
        suggested replies and approval queue. No external action is executed
        from this page.
      </p>
    </section>
  );
}
