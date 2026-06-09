import { NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/ai-analysis";
import { getLeadById, saveLeadAnalysis } from "@/lib/leads";
import { calculateLeadScore } from "@/lib/scoring";

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

    if (!lead.website) {
      return NextResponse.json(
        { error: "Lead has no website URL to analyze" },
        { status: 400 }
      );
    }

    const analysis = await analyzeWebsite(lead.website, lead.industry, {
      company: lead.company,
      city: lead.city,
      industry: lead.industry,
    });
    const leadScore = calculateLeadScore(analysis);

    const savedAnalysis = saveLeadAnalysis(leadId, {
      websiteQuality: analysis.websiteQuality,
      mobileFriendliness: analysis.mobileFriendliness,
      speedScore: analysis.speedScore,
      seoScore: analysis.seoScore,
      hasContactForm: analysis.hasContactForm,
      trustScore: analysis.trustScore,
      quickWins: analysis.quickWins,
      automationOpportunities: analysis.automationOpportunities,
      rawAnalysis: analysis.details,
      leadScore,
    });

    const updatedLead = getLeadById(leadId);

    return NextResponse.json({
      lead: updatedLead,
      analysis: savedAnalysis,
      score: leadScore,
    });
  } catch (error) {
    console.error("POST /api/leads/[id]/analyze error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
