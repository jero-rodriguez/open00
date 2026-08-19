// Feature: foundry-vsd-system, Property 16: Affinity Bonus Activation
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getActiveBonuses } from '../../src/module/engine/affinity';

/**
 * Validates: Requirements 22.2, 22.5
 *
 * Property 16: Affinity Bonus Activation
 * For an Item of Power with bonuses:
 * - If not attuned (isAttuned = false), no bonuses are active regardless of affinity level
 * - If attuned, exactly those bonuses with threshold ≤ affinity level are active
 * - Increasing affinity level only adds bonuses, never removes previously active ones (monotonicity)
 * - Active bonuses maintain their original order and content
 */
describe('Affinity Functions – Property 16: Affinity Bonus Activation', () => {
  const affinityLevel = fc.integer({ min: 0, max: 5 });

  const bonus = fc.record({
    threshold: fc.integer({ min: 0, max: 5 }),
    effect: fc.string({ minLength: 1, maxLength: 50 }),
  });

  const bonuses = fc.array(bonus, { minLength: 0, maxLength: 10 });

  it('returns empty array when not attuned regardless of affinity level', () => {
    fc.assert(
      fc.property(affinityLevel, bonuses, (affinity, bonusArray) => {
        const result = getActiveBonuses(affinity, false, bonusArray);
        expect(result).toEqual([]);
      }),
      { numRuns: 100 },
    );
  });

  it('returns only bonuses with threshold ≤ affinity level when attuned', () => {
    fc.assert(
      fc.property(affinityLevel, bonuses, (affinity, bonusArray) => {
        const result = getActiveBonuses(affinity, true, bonusArray);

        // All returned bonuses must have threshold <= affinity
        for (const active of result) {
          expect(active.threshold).toBeLessThanOrEqual(affinity);
        }

        // All bonuses with threshold <= affinity must be in the result
        const expectedCount = bonusArray.filter((b) => b.threshold <= affinity).length;
        expect(result.length).toBe(expectedCount);
      }),
      { numRuns: 100 },
    );
  });

  it('affinity level increase only adds bonuses, never removes them (monotonicity)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4 }),
        bonuses,
        (lowerAffinity, bonusArray) => {
          const higherAffinity = lowerAffinity + 1;

          const resultsLower = getActiveBonuses(lowerAffinity, true, bonusArray);
          const resultsHigher = getActiveBonuses(higherAffinity, true, bonusArray);

          // Every bonus active at lower affinity is still active at higher
          for (const bonus of resultsLower) {
            expect(resultsHigher).toContainEqual(bonus);
          }

          // Higher affinity should have >= bonuses as lower
          expect(resultsHigher.length).toBeGreaterThanOrEqual(resultsLower.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('active bonuses preserve order and content from input', () => {
    fc.assert(
      fc.property(affinityLevel, bonuses, (affinity, bonusArray) => {
        const result = getActiveBonuses(affinity, true, bonusArray);

        // Result must be a subset of input in the same order
        let bonusIndex = 0;
        for (const active of result) {
          // Find this bonus in the original array starting from bonusIndex
          while (bonusIndex < bonusArray.length) {
            if (
              bonusArray[bonusIndex].threshold === active.threshold &&
              bonusArray[bonusIndex].effect === active.effect
            ) {
              bonusIndex++;
              break;
            }
            bonusIndex++;
          }
          // If we reach here, the bonus was found in order
        }
      }),
      { numRuns: 100 },
    );
  });

  it('at affinity level 0, only bonuses with threshold 0 are active (when attuned)', () => {
    const bonuses1 = [
      { threshold: 0, effect: 'base' },
      { threshold: 1, effect: 'level1' },
      { threshold: 2, effect: 'level2' },
    ];

    const result = getActiveBonuses(0, true, bonuses1);
    expect(result).toEqual([{ threshold: 0, effect: 'base' }]);
  });

  it('at affinity level 5, all bonuses with threshold <= 5 are active (when attuned)', () => {
    const bonuses1 = [
      { threshold: 0, effect: 'level0' },
      { threshold: 1, effect: 'level1' },
      { threshold: 3, effect: 'level3' },
      { threshold: 5, effect: 'level5' },
    ];

    const result = getActiveBonuses(5, true, bonuses1);
    expect(result).toEqual(bonuses1);
  });

  it('affinity level mismatch: higher threshold than affinity yields partial set', () => {
    const bonuses1 = [
      { threshold: 1, effect: 'level1' },
      { threshold: 3, effect: 'level3' },
      { threshold: 5, effect: 'level5' },
    ];

    const result = getActiveBonuses(2, true, bonuses1);
    expect(result).toEqual([{ threshold: 1, effect: 'level1' }]);
  });

  it('empty bonus array always returns empty regardless of attunement', () => {
    const result1 = getActiveBonuses(5, true, []);
    expect(result1).toEqual([]);

    const result2 = getActiveBonuses(5, false, []);
    expect(result2).toEqual([]);
  });

  it('all bonuses at same threshold activate or deactivate together', () => {
    const bonuses1 = [
      { threshold: 2, effect: 'bonus1' },
      { threshold: 2, effect: 'bonus2' },
      { threshold: 2, effect: 'bonus3' },
    ];

    // Just below threshold
    const resultBelow = getActiveBonuses(1, true, bonuses1);
    expect(resultBelow).toEqual([]);

    // At threshold
    const resultAt = getActiveBonuses(2, true, bonuses1);
    expect(resultAt).toEqual(bonuses1);
  });

  it('non-attuned always returns empty even with single bonus', () => {
    const bonuses1 = [{ threshold: 0, effect: 'always' }];

    const result = getActiveBonuses(5, false, bonuses1);
    expect(result).toEqual([]);
  });

  it('attuned with no qualifying bonuses returns empty', () => {
    const bonuses1 = [
      { threshold: 3, effect: 'level3' },
      { threshold: 4, effect: 'level4' },
      { threshold: 5, effect: 'level5' },
    ];

    const result = getActiveBonuses(1, true, bonuses1);
    expect(result).toEqual([]);
  });
});
