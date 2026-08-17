// Feature: foundry-vsd-system, Property 1: Rank Bonus Piecewise Formula
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { computeRankBonus } from '../../src/engine/rank-bonus';

/**
 * Validates: Requirements 1.6
 *
 * Property 1: Rank Bonus Piecewise Formula
 * For any non-negative integer rank, computeRankBonus(rank) returns the correct
 * piecewise value AND the function is monotonically non-decreasing.
 */
describe('computeRankBonus – Property 1: Rank Bonus Piecewise Formula', () => {
  const nonNegativeInteger = fc.nat();

  it('returns the correct piecewise formula result for any non-negative integer rank', () => {
    fc.assert(
      fc.property(nonNegativeInteger, (rank) => {
        const result = computeRankBonus(rank);

        if (rank === 0) {
          expect(result).toBe(0);
        } else if (rank <= 10) {
          expect(result).toBe(rank * 5);
        } else if (rank <= 20) {
          expect(result).toBe(50 + (rank - 10) * 2);
        } else {
          expect(result).toBe(70 + (rank - 20) * 1);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('is monotonically non-decreasing: for any a ≤ b, computeRankBonus(a) ≤ computeRankBonus(b)', () => {
    fc.assert(
      fc.property(nonNegativeInteger, nonNegativeInteger, (x, y) => {
        const a = Math.min(x, y);
        const b = Math.max(x, y);
        expect(computeRankBonus(a)).toBeLessThanOrEqual(computeRankBonus(b));
      }),
      { numRuns: 100 },
    );
  });
});
