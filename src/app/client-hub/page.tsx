import { ActivityLog } from "./components/activity-log";
import { ApprovalQueue } from "./components/approval-queue";
import { ClientHubHeader } from "./components/client-hub-header";
import { FollowUpPanel } from "./components/follow-up-panel";
import { PostApprovalPreview } from "./components/post-approval-preview";
import { ClientHubMetrics } from "./components/client-hub-metrics";
import { ClientInbox } from "./components/client-inbox";
import { ConvertActionPanel } from "./components/convert-action-panel";
import { ConvertReadinessChecklist } from "./components/convert-readiness-checklist";
import { ConvertToClientDraft } from "./components/convert-to-client-draft";
import { ClientList } from "./components/client-list";
import { RequestDetail } from "./components/request-detail";
import {
  activityLogItems,
  approvalItems,
  clients,
  convertToClientDraft,
  convertActionPreview,
  convertReadinessItems,
  convertToClientEligibility,
  followUpItems,
  postApprovalResultPreview,
  requests,
} from "./mock-data";

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
          <ConvertToClientDraft
            draft={convertToClientDraft}
            eligibility={convertToClientEligibility}
          />
          <ConvertReadinessChecklist items={convertReadinessItems} />
          <ConvertActionPanel action={convertActionPreview} />
          <PostApprovalPreview preview={postApprovalResultPreview} />
          <FollowUpPanel items={followUpItems} />
          <ActivityLog items={activityLogItems} />
        </section>
      </div>
    </main>
  );
}
