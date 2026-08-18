// Feature: foundry-vsd-system, Property 7: Encumbrance Level Determination
// Feature: foundry-vsd-system, Property 8: Encumbrance Total Calculation
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  determineEncumbranceLevel,
  computeTotalEncumbrance,
  type EncumbranceLevel,
} from '../../src/engine/encumbrance';

/**
 * Validates: Requirements 16.2, 16.3, 16.6
 *
 * Property 7: Encumbrance Level Determination
 * For any non-negative integer totalPoints and positive integer brawn,
 * determineEncumbranceLevel(totalPoints, brawn) SHALL return the correct
 * encumbrance level based on threshold comparisons, and the function SHALL
 * be monotone: higher totalPoints for the same brawn never produces a lower
 * encumbrance level.
 */
describe('determineEncumbranceLevel – Property 7: Encumbrance Level Determination', () => {
  const totalPoints = fc.nat();
  const brawn = fc.integer({ min: 1, max: 10000 });

  const LEVEL_ORDER: EncumbranceLevel[] = [
    'Unencumbered',
    'LightlyEncumbered',
    'Encumbered',
    'HeavilyEncumbered',
    'OverEncumbered',
  ];

  function levelIndex(level: EncumbranceLevel): number {
    return LEVEL_ORDER.indexOf(level);
  }

  it('returns the correct encumbrance level based on threshold comparisons', () => {
    fc.assert(
      fc.property(totalPoints, brawn, (tp, b) => {
        const result = determineEncumbranceLevel(tp, b);

        if (tp <= b) {
          expect(result).toBe('Unencumbered');
        } else if (tp <= b * 1.5) {
          expect(result).toBe('LightlyEncumbered');
        } else if (tp <= b * 2) {
          expect(result).toBe('Encumbered');
        } else if (tp <= b * 3) {
          expect(result).toBe('HeavilyEncumbered');
        } else {
          expect(result).toBe('OverEncumbered');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('is monotone: higher totalPoints for the same brawn never produces a lower encumbrance level', () => {
    fc.assert(
      fc.property(totalPoints, totalPoints, brawn, (tp1, tp2, b) => {
        const lower = Math.min(tp1, tp2);
        const higher = Math.max(tp1, tp2);

        const levelLower = determineEncumbranceLevel(lower, b);
        const levelHigher = determineEncumbranceLevel(higher, b);

        expect(levelIndex(levelLower)).toBeLessThanOrEqual(levelIndex(levelHigher));
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 16.1
 *
 * Property 8: Encumbrance Total Calculation
 * For any collection of items where each item has an encumbrance value (non-negative
 * integer) and a quantity (non-negative integer), the total encumbrance points SHALL
 * equal the sum of (encumbrance × quantity) for all items. Adding an item increases
 * the total by exactly that item's contribution; removing an item decreases it by
 * the same amount.
 */
describe('computeTotalEncumbrance – Property 8: Encumbrance Total Calculation', () => {
  const itemArb = fc.record({
    encumbrance: fc.nat({ max: 100 }),
    quantity: fc.nat({ max: 50 }),
  });

  const itemsArb = fc.array(itemArb, { maxLength: 20 });

  it('returns the sum of (encumbrance × quantity) for all items', () => {
    fc.assert(
      fc.property(itemsArb, (items) => {
        const result = computeTotalEncumbrance(items);
        const expected = items.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);

        expect(result).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });

  it('adding an item increases the total by exactly that items contribution', () => {
    fc.assert(
      fc.property(itemsArb, itemArb, (items, newItem) => {
        const totalBefore = computeTotalEncumbrance(items);
        const totalAfter = computeTotalEncumbrance([...items, newItem]);
        const contribution = newItem.encumbrance * newItem.quantity;

        expect(totalAfter).toBe(totalBefore + contribution);
      }),
      { numRuns: 100 },
    );
  });

  it('removing an item decreases the total by exactly that items contribution', () => {
    fc.assert(
      fc.property(
        itemsArb.filter((items) => items.length > 0),
        fc.nat(),
        (items, indexSeed) => {
          const indexToRemove = indexSeed % items.length;
          const removedItem = items[indexToRemove];
          const remaining = items.filter((_, i) => i !== indexToRemove);

          const totalFull = computeTotalEncumbrance(items);
          const totalReduced = computeTotalEncumbrance(remaining);
          const contribution = removedItem.encumbrance * removedItem.quantity;

          expect(totalReduced).toBe(totalFull - contribution);
        },
      ),
      { numRuns: 100 },
    );
  });
});
