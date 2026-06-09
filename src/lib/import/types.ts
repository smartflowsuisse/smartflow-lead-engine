import type { Lead } from "../types";

export const CSV_LEAD_COLUMNS = [
  "company",
  "website",
  "email",
  "phone",
  "city",
  "industry",
  "notes",
] as const;

export type CsvLeadColumn = (typeof CSV_LEAD_COLUMNS)[number];

export interface CsvLeadRow {
  company: string;
  website?: string;
  email?: string;
  phone?: string;
  city?: string;
  industry?: string;
  notes?: string;
}

export type ImportPreviewStatus =
  | "ready"
  | "duplicate"
  | "duplicate_in_file"
  | "invalid";

export interface ImportPreviewRow {
  rowNumber: number;
  data: CsvLeadRow;
  status: ImportPreviewStatus;
  errors: string[];
  existingLead?: Pick<Lead, "id" | "company" | "website">;
}

export interface ImportPreviewResult {
  rows: ImportPreviewRow[];
  summary: {
    total: number;
    valid: number;
    duplicate: number;
    invalid: number;
  };
}

export interface ImportExecuteResult {
  imported: number;
  skipped: number;
  errors: Array<{ rowNumber: number; message: string }>;
  leads: Lead[];
}
