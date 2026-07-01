const clients = [
  {
    id: "client-demo-001",
    company: "Demo Construction Geneve",
    contact: "Claire Demo",
    language: "FR",
    status: "Active",
  },
  {
    id: "client-demo-002",
    company: "Demo Services Lausanne",
    contact: "Marc Demo",
    language: "FR",
    status: "Pilot",
  },
];

const requests = [
  {
    id: "req-001",
    client: "Demo Construction Geneve",
    title: "New renovation request",
    source: "Website form",
    urgency: "Medium",
    status: "Waiting approval",
    summary:
      "Client asks for a bathroom renovation estimate and wants to know availability for the next two weeks.",
    suggestedReply:
      "Bonjour Claire, merci pour votre demande. Nous pouvons organiser un premier echange cette semaine afin de clarifier les details du projet.",
  },
  {
    id: "req-002",
    client: "Demo Services Lausanne",
    title: "Follow-up on service offer",
    source: "Manual demo intake",
    urgency: "Low",
    status: "Draft reply",
    summary:
      "Client requests a short clarification about the proposed monthly support package.",
    suggestedReply:
      "Bonjour Marc, merci pour votre message. Voici une clarification simple du support mensuel propose.",
  },
];

const approvalItems = [
  {
    id: "approval-001",
    type: "Suggested reply",
    client: "Demo Construction Geneve",
    status: "Needs human approval",
  },
  {
    id: "approval-002",
    type: "Follow-up task",
    client: "Demo Services Lausanne",
    status: "Review before action",
  },
];

export default function ClientHubPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400">
            SmartFlow AI Operations
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Client Hub
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            MVP1 mock screen for managing clients, incoming requests, AI
            summaries, suggested replies and approval queue. No external action
            is executed from this page.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Clients</p>
            <p className="mt-2 text-3xl font-semibold">{clients.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Requests</p>
            <p className="mt-2 text-3xl font-semibold">{requests.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Approval queue</p>
            <p className="mt-2 text-3xl font-semibold">
              {approvalItems.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">External actions</p>
            <p className="mt-2 text-3xl font-semibold text-red-400">0</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Clients</h2>

            <div className="mt-5 space-y-4">
              {clients.map((client) => (
                <article
                  key={client.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <h3 className="font-medium">{client.company}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {client.contact}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{client.language}</span>
                    <span>{client.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

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
                      <h3 className="mt-2 text-lg font-semibold">
                        {request.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {request.client}
                      </p>
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
        </section>
      </div>
    </main>
  );
}
