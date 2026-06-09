"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";
import { cn, scoreColor, statusColor } from "@/lib/utils";

interface PipelineBoardProps {
  initialPipeline: Record<LeadStatus, Lead[]>;
}

function findLeadStatus(
  pipeline: Record<LeadStatus, Lead[]>,
  leadId: number
): LeadStatus | null {
  for (const status of LEAD_STATUSES) {
    if (pipeline[status].some((lead) => lead.id === leadId)) {
      return status;
    }
  }
  return null;
}

function moveLead(
  pipeline: Record<LeadStatus, Lead[]>,
  leadId: number,
  newStatus: LeadStatus
): Record<LeadStatus, Lead[]> | null {
  const currentStatus = findLeadStatus(pipeline, leadId);
  if (!currentStatus || currentStatus === newStatus) return null;

  const lead = pipeline[currentStatus].find((item) => item.id === leadId);
  if (!lead) return null;

  const updated = {} as Record<LeadStatus, Lead[]>;
  for (const status of LEAD_STATUSES) {
    updated[status] =
      status === currentStatus
        ? pipeline[status].filter((item) => item.id !== leadId)
        : status === newStatus
          ? [{ ...lead, status: newStatus }, ...pipeline[status]]
          : [...pipeline[status]];
  }

  return updated;
}

export function PipelineBoard({ initialPipeline }: PipelineBoardProps) {
  const router = useRouter();
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<LeadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    setPipeline(initialPipeline);
  }, [initialPipeline]);

  const handleDragStart = (leadId: number) => {
    didDrag.current = false;
    setDraggingId(leadId);
    setError(null);
  };

  const handleDrag = () => {
    didDrag.current = true;
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTarget(null);
  };

  const handleDrop = async (newStatus: LeadStatus) => {
    setDropTarget(null);

    if (draggingId === null) return;

    const leadId = draggingId;
    setDraggingId(null);

    const previous = pipeline;
    const updated = moveLead(pipeline, leadId, newStatus);
    if (!updated) return;

    setPipeline(updated);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update lead status");
      }

      router.refresh();
    } catch (err) {
      setPipeline(previous);
      setError(
        err instanceof Error ? err.message : "Failed to move lead. Changes reverted."
      );
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {LEAD_STATUSES.map((status) => (
          <div key={status} className="w-72 shrink-0">
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

            <div
              className={cn(
                "min-h-[400px] space-y-2 rounded-xl border border-dashed p-2 transition-colors",
                dropTarget === status
                  ? "border-brand-400 bg-brand-50/60"
                  : "border-slate-200 bg-slate-50/50"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDropTarget(status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDropTarget((current) => (current === status ? null : current));
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                void handleDrop(status);
              }}
            >
              {pipeline[status].map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", String(lead.id));
                    e.dataTransfer.effectAllowed = "move";
                    handleDragStart(lead.id);
                  }}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing",
                    draggingId === lead.id && "opacity-50"
                  )}
                >
                  <Link
                    href={`/leads/${lead.id}`}
                    draggable={false}
                    className="block"
                    onClick={(e) => {
                      if (didDrag.current) {
                        e.preventDefault();
                        didDrag.current = false;
                      }
                    }}
                  >
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
    </div>
  );
}
