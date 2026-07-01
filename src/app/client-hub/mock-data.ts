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
