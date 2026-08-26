/**
 * Encumbrance level determination for Open 00 (VsD v1.5).
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Five qualitative levels in severity order:
 *   Unencumbered → LightlyEncumbered → Encumbered → HeavilyEncumbered → OverEncumbered
 *
 * Key rules:
 * - Lightly Encumbered = NO penalties (move rate unaffected, no action penalties)
 * - BRN >= 30 AND FOR >= 30, OR Large size → effective level reduced by one
 * - Armor is NEVER factored into encumbrance level (armor has its own separate penalties)
 * - Reduction does NOT stack (Large + BRN/FOR still only reduces by one)
 *
 * Source: vsd-travel-healing.md §Encumbrance table and §Special Rules.
 */

export type EncumbranceLevel =
  | 'Unencumbered'
  | 'LightlyEncumbered'
  | 'Encumbered'
  | 'HeavilyEncumbered'
  | 'OverEncumbered';

/** Ordered list of encumbrance levels from lightest to heaviest. */
export const ENCUMBRANCE_LEVELS: readonly EncumbranceLevel[] = [
  'Unencumbered',
  'LightlyEncumbered',
  'Encumbered',
  'HeavilyEncumbered',
  'OverEncumbered',
] as const;

export type CharacterSize = 'Small' | 'Medium' | 'Large';

export interface EncumbranceReductionParams {
  /** Character's Brawn (BRN) stat total. */
  brn: number;
  /** Character's Fortitude (FOR) stat total. Historically named "piernas" in the system. */
  piernas: number;
  /** Character's size category. */
  size: CharacterSize;
}

/**
 * Whether a given encumbrance level imposes penalties.
 *
 * Per VsD v1.5: Unencumbered and Lightly Encumbered have NO penalties.
 * Encumbered, Heavily Encumbered, and Over Encumbered have penalties.
 */
export function hasEncumbrancePenalties(level: EncumbranceLevel): boolean {
  return level !== 'Unencumbered' && level !== 'LightlyEncumbered';
}

/**
 * Compute the effective encumbrance level after applying reduction rules.
 *
 * Reduction qualifiers (OR, not AND — but reduction is always exactly one level):
 * - BRN >= 30 AND FOR >= 30
 * - Large size
 *
 * These do NOT stack: even if both apply, the reduction is still only one level.
 * Cannot reduce below Unencumbered.
 *
 * @param rawLevel - The assessed encumbrance level before reduction
 * @param params - Character stats relevant to reduction
 * @returns The effective encumbrance level (same or one lower)
 */
export function getEffectiveEncumbranceLevel(
  rawLevel: EncumbranceLevel,
  params: EncumbranceReductionParams,
): EncumbranceLevel {
  const qualifies =
    (params.brn >= 30 && params.piernas >= 30) || params.size === 'Large';

  if (!qualifies) return rawLevel;

  const idx = ENCUMBRANCE_LEVELS.indexOf(rawLevel);
  if (idx <= 0) return 'Unencumbered';
  return ENCUMBRANCE_LEVELS[idx - 1];
}

/**
 * Determine raw encumbrance level from total encumbrance points and Brawn stat.
 *
 * Thresholds (carried forward for sheet presentation):
 * - Unencumbered: totalPoints <= brawn
 * - LightlyEncumbered: brawn < totalPoints <= brawn × 1.5
 * - Encumbered: brawn × 1.5 < totalPoints <= brawn × 2
 * - HeavilyEncumbered: brawn × 2 < totalPoints <= brawn × 3
 * - OverEncumbered: totalPoints > brawn × 3
 */
export function determineEncumbranceLevel(totalPoints: number, brawn: number): EncumbranceLevel {
  if (totalPoints <= brawn) return 'Unencumbered';
  if (totalPoints <= brawn * 1.5) return 'LightlyEncumbered';
  if (totalPoints <= brawn * 2) return 'Encumbered';
  if (totalPoints <= brawn * 3) return 'HeavilyEncumbered';
  return 'OverEncumbered';
}

/**
 * Compute total encumbrance points from a list of items.
 *
 * Each item's contribution is its encumbrance value multiplied by its quantity.
 */
export function computeTotalEncumbrance(items: { encumbrance: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.encumbrance * item.quantity, 0);
}

/**
 * Penalties imposed by each encumbrance level per VsD v1.5 §Encumbrance.
 *
 * - moveRateFraction: multiplier applied to base Move Rate (1 = unaffected)
 * - actionPenalty: flat penalty to all action rolls (non-positive)
 * - canSprint: whether the character can Sprint
 * - canAttack: whether the character can make attacks
 * - canTravel: whether the character can undertake overland travel
 * - swiToDefense: whether SWI contributes to Defense
 */
export interface EncumbrancePenalties {
  moveRateFraction: number;
  actionPenalty: number;
  canSprint: boolean;
  canAttack: boolean;
  canTravel: boolean;
  swiToDefense: boolean;
}

const PENALTY_TABLE: Record<EncumbranceLevel, EncumbrancePenalties> = {
  Unencumbered: {
    moveRateFraction: 1,
    actionPenalty: 0,
    canSprint: true,
    canAttack: true,
    canTravel: true,
    swiToDefense: true,
  },
  LightlyEncumbered: {
    moveRateFraction: 1,
    actionPenalty: 0,
    canSprint: true,
    canAttack: true,
    canTravel: true,
    swiToDefense: true,
  },
  Encumbered: {
    moveRateFraction: 2 / 3,
    actionPenalty: 0,
    canSprint: true,
    canAttack: true,
    canTravel: true,
    swiToDefense: true,
  },
  HeavilyEncumbered: {
    moveRateFraction: 1 / 2,
    actionPenalty: -20,
    canSprint: true,
    canAttack: true,
    canTravel: true,
    swiToDefense: true,
  },
  OverEncumbered: {
    moveRateFraction: 1 / 4,
    actionPenalty: 0,
    canSprint: false,
    canAttack: false,
    canTravel: false,
    swiToDefense: false,
  },
};

/**
 * Get the penalties for a given encumbrance level.
 *
 * @param level - The effective encumbrance level
 * @returns Penalties struct with move rate fraction, action penalty, and restrictions
 */
export function getEncumbrancePenalties(level: EncumbranceLevel): EncumbrancePenalties {
  return PENALTY_TABLE[level];
}
