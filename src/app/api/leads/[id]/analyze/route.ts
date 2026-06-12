import { NextResponse } from "next/server";
import { buildAnalysisUnavailablePayload } from "@/lib/analysis/unavailable-display";
import { runLeadWebsiteAnalysis } from "@/lib/analysis/run-lead-analysis";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const result = await runLeadWebsiteAnalysis(leadId);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      if (result.reason === "no_website") {
        return NextResponse.json(
          { error: "Lead has no website URL to analyze" },
          { status: 400 }
        );
      }

      if (result.reason === "unavailable") {
        return NextResponse.json(buildAnalysisUnavailablePayload(), {
          status: 422,
        });
      }

      return NextResponse.json(
        { error: result.error ?? "Analysis could not be completed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      lead: result.lead,
      analysis: result.analysis,
      score: result.score,
    });
  } catch (error) {
    console.error("POST /api/leads/[id]/analyze error:", error);
    return NextResponse.json(
      { error: "Analysis could not be completed" },
      { status: 500 }
    );
  }
}
