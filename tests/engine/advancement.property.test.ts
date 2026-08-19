// Feature: open00-system, Property 15: DP Accounting Invariant
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { allocateDP, checkLevelUp, LevelEntry } from '../../src/module/engine/advancement';

/**
 * Validates: Requirements 11.7, 12.4, 12.5
 *
 * Property 15: DP Accounting Invariant
 * For any DP allocation:
 * - If successful, remainingDP + cost = availableDP (conservation of DP)
 * - If successful, newRank = currentRank + 1 (always increments by 1)
 * - If unsuccessful, returns an error message and no state changes are implied
 * - Maximum rank ceiling is 30
 */
describe('Advancement Functions – Property 15: DP Accounting Invariant', () => {
  const validRank = fc.integer({ min: 0, max: 29 });
  const validDP = fc.nat({ max: 500 });

  it('successful allocation preserves DP accounting: remainingDP + cost = availableDP', () => {
    fc.assert(
      fc.property(
        validDP,
        fc.integer({ min: 1, max: 100 }),
        validRank,
        (availableDP, cost, currentRank) => {
          // Ensure cost <= availableDP and rank < 30 for success
          if (cost <= availableDP && currentRank < 30) {
            const result = allocateDP(availableDP, cost, currentRank);
            if ('newRank' in result) {
              expect(result.remainingDP + cost).toBe(availableDP);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('successful allocation always increments rank by exactly 1', () => {
    fc.assert(
      fc.property(
        validDP,
        fc.integer({ min: 1, max: 100 }),
        validRank,
        (availableDP, cost, currentRank) => {
          if (cost <= availableDP && currentRank < 30) {
            const result = allocateDP(availableDP, cost, currentRank);
            if ('newRank' in result) {
              expect(result.newRank).toBe(currentRank + 1);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('allocation fails when cost exceeds available DP', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 51, max: 200 }),
        fc.integer({ min: 0, max: 29 }),
        (availableDP, cost, currentRank) => {
          const result = allocateDP(availableDP, cost, currentRank);
          expect('error' in result).toBe(true);
          const typedResult = result as { error: string };
          expect(typedResult.error).toContain('insufficient');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('allocation fails when rank is already at maximum (30)', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 500 }),
        fc.integer({ min: 1, max: 100 }),
        (availableDP, cost) => {
          const result = allocateDP(availableDP, cost, 30);
          expect('error' in result).toBe(true);
          const typedResult = result as { error: string };
          expect(typedResult.error).toContain('maximum');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('allocation succeeds when rank is 29 and cost is available', () => {
    const result = allocateDP(100, 50, 29);
    expect('newRank' in result).toBe(true);
    const typedResult = result as { newRank: number; remainingDP: number };
    expect(typedResult.newRank).toBe(30);
    expect(typedResult.remainingDP).toBe(50);
  });

  it('allocation fails when rank is 30 regardless of cost', () => {
    const result1 = allocateDP(1000, 1, 30);
    expect('error' in result1).toBe(true);

    const result2 = allocateDP(1000, 1000, 30);
    expect('error' in result2).toBe(true);
  });

  it('remaining DP is never negative', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 500 }),
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 29 }),
        (availableDP, cost, currentRank) => {
          if (cost <= availableDP && currentRank < 30) {
            const result = allocateDP(availableDP, cost, currentRank);
            if ('remainingDP' in result) {
              expect(result.remainingDP).toBeGreaterThanOrEqual(0);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('specific examples: DP allocation scenarios', () => {
    // Success: cost available, rank < 30
    const success = allocateDP(100, 30, 10);
    expect('newRank' in success).toBe(true);
    const successTyped = success as { newRank: number; remainingDP: number };
    expect(successTyped.newRank).toBe(11);
    expect(successTyped.remainingDP).toBe(70);

    // Failure: insufficient DP
    const failInsufficient = allocateDP(10, 50, 5);
    expect('error' in failInsufficient).toBe(true);

    // Failure: rank maxed
    const failMaxed = allocateDP(1000, 1, 30);
    expect('error' in failMaxed).toBe(true);

    // Edge: exact cost match
    const exact = allocateDP(50, 50, 10);
    const exactTyped = exact as { newRank: number; remainingDP: number };
    expect(exactTyped.newRank).toBe(11);
    expect(exactTyped.remainingDP).toBe(0);
  });
});

/**
 * Property for checkLevelUp: Level-Up Eligibility
 *
 * For any total XP and current level:
 * - If the progression table contains an entry for (currentLevel + 1)
 *   and totalXP >= that entry's xpThreshold, return true
 * - Otherwise, return false
 * - If (currentLevel + 1) is not in the table, always return false
 */
describe('Advancement Functions – checkLevelUp', () => {
  it('returns true when total XP meets or exceeds next level threshold', () => {
    const progressionTable: LevelEntry[] = [
      { level: 1, xpThreshold: 0 },
      { level: 2, xpThreshold: 100 },
      { level: 3, xpThreshold: 300 },
      { level: 4, xpThreshold: 600 },
    ];

    // At level 1 with 100 XP, should level up (meets level 2 threshold)
    expect(checkLevelUp(100, 1, progressionTable)).toBe(true);

    // At level 2 with 300 XP, should level up (meets level 3 threshold)
    expect(checkLevelUp(300, 2, progressionTable)).toBe(true);

    // At level 3 with 600 XP, should level up (meets level 4 threshold)
    expect(checkLevelUp(600, 3, progressionTable)).toBe(true);
  });

  it('returns false when total XP is below next level threshold', () => {
    const progressionTable: LevelEntry[] = [
      { level: 1, xpThreshold: 0 },
      { level: 2, xpThreshold: 100 },
      { level: 3, xpThreshold: 300 },
    ];

    // At level 1 with 50 XP, should not level up (below level 2 threshold)
    expect(checkLevelUp(50, 1, progressionTable)).toBe(false);

    // At level 2 with 250 XP, should not level up (below level 3 threshold)
    expect(checkLevelUp(250, 2, progressionTable)).toBe(false);
  });

  it('returns false when next level is not in the progression table', () => {
    const progressionTable: LevelEntry[] = [
      { level: 1, xpThreshold: 0 },
      { level: 2, xpThreshold: 100 },
      { level: 3, xpThreshold: 300 },
    ];

    // At level 3, no level 4 entry, should return false
    expect(checkLevelUp(1000, 3, progressionTable)).toBe(false);
  });

  it('boundary: exact threshold value returns true', () => {
    const progressionTable: LevelEntry[] = [
      { level: 1, xpThreshold: 0 },
      { level: 2, xpThreshold: 100 },
    ];

    // Exactly at threshold
    expect(checkLevelUp(100, 1, progressionTable)).toBe(true);

    // One below threshold
    expect(checkLevelUp(99, 1, progressionTable)).toBe(false);
  });

  it('handles large XP values correctly', () => {
    const progressionTable: LevelEntry[] = [
      { level: 1, xpThreshold: 0 },
      { level: 2, xpThreshold: 100 },
    ];

    // Very large XP still qualifies
    expect(checkLevelUp(1_000_000, 1, progressionTable)).toBe(true);
  });

  it('empty progression table returns false', () => {
    const progressionTable: LevelEntry[] = [];
    expect(checkLevelUp(1000, 1, progressionTable)).toBe(false);
  });

  it('unordered progression table (implementation detail)', () => {
    // In case table is not sorted, find() still works
    const progressionTable: LevelEntry[] = [
      { level: 3, xpThreshold: 300 },
      { level: 1, xpThreshold: 0 },
      { level: 2, xpThreshold: 100 },
    ];

    expect(checkLevelUp(100, 1, progressionTable)).toBe(true);
  });
});
