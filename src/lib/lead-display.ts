export function scoreColor(score: number): string {
  if (score >= 65) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 45) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    "New Lead": "bg-slate-100 text-slate-700 border-slate-200",
    Analyzed: "bg-blue-100 text-blue-700 border-blue-200",
    Contacted: "bg-violet-100 text-violet-700 border-violet-200",
    "Follow Up": "bg-amber-100 text-amber-700 border-amber-200",
    "Proposal Sent": "bg-orange-100 text-orange-700 border-orange-200",
    Client: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Lost: "bg-red-100 text-red-700 border-red-200",
  };
  return colors[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}
