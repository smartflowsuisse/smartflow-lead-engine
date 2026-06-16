"use client";

import { TemplatePackLeadMessageButton } from "@/components/outreach/TemplatePackLeadMessageButton";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  UserCheck,
} from "lucide-react";
import {
  canCopyLeadEmail,
  getCopyableLeadEmail,
  getLeadDetailsPath,
  getLeadEmailGeneratorPath,
} from "@/lib/leads/outreach-actions";

interface OutreachQueueActionsProps {
  leadId: number;
  email: string | null;
}

const actionButtonClass =
  "inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

export function OutreachQueueActions({
  leadId,
  email,
}: OutreachQueueActionsProps) {
  const router = useRouter();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const copyableEmail = getCopyableLeadEmail(email);
  const hasEmail = canCopyLeadEmail({ email });

  const handleCopyEmail = async () => {
    if (!copyableEmail) return;

    try {
      await navigator.clipboard.writeText(copyableEmail);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
    }
  };

  const handleMarkAsContacted = async () => {
    setContactLoading(true);
    setContactError(null);

    try {
      const res = await fetch(`/api/leads/${leadId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "fr" }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to mark lead as contacted");
      }

      router.refresh();
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : "Failed to mark lead as contacted"
      );
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        <Link href={getLeadDetailsPath(leadId)} className={actionButtonClass}>
          <ExternalLink className="h-3.5 w-3.5" />
          Open Lead
        </Link>

        {hasEmail ? (
          <button
            type="button"
            onClick={() => void handleCopyEmail()}
            className={actionButtonClass}
          >
            {copyState === "copied" ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copyState === "copied" ? "Copied" : "Copy Email"}
          </button>
        ) : (
          <span
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400"
            title="No email address on file"
          >
            <Mail className="h-3.5 w-3.5" />
            No email
          </span>
        )}

        <Link
          href={getLeadEmailGeneratorPath(leadId)}
          className={actionButtonClass}
        >
          <Mail className="h-3.5 w-3.5" />
          Generate Email
        </Link>
      <TemplatePackLeadMessageButton lead={{ email: email ?? null }} />

        <button
          type="button"
          onClick={() => void handleMarkAsContacted()}
          disabled={contactLoading}
          className={actionButtonClass}
        >
          {contactLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UserCheck className="h-3.5 w-3.5" />
          )}
          Mark as Contacted
        </button>
      </div>

      {copyState === "error" && (
        <p className="text-xs text-red-600">Could not copy email</p>
      )}
      {contactError && <p className="text-xs text-red-600">{contactError}</p>}
    </div>
  );
}
