/**
 * Combat Phases Engine
 *
 * Implements the Open 00 9-phase Tactical Round Sequence.
 * Pure functions with no FoundryVTT imports.
 */

/** The 9 combat phases in order per the Open 00 Tactical Round Sequence. */
export const COMBAT_PHASES = [
  'Assessment',
  'ActionDeclaration',
  'Move',
  'SpellA',
  'RangedA',
  'Melee',
  'RangedB',
  'SpellB',
  'OtherActions',
] as const;

export type CombatPhase = (typeof COMBAT_PHASES)[number];

/**
 * Advance to the next phase in sequence.
 * When on the last phase (OtherActions, index 8), wraps to Assessment (index 0)
 * and increments the round.
 */
export function advancePhase(
  phase: number,
  round: number
): { phase: number; round: number } {
  const nextIndex = phase + 1;
  if (nextIndex >= COMBAT_PHASES.length) {
    return { phase: 0, round: round + 1 };
  }
  return { phase: nextIndex, round };
}

/**
 * Revert to the previous phase in sequence.
 * If on Assessment (index 0) of round 1, stays at Assessment round 1 (clamped).
 * If on Assessment of round > 1, goes to OtherActions of the previous round.
 */
export function revertPhase(
  phase: number,
  round: number
): { phase: number; round: number } {
  if (phase === 0) {
    if (round <= 1) {
      return { phase: 0, round: 1 };
    }
    return { phase: COMBAT_PHASES.length - 1, round: round - 1 };
  }
  return { phase: phase - 1, round };
}

/**
 * Decrement duration by 1 for each condition.
 * Removes conditions whose duration reaches 0.
 */
export function decrementConditions(
  conditions: { name: string; duration: number }[]
): { name: string; duration: number }[] {
  return conditions
    .map((c) => ({ name: c.name, duration: c.duration - 1 }))
    .filter((c) => c.duration > 0);
}
