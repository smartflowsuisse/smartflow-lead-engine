"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { TemplatePackOutreachLead } from "@/lib/leads/template-pack-outreach-message";
import { buildTemplatePackOutreachMessage } from "@/lib/leads/template-pack-outreach-message";
import { isTemplatePackId } from "@/lib/templates/template-pack-context";

interface TemplatePackLeadMessageButtonProps {
  lead: TemplatePackOutreachLead;
}

export function TemplatePackLeadMessageButton({
  lead,
}: TemplatePackLeadMessageButtonProps) {
  const searchParams = useSearchParams();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const templatePack = searchParams.get("templatePack");

  const message = useMemo(() => {
    if (!isTemplatePackId(templatePack)) {
      return null;
    }

    return buildTemplatePackOutreachMessage({
      lead,
      templatePackId: templatePack,
      language: "en",
    });
  }, [lead, templatePack]);

  if (!message) {
    return null;
  }

  async function copyMessage() {
    if (!message) {
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <button
      type="button"
      onClick={copyMessage}
      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      {copyState === "copied"
        ? "Pack message copied"
        : copyState === "error"
          ? "Copy failed"
          : "Copy pack message"}
    </button>
  );
}
