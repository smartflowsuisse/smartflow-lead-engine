import { hasLeadEmail } from "./list-view";
import type { Lead } from "../types";

export const LEAD_EMAIL_GENERATOR_HASH = "email-generator";

export function getLeadDetailsPath(leadId: number): string {
  return `/leads/${leadId}`;
}

export function getLeadEmailGeneratorPath(leadId: number): string {
  return `${getLeadDetailsPath(leadId)}#${LEAD_EMAIL_GENERATOR_HASH}`;
}

export function getCopyableLeadEmail(
  email: string | null | undefined
): string | null {
  const trimmed = email?.trim();
  return trimmed ? trimmed : null;
}

export function canCopyLeadEmail(lead: Pick<Lead, "email">): boolean {
  return hasLeadEmail(lead);
}
