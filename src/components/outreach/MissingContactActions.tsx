"use client";

import Link from "next/link";
import { useState } from "react";

interface MissingContactActionsProps {
  leadId: number;
  website?: string | null;
  phone?: string | null;
}

type CopyTarget = "website" | "phone";
type CopyState = CopyTarget | "error" | null;

const buttonClass =
  "inline-flex min-w-24 items-center justify-center whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

const primaryButtonClass =
  "inline-flex min-w-24 items-center justify-center whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800";

function cleanValue(value?: string | null): string | null {
  const cleaned = value?.trim();

  return cleaned ? cleaned : null;
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function MissingContactActions({
  leadId,
  website,
  phone,
}: MissingContactActionsProps) {
  const [copyState, setCopyState] = useState<CopyState>(null);

  const cleanWebsite = cleanValue(website);
  const cleanPhone = cleanValue(phone);

  const handleCopy = async (target: CopyTarget, value: string | null) => {
    if (!value) return;

    try {
      await copyText(value);
      setCopyState(target);
      setTimeout(() => setCopyState(null), 1800);
    } catch {
      setCopyState("error");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <Link href={`/leads/${leadId}`} className={buttonClass}>
          Open Lead
        </Link>

        <Link
          href={`/leads/${leadId}/edit?returnTo=/outreach/missing-contacts&noteHint=email-source`}
          className={primaryButtonClass}
        >
          Add Email
        </Link>

        <button
          type="button"
          onClick={() => void handleCopy("website", cleanWebsite)}
          disabled={!cleanWebsite}
          className={buttonClass}
        >
          {copyState === "website" ? "Website Copied" : "Copy Website"}
        </button>

        <button
          type="button"
          onClick={() => void handleCopy("phone", cleanPhone)}
          disabled={!cleanPhone}
          className={buttonClass}
        >
          {copyState === "phone" ? "Phone Copied" : "Copy Phone"}
        </button>
      </div>

      {copyState === "error" ? (
        <p className="text-xs text-red-600">Copy failed</p>
      ) : null}
    </div>
  );
}
