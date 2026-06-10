import { NextResponse } from "next/server";
import { importDiscoveryCandidate } from "@/lib/discovery/import";
import type { DiscoveryCandidate } from "@/lib/discovery/types";

function parseCandidate(body: unknown): DiscoveryCandidate | null {
  if (!body || typeof body !== "object") return null;

  const candidate = body as Partial<DiscoveryCandidate>;
  if (!candidate.company || typeof candidate.company !== "string") return null;
  if (!candidate.website || typeof candidate.website !== "string") return null;
  if (!candidate.city || typeof candidate.city !== "string") return null;
  if (!candidate.industry || typeof candidate.industry !== "string") return null;

  return {
    company: candidate.company.trim(),
    website: candidate.website.trim(),
    city: candidate.city.trim(),
    industry: candidate.industry.trim(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidate = parseCandidate(body);

    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid discovery candidate" },
        { status: 400 }
      );
    }

    const result = await importDiscoveryCandidate(candidate);

    if (!result.ok && result.duplicate) {
      return NextResponse.json(result, { status: 409 });
    }

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/discovery/import error:", error);
    return NextResponse.json(
      { error: "Failed to import lead" },
      { status: 500 }
    );
  }
}
