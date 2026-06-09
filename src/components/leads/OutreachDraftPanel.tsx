"use client";

import { useState } from "react";
import { Copy, Loader2, Mail, Check } from "lucide-react";
interface OutreachDraftPanelProps {
  leadId: number;
  hasAnalysis: boolean;
}

interface OutreachDraft {
  subject: string;
  body: string;
  generatedAt: string;
}

export function OutreachDraftPanel({
  leadId,
  hasAnalysis,
}: OutreachDraftPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [copied, setCopied] = useState(false);

  const generateDraft = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch(`/api/leads/${leadId}/outreach`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate outreach draft");
      }

      setDraft(data as OutreachDraft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyDraft = async () => {
    if (!draft) return;

    const text = `Subject: ${draft.subject}\n\n${draft.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">Outreach Draft</h2>
          <p className="mt-1 text-sm text-slate-500">
            Local template — not sent, no external APIs
          </p>
        </div>
        <button
          type="button"
          onClick={generateDraft}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Generate Outreach Message
        </button>
      </div>

      {!hasAnalysis && !draft && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Run website analysis first for a richer outreach draft.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {draft && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Generated {new Date(draft.generatedAt).toLocaleString("de-CH")}
            </p>
            <button
              type="button"
              onClick={copyDraft}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              Subject
            </p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
              {draft.subject}
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              Message
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-sans text-sm leading-relaxed text-slate-800">
              {draft.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
