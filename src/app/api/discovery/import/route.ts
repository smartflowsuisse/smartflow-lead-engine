import { NextResponse } from "next/server";
import {
  importDiscoveryCandidate,
  parseDiscoveryImportCandidate,
} from "@/lib/discovery/import";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidate = parseDiscoveryImportCandidate(body);

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
