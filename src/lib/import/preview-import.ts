import { findDuplicateLead } from "../leads";
import { getCandidateKey } from "../discovery/dedup";
import { mapParsedCsvToRows } from "./validate-row";
import { parseCsv } from "./parse-csv";
import type { ImportPreviewResult, ImportPreviewRow } from "./types";

function duplicateKey(row: { company: string; website?: string }): string {
  return getCandidateKey({
    company: row.company,
    website: row.website ?? "",
  });
}

export function buildImportPreview(csvText: string): ImportPreviewResult {
  const parsed = parseCsv(csvText);
  const mappedRows = mapParsedCsvToRows(parsed);
  const seenInFile = new Set<string>();
  const previewRows: ImportPreviewRow[] = [];

  for (const mapped of mappedRows) {
    if (mapped.errors.length > 0) {
      previewRows.push({
        rowNumber: mapped.rowNumber,
        data: mapped.data,
        status: "invalid",
        errors: mapped.errors,
      });
      continue;
    }

    const key = duplicateKey(mapped.data);

    if (seenInFile.has(key)) {
      previewRows.push({
        rowNumber: mapped.rowNumber,
        data: mapped.data,
        status: "duplicate_in_file",
        errors: ["Duplicate row within CSV file"],
      });
      continue;
    }

    seenInFile.add(key);

    const existing = findDuplicateLead({
      company: mapped.data.company,
      website: mapped.data.website ?? null,
    });

    if (existing) {
      previewRows.push({
        rowNumber: mapped.rowNumber,
        data: mapped.data,
        status: "duplicate",
        errors: ["Already exists in CRM"],
        existingLead: {
          id: existing.id,
          company: existing.company,
          website: existing.website,
        },
      });
      continue;
    }

    previewRows.push({
      rowNumber: mapped.rowNumber,
      data: mapped.data,
      status: "ready",
      errors: [],
    });
  }

  const duplicateCount = previewRows.filter(
    (row) => row.status === "duplicate" || row.status === "duplicate_in_file"
  ).length;

  return {
    rows: previewRows,
    summary: {
      total: previewRows.length,
      valid: previewRows.filter((row) => row.status === "ready").length,
      duplicate: duplicateCount,
      invalid: previewRows.filter((row) => row.status === "invalid").length,
    },
  };
}
