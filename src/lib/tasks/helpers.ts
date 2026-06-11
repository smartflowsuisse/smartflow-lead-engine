import type { LeadTask } from "../types";

export interface LeadTaskSummary {
  total: number;
  open: number;
  completed: number;
}

export function sortLeadTasks(tasks: LeadTask[]): LeadTask[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.due_date.localeCompare(b.due_date);
  });
}

export function summarizeLeadTasks(tasks: LeadTask[]): LeadTaskSummary {
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total: tasks.length,
    open: tasks.length - completed,
    completed,
  };
}
