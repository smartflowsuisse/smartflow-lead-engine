"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Loader2, Mail, Check, UserCheck } from "lucide-react";
import {
  OUTREACH_LANGUAGES,
  type OutreachLanguage,
} from "@/lib/outreach/languages";
import type { OutreachDraft } from "@/lib/outreach/generate-outreach";
import {
  buildOutreachMailtoLink,
  formatOutreachEmailForCopy,
} from "@/lib/outreach/generate-outreach";

interface EmailGeneratorPanelProps {
  leadId: number;
  leadEmail?: string | null;
  hasAnalysis: boolean;
  contactedAt?: string | null;
  contactedLanguage?: string | null;
}

export function EmailGeneratorPanel({
  leadId,
  leadEmail,
  hasAnalysis,
  contactedAt,
  contactedLanguage,
}: EmailGeneratorPanelProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<OutreachLanguage>(
    (contactedLanguage as OutreachLanguage) || "fr"
  );
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [copiedField, setCopiedField] = useState<
    "email" | "subject" | "message" | null
  >(null);

  const generateEmail = async () => {
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
        throw new Error(data.error || "Failed to generate email");
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

  const copyText = async (
    text: string,
    field: "email" | "subject" | "message"
  ) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="email-generator"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            SmartFlow Email Generator
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Personalized outreach email
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Draft only — uses company profile, website analysis, quick wins,
            automation opportunities, and lead score. Nothing is sent.
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
                name="email-language"
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
        onClick={() => void generateEmail()}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        Generate Email
      </button>

      {contactSuccess && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Lead marked as contacted.
        </p>
      )}

      {contactedAt && (
        <p className="mt-4 text-sm text-slate-600">
          Last contacted{" "}
          {new Date(contactedAt).toLocaleString("de-CH")}
          {contactedLanguage
            ? ` · ${OUTREACH_LANGUAGES.find((item) => item.code === contactedLanguage)?.label ?? contactedLanguage}`
            : ""}
        </p>
      )}

      {!hasAnalysis && !draft && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Run website analysis first for a richer email with quick wins and
          automation opportunities.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {draft && (
        <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              Preview ·{" "}
              {new Date(draft.generatedAt).toLocaleString("de-CH")} ·{" "}
              {OUTREACH_LANGUAGES.find((item) => item.code === draft.language)?.label}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={buildOutreachMailtoLink({
                  recipient: leadEmail,
                  subject: draft.subject,
                  body: draft.body,
                })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-600 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Email Client
              </a>
              <button
                type="button"
                onClick={() => void copyText(formatOutreachEmailForCopy(draft), "email")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                {copiedField === "email" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedField === "email" ? "Copied" : "Copy Email"}
              </button>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Subject
              </p>
              <button
                type="button"
                onClick={() => void copyText(draft.subject, "subject")}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {copiedField === "subject" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedField === "subject" ? "Copied" : "Copy subject"}
              </button>
            </div>
            <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900">
              {draft.subject}
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email body
              </p>
              <button
                type="button"
                onClick={() => void copyText(draft.body, "message")}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {copiedField === "message" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedField === "message" ? "Copied" : "Copy body"}
              </button>
            </div>
            <pre className="max-h-[28rem] overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white px-4 py-3 font-sans text-sm leading-relaxed text-slate-800">
              {draft.body}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
