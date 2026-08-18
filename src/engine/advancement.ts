/**
 * Advancement engine for Against the Darkmaster (VsD).
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Handles Development Point (DP) allocation for skill rank increases
 * and level-up eligibility checks against an XP progression table.
 *
 * Rules:
 * - Each DP allocation increases a skill rank by exactly 1
 * - Maximum skill rank is 30
 * - Allocation is rejected if cost exceeds available DP
 * - Allocation is rejected if current rank is already 30
 * - Level-up occurs when total XP meets or exceeds the threshold for the next level
 */

/** A single entry in the level progression table. */
export interface LevelEntry {
  /** The character level this entry represents. */
  level: number;
  /** The cumulative XP required to reach this level. */
  xpThreshold: number;
}

/**
 * Allocate Development Points to increase a skill rank by 1.
 *
 * Validation:
 * - If currentRank >= 30, returns error "maximum rank reached"
 * - If cost > availableDP, returns error "insufficient DP"
 * - Otherwise, returns the new rank (currentRank + 1) and remaining DP (availableDP - cost)
 *
 * @param availableDP - The character's currently available Development Points (non-negative integer)
 * @param cost - The DP cost for this allocation (positive integer, may be vocation-modified)
 * @param currentRank - The current rank of the target skill (integer, 0–30)
 * @returns The new rank and remaining DP, or an error message
 */
export function allocateDP(
  availableDP: number,
  cost: number,
  currentRank: number
): { newRank: number; remainingDP: number } | { error: string } {
  if (currentRank >= 30) {
    return { error: 'maximum rank reached' };
  }
  if (cost > availableDP) {
    return { error: 'insufficient DP' };
  }
  return { newRank: currentRank + 1, remainingDP: availableDP - cost };
}

/**
 * Check whether a character is eligible to level up based on total XP.
 *
 * Returns true if totalXP >= the xpThreshold for (currentLevel + 1) in the
 * progression table. Returns false if currentLevel + 1 is not found in the
 * table or if XP is insufficient.
 *
 * @param totalXP - The character's cumulative experience points (non-negative integer)
 * @param currentLevel - The character's current level (positive integer)
 * @param progressionTable - The level progression table with XP thresholds
 * @returns true if the character qualifies for the next level, false otherwise
 */
export function checkLevelUp(
  totalXP: number,
  currentLevel: number,
  progressionTable: LevelEntry[]
): boolean {
  const nextLevelEntry = progressionTable.find(
    (entry) => entry.level === currentLevel + 1
  );
  if (!nextLevelEntry) {
    return false;
  }
  return totalXP >= nextLevelEntry.xpThreshold;
}
