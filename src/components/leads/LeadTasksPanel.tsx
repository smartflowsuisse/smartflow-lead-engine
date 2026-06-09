"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, Loader2, Plus } from "lucide-react";
import type { LeadTask } from "@/lib/types";
import { isTaskOverdue } from "@/lib/tasks/overdue";
import { cn, formatDate } from "@/lib/utils";

interface LeadTasksPanelProps {
  leadId: number;
  initialTasks: LeadTask[];
}

function defaultDueDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function LeadTasksPanel({ leadId, initialTasks }: LeadTasksPanelProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !dueDate) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch(`/api/leads/${leadId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle, due_date: dueDate }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTasks((prev) => [...prev, data as LeadTask].sort(sortTasks));
      setTitle("");
      setDueDate(defaultDueDate());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const toggleCompleted = async (task: LeadTask) => {
    setTogglingId(task.id);
    setError(null);

    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev
        .map((item) =>
          item.id === task.id ? { ...item, completed: nextCompleted } : item
        )
        .sort(sortTasks)
    );

    try {
      const res = await fetch(`/api/leads/${leadId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? (data as LeadTask) : item)).sort(sortTasks)
      );
      router.refresh();
    } catch (err) {
      setTasks((prev) =>
        prev
          .map((item) =>
            item.id === task.id ? { ...item, completed: task.completed } : item
          )
          .sort(sortTasks)
      );
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-900">Follow-up Tasks</h3>

      <form onSubmit={(e) => void createTask(e)} className="mb-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>
      </form>

      {error && (
        <p className="mb-3 text-xs text-red-600">{error}</p>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">No tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => {
            const overdue = isTaskOverdue(task.due_date, task.completed);

            return (
              <li
                key={task.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-2.5",
                  overdue
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                )}
              >
                <button
                  type="button"
                  onClick={() => void toggleCompleted(task)}
                  disabled={togglingId === task.id}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    task.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : overdue
                        ? "border-red-400 bg-white hover:border-red-500"
                        : "border-slate-300 bg-white hover:border-brand-500"
                  )}
                >
                  {togglingId === task.id ? (
                    <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  ) : task.completed ? (
                    <Check className="h-3 w-3" />
                  ) : null}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      task.completed
                        ? "text-slate-400 line-through"
                        : overdue
                          ? "text-red-700"
                          : "text-slate-900"
                    )}
                  >
                    {task.title}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 flex items-center gap-1 text-xs",
                      overdue ? "text-red-600" : "text-slate-500"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    Due {formatDate(task.due_date)}
                    {overdue && " · Overdue"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function sortTasks(a: LeadTask, b: LeadTask): number {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }
  return a.due_date.localeCompare(b.due_date);
}
