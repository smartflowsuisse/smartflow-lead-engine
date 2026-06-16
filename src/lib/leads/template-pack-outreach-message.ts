import type { TemplatePackId } from "../templates/template-pack-registry";
import { getTemplatePack } from "../templates/template-pack-registry";

export type OutreachMessageLanguage = "en" | "fr" | "de";

export interface TemplatePackOutreachLead {
  company?: string | null;
  website?: string | null;
  email?: string | null;
  city?: string | null;
  industry?: string | null;
}

export interface TemplatePackOutreachMessageInput {
  lead: TemplatePackOutreachLead;
  templatePackId: TemplatePackId;
  language?: OutreachMessageLanguage;
}

function getLeadDisplayName(lead: TemplatePackOutreachLead): string {
  return (
    lead.company?.trim() ||
    lead.website?.trim() ||
    lead.email?.trim() ||
    "your company"
  );
}

function getLeadContextLine(lead: TemplatePackOutreachLead): string {
  const details = [lead.city?.trim(), lead.industry?.trim()].filter(Boolean);

  return details.join(" · ");
}

function normalizeBaseMessage(message: string): string {
  return message
    .replace(/^Hello,\s*/i, "")
    .replace(/^Bonjour,\s*/i, "")
    .replace(/^Guten Tag,\s*/i, "")
    .trim();
}

export function buildTemplatePackOutreachMessage({
  lead,
  templatePackId,
  language = "en",
}: TemplatePackOutreachMessageInput): string {
  const pack = getTemplatePack(templatePackId);
  const rawBaseMessage = pack.auditMessages[language] ?? pack.auditMessages.en;
  const baseMessage = normalizeBaseMessage(rawBaseMessage);
  const leadName = getLeadDisplayName(lead);
  const contextLine = getLeadContextLine(lead);

  const greeting =
    language === "fr"
      ? `Bonjour ${leadName},`
      : language === "de"
        ? `Guten Tag ${leadName},`
        : `Hello ${leadName},`;

  const context =
    contextLine.length === 0
      ? ""
      : language === "fr"
        ? `\n\nContexte: ${contextLine}.`
        : language === "de"
          ? `\n\nKontext: ${contextLine}.`
          : `\n\nContext: ${contextLine}.`;

  return `${greeting}\n\n${baseMessage}${context}`.trim();
}

export function buildTemplatePackOutreachSubject(
  templatePackId: TemplatePackId,
  language: OutreachMessageLanguage = "en",
): string {
  const pack = getTemplatePack(templatePackId);

  if (language === "fr") {
    return `Audit gratuit — ${pack.offerName}`;
  }

  if (language === "de") {
    return `Kostenloser Audit — ${pack.offerName}`;
  }

  return `Free workflow audit — ${pack.offerName}`;
}

export function buildTemplatePackOutreachEmail(
  input: TemplatePackOutreachMessageInput,
): string {
  const language = input.language ?? "en";
  const subject = buildTemplatePackOutreachSubject(
    input.templatePackId,
    language,
  );
  const message = buildTemplatePackOutreachMessage({
    ...input,
    language,
  });

  return `Subject: ${subject}\n\n${message}`;
}

export function buildTemplatePackOutreachMailtoHref(
  input: TemplatePackOutreachMessageInput,
): string | null {
  const recipient = input.lead.email?.trim();

  if (!recipient) {
    return null;
  }

  const language = input.language ?? "en";
  const subject = buildTemplatePackOutreachSubject(
    input.templatePackId,
    language,
  );
  const body = buildTemplatePackOutreachMessage({
    ...input,
    language,
  });

  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
