import { getDb } from "../db";
import {
  createLead,
  findDuplicateLead,
  getLeadById,
  persistLeadScore,
} from "../leads";
import { enrichLeadWithDiscoveredContact } from "../contact/enrich-lead-contact";
import type { Lead } from "../types";
import type { CsvLeadRow, ImportExecuteResult } from "./types";

export interface ImportConfirmRow {
  rowNumber: number;
  data: CsvLeadRow;
}

export async function executeImport(
  rows: ImportConfirmRow[]
): Promise<ImportExecuteResult> {
  const db = getDb();
  const result: ImportExecuteResult = {
    imported: 0,
    skipped: 0,
    errors: [],
    leads: [],
  };

  const importRows = db.transaction((items: ImportConfirmRow[]) => {
    const created: Lead[] = [];
    const errors: ImportExecuteResult["errors"] = [];
    let imported = 0;
    let skipped = 0;

    for (const item of items) {
      if (!item.data.company?.trim()) {
        skipped++;
        errors.push({
          rowNumber: item.rowNumber,
          message: "Company name is required",
        });
        continue;
      }

      const existing = findDuplicateLead({
        company: item.data.company,
        website: item.data.website ?? null,
      });

      if (existing) {
        skipped++;
        errors.push({
          rowNumber: item.rowNumber,
          message: `${item.data.company} already exists in CRM`,
        });
        continue;
      }

      const lead = createLead({
        company: item.data.company.trim(),
        website: item.data.website?.trim() || undefined,
        email: item.data.email?.trim() || undefined,
        phone: item.data.phone?.trim() || undefined,
        city: item.data.city?.trim() || undefined,
        industry: item.data.industry?.trim() || undefined,
        notes: item.data.notes?.trim()
          ? `Imported from CSV\n${item.data.notes.trim()}`
          : "Imported from CSV",
        status: "New Lead",
      });

      created.push(lead);
      imported++;
    }

    return { created, errors, imported, skipped };
  });

  const executed = importRows(rows);
  const enrichedLeads: Lead[] = [];

  for (const lead of executed.created) {
    const enriched = await enrichLeadWithDiscoveredContact(lead);
    persistLeadScore(enriched.id);
    enrichedLeads.push(getLeadById(enriched.id) ?? enriched);
  }

  result.leads = enrichedLeads;
  result.errors = executed.errors;
  result.imported = executed.imported;
  result.skipped = executed.skipped;

  return result;
}
