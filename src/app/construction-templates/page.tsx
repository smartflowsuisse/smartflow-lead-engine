import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ConstructionTemplatesPanel } from "@/components/ui/ConstructionTemplatesPanel";

export default function ConstructionTemplatesPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Workflow templates
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Construction Workflow Templates
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Dedicated demo page for construction automation packages: invoice PDF
          workflows, project task automation, procurement reporting, and future
          n8n/Make implementation details.
        </p>
      </div>

      <ConstructionTemplatesPanel />
    </div>
  );
}
