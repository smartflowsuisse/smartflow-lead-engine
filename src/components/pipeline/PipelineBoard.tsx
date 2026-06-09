"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";
import { cn, scoreColor, statusColor } from "@/lib/utils";

interface PipelineBoardProps {
  initialPipeline: Record<LeadStatus, Lead[]>;
}

export function PipelineBoard({ initialPipeline }: PipelineBoardProps) {
  const router = useRouter();
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [dragging, setDragging] = useState<number | null>(null);

  const handleDragStart = (leadId: number) => {
    setDragging(leadId);
  };

  const handleDrop = async (newStatus: LeadStatus) => {
    if (dragging === null) return;

    const leadId = dragging;
    setDragging(null);

    let movedLead: Lead | null = null;
    const updated = { ...pipeline };

    for (const status of LEAD_STATUSES) {
      const idx = updated[status].findIndex((l) => l.id === leadId);
      if (idx !== -1) {
        movedLead = { ...updated[status][idx], status: newStatus };
        updated[status] = updated[status].filter((l) => l.id !== leadId);
        break;
      }
    }

    if (!movedLead) return;

    updated[newStatus] = [movedLead, ...updated[newStatus]];
    setPipeline(updated);

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch {
      setPipeline(initialPipeline);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {LEAD_STATUSES.map((status) => (
        <div
          key={status}
          className="w-72 shrink-0"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(status)}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs font-medium",
                statusColor(status)
              )}
            >
              {pipeline[status].length}
            </span>
          </div>

          <div className="min-h-[400px] space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-2">
            {pipeline[status].map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={() => handleDragStart(lead.id)}
                className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
              >
                <Link href={`/leads/${lead.id}`} className="block">
                  <p className="font-medium text-slate-900 hover:text-brand-700">
                    {lead.company}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {lead.city ?? "—"} · {lead.industry ?? "—"}
                  </p>
                  {lead.lead_score > 0 && (
                    <span
                      className={cn(
                        "mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold",
                        scoreColor(lead.lead_score)
                      )}
                    >
                      Score: {lead.lead_score}
                    </span>
                  )}
                </Link>
              </div>
            ))}
            {pipeline[status].length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">
                Drop leads here
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
