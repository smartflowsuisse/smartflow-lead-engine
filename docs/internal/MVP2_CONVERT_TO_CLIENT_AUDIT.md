# MVP2 Convert to Client — Audit

## Purpose

This document audits the existing Lead Engine structure before implementing MVP2.

MVP2 target:

Lead Engine
-> Lead status: Won
-> Convert to Client
-> Client appears in Client Hub

## Safety

This audit is documentation-only.

No application code is changed.

No external systems are connected:

- no Gmail;
- no Make;
- no OpenAI;
- no database change;
- no production deploy;
- no automatic email sending;
- no external action.

## Current Known Direction

Client Hub MVP1 is complete as a mock-only screen.

MVP2 should connect Lead Engine to Client Hub in a controlled way.

The first implementation should be small and safe:

1. inspect current lead status model;
2. inspect lead detail actions;
3. inspect pipeline logic;
4. decide where a Convert to Client action belongs;
5. implement only after audit.


## Relevant Lead Library Files

```text
src/lib/leads/__tests__/construction-templates-page.test.ts
src/lib/leads/__tests__/contact-enrichment.test.ts
src/lib/leads/__tests__/export-csv.test.ts
src/lib/leads/__tests__/fiduciary-template-pack.test.ts
src/lib/leads/__tests__/lead-details.test.ts
src/lib/leads/__tests__/lead-status.test.ts
src/lib/leads/__tests__/list-view.test.ts
src/lib/leads/__tests__/missing-contact-queue.test.ts
src/lib/leads/__tests__/next-best-action.test.ts
src/lib/leads/__tests__/opportunity-summary.test.ts
src/lib/leads/__tests__/outreach-actions.test.ts
src/lib/leads/__tests__/outreach-queue.test.ts
src/lib/leads/__tests__/outreach-session.test.ts
src/lib/leads/__tests__/pipeline.test.ts
src/lib/leads/__tests__/retail-template-pack.test.ts
src/lib/leads/__tests__/status-sync.test.ts
src/lib/leads/__tests__/template-pack-context.test.ts
src/lib/leads/__tests__/template-pack-lead-matching.test.ts
src/lib/leads/__tests__/template-pack-outreach-bridge.test.ts
src/lib/leads/__tests__/template-pack-outreach-message.test.ts
src/lib/leads/__tests__/template-pack-registry.test.ts
src/lib/leads/__tests__/website-display.test.ts
src/lib/leads/contact-enrichment.ts
src/lib/leads/export-csv.ts
src/lib/leads/lead-details.ts
src/lib/leads/lead-status.ts
src/lib/leads/list-view.ts
src/lib/leads/missing-contact-queue.ts
src/lib/leads/next-best-action.ts
src/lib/leads/opportunity-summary.ts
src/lib/leads/outreach-actions.ts
src/lib/leads/outreach-queue.ts
src/lib/leads/outreach-session.ts
src/lib/leads/pipeline.ts
src/lib/leads/scoring-thresholds.ts
src/lib/leads/status-sync.ts
src/lib/leads/template-pack-lead-matching.ts
src/lib/leads/template-pack-outreach-message.ts
src/lib/leads/website-display.ts
```

## Relevant App Routes

```text
src/app/api/leads/[id]/analyze/route.ts
src/app/api/leads/[id]/contact/route.ts
src/app/api/leads/[id]/outreach/route.ts
src/app/api/leads/[id]/route.ts
src/app/api/leads/[id]/tasks/route.ts
src/app/api/leads/export/route.ts
src/app/api/leads/import/preview/route.ts
src/app/api/leads/import/route.ts
src/app/api/leads/route.ts
src/app/api/pipeline/route.ts
src/app/client-hub/components/activity-log.tsx
src/app/client-hub/components/approval-queue.tsx
src/app/client-hub/components/client-hub-header.tsx
src/app/client-hub/components/client-hub-metrics.tsx
src/app/client-hub/components/client-inbox.tsx
src/app/client-hub/components/client-list.tsx
src/app/client-hub/components/follow-up-panel.tsx
src/app/client-hub/components/request-detail.tsx
src/app/client-hub/mock-data.ts
src/app/client-hub/page.tsx
src/app/leads/[id]/edit/page.tsx
src/app/leads/[id]/page.tsx
src/app/leads/import/page.tsx
src/app/leads/new/page.tsx
src/app/leads/page.tsx
src/app/pipeline/page.tsx
```

