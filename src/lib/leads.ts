import { getDb } from "./db";
import {
  scoreFromDb,
  scoreToDb,
  triStateFromDb,
  triStateToDb,
} from "./analysis/score-values";
import type {
  CreateLeadInput,
  DashboardStats,
  Lead,
  LeadAnalysis,
  LeadSearchFilters,
  LeadStatus,
  LeadWithAnalysis,
  UpdateLeadInput,
} from "./types";
import { LEAD_STATUSES } from "./types";
import {
  normalizeCompany,
  normalizeWebsite,
} from "./discovery/dedup";
import { createLeadActivity } from "./activities";
import { parseOutreachLanguage } from "./outreach/languages";
import { normalizeLeadStatus } from "./leads/lead-status";
import {
  calculateLeadScore,
  leadAnalysisToWebsiteResult,
} from "./scoring";

const POST_CONTACT_STATUSES: LeadStatus[] = [
  "Contacted",
  "Replied",
  "Meeting",
  "Proposal",
  "Won",
  "Lost",
];

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as number,
    company: row.company as string,
    website: (row.website as string) ?? null,
    email: (row.email as string) ?? null,
    phone: (row.phone as string) ?? null,
    city: (row.city as string) ?? null,
    industry: (row.industry as string) ?? null,
    lead_score: row.lead_score as number,
    status: normalizeLeadStatus(row.status as string),
    outreach_status: (row.outreach_status as Lead["outreach_status"]) ?? "New",
    notes: (row.notes as string) ?? null,
    contacted_at: (row.contacted_at as string) ?? null,
    contacted_language: (row.contacted_language as string) ?? null,
    contact_page_url: (row.contact_page_url as string) ?? null,
    email_confidence:
      typeof row.email_confidence === "number"
        ? row.email_confidence
        : row.email_confidence != null
          ? Number(row.email_confidence)
          : null,
    phone_confidence:
      typeof row.phone_confidence === "number"
        ? row.phone_confidence
        : row.phone_confidence != null
          ? Number(row.phone_confidence)
          : null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function rowToAnalysis(row: Record<string, unknown>): LeadAnalysis {
  return {
    id: row.id as number,
    lead_id: row.lead_id as number,
    website_quality: scoreFromDb(row.website_quality as number),
    mobile_friendliness: scoreFromDb(row.mobile_friendliness as number),
    speed_score: scoreFromDb(row.speed_score as number),
    seo_score: scoreFromDb(row.seo_score as number),
    has_contact_form: triStateFromDb(row.has_contact_form as number),
    trust_score: scoreFromDb(row.trust_score as number),
    quick_wins: row.quick_wins as string,
    automation_opportunities: row.automation_opportunities as string,
    raw_analysis: row.raw_analysis as string,
    analyzed_at: row.analyzed_at as string,
  };
}

export function searchLeads(filters: LeadSearchFilters = {}): Lead[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters.status) {
    conditions.push("status = @status");
    params.status = filters.status;
  }

  if (filters.q) {
    conditions.push(`(
      company LIKE @q OR
      city LIKE @q OR
      industry LIKE @q OR
      email LIKE @q OR
      website LIKE @q OR
      phone LIKE @q OR
      notes LIKE @q
    )`);
    params.q = `%${filters.q}%`;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT * FROM leads ${where} ORDER BY lead_score DESC, created_at DESC`
    )
    .all(params);

  return rows.map((row) => rowToLead(row as Record<string, unknown>));
}

export function getOutreachQueueLeads(): Lead[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM leads
       WHERE lead_score >= 45
         AND (
           (email IS NOT NULL AND trim(email) != '')
           OR (phone IS NOT NULL AND trim(phone) != '')
         )
       ORDER BY lead_score DESC, created_at DESC`
    )
    .all();

  return rows.map((row) => rowToLead(row as Record<string, unknown>));
}

export function getAnalyzedLeadIdSet(): Set<number> {
  const db = getDb();
  const rows = db
    .prepare("SELECT lead_id FROM lead_analyses")
    .all() as Array<{ lead_id: number }>;

  return new Set(rows.map((row) => row.lead_id));
}

export function getAllLeads(status?: LeadStatus): Lead[] {
  return searchLeads(status ? { status } : {});
}

