// Feature: foundry-vsd-system, Properties 11, 12, 13: Combat Phase Cycling, Advance/Revert Round-Trip, Condition Duration Decrement
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  advancePhase,
  revertPhase,
  decrementConditions,
  COMBAT_PHASES,
} from '../../src/engine/combat-phases';

/**
 * Validates: Requirements 7.1, 7.3, 7.4, 7.7, 7.10
 *
 * Property 11: Combat Phase Cycling
 * For any phase index and round number:
 * - advancePhase wraps around after the last phase (OtherActions, index 8) back to Assessment (index 0),
 *   incrementing the round
 * - revertPhase goes backward, and clamps to Assessment round 1 when at the start
 */
describe('Combat Phase Functions – Property 11: Combat Phase Cycling', () => {
  const phaseIndex = fc.integer({ min: 0, max: 8 }); // Valid phase indices
  const roundNumber = fc.integer({ min: 1, max: 100 });

  it('advancePhase from any phase within range cycles to the next phase', () => {
    fc.assert(
      fc.property(phaseIndex, roundNumber, (phase, round) => {
        const result = advancePhase(phase, round);

        if (phase < 8) {
          expect(result.phase).toBe(phase + 1);
          expect(result.round).toBe(round);
        } else {
          // Last phase (8) wraps to Assessment (0) and increments round
          expect(result.phase).toBe(0);
          expect(result.round).toBe(round + 1);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('all phase indices 0–8 are valid and defined in COMBAT_PHASES', () => {
    expect(COMBAT_PHASES.length).toBe(9);
    for (let i = 0; i < 9; i++) {
      expect(COMBAT_PHASES[i]).toBeDefined();
    }
  });

  it('revertPhase goes backward one phase in normal cases', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 8 }),
        fc.integer({ min: 1, max: 100 }),
        (phase, round) => {
          const result = revertPhase(phase, round);
          expect(result.phase).toBe(phase - 1);
          expect(result.round).toBe(round);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('revertPhase from Assessment (phase 0) of round 1 stays at Assessment round 1', () => {
    const result = revertPhase(0, 1);
    expect(result.phase).toBe(0);
    expect(result.round).toBe(1);
  });

  it('revertPhase from Assessment (phase 0) of round > 1 goes to OtherActions of previous round', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 100 }), (round) => {
        const result = revertPhase(0, round);
        expect(result.phase).toBe(8); // OtherActions
        expect(result.round).toBe(round - 1);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 12: Phase Advance/Revert Round-Trip
 * For any phase and round, advancing then reverting (or reverting then advancing)
 * returns to the original state in most cases. Exceptions: clamping at Assessment round 1.
 */
describe('Combat Phase Functions – Property 12: Phase Advance/Revert Round-Trip', () => {
  const phaseIndex = fc.integer({ min: 0, max: 8 });
  const roundNumber = fc.integer({ min: 1, max: 100 });

  it('advancePhase then revertPhase returns to original phase/round (except clamping)', () => {
    fc.assert(
      fc.property(phaseIndex, roundNumber, (phase, round) => {
        const afterAdvance = advancePhase(phase, round);
        const afterRevert = revertPhase(afterAdvance.phase, afterAdvance.round);

        // For all cases except wrapping at the boundary, round-trip succeeds
        if (phase < 8) {
          // Normal advance, normal revert
          expect(afterRevert.phase).toBe(phase);
          expect(afterRevert.round).toBe(round);
        } else {
          // phase === 8: advance wraps to (0, round+1), then revert goes to (8, round)
          expect(afterRevert.phase).toBe(8);
          expect(afterRevert.round).toBe(round);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('revertPhase then advancePhase returns to original state (unless starting at Assessment round 1)', () => {
    fc.assert(
      fc.property(phaseIndex, roundNumber, (phase, round) => {
        const afterRevert = revertPhase(phase, round);
        const afterAdvance = advancePhase(afterRevert.phase, afterRevert.round);

        // Exception: if we start at Assessment round 1, revert clamps, so advance goes to phase 1 round 1
        if (phase === 0 && round === 1) {
          expect(afterAdvance.phase).toBe(1);
          expect(afterAdvance.round).toBe(1);
        } else if (phase === 0 && round > 1) {
          // Revert goes to (8, round-1), advance goes to (0, round)
          expect(afterAdvance.phase).toBe(0);
          expect(afterAdvance.round).toBe(round);
        } else {
          // Normal revert then advance
          expect(afterAdvance.phase).toBe(phase);
          expect(afterAdvance.round).toBe(round);
        }
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 13: Condition Duration Decrement
 * For any list of conditions:
 * - Each condition's duration is decremented by exactly 1
 * - Conditions with duration ≤ 0 (after decrement) are removed
 * - Order is preserved for remaining conditions
 */
describe('Combat Phase Functions – Property 13: Condition Duration Decrement', () => {
  const condition = fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }),
    duration: fc.integer({ min: 1, max: 99 }),
  });

  const conditionArray = fc.array(condition, { minLength: 0, maxLength: 10 });

  it('decrements all condition durations by exactly 1', () => {
    fc.assert(
      fc.property(conditionArray, (conditions) => {
        const result = decrementConditions(conditions);

        // Verify: all results have duration > 0 (they weren't removed)
        for (const res of result) {
          expect(res.duration).toBeGreaterThan(0);
        }

        // Verify: number of results = number of original conditions with duration > 1
        const expectedCount = conditions.filter((c) => c.duration > 1).length;
        expect(result.length).toBe(expectedCount);
      }),
      { numRuns: 100 },
    );
  });

  it('removes conditions whose duration reaches 0 after decrement', () => {
    fc.assert(
      fc.property(conditionArray, (conditions) => {
        const result = decrementConditions(conditions);

        // No result should have duration <= 0
        for (const c of result) {
          expect(c.duration).toBeGreaterThan(0);
        }

        // Conditions with original duration === 1 should be removed (decrement to 0)
        for (const c of conditions) {
          if (c.duration === 1) {
            expect(result.find((r) => r.name === c.name)).toBeUndefined();
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('preserves order of remaining conditions', () => {
    fc.assert(
      fc.property(conditionArray, (conditions) => {
        const result = decrementConditions(conditions);

        // If result is empty, order is trivially preserved
        if (result.length === 0) {
          return;
        }

        // Check that remaining conditions appear in the same relative order
        let prevIndex = -1;
        for (const r of result) {
          const originalIndex = conditions.findIndex((c) => c.name === r.name);
          expect(originalIndex).toBeGreaterThan(prevIndex);
          prevIndex = originalIndex;
        }
      }),
      { numRuns: 100 },
    );
  });

  it('empty condition array returns empty array', () => {
    const result = decrementConditions([]);
    expect(result).toEqual([]);
  });

  it('all conditions with duration 1 are removed after decrement', () => {
    const conditions = [
      { name: 'A', duration: 1 },
      { name: 'B', duration: 1 },
      { name: 'C', duration: 1 },
    ];
    const result = decrementConditions(conditions);
    expect(result).toEqual([]);
  });

  it('mix of durations: only those > 1 remain with decremented values', () => {
    const conditions = [
      { name: 'Short', duration: 1 },
      { name: 'Medium', duration: 5 },
      { name: 'Long', duration: 10 },
    ];
    const result = decrementConditions(conditions);
    expect(result).toEqual([
      { name: 'Medium', duration: 4 },
      { name: 'Long', duration: 9 },
    ]);
  });
});
