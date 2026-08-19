/**
 * Open-ended d100 dice engine for Open 00.
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Open-ended rules:
 * - High (≥96): add roll to total, roll again; continue while ≥96, stop when ≤95 (add final)
 * - Low (≤5): keep initial value, roll again and subtract; continue subtracting while ≥96, stop when ≤95
 * - Normal (6–95): return that single roll as the total
 */

/** Random number source interface for dependency injection. Returns 1–100 inclusive. */
export type RollSource = () => number;

export interface RollResult {
  total: number;
  rolls: { value: number; type: 'initial' | 'high-explode' | 'low-explode' | 'final' }[];
  isOpenEndedHigh: boolean;
  isOpenEndedLow: boolean;
}

/**
 * Compute an open-ended d100 roll.
 *
 * - If the first roll is 6–95: return that value as the total (no explosion).
 * - If the first roll is ≥96: add it to a running total and continue rolling,
 *   adding subsequent rolls while they are ≥96, stopping when a roll is ≤95
 *   (adding the final roll to the total).
 * - If the first roll is ≤5: keep the initial value, roll again and subtract it;
 *   if that subtraction roll is ≥96, continue subtracting while subsequent rolls
 *   are ≥96, stopping when a roll is ≤95 (subtracting the final roll).
 *
 * No explosion cap — rolls can chain indefinitely.
 */
export function computeOpenEndedRoll(source: RollSource): RollResult {
  const initial = source();
  const rolls: RollResult['rolls'] = [{ value: initial, type: 'initial' }];

  // Normal roll — no explosion
  if (initial >= 6 && initial <= 95) {
    return {
      total: initial,
      rolls,
      isOpenEndedHigh: false,
      isOpenEndedLow: false,
    };
  }

  // Open-ended HIGH (initial ≥ 96)
  if (initial >= 96) {
    let total = initial;
    let next = source();

    while (next >= 96) {
      rolls.push({ value: next, type: 'high-explode' });
      total += next;
      next = source();
    }

    // Final roll (≤ 95) — still added to total
    rolls.push({ value: next, type: 'final' });
    total += next;

    return {
      total,
      rolls,
      isOpenEndedHigh: true,
      isOpenEndedLow: false,
    };
  }

  // Open-ended LOW (initial ≤ 5)
  let total = initial;
  let next = source();
  rolls.push({ value: next, type: 'low-explode' });
  total -= next;

  // Continue subtracting while subsequent rolls are ≥ 96
  while (next >= 96) {
    next = source();
    if (next >= 96) {
      rolls.push({ value: next, type: 'low-explode' });
    } else {
      rolls.push({ value: next, type: 'final' });
    }
    total -= next;
  }

  return {
    total,
    rolls,
    isOpenEndedHigh: false,
    isOpenEndedLow: true,
  };
}

/**
 * Format a RollResult into a display string for chat output.
 *
 * Uses arrow indicators:
 * - ↑ before high-explode rolls
 * - ↓ before low-explode rolls
 *
 * Format: "[total] (roll1 ↑roll2 ↑roll3 roll4)" or "[total] (roll1 ↓roll2 roll3)"
 * The total is enclosed in square brackets so it can be extracted for round-trip verification.
 */
export function formatRollDisplay(result: RollResult): string {
  const parts: string[] = [];

  for (const roll of result.rolls) {
    switch (roll.type) {
      case 'initial':
        parts.push(String(roll.value));
        break;
      case 'high-explode':
        parts.push(`↑${roll.value}`);
        break;
      case 'low-explode':
        parts.push(`↓${roll.value}`);
        break;
      case 'final':
        parts.push(String(roll.value));
        break;
    }
  }

  return `[${result.total}] (${parts.join(' ')})`;
}
