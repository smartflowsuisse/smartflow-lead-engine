import { ApprovalQueue } from "./components/approval-queue";
import { ClientHubHeader } from "./components/client-hub-header";
import { ClientHubMetrics } from "./components/client-hub-metrics";
import { ClientInbox } from "./components/client-inbox";
import { ClientList } from "./components/client-list";
import { RequestDetail } from "./components/request-detail";
import { approvalItems, clients, requests } from "./mock-data";

export default function ClientHubPage() {
  const selectedRequest = requests[0];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <ClientHubHeader />

        <ClientHubMetrics
          clientsCount={clients.length}
          requestsCount={requests.length}
          approvalItemsCount={approvalItems.length}
        />

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr_0.9fr]">
          <ClientList clients={clients} />
          <ClientInbox requests={requests} />
          <ApprovalQueue approvalItems={approvalItems} />
          <RequestDetail selectedRequest={selectedRequest} />
        </section>
      </div>
    </main>
  );
}
