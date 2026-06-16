"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { TemplatePackOutreachLead } from "@/lib/leads/template-pack-outreach-message";
import {
  buildTemplatePackOutreachEmail,
  buildTemplatePackOutreachMailtoHref,
} from "@/lib/leads/template-pack-outreach-message";
import { isTemplatePackId } from "@/lib/templates/template-pack-context";

interface TemplatePackLeadMessageButtonProps {
  lead: TemplatePackOutreachLead;
}

const actionButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";

export function TemplatePackLeadMessageButton({
  lead,
}: TemplatePackLeadMessageButtonProps) {
  const searchParams = useSearchParams();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const templatePack = searchParams.get("templatePack");

  const email = useMemo(() => {
    if (!isTemplatePackId(templatePack)) {
      return null;
    }

    return buildTemplatePackOutreachEmail({
      lead,
      templatePackId: templatePack,
      language: "en",
    });
  }, [lead, templatePack]);

  const mailtoHref = useMemo(() => {
    if (!isTemplatePackId(templatePack)) {
      return null;
    }

    return buildTemplatePackOutreachMailtoHref({
      lead,
      templatePackId: templatePack,
      language: "en",
    });
  }, [lead, templatePack]);

  if (!email) {
    return null;
  }

  async function copyEmail() {
    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <>
      <button type="button" onClick={copyEmail} className={actionButtonClass}>
        {copyState === "copied"
          ? "Pack email copied"
          : copyState === "error"
            ? "Copy failed"
            : "Copy pack email"}
      </button>

      {mailtoHref ? (
        <a href={mailtoHref} className={actionButtonClass}>
          Open email draft
        </a>
      ) : null}
    </>
  );
}
