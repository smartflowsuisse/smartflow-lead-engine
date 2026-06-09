import { NextResponse } from "next/server";
import {
  buildOutreachInput,
  generateOutreachDraft,
} from "@/lib/outreach/generate-outreach";
import { getLeadById } from "@/lib/leads";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const input = buildOutreachInput(lead, lead.analysis);
    const draft = generateOutreachDraft(input);

    return NextResponse.json(draft);
  } catch (error) {
    console.error("POST /api/leads/[id]/outreach error:", error);
    return NextResponse.json(
      { error: "Failed to generate outreach draft" },
      { status: 500 }
    );
  }
}
