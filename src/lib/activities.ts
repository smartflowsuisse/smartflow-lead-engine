import { getDb } from "./db";
import type { LeadActivity, LeadActivityType } from "./types";

function rowToActivity(row: Record<string, unknown>): LeadActivity {
  let details: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(row.details as string);
    if (parsed && typeof parsed === "object") {
      details = parsed as Record<string, unknown>;
    }
  } catch {
    details = {};
  }

  return {
    id: row.id as number,
    lead_id: row.lead_id as number,
    activity_type: row.activity_type as LeadActivityType,
    details,
    created_at: row.created_at as string,
  };
}

export function createLeadActivity(
  leadId: number,
  activityType: LeadActivityType,
  details: Record<string, unknown> = {}
): LeadActivity {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO lead_activities (lead_id, activity_type, details)
       VALUES (@leadId, @activityType, @details)`
    )
    .run({
      leadId,
      activityType,
      details: JSON.stringify(details),
    });

  const row = db
    .prepare("SELECT * FROM lead_activities WHERE id = ?")
    .get(result.lastInsertRowid);

  return rowToActivity(row as Record<string, unknown>);
}

export function getActivitiesByLeadId(leadId: number): LeadActivity[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM lead_activities
       WHERE lead_id = ?
       ORDER BY created_at DESC, id DESC`
    )
    .all(leadId);

  return rows.map((row) => rowToActivity(row as Record<string, unknown>));
}
