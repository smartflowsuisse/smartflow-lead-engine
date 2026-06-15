"use client";

import Link from "next/link";
import { useState } from "react";

const auditMessage =
  "Hello, I noticed that many construction companies lose time on invoices, project follow-ups, procurement tracking, and weekly reporting. SmartFlow Suisse has prepared a Construction Automation Starter with ready-to-demo workflows for invoice PDF extraction, project task follow-ups, and procurement reports. We can offer a free workflow audit and show where automation could save time before proposing any implementation.";

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

export function ConstructionTemplatesPanel() {
  const [copied, setCopied] = useState(false);

  async function copyAuditMessage() {
    try {
      await navigator.clipboard.writeText(auditMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
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
          <p className="mt-1 text-slate-700">CHF 6&apos;000–12&apos;000 + retainer</p>
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

      <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Use this demo with construction leads before outreach: show the workflow
        idea, offer a free process audit, then propose implementation and monthly
        support.
      </div>
    </section>
  );
}
