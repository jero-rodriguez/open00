// Feature: open00-system, Property 17: Travel Duration Computation
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { computeTravelDuration, TravelPace } from '../../src/module/engine/travel';

/**
 * Validates: Requirements 18.3
 *
 * Property 17: Travel Duration Computation
 * For any distance, pace, terrain modifier, and party movement rate:
 * - Duration formula: (distanceMiles * terrainModifier) / (partyMovementRate * paceMultiplier)
 * - Faster paces (ForcedMarch > Fast > Normal > Careful) yield shorter durations
 * - Terrain difficulty and movement rate inversely affect duration
 * - Duration is always positive for positive inputs
 */
describe('Travel Functions – Property 17: Travel Duration Computation', () => {
  const positiveNumber = fc.integer({ min: 1, max: 1000 });
  const travelPaces: TravelPace[] = ['Careful', 'Normal', 'Fast', 'ForcedMarch'];

  it('returns positive duration for positive inputs', () => {
    fc.assert(
      fc.property(positiveNumber, positiveNumber, positiveNumber, positiveNumber, (dist, terrain, rate, dummy) => {
        const pace: TravelPace = travelPaces[dummy % 4];
        const result = computeTravelDuration(dist, pace, terrain, rate);
        expect(result).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it('implements correct formula: (distance * terrain) / (rate * paceMultiplier)', () => {
    const distance = 100;
    const terrainModifier = 1.5;
    const partyMovementRate = 10;

    const resultNormal = computeTravelDuration(distance, 'Normal', terrainModifier, partyMovementRate);
    // Normal pace = 1.0x, so (100 * 1.5) / (10 * 1.0) = 15
    expect(resultNormal).toBeCloseTo(15);

    const resultFast = computeTravelDuration(distance, 'Fast', terrainModifier, partyMovementRate);
    // Fast pace = 1.5x, so (100 * 1.5) / (10 * 1.5) = 10
    expect(resultFast).toBeCloseTo(10);

    const resultCareful = computeTravelDuration(distance, 'Careful', terrainModifier, partyMovementRate);
    // Careful pace = 0.5x, so (100 * 1.5) / (10 * 0.5) = 30
    expect(resultCareful).toBeCloseTo(30);
  });

  it('faster paces yield shorter durations (monotonicity)', () => {
    const distance = 100;
    const terrainModifier = 1.0;
    const partyMovementRate = 10;

    const durationCareful = computeTravelDuration(distance, 'Careful', terrainModifier, partyMovementRate);
    const durationNormal = computeTravelDuration(distance, 'Normal', terrainModifier, partyMovementRate);
    const durationFast = computeTravelDuration(distance, 'Fast', terrainModifier, partyMovementRate);
    const durationForcedMarch = computeTravelDuration(
      distance,
      'ForcedMarch',
      terrainModifier,
      partyMovementRate
    );

    // Careful > Normal > Fast > ForcedMarch
    expect(durationCareful).toBeGreaterThan(durationNormal);
    expect(durationNormal).toBeGreaterThan(durationFast);
    expect(durationFast).toBeGreaterThan(durationForcedMarch);
  });

  it('increasing distance increases duration proportionally', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 20 }),
        (distance, terrainMultiplier, rate) => {
          const result1 = computeTravelDuration(distance, 'Normal', terrainMultiplier, rate);
          const result2 = computeTravelDuration(distance * 2, 'Normal', terrainMultiplier, rate);

          // Double distance doubles duration
          expect(result2).toBeCloseTo(result1 * 2, 5);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('increasing terrain modifier increases duration proportionally', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 20 }),
        (distance, terrain, rate) => {
          const result1 = computeTravelDuration(distance, 'Normal', terrain, rate);
          const result2 = computeTravelDuration(distance, 'Normal', terrain * 2, rate);

          // Double terrain doubles duration
          expect(result2).toBeCloseTo(result1 * 2, 5);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('increasing party movement rate decreases duration inversely', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 10 }),
        (distance, terrain, rate) => {
          const result1 = computeTravelDuration(distance, 'Normal', terrain, rate);
          const result2 = computeTravelDuration(distance, 'Normal', terrain, rate * 2);

          // Double rate halves duration
          expect(result2).toBeCloseTo(result1 / 2, 5);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('pace multipliers are correctly applied: Careful 0.5x, Normal 1.0x, Fast 1.5x, ForcedMarch 2.0x', () => {
    const distance = 100;
    const terrain = 1.0;
    const rate = 10;

    const careful = computeTravelDuration(distance, 'Careful', terrain, rate);
    const normal = computeTravelDuration(distance, 'Normal', terrain, rate);
    const fast = computeTravelDuration(distance, 'Fast', terrain, rate);
    const forcedMarch = computeTravelDuration(distance, 'ForcedMarch', terrain, rate);

    // Verify multipliers: careful = normal * 2, fast = normal * (2/3), etc.
    expect(careful).toBeCloseTo(normal * 2, 5);
    expect(fast).toBeCloseTo(normal * (2 / 3), 5);
    expect(forcedMarch).toBeCloseTo(normal / 2, 5);
  });

  it('fractional inputs (terrain modifier as decimal) work correctly', () => {
    const result = computeTravelDuration(100, 'Normal', 0.5, 10);
    // (100 * 0.5) / (10 * 1.0) = 5
    expect(result).toBeCloseTo(5, 5);
  });

  it('small values produce small durations', () => {
    const result = computeTravelDuration(1, 'ForcedMarch', 1, 10);
    // (1 * 1) / (10 * 2.0) = 0.05
    expect(result).toBeCloseTo(0.05, 5);
  });

  it('large values produce large durations', () => {
    const result = computeTravelDuration(1000, 'Careful', 2, 1);
    // (1000 * 2) / (1 * 0.5) = 4000
    expect(result).toBeCloseTo(4000, 5);
  });

  it('specific example: long journey in difficult terrain at normal pace', () => {
    const result = computeTravelDuration(500, 'Normal', 1.5, 5);
    // (500 * 1.5) / (5 * 1.0) = 150 hours
    expect(result).toBeCloseTo(150, 5);
  });

  it('specific example: short journey in easy terrain at fast pace', () => {
    const result = computeTravelDuration(50, 'Fast', 0.75, 20);
    // (50 * 0.75) / (20 * 1.5) = 37.5 / 30 = 1.25 hours
    expect(result).toBeCloseTo(1.25, 5);
  });
});
