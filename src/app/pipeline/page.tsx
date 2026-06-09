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
      </div>

      <PipelineBoard initialPipeline={pipeline} />
    </div>
  );
}
