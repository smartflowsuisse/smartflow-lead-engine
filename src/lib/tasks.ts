import { getDb } from "./db";
import { getLeadById } from "./leads";
import type {
  CreateLeadTaskInput,
  LeadTask,
  UpdateLeadTaskInput,
} from "./types";

function rowToTask(row: Record<string, unknown>): LeadTask {
  return {
    id: row.id as number,
    lead_id: row.lead_id as number,
    title: row.title as string,
    due_date: row.due_date as string,
    completed: Boolean(row.completed),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function getTasksByLeadId(leadId: number): LeadTask[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM lead_tasks
       WHERE lead_id = ?
       ORDER BY completed ASC, due_date ASC, created_at ASC`
    )
    .all(leadId);

  return rows.map((row) => rowToTask(row as Record<string, unknown>));
}

export function createLeadTask(
  leadId: number,
  input: CreateLeadTaskInput
): LeadTask | null {
  const lead = getLeadById(leadId);
  if (!lead) return null;

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO lead_tasks (lead_id, title, due_date)
       VALUES (@leadId, @title, @dueDate)`
    )
    .run({
      leadId,
      title: input.title.trim(),
      dueDate: input.due_date,
    });

  return getLeadTaskById(result.lastInsertRowid as number);
}

export function getLeadTaskById(taskId: number): LeadTask | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM lead_tasks WHERE id = ?").get(taskId);
  if (!row) return null;
  return rowToTask(row as Record<string, unknown>);
}

export function updateLeadTask(
  taskId: number,
  input: UpdateLeadTaskInput
): LeadTask | null {
  const existing = getLeadTaskById(taskId);
  if (!existing) return null;

  const db = getDb();
  db.prepare(
    `UPDATE lead_tasks SET
      title = @title,
      due_date = @dueDate,
      completed = @completed,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id: taskId,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    dueDate: input.due_date ?? existing.due_date,
    completed:
      input.completed !== undefined
        ? input.completed
          ? 1
          : 0
        : existing.completed
          ? 1
          : 0,
  });

  return getLeadTaskById(taskId);
}

export function getLeadTaskForLead(
  leadId: number,
  taskId: number
): LeadTask | null {
  const task = getLeadTaskById(taskId);
  if (!task || task.lead_id !== leadId) return null;
  return task;
}
