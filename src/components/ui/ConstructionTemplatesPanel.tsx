"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getTemplatePack,
  templatePackOptions,
  type TemplatePackId,
} from "@/lib/templates/template-pack-registry";

type AuditLanguage = "en" | "fr" | "de";

const defaultClientDeliveryPack = {
  clientProvides: [
    "Sample invoices and supplier documents",
    "Project notes, purchase lists, and weekly reports",
    "Current tools: email, accounting, CRM, spreadsheet, or PM system",
    "Approval rules and responsible team members",
  ],
  smartflowDelivers: [
    "Configured invoice, task, or reporting workflow",
    "AI-assisted document review and structured output",
    "Tested automation with real client documents",
    "Owner/admin training and monthly support path",
  ],
  timeline: [
    "Day 1: workflow audit and data collection",
    "Day 2–3: workflow setup and AI extraction test",
    "Day 4: client validation and corrections",
    "Day 5: delivery, training, and support setup",
  ],
  monthlySupport: [
    "Workflow monitoring and small fixes",
    "Template updates when client process changes",
    "Basic reporting review and improvement suggestions",
    "Optional expansion to new workflows",
  ],
};

function buildImplementationPlan(offerName: string, steps: readonly { title: string; description: string }[]) {
  return [
    `${offerName} — Implementation Plan`,
    "",
    ...steps.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`),
  ].join("\n");
}

function buildProposalSummary(pack: ReturnType<typeof getTemplatePack>) {
  if (pack.proposalSummary) {
    return pack.proposalSummary;
  }

  return [
    `${pack.offerName} — Proposal Summary`,
    "",
    `We can help ${pack.industry.toLowerCase()} reduce manual work with clear automation workflows.`,
    "",
    "Package:",
    ...pack.templates.map((template) => `- ${template.title}`),
    "- Implementation checklist from workflow audit to monthly support",
    "",
    "Offer range:",
    pack.offerRange,
    "",
    "Next step:",
    "Free workflow audit to identify where automation can save time before implementation.",
  ].join("\n");
}

function buildClientIntakeChecklist(pack: ReturnType<typeof getTemplatePack>) {
  if (pack.clientIntakeChecklist) {
    return pack.clientIntakeChecklist;
  }

  return [
    `${pack.offerName} — Client Intake Checklist`,
    "",
    "Please prepare the following before the workflow audit:",
    "",
    "1. Sample documents",
    "2. Current workflow notes",
    "3. Current tools used by the team",
    "4. Existing reports or files",
    "5. Approval rules and responsible team members",
    "6. Main pain points: delays, manual work, missing data, errors, or unclear responsibilities",
    "",
    "Goal:",
    "Use these materials to identify where automation can save time before implementation.",
  ].join("\n");
}

export function ConstructionTemplatesPanel() {
  const [selectedPackId, setSelectedPackId] = useState<TemplatePackId>("construction");
  const [copied, setCopied] = useState(false);
  const [planCopied, setPlanCopied] = useState(false);
  const [proposalCopied, setProposalCopied] = useState(false);
  const [intakeCopied, setIntakeCopied] = useState(false);
  const [language, setLanguage] = useState<AuditLanguage>("en");

  const selectedPack = getTemplatePack(selectedPackId);
  const auditMessage = selectedPack.auditMessages[language] ?? selectedPack.auditMessages.en;
  const languageLabels = selectedPack.languageLabels;
  const templates = selectedPack.templates;
  const implementationSteps = selectedPack.implementationSteps;
  const implementationPlan = buildImplementationPlan(selectedPack.offerName, implementationSteps);
  const proposalSummary = buildProposalSummary(selectedPack);
  const clientIntakeChecklist = buildClientIntakeChecklist(selectedPack);

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
    <section className="mx-auto max-w-5xl px-6 py-8">
      <Link href="/" className="text-sm font-medium text-brand-700 hover:text-brand-900">
        ← Back to Dashboard
      </Link>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          Workflow templates
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Automation Template Packs
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Select an industry package, review ready-to-demo workflows, copy outreach text,
          and prepare the client implementation path.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Template pack
        </p>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {templatePackOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setSelectedPackId(option.id);
                setCopied(false);
                setPlanCopied(false);
                setProposalCopied(false);
                setIntakeCopied(false);
              }}
              className={`rounded-lg border p-4 text-left transition ${
                selectedPackId === option.id
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {option.offerRange}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    selectedPackId === option.id
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedPackId === option.id ? "Selected" : "Choose"}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs leading-5">
                <p>
                  <span className="font-semibold text-slate-700">
                    Best for:{" "}
                  </span>
                  <span className="text-slate-600">{option.bestFor}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-700">
                    Pain:{" "}
                  </span>
                  <span className="text-slate-600">{option.typicalPain}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-700">
                    Demo:{" "}
                  </span>
                  <span className="text-slate-600">{option.demoAngle}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Demo product
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {selectedPack.offerName}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Ready-to-demo workflow templates for {selectedPack.industry.toLowerCase()}:
              {templates.map((template) => ` ${template.title}`).join(", ")}.
            </p>
          </div>

          <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm">
            <p className="font-semibold text-brand-700">Offer range</p>
            <p className="mt-1 text-slate-700">{selectedPack.offerRange}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/leads"
            className="inline-flex items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
          >
            Review leads
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

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
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

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
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

            <div className="flex flex-wrap gap-2">
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
              <button
                type="button"
                onClick={() => void copyClientIntakeChecklist()}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {intakeCopied ? "Client intake copied" : "Copy client intake checklist"}
              </button>
            </div>
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
                <p className="text-xs leading-5 text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Client Delivery Pack</h3>
          <p className="mt-1 text-xs text-slate-500">
            Use this as the client-facing delivery structure after the first workflow audit.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Client provides
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                {defaultClientDeliveryPack.clientProvides.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                SmartFlow delivers
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                {defaultClientDeliveryPack.smartflowDelivers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Delivery timeline
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                {defaultClientDeliveryPack.timeline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Monthly support
              </h4>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                {defaultClientDeliveryPack.monthlySupport.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
          Use this demo with {selectedPack.label.toLowerCase()} leads before outreach:
          show the workflow idea, offer a free process audit, then propose implementation
          and monthly support.
        </div>
      </div>
    </section>
  );
}
