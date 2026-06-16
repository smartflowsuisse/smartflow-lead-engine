import {
  auditMessages as constructionAuditMessages,
  implementationSteps as constructionImplementationSteps,
  languageLabels as constructionLanguageLabels,
  templates as constructionTemplates,
} from "./construction-template-pack";

import {
  retailAuditMessages,
  retailClientIntakeChecklist,
  retailImplementationSteps,
  retailLanguageLabels,
  retailProposalSummary,
  retailTemplates,
} from "./retail-template-pack";

import {
  fiduciaryAuditMessages,
  fiduciaryClientIntakeChecklist,
  fiduciaryImplementationSteps,
  fiduciaryLanguageLabels,
  fiduciaryProposalSummary,
  fiduciaryTemplates,
} from "./fiduciary-template-pack";

export type TemplatePackId = "construction" | "retail" | "fiduciary";

export type TemplatePack = {
  id: TemplatePackId;
  label: string;
  industry: string;
  offerName: string;
  offerRange: string;
  bestFor: string;
  typicalPain: string;
  demoAngle: string;
  languages: readonly string[];
  auditMessages: Record<string, string>;
  languageLabels: Record<string, string>;
  templates: readonly {
    title: string;
    description: string;
    outcome: string;
    value: string;
  }[];
  implementationSteps: readonly {
    title: string;
    description: string;
  }[];
  proposalSummary?: string;
  clientIntakeChecklist?: string;
};

export const templatePackRegistry: Record<TemplatePackId, TemplatePack> = {
  construction: {
    id: "construction",
    label: "Construction",
    industry: "Construction companies",
    offerName: "Construction Automation Starter",
    offerRange: "CHF 6'000–12'000 + monthly support retainer",
    bestFor: "Construction companies with invoice, project, procurement, and reporting follow-ups.",
    typicalPain: "Lost time on invoices, missing documents, project follow-ups, purchase tracking, and weekly reports.",
    demoAngle: "Show how one invoice or project note becomes a clean task, report, or review-ready summary.",
    languages: ["en", "fr", "de"],
    auditMessages: constructionAuditMessages,
    languageLabels: constructionLanguageLabels,
    templates: constructionTemplates,
    implementationSteps: constructionImplementationSteps,
    proposalSummary: undefined,
    clientIntakeChecklist: undefined,
  },
  retail: {
    id: "retail",
    label: "Retail",
    industry: "Retail businesses and stores",
    offerName: "Retail Automation Starter",
    offerRange: "CHF 4'000–10'000 + monthly support retainer",
    bestFor: "Retail shops, local stores, and product-heavy businesses with recurring catalog or price updates.",
    typicalPain: "Manual catalog updates, supplier invoices, promotion prices, stock files, and daily reporting.",
    demoAngle: "Show how a supplier file, invoice, or promotion list becomes clean product or reporting data.",
    languages: ["en", "fr", "de"],
    auditMessages: retailAuditMessages,
    languageLabels: retailLanguageLabels,
    templates: retailTemplates,
    implementationSteps: retailImplementationSteps,
    proposalSummary: retailProposalSummary,
    clientIntakeChecklist: retailClientIntakeChecklist,
  },
  fiduciary: {
    id: "fiduciary",
    label: "Fiduciary",
    industry: "Fiduciary and accounting teams",
    offerName: "Fiduciary Automation Starter",
    offerRange: "CHF 5'000–11'000 + monthly support retainer",
    bestFor: "Fiduciary and accounting teams managing recurring client documents and monthly reporting.",
    typicalPain: "Missing client documents, VAT/TVA checks, repeated follow-ups, monthly reporting, and manual review.",
    demoAngle: "Show how client documents become an intake checklist, review queue, and monthly summary.",
    languages: ["en", "fr", "de"],
    auditMessages: fiduciaryAuditMessages,
    languageLabels: fiduciaryLanguageLabels,
    templates: fiduciaryTemplates,
    implementationSteps: fiduciaryImplementationSteps,
    proposalSummary: fiduciaryProposalSummary,
    clientIntakeChecklist: fiduciaryClientIntakeChecklist,
  },
};

export const templatePackOptions = Object.values(templatePackRegistry).map(
  (pack) => ({
    id: pack.id,
    label: pack.label,
    industry: pack.industry,
    offerName: pack.offerName,
    offerRange: pack.offerRange,
    bestFor: pack.bestFor,
    typicalPain: pack.typicalPain,
    demoAngle: pack.demoAngle,
  }),
);

export function getTemplatePack(id: TemplatePackId): TemplatePack {
  return templatePackRegistry[id];
}
