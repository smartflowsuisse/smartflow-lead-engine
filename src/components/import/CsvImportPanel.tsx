"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, Loader2, Upload } from "lucide-react";
import type { ImportExecuteResult, ImportPreviewResult } from "@/lib/import/types";
import { cn } from "@/lib/utils";

function statusLabel(status: ImportPreviewResult["rows"][number]["status"]): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "duplicate":
      return "Duplicate";
    case "duplicate_in_file":
      return "Duplicate in file";
    case "invalid":
      return "Invalid";
  }
}

function statusClass(status: ImportPreviewResult["rows"][number]["status"]): string {
  switch (status) {
    case "ready":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "duplicate":
    case "duplicate_in_file":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "invalid":
      return "border-red-200 bg-red-50 text-red-700";
  }
}

export function CsvImportPanel() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null);
  const [result, setResult] = useState<ImportExecuteResult | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readyRows = useMemo(
    () => preview?.rows.filter((row) => row.status === "ready") ?? [],
    [preview]
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    setPreview(null);
    setFileName(file.name);

    const text = await file.text();
    setCsvText(text);
  };

  const runPreview = async () => {
    if (!csvText.trim()) {
      setError("Choose a CSV file first.");
      return;
    }

    setLoadingPreview(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/leads/import/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to preview CSV");
      }

      setPreview(data as ImportPreviewResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to preview CSV");
    } finally {
      setLoadingPreview(false);
    }
  };

  const confirmImport = async () => {
    if (readyRows.length === 0) {
      setError("No valid rows available to import.");
      return;
    }

    setLoadingImport(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: readyRows.map((row) => ({
            rowNumber: row.rowNumber,
            data: row.data,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import leads");
      }

      setResult(data as ImportExecuteResult);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import leads");
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Upload CSV</h2>
        <p className="mt-1 text-sm text-slate-500">
          Supported columns: company, website, email, phone, city, industry, notes
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <FileUp className="h-4 w-4" />
            Choose CSV file
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => void handleFileChange(e)}
              className="sr-only"
            />
          </label>
          {fileName && (
            <span className="text-sm text-slate-600">{fileName}</span>
          )}
          <button
            type="button"
            onClick={() => void runPreview()}
            disabled={!csvText || loadingPreview}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loadingPreview ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Preview import
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {preview && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-4">
            <SummaryCard label="Total rows" value={preview.summary.total} />
            <SummaryCard label="Valid rows" value={preview.summary.valid} />
            <SummaryCard label="Duplicate rows" value={preview.summary.duplicate} />
            <SummaryCard label="Invalid rows" value={preview.summary.invalid} />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Row</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Website</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Industry</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row) => (
                  <tr key={row.rowNumber} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-500">{row.rowNumber}</td>
                    <td className="px-3 py-2 font-medium text-slate-900">{row.data.company || "—"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.data.website ?? "—"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.data.city ?? "—"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.data.industry ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-medium",
                          statusClass(row.status)
                        )}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-500">
                      {row.existingLead
                        ? `Existing lead #${row.existingLead.id}`
                        : row.errors.join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <div>

              <p className="text-sm text-slate-600">
              {readyRows.length} lead{readyRows.length === 1 ? "" : "s"} ready to import

              </p>

              <p className="mt-1 text-xs text-slate-500">

                Only Ready rows will be imported. Duplicate and invalid rows are skipped.

              </p>

            </div>
            <button
              type="button"
              onClick={() => void confirmImport()}
              disabled={loadingImport || readyRows.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loadingImport ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirm import
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="font-semibold text-emerald-900">Import complete</h3>
          <p className="mt-2 text-sm text-emerald-800">
            Imported {result.imported} lead{result.imported === 1 ? "" : "s"}
            {result.skipped > 0 ? ` · Skipped ${result.skipped}` : ""}.
          </p>
          <Link
            href="/leads"
            className="mt-3 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            View leads →
          </Link>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
