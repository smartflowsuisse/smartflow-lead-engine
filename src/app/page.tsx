import Link from "next/link";
import {
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats } from "@/lib/leads";
import { StatCard } from "@/components/ui/StatCard";
import { LeadCard } from "@/components/leads/LeadCard";
import { LEAD_STATUSES } from "@/lib/types";
import { statusColor, cn } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          SmartFlow Suisse — AI-powered lead generation overview
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          subtitle="All companies in database"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Avg. Lead Score"
          value={stats.averageScore}
          subtitle="Across analyzed leads"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="High Priority"
          value={stats.highPriorityLeads}
          subtitle="Score ≥ 60, not yet client"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          subtitle={`${stats.byStatus["Client"]} clients from ${stats.totalLeads} leads`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={stats.conversionRate > 0 ? "Active pipeline" : undefined}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Pipeline Overview</h2>
            <Link
              href="/pipeline"
              className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
            >
              View pipeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {LEAD_STATUSES.map((status) => {
              const count = stats.byStatus[status];
              const pct =
                stats.totalLeads > 0
                  ? Math.round((count / stats.totalLeads) * 100)
                  : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        statusColor(status)
                      )}
                    >
                      {status}
                    </span>
                    <span className="text-slate-600">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h2 className="font-semibold text-slate-900">AI Analysis Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {stats.analyzedCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">Leads Analyzed</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalLeads - stats.analyzedCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">Pending Analysis</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">
                {stats.byStatus["Contacted"] + stats.byStatus["Follow Up"]}
              </p>
              <p className="mt-1 text-xs text-slate-500">In Outreach</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-4 text-center">
              <p className="text-3xl font-bold text-brand-700">
                {stats.byStatus["Proposal Sent"]}
              </p>
              <p className="mt-1 text-xs text-slate-500">Proposals Sent</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Leads</h2>
          <Link
            href="/leads"
            className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {stats.recentLeads.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.recentLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">No leads yet.</p>
            <Link
              href="/leads/new"
              className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Add your first lead →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
