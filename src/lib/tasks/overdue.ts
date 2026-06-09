export function isTaskOverdue(
  dueDate: string,
  completed: boolean,
  referenceDate: Date = new Date()
): boolean {
  if (completed) return false;

  const due = dueDate.slice(0, 10);
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, "0");
  const day = String(referenceDate.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  return due < today;
}
