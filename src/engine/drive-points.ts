/**
 * Drive Points management for Against the Darkmaster (VsD).
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Drive Points fuel Passion invocations and are awarded/removed by the GM.
 * All operations clamp the resulting value to [0, max].
 */

/**
 * Modify current Drive Points by a delta value (positive for award, negative for spend).
 * The result is clamped to the range [0, max].
 *
 * @param current - Current Drive Points (in [0, max])
 * @param max - Maximum Drive Points (>= 0)
 * @param delta - Amount to add (positive) or remove (negative)
 * @returns The new current Drive Points value, clamped to [0, max]
 */
export function modifyDrivePoints(current: number, max: number, delta: number): number {
  const result = current + delta;
  return Math.max(0, Math.min(max, result));
}

/**
 * Invoke a Passion by spending 1 Drive Point.
 *
 * If the character has at least 1 Drive Point, deducts 1 and returns a +30 bonus.
 * If current is 0, returns an error indicating insufficient Drive Points.
 *
 * @param current - Current Drive Points
 * @returns Object with newCurrent and bonus on success, or error string on failure
 */
export function invokePassion(current: number): { newCurrent: number; bonus: number } | { error: string } {
  if (current <= 0) {
    return { error: 'insufficient drive points' };
  }
  return { newCurrent: current - 1, bonus: 30 };
}
