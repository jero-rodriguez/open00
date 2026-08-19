import { describe, it, expect } from 'vitest';
import { computeRankBonus } from '../../src/module/engine/rank-bonus';

describe('computeRankBonus', () => {
  it('returns 0 for rank 0', () => {
    expect(computeRankBonus(0)).toBe(0);
  });

  it('returns rank × 5 for ranks 1–10', () => {
    expect(computeRankBonus(1)).toBe(5);
    expect(computeRankBonus(5)).toBe(25);
    expect(computeRankBonus(10)).toBe(50);
  });

  it('returns 50 + (rank − 10) × 2 for ranks 11–20', () => {
    expect(computeRankBonus(11)).toBe(52);
    expect(computeRankBonus(15)).toBe(60);
    expect(computeRankBonus(20)).toBe(70);
  });

  it('returns 70 + (rank − 20) × 1 for ranks 21+', () => {
    expect(computeRankBonus(21)).toBe(71);
    expect(computeRankBonus(25)).toBe(75);
    expect(computeRankBonus(30)).toBe(80);
  });

  it('is monotonically non-decreasing', () => {
    let prev = computeRankBonus(0);
    for (let r = 1; r <= 50; r++) {
      const curr = computeRankBonus(r);
      expect(curr).toBeGreaterThanOrEqual(prev);
      prev = curr;
    }
  });

  it('transitions smoothly at boundaries', () => {
    // rank 10 → 50, rank 11 → 52 (no gap or overlap)
    expect(computeRankBonus(10)).toBe(50);
    expect(computeRankBonus(11)).toBe(52);

    // rank 20 → 70, rank 21 → 71 (no gap or overlap)
    expect(computeRankBonus(20)).toBe(70);
    expect(computeRankBonus(21)).toBe(71);
  });
});
