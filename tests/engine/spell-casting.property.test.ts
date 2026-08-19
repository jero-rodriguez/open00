// Feature: open00-system, Property 5: Magical Resonance Detection
// Feature: open00-system, Property 6: Spell Casting Total Formula
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { detectMagicalResonance, computeSpellTotal } from '../../src/module/engine/spell-casting';

/**
 * Validates: Requirements 6.2, 6.7
 *
 * Property 5: Magical Resonance Detection
 * For any integer d100 value in the range 11–99, detectMagicalResonance(value) SHALL return
 * true if and only if the tens digit equals the units digit (i.e., value is one of:
 * 11, 22, 33, 44, 55, 66, 77, 88, 99).
 */
describe('detectMagicalResonance – Property 5: Magical Resonance Detection', () => {
  const DOUBLES = [11, 22, 33, 44, 55, 66, 77, 88, 99];

  const d100Range = fc.integer({ min: 11, max: 99 });

  it('returns true if and only if the tens digit equals the units digit for any d100 value in 11–99', () => {
    fc.assert(
      fc.property(d100Range, (value) => {
        const result = detectMagicalResonance(value);
        const tens = Math.floor(value / 10);
        const units = value % 10;
        const isDouble = tens === units;

        expect(result).toBe(isDouble);
      }),
      { numRuns: 100 },
    );
  });

  it('returns true for all known doubles (11, 22, 33, 44, 55, 66, 77, 88, 99)', () => {
    fc.assert(
      fc.property(fc.constantFrom(...DOUBLES), (value) => {
        expect(detectMagicalResonance(value)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('returns false for non-double values in range 11–99', () => {
    const nonDoubles = fc.integer({ min: 11, max: 99 }).filter(
      (v) => !DOUBLES.includes(v),
    );

    fc.assert(
      fc.property(nonDoubles, (value) => {
        expect(detectMagicalResonance(value)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 6.1
 *
 * Property 6: Spell Casting Total Formula
 * For any integer skillBonus, integer rollResult, and positive integer casterLevel,
 * computeSpellTotal(skillBonus, rollResult, casterLevel) SHALL return exactly
 * skillBonus + rollResult + (5 × casterLevel).
 */
describe('computeSpellTotal – Property 6: Spell Casting Total Formula', () => {
  const skillBonus = fc.integer({ min: -100, max: 200 });
  const rollResult = fc.integer({ min: -200, max: 500 });
  const casterLevel = fc.integer({ min: 1, max: 50 });

  it('returns exactly skillBonus + rollResult + (5 × casterLevel) for any valid inputs', () => {
    fc.assert(
      fc.property(skillBonus, rollResult, casterLevel, (sb, rr, cl) => {
        const result = computeSpellTotal(sb, rr, cl);
        const expected = sb + rr + 5 * cl;

        expect(result).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });
});
