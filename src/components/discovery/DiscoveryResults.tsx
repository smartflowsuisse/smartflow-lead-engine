"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Tag,
  UserPlus,
} from "lucide-react";
import { getCandidateKey } from "@/lib/discovery/dedup";
import type { DiscoveryCandidate, DiscoveryResult } from "@/lib/discovery/types";

function providerLabel(provider: DiscoveryResult["provider"]): string {
  return provider === "osm" ? "OpenStreetMap" : "Mock provider";
}

interface DiscoveryResultsProps {
  result: DiscoveryResult;
  onNotification?: (message: string, type: "success" | "error") => void;
}

type ImportState = "idle" | "loading" | "imported" | "duplicate";

export function DiscoveryResults({ result, onNotification }: DiscoveryResultsProps) {
  const { candidates, totalFound, query } = result;
  const [importStates, setImportStates] = useState<Record<string, ImportState>>(
    {}
  );
  const [existingLeadIds, setExistingLeadIds] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      if (candidates.length === 0) return;

      try {
        const res = await fetch("/api/discovery/import/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidates }),
        });

        if (!res.ok || cancelled) return;

        const data = (await res.json()) as { imported: Record<string, number> };
        const nextStates: Record<string, ImportState> = {};
        const nextIds: Record<string, number> = {};

        for (const candidate of candidates) {
          const key = getCandidateKey(candidate);
          const leadId = data.imported[key];
          if (leadId) {
            nextStates[key] = "duplicate";
            nextIds[key] = leadId;
          }
        }

        if (!cancelled) {
          setImportStates(nextStates);
          setExistingLeadIds(nextIds);
        }
      } catch {
        // Status check is best-effort; import still validates server-side.
      }
    }

    setImportStates({});
    setExistingLeadIds({});
    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [candidates]);

  const handleImport = async (candidate: DiscoveryCandidate) => {
    const key = getCandidateKey(candidate);
    const current = importStates[key];
    if (current === "loading" || current === "imported" || current === "duplicate") {
      return;
    }

    setImportStates((prev) => ({ ...prev, [key]: "loading" }));

    try {
      const res = await fetch("/api/discovery/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });

      const data = await res.json();

      if (res.status === 409 && data.duplicate) {
        setImportStates((prev) => ({ ...prev, [key]: "duplicate" }));
        setExistingLeadIds((prev) => ({
          ...prev,
          [key]: data.existingLead.id,
        }));
        onNotification?.(data.message, "error");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }

      setImportStates((prev) => ({ ...prev, [key]: "imported" }));
      setExistingLeadIds((prev) => ({
        ...prev,
        [key]: data.lead.id,
      }));
      onNotification?.(data.message, "success");
    } catch (err) {
      setImportStates((prev) => ({ ...prev, [key]: "idle" }));
      onNotification?.(
        err instanceof Error ? err.message : "Import failed",
        "error"
      );
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Discovered Companies
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {candidates.length} shown
            {totalFound > candidates.length
              ? ` of ${totalFound} matches`
              : totalFound === candidates.length && totalFound > 0
                ? ` found`
                : ""}{" "}
            for {query.industry} in {query.city}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {providerLabel(result.provider)}
        </span>
      </div>

          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Discovery results are checked against your CRM before import.</p>
            <p className="mt-1">
              Companies already in CRM are marked as <span className="font-semibold text-emerald-700">In CRM</span>. Use <span className="font-semibold text-brand-700">View</span> to open the existing lead.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              New companies can be imported from the Action column.
            </p>
          </div>

      {candidates.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Company</th>
                <th className="px-4 py-3 font-medium text-slate-700">Website</th>
                <th className="px-4 py-3 font-medium text-slate-700">City</th>
                <th className="px-4 py-3 font-medium text-slate-700">Industry</th>
                <th className="px-4 py-3 font-medium text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((company) => {
                const key = getCandidateKey(company);
                const state = importStates[key] ?? "idle";
                const leadId = existingLeadIds[key];

                return (
                  <tr
                    key={key}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {company.company}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700"
                        >
                          {company.website.replace(/^https?:\/\//, "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="font-medium text-amber-700">Missing</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {company.city}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                        <Tag className="h-3 w-3" />
                        {company.industry}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {state === "imported" || state === "duplicate" ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {state === "duplicate" ? "In CRM" : "Imported"}
                          </span>
                          {leadId && (
                            <Link
                              href={`/leads/${leadId}`}
                              className="text-xs text-brand-600 hover:text-brand-700"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImport(company)}
                          disabled={state === "loading"}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-60"
                        >
                          {state === "loading" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <UserPlus className="h-3.5 w-3.5" />
                          )}
                          Import
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-700">No companies found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different industry or city. Real results come from OpenStreetMap
            for Swiss cities such as Zürich, Basel, Genève, Lausanne, Bern, Luzern,
            and St. Gallen.
          </p>
        </div>
      )}
    </div>
  );
}
