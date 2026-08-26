/**
 * Drive Points engine for Open 00.
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * VsD v1.5 Rules (vsd-core-rules.md §Drive):
 * - Range: 0-5. Starts at 1.
 * - Gained by following Passions into danger/drama (group decision).
 * - Spending: +10 per Drive Point spent.
 * - NO +30 invokePassion mechanic.
 */

/** Starting Drive Points for a new character. */
export const DRIVE_INITIAL = 1;

/** Maximum Drive Points a character can hold. */
export const DRIVE_MAX = 5;

/** Bonus granted per Drive Point spent (+10 per point). */
export const DRIVE_BONUS_PER_POINT = 10;

/**
 * Spend Drive Points for a bonus.
 *
 * @param current - Current Drive Points (0-5)
 * @param amount - Number of points to spend (positive integer)
 * @returns Object with remaining points and bonus, or error
 */
export function spendDrive(
  current: number,
  amount: number
): { remaining: number; bonus: number } | { error: string } {
  if (!Number.isInteger(amount) || amount < 0) {
    return { error: 'invalid spend amount' };
  }
  if (amount > current) {
    return { error: 'insufficient drive points' };
  }
  return {
    remaining: current - amount,
    bonus: amount * DRIVE_BONUS_PER_POINT,
  };
}

/**
 * Award (or remove) Drive Points, clamping to [0, DRIVE_MAX].
 *
 * @param current - Current Drive Points
 * @param delta - Amount to add (positive) or remove (negative)
 * @returns New Drive Points value, clamped to [0, 5]
 */
export function awardDrive(current: number, delta: number): number {
  return Math.max(0, Math.min(DRIVE_MAX, current + delta));
}

/**
 * Compute the total bonus from spending a given number of Drive Points.
 *
 * @param pointsSpent - Number of Drive Points being spent
 * @returns The bonus value (+10 per point)
 */
export function computeDriveBonus(pointsSpent: number): number {
  return pointsSpent * DRIVE_BONUS_PER_POINT;
}
