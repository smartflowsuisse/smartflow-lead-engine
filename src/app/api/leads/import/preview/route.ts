import { NextResponse } from "next/server";
import { buildImportPreview } from "@/lib/import/preview-import";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const csv = typeof body.csv === "string" ? body.csv : "";

    if (!csv.trim()) {
      return NextResponse.json({ error: "CSV content is required" }, { status: 400 });
    }

    const preview = buildImportPreview(csv);
    return NextResponse.json(preview);
  } catch (error) {
    console.error("POST /api/leads/import/preview error:", error);
    return NextResponse.json(
      { error: "Failed to preview CSV import" },
      { status: 500 }
    );
  }
}
