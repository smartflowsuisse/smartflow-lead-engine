"use client";

import Link from "next/link";
import { useState } from "react";

type AuditLanguage = "en" | "fr" | "de";

const auditMessages: Record<AuditLanguage, string> = {
  en: "Hello, I noticed that many construction companies lose time on invoices, project follow-ups, procurement tracking, and weekly reporting. SmartFlow Suisse has prepared a Construction Automation Starter with ready-to-demo workflows for invoice PDF extraction, project task follow-ups, and procurement reports. We can offer a free workflow audit and show where automation could save time before proposing any implementation.",
  fr: "Bonjour, j’ai remarqué que de nombreuses entreprises de construction perdent du temps avec les factures, le suivi des projets, les achats et les rapports hebdomadaires. SmartFlow Suisse a préparé un Construction Automation Starter avec des workflows prêts à démontrer pour l’extraction de factures PDF, le suivi des tâches projet et les rapports d’achats. Nous pouvons proposer un audit gratuit de vos workflows afin d’identifier où l’automatisation pourrait vous faire gagner du temps avant toute proposition d’implémentation.",
  de: "Guten Tag, ich habe gesehen, dass viele Bauunternehmen viel Zeit mit Rechnungen, Projekt-Follow-ups, Beschaffung und wöchentlichen Berichten verlieren. SmartFlow Suisse hat einen Construction Automation Starter mit vorführbereiten Workflows für PDF-Rechnungsextraktion, Projektaufgaben-Follow-ups und Beschaffungir können einen kostenlosen Workflow-Audit anbieten und zeigen, wo Automatisierung Zeit sparen kann, bevor wir eine Umsetzung vorschlagen.",
};

const languageLabels: Record<AuditLanguage, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
};

