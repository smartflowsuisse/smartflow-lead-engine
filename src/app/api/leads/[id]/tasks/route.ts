import { NextResponse } from "next/server";
import { getLeadById } from "@/lib/leads";
import { createLeadTask, getTasksByLeadId } from "@/lib/tasks";

type RouteParams = { params: Promise<{ id: string }> };

function parseLeadId(id: string): number | null {
  const leadId = parseInt(id, 10);
  return isNaN(leadId) ? null : leadId;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseLeadId(id);
    if (leadId === null) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(getTasksByLeadId(leadId));
  } catch (error) {
    console.error("GET /api/leads/[id]/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseLeadId(id);
    if (leadId === null) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const dueDate = typeof body.due_date === "string" ? body.due_date : "";

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!isValidDate(dueDate)) {
      return NextResponse.json(
        { error: "Valid due date is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const task = createLeadTask(leadId, { title, due_date: dueDate });
    if (!task) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads/[id]/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
