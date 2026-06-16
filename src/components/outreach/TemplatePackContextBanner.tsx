"use client";

import { useSearchParams } from "next/navigation";
import { getTemplatePackContext } from "@/lib/templates/template-pack-context";

const TEMPLATE_PACK_QUERY_PARAM = "templatePack";

export function TemplatePackContextBanner() {
  const searchParams = useSearchParams();
  const selectedTemplatePack = searchParams.get(TEMPLATE_PACK_QUERY_PARAM);
  const pack = getTemplatePackContext(selectedTemplatePack);

  if (!pack) {
    return null;
  }

  return (
    <section className="mb-5 rounded-lg border border-brand-200 bg-brand-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Selected template pack
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {pack.offerName}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{pack.offerRange}</p>
        </div>

        <div className="rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 lg:max-w-sm">
          <p className="font-semibold text-slate-900">Demo angle</p>
          <p className="mt-1 text-slate-600">{pack.demoAngle}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-brand-100 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
            Best for
          </p>
          <p className="mt-1 text-sm text-slate-600">{pack.bestFor}</p>
        </div>

        <div className="rounded-lg border border-brand-100 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
            Typical pain
          </p>
          <p className="mt-1 text-sm text-slate-600">{pack.typicalPain}</p>
        </div>
      </div>
    </section>
  );
}
