import Link from "next/link";
import type { Lead } from "@/lib/types";
import { cn, formatDate, scoreColor, statusColor } from "@/lib/utils";
import { getScoreLabel, getScorePriority } from "@/lib/scoring";
import { ExternalLink, ChevronRight } from "lucide-react";
import { needsContactEnrichment } from "@/lib/leads/contact-enrichment";
import { LeadContactEnrichmentBadge } from "./LeadContactEnrichmentBadge";
import { LeadQualificationIndicators } from "./LeadQualificationIndicators";

interface LeadCardProps {
  lead: Lead;
  compact?: boolean;
}

const priorityLabel: Record<ReturnType<typeof getScorePriority>, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function LeadCard({ lead, compact = false }: LeadCardProps) {
  const showEnrichmentBadge = needsContactEnrichment(lead);
  const scorePriority =
    lead.lead_score > 0 ? priorityLabel[getScorePriority(lead.lead_score)] : null;

  return (
    <Link
      href={`/leads/${lead.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-700">
              {lead.company}
            </h3>
            {lead.website && (
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            )}
          </div>
          {!compact && (
            <p className="mt-0.5 truncate text-sm text-slate-500">
              {[lead.city, lead.industry].filter(Boolean).join(" · ") ||
                "No location"}
            </p>
          )}
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500" />
      </div>

      <LeadQualificationIndicators lead={lead} compact={compact} />

      {showEnrichmentBadge && (
        <div className={cn(compact ? "mt-2" : "mt-2.5")}>
          <LeadContactEnrichmentBadge compact={compact} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
            statusColor(lead.status)
          )}
        >
          {lead.status}
        </span>
        {lead.lead_score > 0 && (
          <>
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                scoreColor(lead.lead_score)
              )}
            >
              {lead.lead_score}/100 — {getScoreLabel(lead.lead_score)}
            </span>
            {scorePriority && !compact && (
              <span className="text-xs font-medium text-slate-500">
                {scorePriority} priority
              </span>
            )}
          </>
        )}
        {!compact && (
          <span className="text-xs text-slate-400">{formatDate(lead.created_at)}</span>
        )}
      </div>
    </Link>
  );
}
