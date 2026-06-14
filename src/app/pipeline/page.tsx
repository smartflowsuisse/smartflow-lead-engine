import { getLeadsByPipeline } from "@/lib/leads";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";

export default function PipelinePage() {
  const pipeline = getLeadsByPipeline();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">CRM Pipeline</h1>
        <p className="mt-1 text-slate-500">
          Drag and drop leads between pipeline stages
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Move leads from New to Contacted, then to Won or Lost when the result is clear.
          Use this board to keep CRM status aligned with outreach progress.
        </div>
      </div>

      <PipelineBoard initialPipeline={pipeline} />
    </div>
  );
}
