"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type {
  LeadContactFilter,
  LeadScoreFilter,
  LeadSortOption,
} from "@/lib/leads/list-view";
import type { LeadStatus } from "@/lib/types";

interface LeadExportButtonProps {
  q?: string;
  status?: LeadStatus;
  contact?: LeadContactFilter;
  score?: LeadScoreFilter;
  sort?: LeadSortOption;
}

function buildExportQuery({
  q,
  status,
  contact = "all",
  score = "all",
  sort = "newest",
}: LeadExportButtonProps): string {
  const params = new URLSearchParams();

  if (q?.trim()) {
    params.set("q", q.trim());
  }
  if (status) {
    params.set("status", status);
  }
  if (contact !== "all") {
    params.set("contact", contact);
  }
  if (score !== "all") {
    params.set("score", score);
  }
  if (sort !== "newest") {
    params.set("sort", sort);
  }

  return params.toString();
}

export function LeadExportButton(props: LeadExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      const query = buildExportQuery(props);
      const url = query ? `/api/leads/export?${query}` : "/api/leads/export";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="([^"]+)"/);
      const filename =
        filenameMatch?.[1] ??
        `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.alert("Failed to export leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      {loading ? "Exporting…" : "Export CSV"}
    </button>
  );
}
