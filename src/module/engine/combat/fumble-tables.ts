/**
 * The weapon's Clumsy Range is always 1 through the supplied upper bound.
 * Detection uses the raw d100, before any combat modifiers are applied.
 */
export function isWeaponFumble(unmodifiedD100: number, clumsyRangeMaximum: number): boolean {
  return unmodifiedD100 >= 1 && unmodifiedD100 <= clumsyRangeMaximum;
}

/** Compute the value that will eventually be read on the user-supplied Fumble Table. */
export function calculateFumbleResult(d100: number, fumbleModifier: number): number {
  return d100 + fumbleModifier;
}
