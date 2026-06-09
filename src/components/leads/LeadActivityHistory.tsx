import type { LeadActivity } from "@/lib/types";
import {
  formatActivityDescription,
  formatActivityTitle,
} from "@/lib/activities/format-activity";
import { formatDateTime } from "@/lib/utils";

interface LeadActivityHistoryProps {
  activities: LeadActivity[];
}

export function LeadActivityHistory({ activities }: LeadActivityHistoryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Activity History</h2>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">
                  {formatActivityTitle(activity.activity_type)}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDateTime(activity.created_at)}
                </p>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {formatActivityDescription(
                  activity.activity_type,
                  activity.details
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