const templates = [
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

const implementationSteps = [
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

export function ConstructionTemplatesPanel() {
  const [copied, setCopied] = useState(false);
  const [planCopied, setPlanCopied] = useState(false);
  const [proposalCopied, setProposalCopied] = useState(false);
  const [intakeCopied, setIntakeCopied] = useState(false);
  const [language, setLanguage] = useState<AuditLanguage>("en");

  const auditMessage = auditMessages[language];

  const implementationPlan = [
    "Construction Automation Starter — Implementation Plan",
    "",
    ...implementationSteps.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`),
  ].join("\n");

  const proposalSummary = [
    "Construction Automation Starter — Proposal Summary",
    "",
    "We can help your construction company reduce manual work around invoices, project follow-ups, procurement tracking, and weekly reporting.",
    "",
    "Package:",
    "- Invoice PDF Automation",
    "- Project Task Workflow",
    "- Procurement Weekly Report",
    "- Implementation checklist from workflow audit to monthly support",
    "",
    "Offer range:",
    "CHF 6'000–12'000 + monthly support retainer",
    "",
    "Next step:",
    "Free workflow audit to identify where automation can save time before implementation.",
  ].join("\n");

  const clientIntakeChecklist = [
    "Construction Automation Starter — Client Intake Checklist",
    "",
    "Please prepare the following before the workflow audit:",
    "",
    "1. Sample invoices and supplier documents",
    "2. Project notes, task lists, or site follow-up examples",
    "3. Purchase lists, procurement files, or stock tracking examples",
    "4. Weekly or monthly reports currently prepared manually",
    "5. Current tools used by the team: email, accounting, CRM, spreadsheet, Notion, Trello, Bexio, Banana, or other systems",
    "6. Approval rules: who reviews, approves, pays, or receives alerts",
    "7. Main pain points: delays, manual work, missing data, errors, or unclear responsibilities",
    "",
    "Goal:",
    "Use these materials to identify where automation can save time before implementation.",
  ].join("\n");



  async function copyAuditMessage() {
    try {
      await navigator.clipboard.writeText(auditMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function copyImplementationPlan() {
    try {
      await navigator.clipboard.writeText(implementationPlan);
      setPlanCopied(true);
      window.setTimeout(() => setPlanCopied(false), 2000);
    } catch {
      setPlanCopied(false);
    }
  }


  async function copyProposalSummary() {
    try {
      await navigator.clipboard.writeText(proposalSummary);
      setProposalCopied(true);
      window.setTimeout(() => setProposalCopied(false), 2000);
    } catch {
  setProposalCopied(false);
    }
  }


  async function copyClientIntakeChecklist() {
    try {
      await navigator.clipboard.writeText(clientIntakeChecklist);
      setIntakeCopied(true);
      window.setTimeout(() => setIntakeCopied(false), 2000);
    } catch {
      setIntakeCopied(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Demo product
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Construction Automation Starter
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Ready-to-demo workflow templates for Swiss construction companies:
            invoices, project tasks, procurement reports, and AI-assisted review.
          </p>
        </div>
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm">
          <p className="font-semibold text-brand-700">Offer range</p>
          <p className="mt-1 text-slate-700">
            CHF 6&apos;000–12&apos;000 + retainer
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/leads"
          className="inline-flex items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
        >
          Review construction leads
        </Link>
        <Link
          href="/outreach"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Open outreach
        </Link>
        <button
          type="button"
          onClick={() => void copyAuditMessage()}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? "Audit message copied" : "Copy audit message"}
        </button>
      </div>

      <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Audit message preview
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Choose the outreach language before copying the message.
            </p>
          </div>

          <div className="flex gap-2">
            {(["en", "fr", "de"] as AuditLanguage[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setLanguage(option);
                  setCopied(false);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  language === option
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {languageLabels[option]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{auditMessage}</p>

        <div className="mt-3 flex justify-end">
          <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-500">
            {languageLabels[language]} · Copy-ready
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {templates.map((template) => (
          <article
            key={template.title}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <h3 className="font-semibold text-slate-900">{template.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {template.description}
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <p>
                <span className="font-semibold text-slate-700">Output: </span>
                <span className="text-slate-600">{template.outcome}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Value: </span>
                <span className="text-slate-600">{template.value}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Implementation Checklist
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Use this process to turn the demo into a real client implementation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void copyImplementationPlan()}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {planCopied ? "Implementation plan copied" : "Copy implementation plan"}
          </button>

          <button
            type="button"
            onClick={() => void copyProposalSummary()}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {proposalCopied ? "Proposal summary copied" : "Copy proposal summary"}
          </button>
        </div>

        <ol className="grid gap-3 md:grid-cols-2">
          {implementationSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                  {index + 1}
                </span>
                <h4 className="text-sm font-semibold text-slate-900">
                  {step.title}
                </h4>
              </div>
              <p className="text-xs leading-5 text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Client Delivery Pack
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Use this as the client-facing delivery structure after the first workflow audit.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void copyClientIntakeChecklist()}
            className="mb-4 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {intakeCopied ? "Client intake checklist copied" : "Copy client intake checklist"}
          </button>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Client provides
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                <li>Sample invoices and supplier documents</li>
                <li>Project notes, purchase lists, and weekly reports</li>
                <li>Current tools: email, accounting, CRM, spreadsheet, or PM system</li>
                <li>Approval rules and responsible team members</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                SmartFlow delivers
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                <li>Configured invoice, task, or procurement workflow</li>
                <li>AI-assisted document review and structured output</li>
                <li>Tested automation with real client documents</li>
                <li>Owner/admin training and monthly support path</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Delivery timeline
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                <li>Day 1: workflow audit and data collection</li>
                <li>Day 2–3: workflow setup and AI extraction test</li>
                <li>Day 4: client validation and corrections</li>
                <li>Day 5: delivery, training, and support setup</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Monthly support
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                <li>Workflow monitoring and small fixes</li>
                <li>Template updates when client process changes</li>
                <li>Basic reporting review and improvement suggestions</li>
                <li>Optional expansion to new workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Use this demo with construction leads before outreach: show the workflow
        idea, offer a free process audit, then propose implementation and monthly
        support.
      </div>
    </section>
  );
}