## Lead Status Source

File: `src/lib/leads/lead-status.ts`

```ts
import { LEAD_STATUSES, type LeadStatus } from "../types";

const LEGACY_LEAD_STATUS_MAP: Record<string, LeadStatus> = {
  "New Lead": "New",
  "Follow Up": "Replied",
  "Proposal Sent": "Proposal",
  Client: "Won",
};

export function normalizeLeadStatus(status: string): LeadStatus {
  const mapped = LEGACY_LEAD_STATUS_MAP[status] ?? status;
  if (LEAD_STATUSES.includes(mapped as LeadStatus)) {
    return mapped as LeadStatus;
  }

  return "New";
}

export function isClosedPipelineStatus(status: LeadStatus): boolean {
  return status === "Won" || status === "Lost" || status === "Proposal";
}
```

## Lead Detail Source

File: `src/lib/leads/lead-details.ts`

```ts
export function getAnalyzeActionLabel(hasAnalysis: boolean): "Analyze" | "Re-analyze" {
  return hasAnalysis ? "Re-analyze" : "Analyze";
}
```

## Pipeline Source

File: `src/lib/leads/pipeline.ts`

```ts
import type { LeadStatus } from "../types";

const SALES_PIPELINE: LeadStatus[] = [
  "New",
  "Analyzed",
  "Contacted",
  "Replied",
  "Meeting",
  "Proposal",
  "Won",
];

export function getNextLeadStatus(current: LeadStatus): LeadStatus | null {
  const index = SALES_PIPELINE.indexOf(current);
  if (index === -1 || index >= SALES_PIPELINE.length - 1) {
    return null;
  }

  return SALES_PIPELINE[index + 1] ?? null;
}

export function getSalesPipelineStages(): LeadStatus[] {
  return [...SALES_PIPELINE, "Lost"];
}
```

## Lead Detail Route Candidates

```text
src/app/api/leads/[id]/analyze/route.ts
src/app/api/leads/[id]/contact/route.ts
src/app/api/leads/[id]/outreach/route.ts
src/app/api/leads/[id]/route.ts
src/app/api/leads/[id]/tasks/route.ts
src/app/api/leads/export/route.ts
src/app/api/leads/import/preview/route.ts
src/app/api/leads/import/route.ts
src/app/api/leads/route.ts
src/app/leads/[id]/edit/page.tsx
src/app/leads/[id]/page.tsx
src/app/leads/import/page.tsx
src/app/leads/new/page.tsx
src/app/leads/page.tsx
```

## Status / Won Search

