import { NextResponse } from "next/server";
import { getLeadsByPipeline } from "@/lib/leads";

export async function GET() {
  try {
    const pipeline = getLeadsByPipeline();
    return NextResponse.json(pipeline);
  } catch (error) {
    console.error("GET /api/pipeline error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pipeline" },
      { status: 500 }
    );
  }
}
