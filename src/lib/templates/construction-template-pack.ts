export type AuditLanguage = "en" | "fr" | "de";

export const auditMessages: Record<AuditLanguage, string> = {
  en: "Hello, I noticed that many construction companies lose time on invoices, project follow-ups, procurement tracking, and weekly reporting. SmartFlow Suisse has prepared a Construction Automation Starter with ready-to-demo workflows for invoice PDF extraction, project task follow-ups, and procurement reports. We can offer a free workflow audit and show where automation could save time before proposing any implementation.",
  fr: "Bonjour, j’ai remarqué que de nombreuses entreprises de construction perdent du temps avec les factures, le suivi des projets, les achats et les rapports hebdomadaires. SmartFlow Suisse a préparé un Construction Automation Starter avec des workflows prêts à démontrer pour l’extraction de factures PDF, le suivi des tâches projet et les rapports d’achats. Nous pouvons proposer un audit gratuit de vos workflows afin d’identifier où l’automatisation pourrait vous faire gagner du temps avant toute proposition d’implémentation.",
  de: "Guten Tag, ich habe gesehen, dass viele Bauunternehmen viel Zeit mit Rechnungen, Projekt-Follow-ups, Beschaffung und wöchentlichen Berichten verlieren. SmartFlow Suisse hat einen Construction Automation Starter mit vorführbereiten Workflows für PDF-Rechnungsextraktion, Projektaufgaben-Follow-ups und Beschaffungir können einen kostenlosen Workflow-Audit anbieten und zeigen, wo Automatisierung Zeit sparen kann, bevor wir eine Umsetzung vorschlagen.",
};

export const languageLabels: Record<AuditLanguage, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
};

export const templates = [
  {
    title: "Invoice PDF Automation",
    description:
      "Extract supplier, amount, VAT, project, due date, and approval status from PDF invoices.",
    outcome: "Review-ready invoice summary",
    value: "Accounting and project cost control",
  },
  {
    title: "Project Task Workflow",
    description:
      "Create project tasks, follow-ups, reminders, and blocked-item alerts for construction teams.",
    outcome: "Clear next actions per project",
    value: "Less missed work and faster follow-up",
  },
  {
    title: "Procurement Weekly Report",
    description:
      "Summarize purchases, group costs by project, and highlight missing or suspicious data.",
    outcome: "Weekly purchasing report",
    value: "Better visibility on project spending",
  },
];

export const implementationSteps = [
  {
    title: "Audit client workflow",
    description: "Map invoice, project, procurement, and reporting steps before building automation.",
  },
  {
    title: "Collect sample data",
    description: "Use real invoices, project notes, purchase lists, and weekly reports for testing.",
  },
  {
    title: "Select client tools",
    description: "Confirm email, accounting, spreadsheet, CRM, Notion, Trello, Bexio, Banana, or Excel setup.",
  },
  {
    title: "Build n8n / Make workflow",
    description: "Create the first working automation with AI document review and structured outputs.",
  },
  {
    title: "Test with real documents",
    description: "Check extraction quality, edge cases, missing data, and approval flow before delivery.",
  },
  {
    title: "Train owner / admin",
    description: "Show the client how to review outputs, approve steps, and request support.",
  },
  {
    title: "Start monthly support",
    description: "Monitor workflows, fix issues, update templates, and add improvements under retainer.",
  },
];
