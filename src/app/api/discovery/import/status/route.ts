import { NextResponse } from "next/server";
import { getImportStatusForCandidates } from "@/lib/discovery/import";
import type { DiscoveryCandidate } from "@/lib/discovery/types";

function parseCandidates(body: unknown): DiscoveryCandidate[] | null {
  if (!body || typeof body !== "object") return null;

  const candidates = (body as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates)) return null;

  const parsed: DiscoveryCandidate[] = [];
  for (const item of candidates) {
    if (!item || typeof item !== "object") continue;
    const c = item as Partial<DiscoveryCandidate>;
    if (
      typeof c.company === "string" &&
      typeof c.website === "string" &&
      typeof c.city === "string" &&
      typeof c.industry === "string"
    ) {
      parsed.push({
        company: c.company.trim(),
        website: c.website.trim(),
        city: c.city.trim(),
        industry: c.industry.trim(),
      });
    }
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidates = parseCandidates(body);

    if (!candidates) {
      return NextResponse.json(
        { error: "Invalid candidates list" },
        { status: 400 }
      );
    }

    const imported = getImportStatusForCandidates(candidates);
    return NextResponse.json({ imported });
  } catch (error) {
    console.error("POST /api/discovery/import/status error:", error);
    return NextResponse.json(
      { error: "Failed to check import status" },
      { status: 500 }
    );
  }
}
