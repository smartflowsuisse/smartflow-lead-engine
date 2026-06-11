import { NextResponse } from "next/server";
import { searchLeads } from "@/lib/leads";
import {
  buildLeadsExportCsv,
  buildLeadsExportFilename,
} from "@/lib/leads/export-csv";
import {
  getLeadsForListView,
  parseLeadContactFilter,
  parseLeadScoreFilter,
  parseLeadSortOption,
} from "@/lib/leads/list-view";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

function parseStatus(value: string | null): LeadStatus | undefined {
  if (!value) {
    return undefined;
  }

  return LEAD_STATUSES.includes(value as LeadStatus)
    ? (value as LeadStatus)
    : undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || undefined;
    const status = parseStatus(searchParams.get("status"));
    const contactFilter = parseLeadContactFilter(
      searchParams.get("contact") ?? undefined
    );
    const scoreFilter = parseLeadScoreFilter(
      searchParams.get("score") ?? undefined
    );
    const sortOption = parseLeadSortOption(searchParams.get("sort") ?? undefined);

    const baseLeads = searchLeads({ q, status });
    const leads = getLeadsForListView(baseLeads, {
      contact: contactFilter,
      score: scoreFilter,
      sort: sortOption,
    });
    const csv = buildLeadsExportCsv(leads);
    const filename = buildLeadsExportFilename();

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/leads/export error:", error);
    return NextResponse.json(
      { error: "Failed to export leads" },
      { status: 500 }
    );
  }
}
