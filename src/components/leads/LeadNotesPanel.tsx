"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface LeadNotesPanelProps {
  leadId: number;
  initialNotes: string | null;
  updatedAt: string;
}

export function LeadNotesPanel({
  leadId,
  initialNotes,
  updatedAt,
}: LeadNotesPanelProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [savedNotes, setSavedNotes] = useState(initialNotes ?? "");
  const [lastUpdated, setLastUpdated] = useState(updatedAt);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(initialNotes ?? "");
    setSavedNotes(initialNotes ?? "");
    setLastUpdated(updatedAt);
  }, [initialNotes, updatedAt]);

  const hasChanges = notes !== savedNotes;

  const saveNotes = async () => {
    if (!hasChanges) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save notes");
      }

      const nextNotes = data.notes ?? "";
      setNotes(nextNotes);
      setSavedNotes(nextNotes);
      setLastUpdated(data.updated_at);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Notes</h3>
          <p className="mt-1 text-xs text-slate-500">
            Last updated {formatDateTime(lastUpdated)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void saveNotes()}
          disabled={loading || !hasChanges}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={5}
        placeholder="Add internal notes about this lead..."
        className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
