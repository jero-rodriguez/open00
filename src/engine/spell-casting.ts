/**
 * Spell casting engine for Against the Darkmaster (VsD).
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Provides:
 * - Magical Resonance detection (doubles on initial d100)
 * - Spell casting total computation
 */

/**
 * Detect Magical Resonance from an initial d100 value.
 *
 * Magical Resonance occurs when the tens digit equals the units digit
 * (i.e., the value is one of: 11, 22, 33, 44, 55, 66, 77, 88, 99).
 *
 * @param d100Value - Integer in the range 11–99
 * @returns true if Magical Resonance is triggered
 */
export function detectMagicalResonance(d100Value: number): boolean {
  const tens = Math.floor(d100Value / 10);
  const units = d100Value % 10;
  return tens === units;
}

/**
 * Compute spell casting total.
 *
 * Formula: skillBonus + rollResult + (5 × casterLevel)
 *
 * @param skillBonus - The caster's spell casting skill bonus (integer)
 * @param rollResult - The open-ended d100 roll result (integer)
 * @param casterLevel - The caster's level (positive integer)
 * @returns The total spell casting result
 */
export function computeSpellTotal(
  skillBonus: number,
  rollResult: number,
  casterLevel: number
): number {
  return skillBonus + rollResult + 5 * casterLevel;
}
