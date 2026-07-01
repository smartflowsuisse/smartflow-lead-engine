type Client = {
  id: string;
  company: string;
  contact: string;
  language: string;
  status: string;
};

type ClientListProps = {
  clients: Client[];
};

export function ClientList({ clients }: ClientListProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">Clients</h2>

      <div className="mt-5 space-y-4">
        {clients.map((client) => (
          <article
            key={client.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
          >
            <h3 className="font-medium">{client.company}</h3>
            <p className="mt-1 text-sm text-slate-400">{client.contact}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{client.language}</span>
              <span>{client.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
