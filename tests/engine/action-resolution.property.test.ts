// Feature: foundry-vsd-system, Property 2: Action Resolution Table Completeness and Correctness
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { resolveAction, OutcomeBand } from '../../src/engine/action-resolution';

/**
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.7
 *
 * Property 2: Action Resolution Table Completeness and Correctness
 * For any integer value (including negatives), resolveAction(total) returns exactly
 * one of the five outcome bands with correct boundaries.
 */
describe('resolveAction – Property 2: Action Resolution Table Completeness and Correctness', () => {
  const validOutcomeBands: OutcomeBand[] = [
    'CriticalFailure',
    'Failure',
    'PartialSuccess',
    'Success',
    'OutstandingSuccess',
  ];

  const anyInteger = fc.integer({ min: -1_000_000, max: 1_000_000 });

  it('returns exactly one of the five defined outcome bands for any integer input', () => {
    fc.assert(
      fc.property(anyInteger, (total) => {
        const result = resolveAction(total);
        expect(validOutcomeBands).toContain(result);
      }),
      { numRuns: 100 },
    );
  });

  it('returns CriticalFailure when total ≤ 4', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 4 }), (total) => {
        expect(resolveAction(total)).toBe('CriticalFailure');
      }),
      { numRuns: 100 },
    );
  });

  it('returns Failure when 5 ≤ total ≤ 74', () => {
    fc.assert(
      fc.property(fc.integer({ min: 5, max: 74 }), (total) => {
        expect(resolveAction(total)).toBe('Failure');
      }),
      { numRuns: 100 },
    );
  });

  it('returns PartialSuccess when 75 ≤ total ≤ 99', () => {
    fc.assert(
      fc.property(fc.integer({ min: 75, max: 99 }), (total) => {
        expect(resolveAction(total)).toBe('PartialSuccess');
      }),
      { numRuns: 100 },
    );
  });

  it('returns Success when 100 ≤ total ≤ 174', () => {
    fc.assert(
      fc.property(fc.integer({ min: 100, max: 174 }), (total) => {
        expect(resolveAction(total)).toBe('Success');
      }),
      { numRuns: 100 },
    );
  });

  it('returns OutstandingSuccess when total ≥ 175', () => {
    fc.assert(
      fc.property(fc.integer({ min: 175, max: 1_000_000 }), (total) => {
        expect(resolveAction(total)).toBe('OutstandingSuccess');
      }),
      { numRuns: 100 },
    );
  });

  it('boundary correctness: exact boundary values map to the correct bands', () => {
    // Exact boundary assertions
    expect(resolveAction(4)).toBe('CriticalFailure');
    expect(resolveAction(5)).toBe('Failure');
    expect(resolveAction(74)).toBe('Failure');
    expect(resolveAction(75)).toBe('PartialSuccess');
    expect(resolveAction(99)).toBe('PartialSuccess');
    expect(resolveAction(100)).toBe('Success');
    expect(resolveAction(174)).toBe('Success');
    expect(resolveAction(175)).toBe('OutstandingSuccess');
  });

  it('adjacent boundary values produce different outcome bands', () => {
    expect(resolveAction(4)).not.toBe(resolveAction(5));
    expect(resolveAction(74)).not.toBe(resolveAction(75));
    expect(resolveAction(99)).not.toBe(resolveAction(100));
    expect(resolveAction(174)).not.toBe(resolveAction(175));
  });
});
