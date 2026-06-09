import type { CsvLeadColumn, CsvLeadRow } from "./types";
import { CSV_LEAD_COLUMNS } from "./types";
import { normalizeHeader, type ParsedCsv } from "./parse-csv";

export interface MappedCsvRow {
  rowNumber: number;
  data: CsvLeadRow;
  errors: string[];
}

function optionalField(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function mapParsedCsvToRows(parsed: ParsedCsv): MappedCsvRow[] {
  if (parsed.headers.length === 0) {
    return [];
  }

  const columnIndexes = new Map<CsvLeadColumn, number>();

  parsed.headers.forEach((header, index) => {
    const normalized = normalizeHeader(header) ?? header;
    if ((CSV_LEAD_COLUMNS as readonly string[]).includes(normalized)) {
      columnIndexes.set(normalized as CsvLeadColumn, index);
    }
  });

  if (!columnIndexes.has("company")) {
    return parsed.rows.map((_, index) => ({
      rowNumber: index + 2,
      data: { company: "" },
      errors: ["Missing required column: company"],
    }));
  }

  return parsed.rows.map((row, index) => {
    const data: CsvLeadRow = {
      company: row[columnIndexes.get("company") ?? -1]?.trim() ?? "",
    };

    for (const column of CSV_LEAD_COLUMNS) {
      if (column === "company") continue;
      const value = optionalField(row[columnIndexes.get(column) ?? -1]);
      if (value) {
        data[column] = value;
      }
    }

    const errors: string[] = [];
    if (!data.company) {
      errors.push("Company name is required");
    }

    return {
      rowNumber: index + 2,
      data,
      errors,
    };
  });
}
