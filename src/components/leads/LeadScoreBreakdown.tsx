import type { LeadScoreBreakdown as LeadScoreBreakdownType } from "@/lib/scoring";
import { LEAD_SCORE_PILLARS } from "@/lib/scoring";
import { cn } from "@/lib/utils";

interface LeadScoreBreakdownProps {
  breakdown: LeadScoreBreakdownType;
  compact?: boolean;
}

export function LeadScoreBreakdown({
  breakdown,
  compact = false,
}: LeadScoreBreakdownProps) {
  const pillars = LEAD_SCORE_PILLARS.map((pillar) => ({
    ...pillar,
    value: breakdown[pillar.key],
  }));

  return (
    <div className={cn("space-y-2", compact ? "mt-2" : "mt-3")}>
      {pillars.map((pillar) => {
        const width =
          pillar.max > 0 ? Math.round((pillar.value / pillar.max) * 100) : 0;

        return (
          <div key={pillar.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-600">{pillar.label}</span>
              <span className="font-medium text-slate-800">
                {pillar.value}/{pillar.max}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
