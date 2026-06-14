"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";
import { cn, statusColor } from "@/lib/utils";

interface LeadStatusSelectProps {
  leadId: number;
  currentStatus: LeadStatus;
}

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: LeadStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as LeadStatus;
    if (newStatus === status) return;

    setLoading(true);
    setError(null);
    const previous = status;
    setStatus(newStatus);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (err) {
      setStatus(previous);
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="relative inline-flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => void handleChange(e)}
          disabled={loading}
          aria-label="CRM status"
          className={cn(
            "cursor-pointer appearance-none rounded-full border py-0.5 pl-2.5 pr-7 text-xs font-medium outline-none transition-opacity focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 disabled:cursor-wait disabled:opacity-60",
            statusColor(status)
          )}
        >
          {LEAD_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {loading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
