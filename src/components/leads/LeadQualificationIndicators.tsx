import type { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  hasLeadContactPage,
  hasLeadEmail,
  hasLeadPhone,
} from "@/lib/leads/list-view";

interface LeadQualificationIndicatorsProps {
  lead: Lead;
  compact?: boolean;
}

function QualificationBadge({
  label,
  present,
  compact = false,
}: {
  label: string;
  present: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border font-medium",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        present
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-600"
      )}
    >
      {label} {present ? "✓" : "✗"}
    </span>
  );
}

export function LeadQualificationIndicators({
  lead,
  compact = false,
}: LeadQualificationIndicatorsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-2" : "mt-2.5")}>
      <QualificationBadge label="Email" present={hasLeadEmail(lead)} compact={compact} />
      <QualificationBadge label="Phone" present={hasLeadPhone(lead)} compact={compact} />
      <QualificationBadge
        label={compact ? "Contact" : "Contact Page"}
        present={hasLeadContactPage(lead)}
        compact={compact}
      />
    </div>
  );
}
