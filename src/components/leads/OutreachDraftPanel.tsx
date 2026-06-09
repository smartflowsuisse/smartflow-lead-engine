"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Mail, Check, UserCheck } from "lucide-react";
import {
  OUTREACH_LANGUAGES,
  type OutreachLanguage,
} from "@/lib/outreach/languages";

interface OutreachDraftPanelProps {
  leadId: number;
  hasAnalysis: boolean;
  contactedAt?: string | null;
  contactedLanguage?: string | null;
}

interface OutreachDraft {
  subject: string;
  body: string;
  language: OutreachLanguage;
  generatedAt: string;
}

export function OutreachDraftPanel({
  leadId,
  hasAnalysis,
  contactedAt,
  contactedLanguage,
}: OutreachDraftPanelProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<OutreachLanguage>(
    (contactedLanguage as OutreachLanguage) || "fr"
  );
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [copiedField, setCopiedField] = useState<"subject" | "message" | null>(
    null
  );

  const generateDraft = async () => {
    setLoading(true);
    setError(null);
    setCopiedField(null);

    try {
      const res = await fetch(`/api/leads/${leadId}/outreach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
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

  const markAsContacted = async () => {
    setContactLoading(true);
    setError(null);
    setContactSuccess(false);

    try {
      const res = await fetch(`/api/leads/${leadId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to mark lead as contacted");
      }

      setContactSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setContactLoading(false);
    }
  };

  const copyText = async (text: string, field: "subject" | "message") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
          onClick={() => void markAsContacted()}
          disabled={contactLoading}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
        >
          {contactLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          Mark as Contacted
        </button>
      </div>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Language
        </legend>
        <div className="flex flex-wrap gap-2">
          {OUTREACH_LANGUAGES.map((option) => (
            <label
              key={option.code}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                language === option.code
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="outreach-language"
                value={option.code}
                checked={language === option.code}
                onChange={() => setLanguage(option.code)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => void generateDraft()}
        disabled={loading}
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        Generate Outreach Message
      </button>

      {contactSuccess && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Lead marked as contacted.
        </p>
      )}

      {contactedAt && (
        <p className="mb-4 text-sm text-slate-600">
          Last contacted{" "}
          {new Date(contactedAt).toLocaleString("de-CH")}
          {contactedLanguage
            ? ` · ${OUTREACH_LANGUAGES.find((item) => item.code === contactedLanguage)?.label ?? contactedLanguage}`
            : ""}
        </p>
      )}

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
          <p className="text-xs text-slate-500">
            Generated{" "}
            {new Date(draft.generatedAt).toLocaleString("de-CH")} ·{" "}
            {OUTREACH_LANGUAGES.find((item) => item.code === draft.language)?.label}
          </p>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Subject
              </p>
              <button
                type="button"
                onClick={() => void copyText(draft.subject, "subject")}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {copiedField === "subject" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedField === "subject" ? "Copied" : "Copy subject"}
              </button>
            </div>
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
              {draft.subject}
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Message
              </p>
              <button
                type="button"
                onClick={() => void copyText(draft.body, "message")}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {copiedField === "message" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedField === "message" ? "Copied" : "Copy message"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-sans text-sm leading-relaxed text-slate-800">
              {draft.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
