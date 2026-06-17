export interface OutreachSessionLead {
  id: number | string;
  company?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  industry?: string | null;
  lead_score?: number | null;
  status?: string | null;
  outreach_status?: string | null;
}

const CLOSED_STATUSES = new Set(["Won", "Lost"]);
const BLOCKED_OUTREACH_STATUSES = new Set(["Contacted", "Won", "Lost"]);

export function hasOutreachContactChannel(lead: OutreachSessionLead): boolean {
  return Boolean(lead.email?.trim() || lead.phone?.trim() || lead.website?.trim());
}

export function isOutreachSessionLead(lead: OutreachSessionLead): boolean {
  const score = lead.lead_score ?? 0;

  if (score < 45) {
    return false;
  }

  if (lead.status && CLOSED_STATUSES.has(lead.status)) {
    return false;
  }

  if (lead.outreach_status && BLOCKED_OUTREACH_STATUSES.has(lead.outreach_status)) {
    return false;
  }

  return hasOutreachContactChannel(lead);
}

export function sortOutreachSessionLeads(
  leads: OutreachSessionLead[],
): OutreachSessionLead[] {
  return [...leads]
    .filter(isOutreachSessionLead)
    .sort((left, right) => {
      const scoreDiff = (right.lead_score ?? 0) - (left.lead_score ?? 0);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return String(left.company ?? "").localeCompare(String(right.company ?? ""));
    });
}

export function getOutreachSessionContext(lead: OutreachSessionLead): string {
  return [lead.city, lead.industry].filter(Boolean).join(" · ");
}

export function buildOutreachSessionSubject(lead: OutreachSessionLead): string {
  const industry = lead.industry?.toLowerCase().includes("bau")
    ? "Bau Automation Starter"
    : "Construction Automation Starter";

  return `Free workflow audit — ${industry}`;
}

export function buildOutreachSessionEmail(lead: OutreachSessionLead): string {
  const company = lead.company?.trim() || "your company";
  const context = getOutreachSessionContext(lead);

  return [
    `Hello ${company},`,
    "",
    "I noticed that many construction and project-based companies lose time on invoices, project follow-ups, procurement tracking, and weekly reporting.",
    "SmartFlow Suisse has prepared a Construction Automation Starter with ready-to-demo workflows for invoice PDF extraction, project task follow-ups, and procurement reports.",
    "We can offer a free workflow audit and show where automation could save time before proposing any implementation.",
    "",
    context ? `Context: ${context}.` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildMailtoHref(lead: OutreachSessionLead): string | null {
  const email = lead.email?.trim();

  if (!email) {
    return null;
  }

  const subject = encodeURIComponent(buildOutreachSessionSubject(lead));
  const body = encodeURIComponent(buildOutreachSessionEmail(lead));

  return `mailto:${email}?subject=${subject}&body=${body}`;
}
