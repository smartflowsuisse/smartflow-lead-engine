import { DiscoveryForm } from "@/components/discovery/DiscoveryForm";
import { Radar } from "lucide-react";

export default function DiscoveryPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Discovery</h1>
            <p className="mt-1 text-slate-500">
              Find Swiss companies by industry and city
            </p>
          </div>
        </div>
      </div>

      <DiscoveryForm />
    </div>
  );
}