```text
src/lib/leads/outreach-session.ts:10:  status?: string | null;
src/lib/leads/outreach-session.ts:11:  outreach_status?: string | null;
src/lib/leads/outreach-session.ts:14:const CLOSED_STATUSES = new Set(["Contacted", "Replied", "Meeting", "Proposal", "Won", "Lost"]);
src/lib/leads/outreach-session.ts:15:const BLOCKED_OUTREACH_STATUSES = new Set(["Contacted", "Won", "Lost"]);
src/lib/leads/outreach-session.ts:28:  if (lead.status && CLOSED_STATUSES.has(lead.status)) {
src/lib/leads/outreach-session.ts:32:  if (lead.outreach_status && BLOCKED_OUTREACH_STATUSES.has(lead.outreach_status)) {
src/lib/leads/pipeline.ts:10:  "Won",
src/lib/leads/missing-contact-queue.ts:4:const CLOSED_CRM_STATUSES = new Set(["Won", "Lost"]);
src/lib/leads/missing-contact-queue.ts:10:  "Won",
src/lib/leads/missing-contact-queue.ts:22:  status?: string | null;
src/lib/leads/missing-contact-queue.ts:23:  outreach_status?: string | null;
src/lib/leads/missing-contact-queue.ts:42:    | "status"
src/lib/leads/missing-contact-queue.ts:43:    | "outreach_status"
src/lib/leads/missing-contact-queue.ts:54:  if (lead.status && CLOSED_CRM_STATUSES.has(lead.status)) {
src/lib/leads/missing-contact-queue.ts:59:    lead.outreach_status &&
src/lib/leads/missing-contact-queue.ts:60:    CLOSED_OUTREACH_STATUSES.has(lead.outreach_status)
src/lib/leads/status-sync.ts:3:export const CLOSED_CRM_STATUSES: LeadStatus[] = ["Won", "Lost"];
src/lib/leads/status-sync.ts:5:export function isClosedCrmStatus(status: LeadStatus): boolean {
src/lib/leads/status-sync.ts:6:  return status === "Won" || status === "Lost";
src/lib/leads/status-sync.ts:9:/** Map canonical CRM status to outreach queue status. */
src/lib/leads/status-sync.ts:10:export function syncOutreachStatusFromCrm(status: LeadStatus): OutreachStatus {
src/lib/leads/status-sync.ts:11:  switch (status) {
src/lib/leads/status-sync.ts:22:    case "Won":
src/lib/leads/status-sync.ts:23:      return "Won";
src/lib/leads/status-sync.ts:29:/** Map outreach queue status back to canonical CRM status. */
src/lib/leads/status-sync.ts:43:    case "Won":
src/lib/leads/status-sync.ts:44:      return "Won";
src/lib/leads/status-sync.ts:55:}): { status: LeadStatus; outreach_status: OutreachStatus } {
src/lib/leads/status-sync.ts:56:  const status = input.nextStatus ?? input.existingStatus;
src/lib/leads/status-sync.ts:57:  let outreach_status = input.nextOutreachStatus ?? input.existingOutreachStatus;
src/lib/leads/status-sync.ts:60:    outreach_status = syncOutreachStatusFromCrm(input.nextStatus);
src/lib/leads/status-sync.ts:66:      status: syncCrmStatusFromOutreach(
src/lib/leads/status-sync.ts:70:      outreach_status: input.nextOutreachStatus,
src/lib/leads/status-sync.ts:74:  return { status, outreach_status };
src/lib/leads/__tests__/pipeline.test.ts:12:    assert.equal(getNextLeadStatus("Proposal"), "Won");
src/lib/leads/__tests__/pipeline.test.ts:16:    assert.equal(getNextLeadStatus("Won"), null);
src/lib/leads/__tests__/export-csv.test.ts:29:    status: "Analyzed",
src/lib/leads/__tests__/export-csv.test.ts:30:    outreach_status: "New",
src/lib/leads/__tests__/export-csv.test.ts:109:      sampleLead({ id: 2, company: "Beta AG", lead_score: 0, status: "New" }),
src/lib/leads/__tests__/export-csv.test.ts:140:    sampleLead({ id: 1, company: "Alpha", lead_score: 10, status: "New" }),
src/lib/leads/__tests__/export-csv.test.ts:141:    sampleLead({ id: 2, company: "Beta", lead_score: 65, status: "Analyzed" }),
src/lib/leads/__tests__/export-csv.test.ts:147:      status: "New",
src/lib/leads/__tests__/list-view.test.ts:23:    status: "New",
src/lib/leads/__tests__/list-view.test.ts:24:    outreach_status: "New",
src/lib/leads/__tests__/list-view.test.ts:156:  it("excludes closed pipeline statuses", () => {
src/lib/leads/__tests__/list-view.test.ts:159:        sampleLead({ lead_score: 80, status: "Won" })
src/lib/leads/__tests__/list-view.test.ts:165:        sampleLead({ lead_score: 80, status: "Analyzed" })
src/lib/leads/__tests__/lead-status.test.ts:3:import { normalizeLeadStatus } from "../lead-status";
src/lib/leads/__tests__/lead-status.test.ts:8:  it("maps legacy CRM statuses to the sales pipeline", () => {
src/lib/leads/__tests__/lead-status.test.ts:12:    assert.equal(normalizeLeadStatus("Client"), "Won");
src/lib/leads/__tests__/lead-status.test.ts:15:  it("keeps current pipeline statuses unchanged", () => {
src/lib/leads/__tests__/lead-status.test.ts:16:    for (const status of LEAD_STATUSES) {
src/lib/leads/__tests__/lead-status.test.ts:17:      assert.equal(normalizeLeadStatus(status), status);
src/lib/leads/__tests__/missing-contact-queue.test.ts:30:        status: "New",
src/lib/leads/__tests__/missing-contact-queue.test.ts:31:        outreach_status: "New",
src/lib/leads/__tests__/missing-contact-queue.test.ts:43:        status: "New",
src/lib/leads/__tests__/missing-contact-queue.test.ts:44:        outreach_status: "New",
src/lib/leads/__tests__/missing-contact-queue.test.ts:56:        status: "Won",
src/lib/leads/__tests__/missing-contact-queue.test.ts:57:        outreach_status: "New",
src/lib/leads/__tests__/missing-contact-queue.test.ts:67:        status: "New",
src/lib/leads/__tests__/missing-contact-queue.test.ts:68:        outreach_status: "Contacted",
src/lib/leads/__tests__/status-sync.test.ts:8:} from "../status-sync";
src/lib/leads/__tests__/status-sync.test.ts:18:    assert.equal(syncOutreachStatusFromCrm("Won"), "Won");
src/lib/leads/__tests__/status-sync.test.ts:24:  it("maps outreach updates back to CRM status", () => {
src/lib/leads/__tests__/status-sync.test.ts:30:    assert.equal(syncCrmStatusFromOutreach("Won", "Meeting"), "Won");
src/lib/leads/__tests__/status-sync.test.ts:35:  it("syncs outreach when CRM status changes", () => {
src/lib/leads/__tests__/status-sync.test.ts:43:      status: "Contacted",
src/lib/leads/__tests__/status-sync.test.ts:44:      outreach_status: "Contacted",
src/lib/leads/__tests__/status-sync.test.ts:48:  it("syncs CRM when outreach status changes", () => {
src/lib/leads/__tests__/status-sync.test.ts:56:      status: "Contacted",
src/lib/leads/__tests__/status-sync.test.ts:57:      outreach_status: "Contacted",
src/lib/leads/__tests__/status-sync.test.ts:70:      status: "Meeting",
src/lib/leads/__tests__/status-sync.test.ts:71:      outreach_status: "Meeting",
src/lib/leads/__tests__/status-sync.test.ts:77:  it("identifies Won and Lost as closed", () => {
src/lib/leads/__tests__/status-sync.test.ts:78:    assert.equal(isClosedCrmStatus("Won"), true);
src/lib/leads/__tests__/contact-enrichment.test.ts:21:    status: "New",
src/lib/leads/__tests__/contact-enrichment.test.ts:22:    outreach_status: "New",
src/lib/leads/__tests__/outreach-queue.test.ts:21:    status: "Analyzed",
src/lib/leads/__tests__/outreach-queue.test.ts:22:    outreach_status: "New",
src/lib/leads/__tests__/outreach-queue.test.ts:54:  it("excludes Won and Lost leads", () => {
src/lib/leads/__tests__/outreach-queue.test.ts:56:      isActionableOutreachLead(sampleLead({ status: "Won" })),
src/lib/leads/__tests__/outreach-queue.test.ts:60:      isActionableOutreachLead(sampleLead({ status: "Lost" })),
src/lib/leads/__tests__/outreach-queue.test.ts:64:      isActionableOutreachLead(sampleLead({ status: "Proposal" })),
src/lib/leads/__tests__/outreach-queue.test.ts:87:  it("counts outreach statuses for actionable leads", () => {
src/lib/leads/__tests__/outreach-queue.test.ts:89:      sampleLead({ id: 1, outreach_status: "New" }),
src/lib/leads/__tests__/outreach-queue.test.ts:90:      sampleLead({ id: 2, outreach_status: "Contacted" }),
src/lib/leads/__tests__/outreach-queue.test.ts:91:      sampleLead({ id: 3, outreach_status: "Replied" }),
src/lib/leads/__tests__/outreach-queue.test.ts:92:      sampleLead({ id: 4, outreach_status: "Meeting" }),
src/lib/leads/__tests__/outreach-queue.test.ts:93:      sampleLead({ id: 5, outreach_status: "Won", status: "Won" }),
src/lib/leads/__tests__/outreach-queue.test.ts:94:      sampleLead({ id: 6, outreach_status: "New", lead_score: 20 }),
src/lib/leads/__tests__/outreach-queue.test.ts:101:    assert.equal(summary.won, 0);
src/lib/leads/__tests__/outreach-queue.test.ts:107:      sampleLead({ id: 1, status: "Lost", outreach_status: "Lost" }),
src/lib/leads/__tests__/outreach-queue.test.ts:108:      sampleLead({ id: 2, status: "Won", outreach_status: "Won" }),
src/lib/leads/__tests__/outreach-queue.test.ts:109:      sampleLead({ id: 3, status: "Contacted", outreach_status: "Contacted" }),
src/lib/leads/__tests__/next-best-action.test.ts:11:  status: "New" as const,
src/lib/leads/__tests__/next-best-action.test.ts:97:  it("returns low-priority guidance for closed Won and Lost leads", () => {
src/lib/leads/__tests__/next-best-action.test.ts:99:      buildNextBestAction({ ...baseInput, status: "Won", lead_score: 80 }).action,
src/lib/leads/__tests__/next-best-action.test.ts:103:      buildNextBestAction({ ...baseInput, status: "Lost", lead_score: 80 }).action,
src/lib/leads/__tests__/outreach-session.test.ts:15:      { id: 1, email: "a@example.ch", lead_score: 80, status: "New", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:16:      { id: 2, email: "b@example.ch", lead_score: 44, status: "New", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:17:      { id: 3, email: "c@example.ch", lead_score: 80, status: "Won", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:18:      { id: 4, email: "d@example.ch", lead_score: 80, status: "New", outreach_status: "Contacted" },
src/lib/leads/__tests__/outreach-session.test.ts:19:      { id: 5, lead_score: 80, status: "New", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:27:      { id: 1, company: "Beta", email: "b@example.ch", lead_score: 80, status: "New", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:28:      { id: 2, company: "Alpha", email: "a@example.ch", lead_score: 80, status: "New", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:29:      { id: 3, company: "Gamma", email: "g@example.ch", lead_score: 90, status: "New", outreach_status: "New" },
src/lib/leads/__tests__/outreach-session.test.ts:47:      status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:48:      outreach_status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:60:  it("rejects CRM statuses already past first outreach", () => {
src/lib/leads/__tests__/outreach-session.test.ts:61:    for (const status of ["Contacted", "Replied", "Meeting", "Proposal", "Won", "Lost"]) {
src/lib/leads/__tests__/outreach-session.test.ts:64:          id: status,
src/lib/leads/__tests__/outreach-session.test.ts:67:          status,
src/lib/leads/__tests__/outreach-session.test.ts:68:          outreach_status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:83:        status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:84:        outreach_status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:96:        status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:97:        outreach_status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:109:        status: "Lost",
src/lib/leads/__tests__/outreach-session.test.ts:110:        outreach_status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:120:        status: "New",
src/lib/leads/__tests__/outreach-session.test.ts:121:        outreach_status: "Contacted",
src/lib/leads/list-view.ts:41:const POST_PRIORITY_STATUSES: LeadStatus[] = ["Won", "Proposal", "Lost"];
src/lib/leads/list-view.ts:87:    lead.lead_score >= LEAD_SCORE_THRESHOLDS.HIGH_PRIORITY && !POST_PRIORITY_STATUSES.includes(lead.status)
src/lib/leads/outreach-queue.ts:2:import { isClosedCrmStatus } from "./status-sync";
src/lib/leads/outreach-queue.ts:13:  won: number;
src/lib/leads/outreach-queue.ts:19:    !isClosedCrmStatus(lead.status) &&
src/lib/leads/outreach-queue.ts:20:    lead.status !== "Contacted" &&
src/lib/leads/outreach-queue.ts:44:    readyForOutreach: actionable.filter((lead) => lead.outreach_status === "New")
src/lib/leads/outreach-queue.ts:46:    contacted: actionable.filter((lead) => lead.outreach_status === "Contacted")
src/lib/leads/outreach-queue.ts:48:    replied: actionable.filter((lead) => lead.outreach_status === "Replied").length,
src/lib/leads/outreach-queue.ts:49:    meetings: actionable.filter((lead) => lead.outreach_status === "Meeting")
src/lib/leads/outreach-queue.ts:51:    won: actionable.filter((lead) => lead.outreach_status === "Won").length,
src/lib/leads/outreach-queue.ts:63:  const statuses: OutreachStatus[] = [
src/lib/leads/outreach-queue.ts:68:    "Won",
src/lib/leads/outreach-queue.ts:72:  return statuses.includes(value as OutreachStatus)
src/lib/leads/next-best-action.ts:26:  | "status"
src/lib/leads/next-best-action.ts:52:  if (input.status === "Won") {
src/lib/leads/next-best-action.ts:56:      reason: "Lead is Won — focus on delivery, upsell, and referrals.",
src/lib/leads/next-best-action.ts:60:  if (input.status === "Lost") {
src/lib/leads/next-best-action.ts:149:    | "status"
src/lib/leads/next-best-action.ts:161:    status: lead.status,
src/lib/leads/lead-status.ts:7:  Client: "Won",
src/lib/leads/lead-status.ts:10:export function normalizeLeadStatus(status: string): LeadStatus {
src/lib/leads/lead-status.ts:11:  const mapped = LEGACY_LEAD_STATUS_MAP[status] ?? status;
src/lib/leads/lead-status.ts:19:export function isClosedPipelineStatus(status: LeadStatus): boolean {
src/lib/leads/lead-status.ts:20:  return status === "Won" || status === "Lost" || status === "Proposal";
src/lib/leads/export-csv.ts:48:  { header: "Status", value: (lead) => lead.status },
src/app/pipeline/page.tsx:15:          Move leads from New to Contacted, then to Won or Lost when the result is clear.
src/app/pipeline/page.tsx:16:          Use this board to keep CRM status aligned with outreach progress.
src/app/leads/[id]/edit/page.tsx:67:            status: lead.status,
src/app/leads/[id]/page.tsx:68:          Update the CRM status and add tasks after each follow-up.
src/app/leads/[id]/page.tsx:74:          currentStatus={lead.status}
src/app/leads/[id]/page.tsx:105:            status={lead.status}
src/app/leads/[id]/page.tsx:106:            outreachStatus={lead.outreach_status}
src/app/leads/[id]/page.tsx:121:            status={lead.status}
src/app/leads/page.tsx:20:    status?: string;
src/app/leads/page.tsx:37:  const status = parseStatus(params.status);
src/app/leads/page.tsx:42:  const baseLeads = searchLeads({ q, status });
src/app/leads/page.tsx:53:      status ||
src/app/leads/page.tsx:72:            status={status}
src/app/leads/page.tsx:91:        initialStatus={status}
src/app/client-hub/components/request-detail.tsx:6:  status: string;
src/app/client-hub/components/request-detail.tsx:35:            {selectedRequest.status}
src/app/client-hub/components/request-detail.tsx:62:            Approval status
src/app/client-hub/components/client-list.tsx:6:  status: string;
src/app/client-hub/components/client-list.tsx:28:              <span>{client.status}</span>
src/app/client-hub/components/follow-up-panel.tsx:7:  status: string;
src/app/client-hub/components/follow-up-panel.tsx:47:                {item.status}
src/app/client-hub/components/approval-queue.tsx:5:  status: string;
src/app/client-hub/components/approval-queue.tsx:26:              {item.status}
src/app/client-hub/components/client-inbox.tsx:7:  status: string;
src/app/client-hub/components/client-inbox.tsx:41:                  {request.status}
src/app/client-hub/mock-data.ts:7:    status: "Active",
src/app/client-hub/mock-data.ts:14:    status: "Pilot",
src/app/client-hub/mock-data.ts:25:    status: "Waiting approval",
src/app/client-hub/mock-data.ts:37:    status: "Draft reply",
src/app/client-hub/mock-data.ts:50:    status: "Needs human approval",
src/app/client-hub/mock-data.ts:56:    status: "Review before action",
src/app/client-hub/mock-data.ts:98:    status: "Scheduled mock",
src/app/client-hub/mock-data.ts:107:    status: "Draft only",
src/app/api/pipeline/route.ts:12:      { status: 500 }
src/app/api/leads/route.ts:17:    const status = parseStatus(searchParams.get("status"));
src/app/api/leads/route.ts:18:    const leads = searchLeads({ q, status });
src/app/api/leads/route.ts:24:      { status: 500 }
src/app/api/leads/route.ts:36:        { status: 400 }
src/app/api/leads/route.ts:48:        status: body.status || undefined,
src/app/api/leads/route.ts:55:    return NextResponse.json(lead, { status: 201 });
src/app/api/leads/route.ts:60:      { status: 500 }
src/app/api/leads/export/route.ts:29:    const status = parseStatus(searchParams.get("status"));
src/app/api/leads/export/route.ts:38:    const baseLeads = searchLeads({ q, status });
src/app/api/leads/export/route.ts:48:      status: 200,
src/app/api/leads/export/route.ts:58:      { status: 500 }
src/app/api/leads/[id]/contact/route.ts:12:      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
src/app/api/leads/[id]/contact/route.ts:20:      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
src/app/api/leads/[id]/contact/route.ts:28:      { status: 500 }
src/app/api/leads/[id]/tasks/route.ts:21:      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
src/app/api/leads/[id]/tasks/route.ts:26:      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
src/app/api/leads/[id]/tasks/route.ts:34:      { status: 500 }
src/app/api/leads/[id]/tasks/route.ts:44:      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
src/app/api/leads/[id]/tasks/route.ts:52:      return NextResponse.json({ error: "Title is required" }, { status: 400 });
src/app/api/leads/[id]/tasks/route.ts:58:        { status: 400 }
src/app/api/leads/[id]/tasks/route.ts:64:      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
src/app/api/leads/[id]/tasks/route.ts:67:    return NextResponse.json(task, { status: 201 });
src/app/api/leads/[id]/tasks/route.ts:72:      { status: 500 }
src/app/api/leads/[id]/tasks/[taskId]/route.ts:22:      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:27:      return NextResponse.json({ error: "Task not found" }, { status: 404 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:40:        return NextResponse.json({ error: "Title is required" }, { status: 400 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:50:          { status: 400 }
src/app/api/leads/[id]/tasks/[taskId]/route.ts:60:          { status: 400 }
src/app/api/leads/[id]/tasks/[taskId]/route.ts:68:      return NextResponse.json({ error: "Task not found" }, { status: 404 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:76:      { status: 500 }
src/app/api/leads/[id]/tasks/[taskId]/route.ts:86:      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:91:      return NextResponse.json({ error: "Task not found" }, { status: 404 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:96:      return NextResponse.json({ error: "Task not found" }, { status: 404 });
src/app/api/leads/[id]/tasks/[taskId]/route.ts:104:      { status: 500 }
src/app/api/leads/[id]/route.ts:12:      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
src/app/api/leads/[id]/route.ts:17:      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
src/app/api/leads/[id]/route.ts:25:      { status: 500 }
src/app/api/leads/[id]/route.ts:35:      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
src/app/api/leads/[id]/route.ts:40:    if (body.status && !LEAD_STATUSES.includes(body.status)) {
```

## Preliminary MVP2 Recommendation

Recommended first code PR after this audit:

1. Add a mock-safe Convert to Client UI/action only where lead status is already compatible.
2. Do not add Gmail, Make, OpenAI or database changes.
3. Do not auto-create real client records until the existing data model is confirmed.
4. Prefer a small local mapping first: Won lead -> demo Client Hub client representation.
5. Keep PR small and reversible.