export function findDuplicateLead(input: {
  company: string;
  website?: string | null;
}): Lead | null {
  const db = getDb();
  const normalizedCompany = normalizeCompany(input.company);
  const normalizedWebsite = input.website
    ? normalizeWebsite(input.website)
    : null;

  const rows = db.prepare("SELECT * FROM leads").all();

  for (const row of rows) {
    const lead = rowToLead(row as Record<string, unknown>);

    if (
      normalizedWebsite &&
      lead.website &&
      normalizeWebsite(lead.website) === normalizedWebsite
    ) {
      return lead;
    }

    if (normalizeCompany(lead.company) === normalizedCompany) {
      return lead;
    }
  }

  return null;
}

export function getLeadById(id: number): LeadWithAnalysis | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!row) return null;

  const lead = rowToLead(row as Record<string, unknown>);
  const analysisRow = db
    .prepare("SELECT * FROM lead_analyses WHERE lead_id = ?")
    .get(id);

  return {
    ...lead,
    analysis: analysisRow
      ? rowToAnalysis(analysisRow as Record<string, unknown>)
      : null,
  };
}

export function createLead(input: CreateLeadInput): Lead {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO leads (company, website, email, phone, city, industry, status, notes)
       VALUES (@company, @website, @email, @phone, @city, @industry, @status, @notes)`
    )
    .run({
      company: input.company,
      website: input.website ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      city: input.city ?? null,
      industry: input.industry ?? null,
      status: input.status ?? "New",
      notes: input.notes ?? null,
    });

  const lead = getLeadById(result.lastInsertRowid as number);
  return lead!;
}

export function updateLead(id: number, input: UpdateLeadInput): Lead | null {
  const db = getDb();
  const existing = getLeadById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE leads SET
      company = @company,
      website = @website,
      email = @email,
      phone = @phone,
      city = @city,
      industry = @industry,
      lead_score = @lead_score,
      status = @status,
      outreach_status = @outreach_status,
      notes = @notes,
      contact_page_url = @contact_page_url,
      email_confidence = @email_confidence,
      phone_confidence = @phone_confidence,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    company: input.company ?? existing.company,
    website: input.website !== undefined ? input.website : existing.website,
    email: input.email !== undefined ? input.email : existing.email,
    phone: input.phone !== undefined ? input.phone : existing.phone,
    city: input.city !== undefined ? input.city : existing.city,
    industry: input.industry !== undefined ? input.industry : existing.industry,
    lead_score: input.lead_score ?? existing.lead_score,
    status: input.status ?? existing.status,
    outreach_status: input.outreach_status ?? existing.outreach_status,
    notes: input.notes !== undefined ? input.notes : existing.notes,
    contact_page_url:
      input.contact_page_url !== undefined
        ? input.contact_page_url
        : existing.contact_page_url,
    email_confidence:
      input.email_confidence !== undefined
        ? input.email_confidence
        : existing.email_confidence,
    phone_confidence:
      input.phone_confidence !== undefined
        ? input.phone_confidence
        : existing.phone_confidence,
  });

  return getLeadById(id);
}

export function persistLeadScore(leadId: number): number {
  const lead = getLeadById(leadId);
  if (!lead) {
    return 0;
  }

  const analysis = lead.analysis
    ? leadAnalysisToWebsiteResult(lead.analysis)
    : null;
  const leadScore = calculateLeadScore(lead, analysis);

  updateLead(leadId, { lead_score: leadScore });
  return leadScore;
}

export function deleteLead(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);
  return result.changes > 0;
}

export function saveLeadAnalysis(
  leadId: number,
  analysis: {
    websiteQuality: number | null;
    mobileFriendliness: number | null;
    speedScore: number | null;
    seoScore: number | null;
    hasContactForm: boolean | null;
    trustScore: number | null;
    quickWins: string[];
    automationOpportunities: string[];
    rawAnalysis: Record<string, unknown>;
    leadScore: number;
  }
): LeadAnalysis {
  const db = getDb();

  db.prepare(
    `INSERT INTO lead_analyses (
      lead_id, website_quality, mobile_friendliness, speed_score, seo_score,
      has_contact_form, trust_score, quick_wins, automation_opportunities, raw_analysis
    ) VALUES (
      @leadId, @websiteQuality, @mobileFriendliness, @speedScore, @seoScore,
      @hasContactForm, @trustScore, @quickWins, @automationOpportunities, @rawAnalysis
    )
    ON CONFLICT(lead_id) DO UPDATE SET
      website_quality = excluded.website_quality,
      mobile_friendliness = excluded.mobile_friendliness,
      speed_score = excluded.speed_score,
      seo_score = excluded.seo_score,
      has_contact_form = excluded.has_contact_form,
      trust_score = excluded.trust_score,
      quick_wins = excluded.quick_wins,
      automation_opportunities = excluded.automation_opportunities,
      raw_analysis = excluded.raw_analysis,
      analyzed_at = datetime('now')`
  ).run({
    leadId,
    websiteQuality: scoreToDb(analysis.websiteQuality),
    mobileFriendliness: scoreToDb(analysis.mobileFriendliness),
    speedScore: scoreToDb(analysis.speedScore),
    seoScore: scoreToDb(analysis.seoScore),
    hasContactForm: triStateToDb(analysis.hasContactForm),
    trustScore: scoreToDb(analysis.trustScore),
    quickWins: JSON.stringify(analysis.quickWins),
    automationOpportunities: JSON.stringify(analysis.automationOpportunities),
    rawAnalysis: JSON.stringify(analysis.rawAnalysis),
  });

  const existing = getLeadById(leadId);
  const preserveStatus =
    existing && POST_CONTACT_STATUSES.includes(existing.status);

  if (preserveStatus) {
    db.prepare(
      `UPDATE leads SET lead_score = @leadScore, updated_at = datetime('now') WHERE id = @leadId`
    ).run({ leadId, leadScore: analysis.leadScore });
  } else {
    db.prepare(
      `UPDATE leads SET lead_score = @leadScore, status = 'Analyzed', updated_at = datetime('now') WHERE id = @leadId`
    ).run({ leadId, leadScore: analysis.leadScore });
  }

  const row = db
    .prepare("SELECT * FROM lead_analyses WHERE lead_id = ?")
    .get(leadId);
  const saved = rowToAnalysis(row as Record<string, unknown>);

  createLeadActivity(leadId, "analysis_completed", {
    leadScore: analysis.leadScore,
  });

  return saved;
}

export function markLeadAsContacted(
  leadId: number,
  languageInput: string
): Lead | null {
  const db = getDb();
  const existing = getLeadById(leadId);
  if (!existing) return null;

  const language = parseOutreachLanguage(languageInput);

  db.prepare(
    `UPDATE leads SET
      status = 'Contacted',
      contacted_at = datetime('now'),
      contacted_language = @language,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({ id: leadId, language });

  createLeadActivity(leadId, "contacted", { language });

  return getLeadById(leadId);
}

