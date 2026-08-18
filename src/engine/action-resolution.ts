/**
 * Outcome bands for the Action Resolution Table.
 *
 * Boundaries:
 * - total ≤ 4   → CriticalFailure
 * - 5–74        → Failure
 * - 75–99       → PartialSuccess
 * - 100–174     → Success
 * - total ≥ 175 → OutstandingSuccess
 */
export type OutcomeBand =
  | 'CriticalFailure'
  | 'Failure'
  | 'PartialSuccess'
  | 'Success'
  | 'OutstandingSuccess';

/** Lookup outcome band from skill check total. Accepts any integer including negatives. */
export function resolveAction(total: number): OutcomeBand {
  if (total <= 4) return 'CriticalFailure';
  if (total <= 74) return 'Failure';
  if (total <= 99) return 'PartialSuccess';
  if (total <= 174) return 'Success';
  return 'OutstandingSuccess';
}
