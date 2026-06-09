import { NextResponse } from "next/server";
import { getAllLeads, createLead } from "@/lib/leads";
import type { LeadStatus } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeadStatus | null;
    const leads = getAllLeads(status ?? undefined);
    return NextResponse.json(leads);
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.company || typeof body.company !== "string") {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const lead = createLead({
      company: body.company.trim(),
      website: body.website?.trim() || undefined,
      email: body.email?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      city: body.city?.trim() || undefined,
      industry: body.industry?.trim() || undefined,
      status: body.status || undefined,
      notes: body.notes?.trim() || undefined,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
