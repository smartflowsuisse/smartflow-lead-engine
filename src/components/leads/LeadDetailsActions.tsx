"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ExternalLink, Loader2, Sparkles } from "lucide-react";
import type { LeadStatus } from "@/lib/types";
import { getNextLeadStatus } from "@/lib/leads/pipeline";
import { getAnalyzeActionLabel } from "@/lib/leads/lead-details";
import {
  ANALYSIS_UNAVAILABLE_ACTION,
  ANALYSIS_UNAVAILABLE_MESSAGE,
  ANALYSIS_UNAVAILABLE_REASON,
  isAnalysisUnavailablePayload,
  isLegacyUnavailableError,
} from "@/lib/analysis/unavailable-display";

interface LeadDetailsActionsProps {
  leadId: number;
  currentStatus: LeadStatus;
  website: string | null;
  hasAnalysis: boolean;
}

function websiteHref(website: string): string {
  return website.startsWith("http") ? website : `https://${website}`;
}

export function LeadDetailsActions({
  leadId,
  currentStatus,
  website,
  hasAnalysis,
}: LeadDetailsActionsProps) {
  const router = useRouter();
  const [advancing, setAdvancing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisNotice, setAnalysisNotice] = useState<string | null>(null);
  const nextStatus = getNextLeadStatus(currentStatus);

  const handleAnalyze = async () => {
    if (!website) return;

    setAnalyzing(true);
    setError(null);
    setAnalysisNotice(null);

    try {
      const res = await fetch(`/api/leads/${leadId}/analyze`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (isAnalysisUnavailablePayload(data)) {
          setAnalysisNotice(data.message);
          return;
        }

        const message =
          typeof data.error === "string" ? data.error : "Analysis could not be completed";

        if (isLegacyUnavailableError(message)) {
          setAnalysisNotice(ANALYSIS_UNAVAILABLE_MESSAGE);
          return;
        }

        throw new Error(message);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis could not be completed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMoveToNextStage = async () => {
    if (!nextStatus) return;

    setAdvancing(true);
    setError(null);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update lead status");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead status");
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void handleAnalyze()}
          disabled={!website || analyzing}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {getAnalyzeActionLabel(hasAnalysis)}
        </button>

        <button
          type="button"
          onClick={() => void handleMoveToNextStage()}
          disabled={!nextStatus || advancing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {advancing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {nextStatus ? `Move To ${nextStatus}` : "Final Stage"}
        </button>

        {website ? (
          <a
            href={websiteHref(website)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Open Website
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400"
          >
            <ExternalLink className="h-4 w-4" />
            Open Website
          </button>
        )}
      </div>

      {!website && (
        <p className="mt-2 text-xs text-amber-700">
          Add a website URL to enable AI analysis.
        </p>
      )}

      {analysisNotice && (
        <p className="mt-2 text-xs text-slate-600">
          {analysisNotice}
          {analysisNotice === ANALYSIS_UNAVAILABLE_MESSAGE && (
            <> {ANALYSIS_UNAVAILABLE_REASON}. {ANALYSIS_UNAVAILABLE_ACTION}</>
          )}
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
