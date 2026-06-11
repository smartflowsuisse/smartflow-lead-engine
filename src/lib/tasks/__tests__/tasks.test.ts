import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { createLead, deleteLead } from "../../leads";
import {
  sortLeadTasks,
  summarizeLeadTasks,
} from "../helpers";
import {
  createLeadTask,
  deleteLeadTask,
  getLeadTaskForLead,
  getTasksByLeadId,
  updateLeadTask,
} from "../../tasks";
import type { LeadTask } from "../../types";

function makeTask(
  overrides: Partial<LeadTask> & Pick<LeadTask, "id" | "title" | "due_date">
): LeadTask {
  return {
    lead_id: 1,
    completed: false,
    created_at: "2026-06-09T08:00:00Z",
    updated_at: "2026-06-09T08:00:00Z",
    ...overrides,
  };
}

describe("sortLeadTasks", () => {
  it("shows open tasks before completed tasks", () => {
    const sorted = sortLeadTasks([
      makeTask({ id: 1, title: "Done", due_date: "2026-06-08", completed: true }),
      makeTask({ id: 2, title: "Open", due_date: "2026-06-10" }),
    ]);

    assert.equal(sorted[0]?.title, "Open");
    assert.equal(sorted[1]?.title, "Done");
  });

  it("sorts open tasks by due date ascending", () => {
    const sorted = sortLeadTasks([
      makeTask({ id: 1, title: "Later", due_date: "2026-06-12" }),
      makeTask({ id: 2, title: "Soon", due_date: "2026-06-10" }),
    ]);

    assert.deepEqual(
      sorted.map((task) => task.title),
      ["Soon", "Later"]
    );
  });
});

describe("summarizeLeadTasks", () => {
  it("counts total, open, and completed tasks", () => {
    const summary = summarizeLeadTasks([
      makeTask({ id: 1, title: "A", due_date: "2026-06-10" }),
      makeTask({ id: 2, title: "B", due_date: "2026-06-11", completed: true }),
      makeTask({ id: 3, title: "C", due_date: "2026-06-12" }),
    ]);

    assert.deepEqual(summary, { total: 3, open: 2, completed: 1 });
  });
});

describe("lead task persistence", () => {
  const createdLeadIds: number[] = [];

  after(() => {
    for (const leadId of createdLeadIds) {
      deleteLead(leadId);
    }
  });

  it("creates, updates, lists, and deletes tasks per lead", () => {
    const lead = createLead({ company: `Task Test ${Date.now()}` });
    createdLeadIds.push(lead.id);

    const created = createLeadTask(lead.id, {
      title: "Call back",
      due_date: "2026-06-15",
    });
    assert.ok(created);
    assert.equal(created?.lead_id, lead.id);
    assert.equal(created?.title, "Call back");
    assert.equal(created?.completed, false);

    const tasks = getTasksByLeadId(lead.id);
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0]?.title, "Call back");

    const updated = updateLeadTask(created!.id, { completed: true });
    assert.equal(updated?.completed, true);

    const refreshed = getTasksByLeadId(lead.id);
    assert.equal(refreshed[0]?.completed, true);

    const deleted = deleteLeadTask(lead.id, created!.id);
    assert.equal(deleted, true);
    assert.equal(getTasksByLeadId(lead.id).length, 0);
    assert.equal(getLeadTaskForLead(lead.id, created!.id), null);
  });

  it("rejects deleting tasks that belong to another lead", () => {
    const leadA = createLead({ company: `Task Lead A ${Date.now()}` });
    const leadB = createLead({ company: `Task Lead B ${Date.now()}` });
    createdLeadIds.push(leadA.id, leadB.id);

    const task = createLeadTask(leadA.id, {
      title: "Follow up",
      due_date: "2026-06-16",
    });

    assert.equal(deleteLeadTask(leadB.id, task!.id), false);
    assert.equal(getTasksByLeadId(leadA.id).length, 1);
  });
});
