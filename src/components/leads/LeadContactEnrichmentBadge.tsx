import { cn } from "@/lib/utils";

interface LeadContactEnrichmentBadgeProps {
  compact?: boolean;
}

export function LeadContactEnrichmentBadge({
  compact = false,
}: LeadContactEnrichmentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-amber-200 bg-amber-50 font-medium text-amber-800",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      )}
    >
      Needs contact enrichment
    </span>
  );
}