export function getDashboardStats(): DashboardStats {
  const db = getDb();

  const totalLeads = (
    db.prepare("SELECT COUNT(*) as count FROM leads").get() as { count: number }
  ).count;

  const byStatus = {} as Record<LeadStatus, number>;
  for (const status of LEAD_STATUSES) {
    byStatus[status] = 0;
  }

  const statusRows = db
    .prepare("SELECT status, COUNT(*) as count FROM leads GROUP BY status")
    .all() as Array<{ status: string; count: number }>;

  for (const row of statusRows) {
    const normalized = normalizeLeadStatus(row.status);
    byStatus[normalized] += row.count;
  }

  const avgRow = db
    .prepare("SELECT AVG(lead_score) as avg FROM leads WHERE lead_score > 0")
    .get() as { avg: number | null };

  const analyzedCount = (
    db.prepare("SELECT COUNT(*) as count FROM lead_analyses").get() as {
      count: number;
    }
  ).count;

  const wonCount = byStatus["Won"];
  const conversionRate =
    totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

  const highPriorityLeads = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM leads WHERE lead_score >= 65 AND status NOT IN ('Won', 'Proposal', 'Lost', 'Client', 'Proposal Sent')"
      )
      .get() as { count: number }
  ).count;

  const recentRows = db
    .prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 5")
    .all();

  return {
    totalLeads,
    byStatus,
    averageScore: Math.round(avgRow.avg ?? 0),
    analyzedCount,
    conversionRate,
    highPriorityLeads,
    recentLeads: recentRows.map((row) =>
      rowToLead(row as Record<string, unknown>)
    ),
  };
}

export function getLeadsByPipeline(): Record<LeadStatus, Lead[]> {
  const pipeline = {} as Record<LeadStatus, Lead[]>;
  for (const status of LEAD_STATUSES) {
    pipeline[status] = getAllLeads(status);
  }
  return pipeline;
}
