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
