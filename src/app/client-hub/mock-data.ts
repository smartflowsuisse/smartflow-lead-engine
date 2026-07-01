export const clients = [
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

export const requests = [
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

export const approvalItems = [
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

export const activityLogItems = [
  {
    id: "activity-001",
    time: "09:10",
    actor: "System",
    action: "Request received from website form",
    entity: "req-001",
  },
  {
    id: "activity-002",
    time: "09:11",
    actor: "Mock AI",
    action: "Generated request summary",
    entity: "req-001",
  },
  {
    id: "activity-003",
    time: "09:12",
    actor: "Mock AI",
    action: "Suggested manual follow-up task",
    entity: "req-001",
  },
  {
    id: "activity-004",
    time: "09:13",
    actor: "Approval Queue",
    action: "Suggested reply marked as waiting for human review",
    entity: "approval-001",
  },
  {
    id: "activity-005",
    time: "09:14",
    actor: "Convert Preview",
    action: "Convert to Client preview prepared for human review",
    entity: "lead-demo-won-001",
  },
];

export const followUpItems = [
  {
    id: "follow-up-001",
    client: "Demo Construction Geneve",
    request: "New renovation request",
    dueDate: "Tomorrow",
    owner: "Manual review",
    status: "Scheduled mock",
    nextAction: "Prepare a manual follow-up after human approval.",
  },
  {
    id: "follow-up-002",
    client: "Demo Services Lausanne",
    request: "Follow-up on service offer",
    dueDate: "In 3 days",
    owner: "Manual review",
    status: "Draft only",
    nextAction: "Review clarification request before sending any reply.",
  },
];

import {
  canConvertLeadToClient,
  createClientDraftFromLead,
} from "@/lib/leads/convert-to-client";

export const convertToClientSourceLead = {
  id: "lead-demo-won-001",
  company: "Demo Won Lead Geneve",
  contactName: "Sophie Demo",
  email: "sophie@example.com",
  phone: "+41000000001",
  language: "FR",
  status: "Won",
};

export const convertToClientEligibility = {
  isEligible: canConvertLeadToClient(convertToClientSourceLead),
  reason: "Lead status is Won and can be prepared as a Client Hub draft.",
};

export const convertToClientDraft = createClientDraftFromLead(
  convertToClientSourceLead,
);

export const convertReadinessItems = [
  {
    id: "readiness-001",
    label: "Lead status is Won",
    status: "Ready",
    detail: "The source lead has a Won status and passes the helper eligibility check.",
  },
  {
    id: "readiness-002",
    label: "Client draft can be prepared",
    status: "Ready",
    detail: "The Client Hub draft is generated from lead data without writing to a database.",
  },
  {
    id: "readiness-003",
    label: "Human review required",
    status: "Required",
    detail: "A human must review the draft before any real client record is created.",
  },
  {
    id: "readiness-004",
    label: "External actions blocked",
    status: "Blocked",
    detail: "No Gmail, Make, OpenAI, calendar, notification or email action is triggered.",
  },
];

export const convertActionPreview = {
  title: "Convert won lead to Client Hub draft",
  mode: "Mock action only",
  approvalStatus: "Human approval required",
  resultPreview: "Client draft would be reviewed before any real client record is created.",
  blockedActions: [
    "No database write",
    "No lead status update",
    "No Gmail draft",
    "No Make scenario",
    "No OpenAI call",
    "No external notification",
  ],
};

export const postApprovalResultPreview = {
  title: "Post-approval result preview",
  status: "Preview only",
  approvedBy: "Human reviewer",
  result: "Client Hub draft would be ready for controlled creation after approval.",
  createdRecords: [
    "Client draft review completed",
    "Source lead remains unchanged",
    "Audit log entry would be prepared",
  ],
  blockedActions: [
    "No real client created",
    "No lead status updated",
    "No database write",
    "No Gmail action",
    "No Make scenario",
    "No OpenAI call",
  ],
};
