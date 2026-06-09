import { NextResponse } from "next/server";
import { runDiscovery, validateDiscoveryQuery } from "@/lib/discovery/discover";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = validateDiscoveryQuery({
      industry: body.industry,
      city: body.city,
      limit: body.limit,
    });

    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const result = await runDiscovery(validated.query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/discovery/search error:", error);
    const message =
      error instanceof Error ? error.message : "Discovery search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
