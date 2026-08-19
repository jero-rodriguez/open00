// Feature: foundry-vsd-system, Property 3: Open-Ended Roll Computation
// Feature: foundry-vsd-system, Property 4: Roll Display Round-Trip
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { computeOpenEndedRoll, formatRollDisplay, RollSource, RollResult } from '../../src/module/engine/dice-engine';

/**
 * Validates: Requirements 4.1, 4.2, 4.3
 *
 * Property 3: Open-Ended Roll Computation
 * For any sequence of d100 values (each 1–100) provided by a deterministic source,
 * computeOpenEndedRoll(source) SHALL:
 * - If the first roll is 6–95: return that value as the total
 * - If the first roll is ≥96: add it to a running total and continue rolling, adding
 *   subsequent rolls while they are ≥96, stopping when a roll is ≤95 (adding the final roll)
 * - If the first roll is ≤5: keep the initial value, roll again and subtract it; if that
 *   subtraction roll is ≥96, continue subtracting while subsequent rolls are ≥96
 * - The computed total SHALL equal the sum of all high-explosion rolls plus the final roll
 *   (for high), or the initial roll minus the sum of subtraction rolls (for low)
 */
describe('computeOpenEndedRoll – Property 3: Open-Ended Roll Computation', () => {
  /** Helper: create a deterministic source from a sequence of values */
  function makeSource(values: number[]): RollSource {
    let index = 0;
    return () => {
      if (index >= values.length) {
        throw new Error('Source exhausted — not enough values provided');
      }
      return values[index++];
    };
  }

  /** Arbitrary for a d100 value (1–100 inclusive) */
  const d100 = fc.integer({ min: 1, max: 100 });

  /** Arbitrary for a normal roll (6–95) */
  const normalRoll = fc.integer({ min: 6, max: 95 });

  /** Arbitrary for a high-exploding initial roll (96–100) */
  const highRoll = fc.integer({ min: 96, max: 100 });

  /** Arbitrary for a low-exploding initial roll (1–5) */
  const lowRoll = fc.integer({ min: 1, max: 5 });

  /** Arbitrary for a terminating roll (1–95) */
  const terminatingRoll = fc.integer({ min: 1, max: 95 });

  it('returns the initial roll as total when it is 6–95 (no explosion)', () => {
    fc.assert(
      fc.property(normalRoll, (value) => {
        const source = makeSource([value]);
        const result = computeOpenEndedRoll(source);

        expect(result.total).toBe(value);
        expect(result.isOpenEndedHigh).toBe(false);
        expect(result.isOpenEndedLow).toBe(false);
        expect(result.rolls).toHaveLength(1);
        expect(result.rolls[0]).toEqual({ value, type: 'initial' });
      }),
      { numRuns: 100 },
    );
  });

  it('computes high-explosion total as sum of all rolls (initial + explosions + final)', () => {
    fc.assert(
      fc.property(
        highRoll,
        fc.array(highRoll, { minLength: 0, maxLength: 5 }),
        terminatingRoll,
        (initial, explosions, final) => {
          const values = [initial, ...explosions, final];
          const source = makeSource(values);
          const result = computeOpenEndedRoll(source);

          const expectedTotal = initial + explosions.reduce((sum, v) => sum + v, 0) + final;
          expect(result.total).toBe(expectedTotal);
          expect(result.isOpenEndedHigh).toBe(true);
          expect(result.isOpenEndedLow).toBe(false);
          expect(result.rolls).toHaveLength(values.length);
          expect(result.rolls[0]).toEqual({ value: initial, type: 'initial' });
          expect(result.rolls[result.rolls.length - 1]).toEqual({ value: final, type: 'final' });
        },
      ),
      { numRuns: 100 },
    );
  });

  it('computes low-explosion total as initial minus sum of all subtraction rolls', () => {
    fc.assert(
      fc.property(
        lowRoll,
        fc.array(highRoll, { minLength: 0, maxLength: 5 }),
        terminatingRoll,
        (initial, continuations, final) => {
          // For low explosion: first subtraction roll, then continuations while ≥96, then final ≤95
          // The first subtraction roll can be anything 1–100; if ≥96 it continues
          // We build: [initial, firstSubtraction, ...continuations (≥96), final (≤95)]
          // If continuations is empty and firstSubtraction ≤95, that firstSubtraction IS the only subtraction
          // If firstSubtraction ≥96, we continue with continuations then final

          // Case: subtraction chain starts with a high roll (≥96) and continues
          const firstSub = continuations.length > 0 || final <= 95 ? (continuations.length > 0 ? continuations[0] : final) : final;

          // Simplify: generate a chain where first subtraction is ≥96 (continues) or ≤95 (stops)
          // Let's test the case where first subtraction is ≥96 and chain continues
          if (continuations.length > 0) {
            const allSubtractions = [...continuations, final];
            const values = [initial, ...allSubtractions];
            const source = makeSource(values);
            const result = computeOpenEndedRoll(source);

            const expectedTotal = initial - allSubtractions.reduce((sum, v) => sum + v, 0);
            expect(result.total).toBe(expectedTotal);
            expect(result.isOpenEndedHigh).toBe(false);
            expect(result.isOpenEndedLow).toBe(true);
          } else {
            // First subtraction roll is the final (≤95), no further chaining
            const values = [initial, final];
            const source = makeSource(values);
            const result = computeOpenEndedRoll(source);

            const expectedTotal = initial - final;
            expect(result.total).toBe(expectedTotal);
            expect(result.isOpenEndedHigh).toBe(false);
            expect(result.isOpenEndedLow).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('total equals sum of all rolls for high explosion (additive verification)', () => {
    fc.assert(
      fc.property(
        highRoll,
        fc.array(highRoll, { minLength: 0, maxLength: 4 }),
        terminatingRoll,
        (initial, explosions, final) => {
          const values = [initial, ...explosions, final];
          const source = makeSource(values);
          const result = computeOpenEndedRoll(source);

          // Total should equal sum of all values in the sequence
          const expectedTotal = values.reduce((sum, v) => sum + v, 0);
          expect(result.total).toBe(expectedTotal);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('records correct roll types in the rolls array', () => {
    fc.assert(
      fc.property(
        highRoll,
        fc.array(highRoll, { minLength: 1, maxLength: 3 }),
        terminatingRoll,
        (initial, explosions, final) => {
          const values = [initial, ...explosions, final];
          const source = makeSource(values);
          const result = computeOpenEndedRoll(source);

          // First roll is initial
          expect(result.rolls[0].type).toBe('initial');
          // Middle rolls are high-explode
          for (let i = 1; i < result.rolls.length - 1; i++) {
            expect(result.rolls[i].type).toBe('high-explode');
          }
          // Last roll is final
          expect(result.rolls[result.rolls.length - 1].type).toBe('final');
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 4.6
 *
 * Property 4: Roll Display Round-Trip
 * For any RollResult produced by computeOpenEndedRoll, formatting the result via
 * formatRollDisplay and extracting the numeric total from the formatted string
 * SHALL yield the same value as result.total.
 */
describe('formatRollDisplay – Property 4: Roll Display Round-Trip', () => {
  /** Helper: create a deterministic source from a sequence of values */
  function makeSource(values: number[]): RollSource {
    let index = 0;
    return () => {
      if (index >= values.length) {
        throw new Error('Source exhausted');
      }
      return values[index++];
    };
  }

  /** Extract the numeric total from the formatted display string "[total] (...)" */
  function extractTotal(display: string): number {
    const match = display.match(/^\[(-?\d+)\]/);
    if (!match) throw new Error(`Cannot extract total from: ${display}`);
    return parseInt(match[1], 10);
  }

  /** Arbitrary for a d100 value (1–100 inclusive) */
  const d100 = fc.integer({ min: 1, max: 100 });

  /** Arbitrary for a normal roll (6–95) */
  const normalRoll = fc.integer({ min: 6, max: 95 });

  /** Arbitrary for a high-exploding initial roll (96–100) */
  const highRoll = fc.integer({ min: 96, max: 100 });

  /** Arbitrary for a low-exploding initial roll (1–5) */
  const lowRoll = fc.integer({ min: 1, max: 5 });

  /** Arbitrary for a terminating roll (1–95) */
  const terminatingRoll = fc.integer({ min: 1, max: 95 });

  it('round-trip: extracting total from formatted normal roll equals result.total', () => {
    fc.assert(
      fc.property(normalRoll, (value) => {
        const source = makeSource([value]);
        const result = computeOpenEndedRoll(source);
        const display = formatRollDisplay(result);
        const extractedTotal = extractTotal(display);

        expect(extractedTotal).toBe(result.total);
      }),
      { numRuns: 100 },
    );
  });

  it('round-trip: extracting total from formatted high-explosion roll equals result.total', () => {
    fc.assert(
      fc.property(
        highRoll,
        fc.array(highRoll, { minLength: 0, maxLength: 5 }),
        terminatingRoll,
        (initial, explosions, final) => {
          const values = [initial, ...explosions, final];
          const source = makeSource(values);
          const result = computeOpenEndedRoll(source);
          const display = formatRollDisplay(result);
          const extractedTotal = extractTotal(display);

          expect(extractedTotal).toBe(result.total);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('round-trip: extracting total from formatted low-explosion roll equals result.total', () => {
    fc.assert(
      fc.property(
        lowRoll,
        fc.array(highRoll, { minLength: 0, maxLength: 5 }),
        terminatingRoll,
        (initial, continuations, final) => {
          const values = [initial, ...continuations, final];
          const source = makeSource(values);
          const result = computeOpenEndedRoll(source);
          const display = formatRollDisplay(result);
          const extractedTotal = extractTotal(display);

          expect(extractedTotal).toBe(result.total);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('round-trip: total extraction works for any valid d100 sequence', () => {
    // Generate an arbitrary roll sequence: first value determines explosion type
    const rollSequence = fc.tuple(d100, fc.array(d100, { minLength: 0, maxLength: 6 })).map(
      ([first, rest]) => {
        if (first >= 6 && first <= 95) {
          // Normal roll - only needs the first value
          return [first];
        } else if (first >= 96) {
          // High explosion - need continuation values ending with ≤95
          const explosions = rest.filter((v) => v >= 96).slice(0, 5);
          const finalValue = rest.find((v) => v <= 95) ?? 50; // fallback terminator
          return [first, ...explosions, finalValue];
        } else {
          // Low explosion (≤5) - need subtraction values
          const continuations = rest.filter((v) => v >= 96).slice(0, 5);
          const finalValue = rest.find((v) => v <= 95) ?? 50; // fallback terminator
          return [first, ...continuations, finalValue];
        }
      },
    );

    fc.assert(
      fc.property(rollSequence, (values) => {
        const source = makeSource(values);
        const result = computeOpenEndedRoll(source);
        const display = formatRollDisplay(result);
        const extractedTotal = extractTotal(display);

        expect(extractedTotal).toBe(result.total);
      }),
      { numRuns: 100 },
    );
  });
});
