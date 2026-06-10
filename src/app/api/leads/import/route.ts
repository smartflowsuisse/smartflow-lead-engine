import { NextResponse } from "next/server";
import { executeImport } from "@/lib/import/execute-import";
import type { ImportConfirmRow } from "@/lib/import/execute-import";

function parseRows(body: unknown): ImportConfirmRow[] | null {
  if (!body || typeof body !== "object") return null;
  const rows = (body as { rows?: unknown }).rows;
  if (!Array.isArray(rows)) return null;

  const parsed: ImportConfirmRow[] = [];

  for (const item of rows) {
    if (!item || typeof item !== "object") return null;
    const row = item as Partial<ImportConfirmRow> & { data?: Record<string, unknown> };
    if (typeof row.rowNumber !== "number" || !row.data || typeof row.data.company !== "string") {
      return null;
    }

    parsed.push({
      rowNumber: row.rowNumber,
      data: {
        company: row.data.company,
        website: typeof row.data.website === "string" ? row.data.website : undefined,
        email: typeof row.data.email === "string" ? row.data.email : undefined,
        phone: typeof row.data.phone === "string" ? row.data.phone : undefined,
        city: typeof row.data.city === "string" ? row.data.city : undefined,
        industry: typeof row.data.industry === "string" ? row.data.industry : undefined,
        notes: typeof row.data.notes === "string" ? row.data.notes : undefined,
      },
    });
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows = parseRows(body);

    if (!rows) {
      return NextResponse.json({ error: "Invalid import rows" }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "No rows to import" }, { status: 400 });
    }

    const result = await executeImport(rows);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads/import error:", error);
    return NextResponse.json(
      { error: "Failed to import leads" },
      { status: 500 }
    );
  }
}
