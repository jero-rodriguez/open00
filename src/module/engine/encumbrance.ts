/**
 * Encumbrance level determination and penalties for Open 00.
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Encumbrance levels are determined by comparing total encumbrance points
 * to the character's Brawn stat value:
 * - Unencumbered: totalPoints ≤ brawn
 * - LightlyEncumbered: brawn < totalPoints ≤ brawn × 1.5
 * - Encumbered: brawn × 1.5 < totalPoints ≤ brawn × 2
 * - HeavilyEncumbered: brawn × 2 < totalPoints ≤ brawn × 3
 * - OverEncumbered: totalPoints > brawn × 3
 */

export type EncumbranceLevel =
  | 'Unencumbered'
  | 'LightlyEncumbered'
  | 'Encumbered'
  | 'HeavilyEncumbered'
  | 'OverEncumbered';

export interface EncumbrancePenalties {
  /** Penalty to maneuver rolls (non-positive) */
  maneuver: number;
  /** Penalty to movement rate as a percentage (non-positive, e.g., -25 means -25%) */
  movement: number;
  /** Penalty to all skill checks (non-positive) */
  allSkills: number;
}

/**
 * Determine encumbrance level from total encumbrance points and Brawn stat value.
 *
 * Thresholds:
 * - Unencumbered: totalPoints ≤ brawn
 * - LightlyEncumbered: brawn < totalPoints ≤ brawn × 1.5
 * - Encumbered: brawn × 1.5 < totalPoints ≤ brawn × 2
 * - HeavilyEncumbered: brawn × 2 < totalPoints ≤ brawn × 3
 * - OverEncumbered: totalPoints > brawn × 3
 *
 * @param totalPoints - Total encumbrance points (non-negative integer)
 * @param brawn - Character's Brawn stat value (positive integer)
 */
export function determineEncumbranceLevel(totalPoints: number, brawn: number): EncumbranceLevel {
  if (totalPoints <= brawn) return 'Unencumbered';
  if (totalPoints <= brawn * 1.5) return 'LightlyEncumbered';
  if (totalPoints <= brawn * 2) return 'Encumbered';
  if (totalPoints <= brawn * 3) return 'HeavilyEncumbered';
  return 'OverEncumbered';
}

/**
 * Get penalties for a given encumbrance level.
 *
 * Penalty schedule:
 * - Unencumbered: no penalties
 * - LightlyEncumbered: -10 maneuver, -25% movement, -5 all skills
 * - Encumbered: -20 maneuver, -50% movement, -10 all skills
 * - HeavilyEncumbered: -30 maneuver, -75% movement, -20 all skills
 * - OverEncumbered: -50 maneuver, -100% movement, -30 all skills
 *
 * @param level - The encumbrance level to look up penalties for
 */
export function getEncumbrancePenalties(level: EncumbranceLevel): EncumbrancePenalties {
  switch (level) {
    case 'Unencumbered':
      return { maneuver: 0, movement: 0, allSkills: 0 };
    case 'LightlyEncumbered':
      return { maneuver: -10, movement: -25, allSkills: -5 };
    case 'Encumbered':
      return { maneuver: -20, movement: -50, allSkills: -10 };
    case 'HeavilyEncumbered':
      return { maneuver: -30, movement: -75, allSkills: -20 };
    case 'OverEncumbered':
      return { maneuver: -50, movement: -100, allSkills: -30 };
  }
}

/**
 * Compute total encumbrance points from a list of items.
 *
 * Each item's contribution is its encumbrance value multiplied by its quantity.
 * The total is the sum of all item contributions.
 *
 * @param items - Collection of items with encumbrance value and quantity
 */
export function computeTotalEncumbrance(items: { encumbrance: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.encumbrance * item.quantity, 0);
}
