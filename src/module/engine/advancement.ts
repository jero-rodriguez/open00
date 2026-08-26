/**
 * Advancement engine for Open 00.
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * VsD v1.5 Rules (vsd-character.md §Vocations, §Advancement; vsd-core-rules.md §Experience & Levels):
 * - Per-category DP budgets from Vocation table (same allocation each level)
 * - Max 2 ranks purchased per skill per level
 * - DPs transfer between categories at 2:1 ratio
 * - Unspent DPs are lost at level-up (no carry-over)
 * - Cultural ranks do NOT count toward max-developable-ranks calculation
 * - NO global rank-30 cap
 * - XP thresholds: L1-5 = 10/lvl, L6-10 = 20/lvl
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** Skill categories for DP allocation. */
export type SkillCategory =
  | 'armor'
  | 'combat'
  | 'adventuring'
  | 'roguery'
  | 'lore'
  | 'spells'
  | 'body';

/** DP budget per category for a single level. */
export type DPBudget = Record<SkillCategory, number>;

/** Vocation identifier. */
export type VocationId =
  | 'warrior'
  | 'rogue'
  | 'wizard'
  | 'animist'
  | 'dabbler'
  | 'champion';

/** State needed to validate a rank allocation for a single skill. */
export interface SkillAdvancementState {
  /** Current total rank (including cultural). */
  currentRank: number;
  /** Ranks purchased THIS level (excluding cultural). */
  ranksThisLevel: number;
  /** Ranks that came from cultural allocation (excluded from max-developable check). */
  culturalRanks: number;
}

/** XP progression entry. */
export interface LevelEntry {
  level: number;
  xpThreshold: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Maximum ranks a character can purchase in a single skill per level. */
export const MAX_RANKS_PER_SKILL_PER_LEVEL = 2;

/**
 * Per-vocation DP budgets per level.
 * Source: vsd-character.md §Vocation DP Summary table.
 */
export const VOCATION_DP_BUDGETS: Record<VocationId, DPBudget> = {
  warrior: { armor: 2, combat: 5, adventuring: 4, roguery: 2, lore: 0, spells: 0, body: 2 },
  rogue: { armor: 1, combat: 3, adventuring: 4, roguery: 5, lore: 1, spells: 0, body: 1 },
  wizard: { armor: 0, combat: 0, adventuring: 1, roguery: 1, lore: 5, spells: 5, body: 0 },
  animist: { armor: 0, combat: 1, adventuring: 2, roguery: 1, lore: 4, spells: 5, body: 0 },
  dabbler: { armor: 1, combat: 2, adventuring: 3, roguery: 3, lore: 1, spells: 3, body: 1 },
  champion: { armor: 2, combat: 3, adventuring: 3, roguery: 0, lore: 1, spells: 3, body: 2 },
} as const;

/**
 * XP progression table.
 * Levels 1-5: 10 XP per level. Levels 6-10: 20 XP per level.
 * Source: vsd-core-rules.md §Experience & Levels.
 */
export const XP_TABLE: LevelEntry[] = [
  { level: 1, xpThreshold: 10 },
  { level: 2, xpThreshold: 20 },
  { level: 3, xpThreshold: 30 },
  { level: 4, xpThreshold: 40 },
  { level: 5, xpThreshold: 50 },
  { level: 6, xpThreshold: 70 },
  { level: 7, xpThreshold: 90 },
  { level: 8, xpThreshold: 110 },
  { level: 9, xpThreshold: 130 },
  { level: 10, xpThreshold: 150 },
];

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Allocate 1 rank to a skill using available DP.
 *
 * Rules enforced:
 * - Max 2 ranks per skill per level (cultural ranks excluded from this count)
 * - Cost must not exceed available DP
 * - NO rank-30 cap (ranks can exceed 30)
 *
 * @param state - Current skill advancement state
 * @param availableDP - DP remaining in the skill's category
 * @returns New rank, remaining DP, and updated ranksThisLevel; or error
 */
export function allocateRank(
  state: SkillAdvancementState,
  availableDP: number
): { newRank: number; remainingDP: number; ranksThisLevel: number } | { error: string } {
  if (state.ranksThisLevel >= MAX_RANKS_PER_SKILL_PER_LEVEL) {
    return { error: 'max ranks per skill per level reached' };
  }
  if (availableDP < 1) {
    return { error: 'insufficient DP' };
  }
  return {
    newRank: state.currentRank + 1,
    remainingDP: availableDP - 1,
    ranksThisLevel: state.ranksThisLevel + 1,
  };
}

/**
 * Transfer DP between categories at 2:1 ratio.
 *
 * @param sourceDP - Available DP in the source category
 * @param amount - Amount to deduct from source (must be even, positive)
 * @returns Remaining source DP and gained target DP; or error
 */
export function transferDP(
  sourceDP: number,
  amount: number
): { sourceRemaining: number; targetGained: number } | { error: string } {
  if (amount < 0) {
    return { error: 'invalid transfer amount' };
  }
  if (amount === 0 || amount % 2 !== 0) {
    return { error: 'transfer amount must be even (2:1 ratio)' };
  }
  if (amount > sourceDP) {
    return { error: 'insufficient source DP' };
  }
  return {
    sourceRemaining: sourceDP - amount,
    targetGained: amount / 2,
  };
}

/**
 * Begin a new level: return a fresh DP budget for the vocation.
 * Any unspent DPs from the prior level are lost.
 *
 * @param vocation - The character's vocation
 * @returns Fresh DP budget for the new level
 */
export function levelUp(vocation: VocationId): DPBudget {
  return { ...VOCATION_DP_BUDGETS[vocation] };
}

/**
 * Compute the XP threshold for a given level.
 *
 * @param level - Target level (1-10)
 * @returns The cumulative XP required, or null if level is out of table range
 */
export function computeXPThreshold(level: number): number | null {
  const entry = XP_TABLE.find((e) => e.level === level);
  return entry?.xpThreshold ?? null;
}

/**
 * Check whether a character qualifies for the next level.
 *
 * @param totalXP - Character's cumulative XP
 * @param currentLevel - Character's current level
 * @returns true if totalXP >= threshold for currentLevel + 1
 */
export function checkLevelUp(totalXP: number, currentLevel: number): boolean {
  const threshold = computeXPThreshold(currentLevel + 1);
  if (threshold === null) {
    return false;
  }
  return totalXP >= threshold;
}
