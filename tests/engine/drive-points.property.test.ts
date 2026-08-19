// Feature: foundry-vsd-system, Property 10: Drive Points Clamping Invariant
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { modifyDrivePoints, invokePassion } from '../../src/module/engine/drive-points';

/**
 * Validates: Requirements 1.8, 15.4, 15.7
 *
 * Property 10: Drive Points Clamping Invariant
 * For any current, max, and delta values:
 * - modifyDrivePoints(current, max, delta) always returns a value in [0, max]
 * - The result is never negative and never exceeds max
 * - Modifications are correctly applied before clamping
 */
describe('Drive Points Functions – Property 10: Drive Points Clamping Invariant', () => {
  const nonNegativeInt = fc.nat({ max: 1_000_000 });

  it('modifyDrivePoints always returns a value in [0, max]', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 100 }),
        fc.nat({ max: 100 }),
        fc.integer({ min: -500, max: 500 }),
        (current, max, delta) => {
          const result = modifyDrivePoints(current, max, delta);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(max);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('result is never negative even with large negative deltas', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 50 }),
        fc.nat({ max: 100 }),
        (current, max) => {
          const result = modifyDrivePoints(current, max, -1_000_000);
          expect(result).toBe(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('result never exceeds max even with large positive deltas', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 50 }),
        fc.nat({ min: 1, max: 100 }),
        (current, max) => {
          const result = modifyDrivePoints(current, max, 1_000_000);
          expect(result).toBe(max);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('positive delta increases current within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 40 }),
        fc.integer({ min: 41, max: 100 }),
        (current, max) => {
          const delta = 10;
          const result = modifyDrivePoints(current, max, delta);
          const expected = Math.min(current + delta, max);
          expect(result).toBe(expected);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('negative delta decreases current within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        fc.integer({ min: 100, max: 200 }),
        (current, max) => {
          const delta = -5;
          const result = modifyDrivePoints(current, max, delta);
          const expected = Math.max(current + delta, 0);
          expect(result).toBe(expected);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('zero delta returns current unchanged', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (current, max) => {
          // Clamp current to be within [0, max]
          const validCurrent = Math.min(current, max);
          const result = modifyDrivePoints(validCurrent, max, 0);
          expect(result).toBe(validCurrent);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('current at max with positive delta stays at max', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (max) => {
        const result = modifyDrivePoints(max, max, 100);
        expect(result).toBe(max);
      }),
      { numRuns: 100 },
    );
  });

  it('current at 0 with negative delta stays at 0', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (max) => {
        const result = modifyDrivePoints(0, max, -100);
        expect(result).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it('specific examples: clamping behavior', () => {
    expect(modifyDrivePoints(5, 10, 3)).toBe(8); // 5 + 3 = 8, within [0, 10]
    expect(modifyDrivePoints(5, 10, 10)).toBe(10); // 5 + 10 = 15, clamped to 10
    expect(modifyDrivePoints(5, 10, -10)).toBe(0); // 5 - 10 = -5, clamped to 0
    expect(modifyDrivePoints(0, 10, 5)).toBe(5); // 0 + 5 = 5
    expect(modifyDrivePoints(10, 10, 1)).toBe(10); // 10 + 1 = 11, clamped to 10
  });
});

/**
 * Property for invokePassion: Passion Invocation Consistency
 *
 * When invoking a passion:
 * - If current > 0, returns new current = current - 1 and bonus = +30
 * - If current <= 0, returns an error
 * - The returned newCurrent (on success) is always in [0, current - 1]
 */
describe('Drive Points Functions – invokePassion', () => {
  const positiveInt = fc.integer({ min: 1, max: 100 });

  it('invokePassion with current > 0 deducts exactly 1 and returns +30 bonus', () => {
    fc.assert(
      fc.property(positiveInt, (current) => {
        const result = invokePassion(current);
        expect('newCurrent' in result && 'bonus' in result).toBe(true);
        const typedResult = result as { newCurrent: number; bonus: number };
        expect(typedResult.newCurrent).toBe(current - 1);
        expect(typedResult.bonus).toBe(30);
      }),
      { numRuns: 100 },
    );
  });

  it('invokePassion with current <= 0 returns error', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100, max: 0 }), (current) => {
        const result = invokePassion(current);
        expect('error' in result).toBe(true);
        const typedResult = result as { error: string };
        expect(typedResult.error).toBeDefined();
        expect(typedResult.error.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it('specific examples: invokePassion behavior', () => {
    const resultSuccess = invokePassion(5);
    expect('newCurrent' in resultSuccess).toBe(true);
    const successTyped = resultSuccess as { newCurrent: number; bonus: number };
    expect(successTyped.newCurrent).toBe(4);
    expect(successTyped.bonus).toBe(30);

    const resultFailure = invokePassion(0);
    expect('error' in resultFailure).toBe(true);

    const resultFailureNegative = invokePassion(-1);
    expect('error' in resultFailureNegative).toBe(true);
  });

  it('invokePassion(1) returns newCurrent = 0', () => {
    const result = invokePassion(1);
    const typedResult = result as { newCurrent: number; bonus: number };
    expect(typedResult.newCurrent).toBe(0);
    expect(typedResult.bonus).toBe(30);
  });
});
