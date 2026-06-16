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
  }),
);

export function getTemplatePack(id: TemplatePackId): TemplatePack {
  return templatePackRegistry[id];
}
