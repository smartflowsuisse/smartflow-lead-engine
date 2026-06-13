import {
  FormInput,
  Monitor,
  Search,
  Shield,
  Smartphone,
} from "lucide-react";
import type { LeadAnalysis } from "@/lib/types";
import { formatAnalysisScore } from "@/lib/scoring";
import { isKnownScore } from "@/lib/analysis/score-values";
import { ANALYSIS_REQUIRES_WEBSITE_MESSAGE } from "@/lib/leads/website-display";
import { cn } from "@/lib/utils";

interface LeadAiAuditSectionProps {
  analysis?: LeadAnalysis | null;
  hasWebsite?: boolean;
}

function AuditMetric({
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
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon}
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {formatAnalysisScore(score)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        {known ? (
          <div
            className={cn(
              "h-full rounded-full",
              score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${score}%` }}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-slate-300" />
        )}
      </div>
    </div>
  );
}

export function LeadAiAuditSection({
  analysis,
  hasWebsite = true,
}: LeadAiAuditSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">AI Audit</h2>
        <p className="mt-1 text-sm text-slate-500">
          Website quality signals from the latest SmartFlow analysis
        </p>
      </div>

      {!hasWebsite ? (
        <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/50 px-4 py-8 text-center text-sm text-amber-800">
          {ANALYSIS_REQUIRES_WEBSITE_MESSAGE}
        </div>
      ) : !analysis ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Run AI analysis below to populate the audit scores.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AuditMetric
            label="Website Quality"
            score={analysis.website_quality}
            icon={<Monitor className="h-4 w-4 text-slate-500" />}
          />
          <AuditMetric
            label="Mobile Experience"
            score={analysis.mobile_friendliness}
            icon={<Smartphone className="h-4 w-4 text-slate-500" />}
          />
          <AuditMetric
            label="SEO"
            score={analysis.seo_score}
            icon={<Search className="h-4 w-4 text-slate-500" />}
          />
          <AuditMetric
            label="Trust Signals"
            score={analysis.trust_score}
            icon={<Shield className="h-4 w-4 text-slate-500" />}
          />
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FormInput className="h-4 w-4 text-slate-500" />
                Contact Options
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  analysis.has_contact_form === null
                    ? "text-slate-500"
                    : analysis.has_contact_form
                      ? "text-emerald-600"
                      : "text-red-600"
                )}
              >
                {analysis.has_contact_form === null
                  ? "Unknown"
                  : analysis.has_contact_form
                    ? "Contact form detected"
                    : "No contact form found"}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
