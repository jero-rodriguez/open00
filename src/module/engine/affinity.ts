/**
 * Affinity Bonus Activation engine for Items of Power.
 *
 * Pure function — zero FoundryVTT imports.
 *
 * Rules:
 * - If attunement status is false, no bonuses are active regardless of affinity level
 * - If attunement status is true, all bonuses with threshold ≤ affinity level are active
 * - Increasing affinity level only adds bonuses (never removes previously active ones)
 */

/**
 * Get the active bonuses for an Item of Power based on attunement and affinity level.
 *
 * @param affinityLevel - Current affinity level (0–5)
 * @param isAttuned - Whether the character is attuned to the item
 * @param bonuses - Collection of bonuses, each with a level threshold and effect description
 * @returns The subset of bonuses that are currently active
 */
export function getActiveBonuses(
  affinityLevel: number,
  isAttuned: boolean,
  bonuses: { threshold: number; effect: string }[]
): { threshold: number; effect: string }[] {
  if (!isAttuned) {
    return [];
  }
  return bonuses.filter((bonus) => bonus.threshold <= affinityLevel);
}
