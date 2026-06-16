export type FiduciaryLanguage = "en" | "fr" | "de";

export const fiduciaryLanguageLabels: Record<FiduciaryLanguage, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
};

export const fiduciaryAuditMessages: Record<FiduciaryLanguage, string> = {
  en: "Hello, I noticed that many fiduciary and accounting teams lose time collecting client documents, checking missing VAT/TVA data, preparing monthly reports, and following up manually. SmartFlow Suisse has prepared a Fiduciary Automation Starter with ready-to-demo workflows for client document intake, VAT/TVA review, monthly reporting, and task follow-ups. We can offer a free workflow audit and show where automation could save time before proposing any implementation.",
  fr: "Bonjour, j’ai remarqué que de nombreuses fiduciaires perdent du temps à collecter les documents clients, vérifier les données TVA manquantes, préparer les rapports mensuels et relancer les clients manuellement. SmartFlow Suisse a préparé un Fiduciary Automation Starter avec des workflows prêts à démontrer pour la collecte de documents, la revue TVA, les rapports mensuels et le suivi des tâches. Nous pouvons proposer un audit gratuit de vos workflows afin d’identifier où l’automatisation pourrait vous faire gagner du temps avant toute proposition d’implémentation.",
  de: "Guten Tag, ich habe gesehen, dass viele Treuhand- und Buchhaltungsteams Zeit mit dem Sammeln von Kundendokumenten, der Prüfung fehlender MWST-Daten, monatlichen Berichten und manuellen Nachfassaktionen verlieren. SmartFlow Suisse hat einen Fiduciary Automation Starter mit vorführbaren Workflows für Dokumenteneingang, MWST-Prüfung, Monatsberichte und Aufgaben-Follow-ups vorbereitet. Wir können ein kostenloses Workflow-Audit anbieten und zeigen, wo Automatisierung Zeit sparen kann, bevor wir eine Umsetzung vorschlagen.",
};

export const fiduciaryTemplates = [
  {
    title: "Client Document Intake",
    description:
      "Collect client invoices, receipts, statements, payroll files, and missing documents through a structured intake workflow.",
    outcome: "Clean document intake list",
    value: "Less chasing and fewer missing files",
  },
  {
    title: "VAT / TVA Review Workflow",
    description:
      "Check invoice fields, VAT/TVA amounts, supplier data, periods, and missing approval information before accounting review.",
    outcome: "Review-ready VAT/TVA checklist",
    value: "Fewer manual checks before filing",
  },
  {
    title: "Monthly Reporting Summary",
    description:
      "Summarize monthly client activity, missing items, unusual expenses, and next actions for the fiduciary team.",
    outcome: "Monthly client report draft",
    value: "Faster recurring client reporting",
  },
  {
    title: "Client Follow-up Tasks",
    description:
      "Create structured follow-up tasks for missing documents, unanswered questions, and approval requests.",
    outcome: "Clear follow-up task list",
    value: "Better visibility and fewer forgotten requests",
  },
];

export const fiduciaryImplementationSteps = [
  {
    title: "Audit client document flow",
    description:
      "Map how client documents arrive, where they are stored, who checks them, and where delays happen.",
  },
  {
    title: "Collect sample files",
    description:
      "Use real invoices, receipts, bank statements, reports, and client follow-up examples for testing.",
  },
  {
    title: "Select client tools",
    description:
      "Confirm email, accounting software, cloud storage, spreadsheet, CRM, task manager, or internal portal setup.",
  },
  {
    title: "Build intake and review workflow",
    description:
      "Create the first working automation for document intake, missing data checks, and structured outputs.",
  },
  {
    title: "Test with real client cases",
    description:
      "Check extraction quality, missing fields, VAT/TVA edge cases, client exceptions, and approval flow.",
  },
  {
    title: "Train fiduciary team",
    description:
      "Show the team how to review outputs, validate exceptions, update templates, and request support.",
  },
  {
    title: "Start monthly support",
    description:
      "Monitor workflows, fix issues, update document rules, and improve reporting under retainer.",
  },
];

export const fiduciaryProposalSummary = [
  "Fiduciary Automation Starter — Proposal Summary",
  "",
  "We can help fiduciary and accounting teams reduce manual work around client documents, VAT/TVA review, monthly reporting, and follow-up tasks.",
  "",
  "Package:",
  "- Client Document Intake",
  "- VAT / TVA Review Workflow",
  "- Monthly Reporting Summary",
  "- Client Follow-up Tasks",
  "- Implementation checklist from workflow audit to monthly support",
  "",
  "Offer range:",
  "CHF 5'000–11'000 + monthly support retainer",
  "",
  "Next step:",
  "Free workflow audit to identify where automation can save time before implementation.",
].join("\n");

export const fiduciaryClientIntakeChecklist = [
  "Fiduciary Automation Starter — Client Intake Checklist",
  "",
  "Please prepare the following before the workflow audit:",
  "",
  "1. Sample invoices, receipts, bank statements, and supplier documents",
  "2. Examples of missing client documents or manual follow-ups",
  "3. VAT/TVA review examples and recurring reporting requirements",
  "4. Monthly or quarterly reports currently prepared manually",
  "5. Current tools used by the team: email, accounting software, cloud storage, CRM, spreadsheet, or task manager",
  "6. Approval rules: who reviews, validates, sends, or receives alerts",
  "7. Main pain points: missing files, manual checks, delays, errors, or unclear responsibilities",
  "",
  "Goal:",
  "Use these materials to identify where automation can save time before implementation.",
].join("\n");
