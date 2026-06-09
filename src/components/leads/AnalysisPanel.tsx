"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  Smartphone,
  Gauge,
  Search,
  Shield,
  FormInput,
  Monitor,
  Lightbulb,
  Bot,
} from "lucide-react";
import type { LeadAnalysis } from "@/lib/types";
import { getAnalysisEngine } from "@/lib/ai/display";
import {
  ANALYSIS_UNAVAILABLE_ACTION,
  ANALYSIS_UNAVAILABLE_MESSAGE,
  ANALYSIS_UNAVAILABLE_REASON,
  type AnalysisUnavailablePayload,
  isAnalysisUnavailablePayload,
  isLegacyUnavailableError,
} from "@/lib/analysis/unavailable-display";
import { cn, scoreColor } from "@/lib/utils";
import { getScoreLabel, formatAnalysisScore } from "@/lib/scoring";
import { isKnownScore } from "@/lib/analysis/score-values";

interface AnalysisPanelProps {
  leadId: number;
  website: string | null;
  leadScore: number;
  analysis: LeadAnalysis | null | undefined;
}

function ScoreBar({
  label,
  score,
  icon,
}: {
  label: string;
  score: number | null;
  icon: React.ReactNode;
}) {
  const known = isKnownScore(score);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-slate-600">
          {icon}
          {label}
        </span>
        <span className="font-semibold text-slate-900">
          {formatAnalysisScore(score)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        {known ? (
          <div
            className={cn(
              "h-full rounded-full transition-all",
              score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${score}%` }}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-slate-200" />
        )}
      </div>
    </div>
  );
}

function AnalysisUnavailableFallback({
  payload,
}: {
  payload: AnalysisUnavailablePayload;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <h3 className="font-semibold text-slate-900">{payload.message}</h3>
        <p className="mt-2 text-sm text-slate-600">
          Reason: {payload.reason}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Lead Score</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">Not scored</p>
      </div>

      <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-4">
        <p className="text-sm font-medium text-slate-900">Recommended action</p>
        <p className="mt-1 text-sm text-slate-700">{payload.recommendedAction}</p>
      </div>
    </div>
  );
}

export function AnalysisPanel({
  leadId,
  website,
  leadScore,
  analysis,
}: AnalysisPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<AnalysisUnavailablePayload | null>(
    null
  );

  const runAnalysis = async () => {
    if (!website) return;
    setLoading(true);
    setError(null);
    setUnavailable(null);

    try {
      const res = await fetch(`/api/leads/${leadId}/analyze`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (isAnalysisUnavailablePayload(data)) {
          setUnavailable(data);
          return;
        }

        const message =
          typeof data.error === "string" ? data.error : "Analysis could not be completed";

        if (isLegacyUnavailableError(message)) {
          setUnavailable({
            unavailable: true,
            message: ANALYSIS_UNAVAILABLE_MESSAGE,
            reason: ANALYSIS_UNAVAILABLE_REASON,
            recommendedAction: ANALYSIS_UNAVAILABLE_ACTION,
          });
          return;
        }

        throw new Error("Analysis could not be completed");
      }

      setUnavailable(null);
      router.refresh();
    } catch {
      setError("Analysis could not be completed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  function safeJsonParse<T>(value: string, fallback: T): T {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  const quickWins: string[] = analysis
    ? safeJsonParse(analysis.quick_wins, [])
    : [];
  const automationOps: string[] = analysis
    ? safeJsonParse(analysis.automation_opportunities, [])
    : [];

  const rawDetails = analysis
    ? safeJsonParse<Record<string, unknown> | null>(analysis.raw_analysis, null)
    : null;
  const analysisEngine = getAnalysisEngine(rawDetails ?? undefined);
  const executiveSummary =
    typeof rawDetails?.summary === "string" ? rawDetails.summary : null;
  const salesAngle =
    typeof rawDetails?.salesAngle === "string" ? rawDetails.salesAngle : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">AI Website Analysis</h2>
            {analysis && (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-medium",
                  analysisEngine === "heuristic+llm"
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                )}
              >
                {analysisEngine === "heuristic+llm" ? "AI-assisted" : "Heuristic"}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Analyze website quality, SEO, and SmartFlow opportunities
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading || !website}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {analysis ? "Re-analyze" : "Run Analysis"}
        </button>
      </div>

      {!website && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add a website URL to enable AI analysis.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {unavailable && !analysis && (
        <AnalysisUnavailableFallback payload={unavailable} />
      )}

      {analysis && (
        <>
          {executiveSummary && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-5">
              <h3 className="font-semibold text-slate-900">Executive Summary</h3>
              <p className="mt-2 text-sm text-slate-700">{executiveSummary}</p>
              {salesAngle && salesAngle !== executiveSummary && (
                <p className="mt-2 text-sm font-medium text-brand-700">
                  Sales angle: {salesAngle}
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Lead Score</p>
                <p className="text-4xl font-bold text-slate-900">{leadScore}</p>
                <p className="text-sm font-medium text-slate-600">
                  {getScoreLabel(leadScore)}
                </p>
              </div>
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 text-center",
                  scoreColor(leadScore)
                )}
              >
                <p className="text-2xl font-bold">{leadScore}</p>
                <p className="text-xs">/ 100</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Analysis Breakdown</h3>
            <ScoreBar label="Website Quality" score={analysis.website_quality} icon={<Monitor className="h-3.5 w-3.5" />} />
            <ScoreBar label="Mobile Friendliness" score={analysis.mobile_friendliness} icon={<Smartphone className="h-3.5 w-3.5" />} />
            <ScoreBar label="Page Speed" score={analysis.speed_score} icon={<Gauge className="h-3.5 w-3.5" />} />
            <ScoreBar label="SEO Basics" score={analysis.seo_score} icon={<Search className="h-3.5 w-3.5" />} />
            <ScoreBar label="Trust Elements" score={analysis.trust_score} icon={<Shield className="h-3.5 w-3.5" />} />
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <FormInput className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">Contact Form:</span>
              <span
                className={
                  analysis.has_contact_form === null
                    ? "font-medium text-slate-500"
                    : analysis.has_contact_form
                      ? "font-medium text-emerald-600"
                      : "font-medium text-red-600"
                }
              >
                {analysis.has_contact_form === null
                  ? "Unknown"
                  : analysis.has_contact_form
                    ? "Detected"
                    : "Not found"}
              </span>
            </div>
          </div>

          {quickWins.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Quick Wins</h3>
              </div>
              <ul className="space-y-2">
                {quickWins.map((win, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-bold text-amber-600">{i + 1}.</span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {automationOps.length > 0 && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-600" />
                <h3 className="font-semibold text-slate-900">
                  SmartFlow Automation Opportunities
                </h3>
              </div>
              <ul className="space-y-2">
                {automationOps.map((op, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-bold text-brand-600">{i + 1}.</span>
                    {op}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
