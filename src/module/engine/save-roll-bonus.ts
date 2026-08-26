/**
 * SR Level Bonus computation.
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * VsD v1.5 Rules (vsd-core-rules.md §SR Level Bonus table):
 * - Levels 1-10:  +5 per level
 * - Levels 11-20: +2 per level
 * - Levels 21+:   +1 per level
 *
 * Example: Level 12 → 50 (from L1-10) + 4 (2×2 from L11-12) = 54
 */

/**
 * Compute the SR Level Bonus for a given character level.
 *
 * @param level - Character level (0+). Level 0 returns 0.
 * @returns The cumulative SR Level Bonus.
 */
export function computeSaveRollBonus(level: number): number {
  if (level <= 0) return 0;
  if (level <= 10) return level * 5;
  if (level <= 20) return 50 + (level - 10) * 2;
  return 70 + (level - 20) * 1;
}
