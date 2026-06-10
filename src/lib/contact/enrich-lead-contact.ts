import { createLeadActivity } from "../activities";
import { updateLead } from "../leads";
import type { Lead } from "../types";
import { normalizeWebsite } from "../website";
import { discoverContactFromWebsite } from "./discover-contact";
import type { ContactDiscoveryResult } from "./types";

export function shouldDiscoverContact(lead: Lead): boolean {
  if (!lead.website?.trim()) {
    return false;
  }

  return !lead.email?.trim() || !lead.phone?.trim() || !lead.contact_page_url?.trim();
}

export function buildContactDiscoveryUpdate(
  lead: Lead,
  discovery: ContactDiscoveryResult
): {
  email?: string;
  phone?: string;
  contact_page_url?: string;
  email_confidence?: number;
  phone_confidence?: number;
} | null {
  const updates: {
    email?: string;
    phone?: string;
    contact_page_url?: string;
    email_confidence?: number;
    phone_confidence?: number;
  } = {};

  if (!lead.email?.trim() && discovery.email?.value) {
    updates.email = discovery.email.value;
    updates.email_confidence = discovery.email.confidence;
  }

  if (!lead.phone?.trim() && discovery.phone?.value) {
    updates.phone = discovery.phone.value;
    updates.phone_confidence = discovery.phone.confidence;
  }

  if (!lead.contact_page_url?.trim() && discovery.contactPageUrl) {
    updates.contact_page_url = discovery.contactPageUrl;
  }

  return Object.keys(updates).length > 0 ? updates : null;
}

export async function enrichLeadWithDiscoveredContact(lead: Lead): Promise<Lead> {
  if (!shouldDiscoverContact(lead)) {
    return lead;
  }

  const website = normalizeWebsite(lead.website ?? "");
  if (!website) {
    return lead;
  }

  const discovery = await discoverContactFromWebsite(website);
  const updates = buildContactDiscoveryUpdate(lead, discovery);

  if (!updates) {
    return lead;
  }

  const updated = updateLead(lead.id, updates);
  if (!updated) {
    return lead;
  }

  createLeadActivity(lead.id, "contact_discovered", {
    email: updates.email ?? null,
    phone: updates.phone ?? null,
    contactPageUrl: updates.contact_page_url ?? null,
    emailConfidence: updates.email_confidence ?? null,
    phoneConfidence: updates.phone_confidence ?? null,
    pagesCrawled: discovery.pagesCrawled,
  });

  return updated;
}
