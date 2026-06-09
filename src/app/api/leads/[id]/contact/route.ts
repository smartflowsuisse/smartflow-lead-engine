import { NextResponse } from "next/server";
import { markLeadAsContacted } from "@/lib/leads";
import { parseOutreachLanguage } from "@/lib/outreach/languages";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const language = parseOutreachLanguage(body.language);

    const lead = markLeadAsContacted(leadId, language);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("POST /api/leads/[id]/contact error:", error);
    return NextResponse.json(
      { error: "Failed to mark lead as contacted" },
      { status: 500 }
    );
  }
}
