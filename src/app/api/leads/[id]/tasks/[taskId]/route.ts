import { NextResponse } from "next/server";
import { getLeadTaskForLead, updateLeadTask } from "@/lib/tasks";

type RouteParams = { params: Promise<{ id: string; taskId: string }> };

function parseIds(id: string, taskId: string) {
  const leadId = parseInt(id, 10);
  const parsedTaskId = parseInt(taskId, 10);
  if (isNaN(leadId) || isNaN(parsedTaskId)) return null;
  return { leadId, taskId: parsedTaskId };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, taskId } = await params;
    const ids = parseIds(id, taskId);
    if (!ids) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const existing = getLeadTaskForLead(ids.leadId, ids.taskId);
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates: {
      title?: string;
      due_date?: string;
      completed?: boolean;
    } = {};

    if (body.title !== undefined) {
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }
      updates.title = title;
    }

    if (body.due_date !== undefined) {
      const dueDate = typeof body.due_date === "string" ? body.due_date : "";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || isNaN(Date.parse(dueDate))) {
        return NextResponse.json(
          { error: "Valid due date is required (YYYY-MM-DD)" },
          { status: 400 }
        );
      }
      updates.due_date = dueDate;
    }

    if (body.completed !== undefined) {
      if (typeof body.completed !== "boolean") {
        return NextResponse.json(
          { error: "Completed must be a boolean" },
          { status: 400 }
        );
      }
      updates.completed = body.completed;
    }

    const task = updateLeadTask(ids.taskId, updates);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("PATCH /api/leads/[id]/tasks/[taskId] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
