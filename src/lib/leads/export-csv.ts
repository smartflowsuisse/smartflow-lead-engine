import type { Lead } from "../types";
import { getScoreLabel } from "../scoring";

export const LEAD_EXPORT_DELIMITER = ";" as const;

export const LEAD_EXPORT_HEADERS = [
  "Company",
  "City",
  "Industry",
  "Email",
  "Phone",
  "Website",
  "Contact Page",
  "Score",
  "Qualification",
  "Status",
  "Created Date",
] as const;

export type LeadExportHeader = (typeof LEAD_EXPORT_HEADERS)[number];

export const REQUIRED_LEAD_EXPORT_HEADERS: LeadExportHeader[] = [
  "Contact Page",
  "Score",
  "Qualification",
  "Status",
  "Created Date",
];

type LeadExportColumn = {
  header: LeadExportHeader;
  value: (lead: Lead) => string;
};

export const LEAD_EXPORT_COLUMNS: LeadExportColumn[] = [
  { header: "Company", value: (lead) => lead.company },
  { header: "City", value: (lead) => lead.city ?? "" },
  { header: "Industry", value: (lead) => lead.industry ?? "" },
  { header: "Email", value: (lead) => lead.email ?? "" },
  { header: "Phone", value: (lead) => lead.phone ?? "" },
  { header: "Website", value: (lead) => lead.website ?? "" },
  { header: "Contact Page", value: (lead) => lead.contact_page_url ?? "" },
  { header: "Score", value: (lead) => String(lead.lead_score ?? 0) },
  {
    header: "Qualification",
    value: (lead) => formatLeadQualification(lead.lead_score ?? 0),
  },
  { header: "Status", value: (lead) => lead.status },
  {
    header: "Created Date",
    value: (lead) => formatLeadExportCreatedDate(lead.created_at),
  },
];

export function escapeCsvField(
  value: string,
  delimiter: string = LEAD_EXPORT_DELIMITER
): string {
  if (value.includes(delimiter) || /["\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function formatLeadQualification(score: number): string {
  return getScoreLabel(score);
}

export function formatLeadExportCreatedDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function leadToExportRow(lead: Lead): string[] {
  return LEAD_EXPORT_COLUMNS.map((column) => column.value(lead));
}

export function buildLeadsExportCsv(leads: Lead[]): string {
  const headerLine = LEAD_EXPORT_HEADERS.join(LEAD_EXPORT_DELIMITER);
  const dataLines = leads.map((lead) =>
    leadToExportRow(lead)
      .map((value) => escapeCsvField(value))
      .join(LEAD_EXPORT_DELIMITER)
  );

  return `\uFEFF${[headerLine, ...dataLines].join("\n")}`;
}

export function buildLeadsExportFilename(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `leads-export-${year}-${month}-${day}.csv`;
}

export function parseLeadExportHeaders(csv: string): string[] {
  const firstLine = csv.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0] ?? "";

  return firstLine
    .split(LEAD_EXPORT_DELIMITER)
    .map((header) => header.trim());
}
