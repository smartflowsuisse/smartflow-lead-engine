/** SQLite stores unknown numeric scores as -1. */
export const UNKNOWN_SCORE = -1;

export function scoreToDb(value: number | null | undefined): number {
  if (value === null || value === undefined) return UNKNOWN_SCORE;
  return value;
}

export function scoreFromDb(value: number): number | null {
  return value < 0 ? null : value;
}

export function triStateToDb(value: boolean | null | undefined): number {
  if (value === null || value === undefined) return UNKNOWN_SCORE;
  return value ? 1 : 0;
}

export function triStateFromDb(value: number): boolean | null {
  if (value < 0) return null;
  return Boolean(value);
}

export function isKnownScore(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && value >= 0;
}
