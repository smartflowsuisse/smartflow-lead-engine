"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildMailtoHref,
  buildOutreachSessionEmail,
  buildOutreachSessionSubject,
  getOutreachSessionContext,
  sortOutreachSessionLeads,
  type OutreachSessionLead,
} from "@/lib/leads/outreach-session";

type LoadState = "idle" | "loading" | "ready" | "error";

function getApiLeads(payload: unknown): OutreachSessionLead[] {
  if (Array.isArray(payload)) {
    return payload as OutreachSessionLead[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.leads)) {
      return record.leads as OutreachSessionLead[];
    }

    if (Array.isArray(record.data)) {
      return record.data as OutreachSessionLead[];
    }
  }

  return [];
}

export function OutreachSessionClient() {
  const [leads, setLeads] = useState<OutreachSessionLead[]>([]);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<LoadState>("idle");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [contactState, setContactState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    let active = true;

    async function loadLeads() {
      setState("loading");

      try {
        const response = await fetch("/api/leads", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to load leads: ${response.status}`);
        }

        const payload = await response.json();
        const sorted = sortOutreachSessionLeads(getApiLeads(payload));

        if (active) {
          setLeads(sorted);
          setIndex(0);
          setState("ready");
        }
      } catch {
        if (active) {
          setState("error");
        }
      }
    }

    void loadLeads();

    return () => {
      active = false;
    };
  }, []);

  const currentLead = leads[index] ?? null;

  const emailText = useMemo(() => {
    return currentLead ? buildOutreachSessionEmail(currentLead) : "";
  }, [currentLead]);

  const mailtoHref = currentLead ? buildMailtoHref(currentLead) : null;

  async function copyEmailText() {
    if (!currentLead) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `Subject: ${buildOutreachSessionSubject(currentLead)}\n\n${emailText}`,
      );
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function resetActionState() {
    setCopyState("idle");
    setContactState("idle");
  }

  function removeCurrentLeadFromSession() {
    if (!currentLead) {
      return;
    }

    setLeads((currentLeads) => {
      const nextLeads = currentLeads.filter((lead) => String(lead.id) !== String(currentLead.id));

      setIndex((currentIndex) => {
        if (nextLeads.length === 0) {
          return 0;
        }

        return Math.min(currentIndex, nextLeads.length - 1);
      });

      return nextLeads;
    });

    resetActionState();
  }

  async function markCurrentLeadAsContacted() {
    if (!currentLead) {
      return;
    }

    setContactState("loading");

    try {
      const response = await fetch(`/api/leads/${currentLead.id}/outreach`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ outreach_status: "Contacted" }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to mark lead as contacted");
      }

      setContactState("done");
      removeCurrentLeadFromSession();
    } catch {
      setContactState("error");
    }
  }

  function goNext() {
    resetActionState();
    setIndex((value) => Math.min(value + 1, Math.max(leads.length - 1, 0)));
  }

  function goPrevious() {
    resetActionState();
    setIndex((value) => Math.max(value - 1, 0));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              SmartFlow Outreach Session
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Work one lead at a time
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review the next best actionable lead, open the website or lead profile,
              prepare the email draft, then continue to the next lead.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-950">{leads.length}</div>
            <div>actionable leads</div>
          </div>
        </div>
      </div>

      {state === "loading" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading outreach session…
        </div>
      ) : null}

      {state === "error" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Could not load leads from the API.
        </div>
      ) : null}

      {state === "ready" && !currentLead ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">No actionable leads</h2>
          <p className="mt-2 text-sm text-slate-600">
            Import new Construction / Bau leads or review the Outreach Queue.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm" href="/leads/import">
              Import CSV
            </Link>
            <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm" href="/outreach">
              Open Outreach
            </Link>
          </div>
        </div>
      ) : null}

      {currentLead ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Lead {index + 1} of {leads.length}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {currentLead.company || "Unnamed lead"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {getOutreachSessionContext(currentLead) || "No city / industry context"}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
                <div className="text-xl font-semibold text-emerald-800">
                  {currentLead.lead_score ?? 0}
                </div>
                <div className="text-xs text-emerald-700">lead score</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Email</div>
                <div className="mt-1 break-all text-sm text-slate-900">
                  {currentLead.email || "No email"}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Phone</div>
                <div className="mt-1 text-sm text-slate-900">
                  {currentLead.phone || "No phone"}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Website</div>
                <div className="mt-1 break-all text-sm text-slate-900">
                  {currentLead.website || "No website"}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
                <div className="mt-1 text-sm text-slate-900">
                  {currentLead.status || "Unknown"} / {currentLead.outreach_status || "Unknown"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                href={`/leads/${currentLead.id}`}
              >
                Open Lead
              </Link>

              {currentLead.website ? (
                <a
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800"
                  href={currentLead.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open Website
                </a>
              ) : null}

              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800"
                type="button"
                onClick={() => void copyEmailText()}
              >
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy Email Text"}
              </button>

              <button
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800"
                type="button"
                onClick={removeCurrentLeadFromSession}
              >
                Skip Lead (session only)
              </button>

              <button
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 disabled:opacity-50"
                type="button"
                disabled={contactState === "loading"}
                onClick={() => {
                    const confirmed = window.confirm(
                      "Mark this lead as contacted only after you manually sent the email. Continue?"
                    );

                    if (!confirmed) return;

                    void markCurrentLeadAsContacted();
                  }}
              >
                {contactState === "loading" ? "Saving..." : "Mark as Contacted (after manual send)"}
              </button>

              {mailtoHref ? (
                <a
                  className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800"
                  href={mailtoHref}
                >
                  Open Email Draft (manual send)
                </a>
              ) : null}

              <Link
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800"
                href="/outreach?templatePack=construction"
              >
                Open Construction Queue
              </Link>
            </div>

            {contactState === "error" ? (
              <p className="mt-3 text-sm text-red-600">
                Could not mark this lead as contacted.
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                type="button"
                disabled={index === 0}
                onClick={goPrevious}
              >
                Previous
              </button>
              <button
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                type="button"
                disabled={index >= leads.length - 1}
                onClick={goNext}
              >
                Next lead
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Lead readiness
            </p>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-600">Email</span>
                <span className={currentLead.email?.trim() ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                  {currentLead.email?.trim() ? "Ready" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-600">Phone</span>
                <span className={currentLead.phone?.trim() ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                  {currentLead.phone?.trim() ? "Ready" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-600">Website</span>
                <span className={currentLead.website?.trim() ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                  {currentLead.website?.trim() ? "Ready" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-600">Score</span>
                <span className="font-medium text-slate-900">{currentLead.lead_score ?? 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-600">CRM status</span>
                <span className="font-medium text-slate-900">{currentLead.status || "Unknown"}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-600">Outreach status</span>
                <span className="font-medium text-slate-900">{currentLead.outreach_status || "Unknown"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Email preview
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-950">
              {buildOutreachSessionSubject(currentLead)}
            </h3>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {emailText}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
