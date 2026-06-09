import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isTaskOverdue } from "../overdue";

describe("isTaskOverdue", () => {
  const today = new Date("2026-06-09T12:00:00");

  it("returns true for past due incomplete tasks", () => {
    assert.equal(isTaskOverdue("2026-06-08", false, today), true);
  });

  it("returns false for future due dates", () => {
    assert.equal(isTaskOverdue("2026-06-10", false, today), false);
  });

  it("returns false for due today", () => {
    assert.equal(isTaskOverdue("2026-06-09", false, today), false);
  });

  it("returns false for completed tasks even when past due", () => {
    assert.equal(isTaskOverdue("2026-06-01", true, today), false);
  });
});
