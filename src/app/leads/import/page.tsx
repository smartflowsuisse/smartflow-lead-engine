import { CsvImportPanel } from "@/components/import/CsvImportPanel";

export default function ImportLeadsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Import Leads</h1>
        <p className="mt-1 text-slate-500">
          Upload a CSV, review the preview, then confirm import into your CRM
        </p>
      </div>

      <CsvImportPanel />
    </div>
  );
}
