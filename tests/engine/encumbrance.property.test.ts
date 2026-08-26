// Feature: open00-system — Encumbrance Five Qualitative Levels (VsD v1.5)
// Source: vsd-travel-healing.md §Encumbrance table and §Special Rules
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  type EncumbranceLevel,
  getEffectiveEncumbranceLevel,
  getEncumbrancePenalties,
  hasEncumbrancePenalties,
  ENCUMBRANCE_LEVELS,
} from '../../src/module/engine/encumbrance';

/**
 * VsD v1.5 Encumbrance Rules:
 * - 5 qualitative levels: Unencumbered, Lightly Encumbered, Encumbered, Heavily Encumbered, Over Encumbered
 * - Lightly Encumbered = NO penalties (move rate unaffected, no action penalties)
 * - BRN >= 30 AND FOR >= 30, OR Large size → effective level reduced by one
 * - Armor is NEVER factored into encumbrance level (armor has its own separate penalties)
 */

describe('Encumbrance – VsD v1.5 Five Qualitative Levels', () => {
  describe('hasEncumbrancePenalties', () => {
    it('Unencumbered has no penalties', () => {
      expect(hasEncumbrancePenalties('Unencumbered')).toBe(false);
    });

    it('Lightly Encumbered has NO penalties', () => {
      expect(hasEncumbrancePenalties('LightlyEncumbered')).toBe(false);
    });

    it('Encumbered has penalties', () => {
      expect(hasEncumbrancePenalties('Encumbered')).toBe(true);
    });

    it('Heavily Encumbered has penalties', () => {
      expect(hasEncumbrancePenalties('HeavilyEncumbered')).toBe(true);
    });

    it('Over Encumbered has penalties', () => {
      expect(hasEncumbrancePenalties('OverEncumbered')).toBe(true);
    });
  });

  describe('getEffectiveEncumbranceLevel – BRN/FOR reduction', () => {
    it('BRN=30, FOR=35, Encumbered → reduced to LightlyEncumbered', () => {
      const result = getEffectiveEncumbranceLevel('Encumbered', { brn: 30, piernas: 35, size: 'Medium' });
      expect(result).toBe('LightlyEncumbered');
    });

    it('BRN=30, FOR=30, HeavilyEncumbered → reduced to Encumbered', () => {
      const result = getEffectiveEncumbranceLevel('HeavilyEncumbered', { brn: 30, piernas: 30, size: 'Medium' });
      expect(result).toBe('Encumbered');
    });

    it('BRN=30, FOR=30, OverEncumbered → reduced to HeavilyEncumbered', () => {
      const result = getEffectiveEncumbranceLevel('OverEncumbered', { brn: 30, piernas: 30, size: 'Medium' });
      expect(result).toBe('HeavilyEncumbered');
    });

    it('BRN=30, FOR=30, LightlyEncumbered → reduced to Unencumbered', () => {
      const result = getEffectiveEncumbranceLevel('LightlyEncumbered', { brn: 30, piernas: 30, size: 'Medium' });
      expect(result).toBe('Unencumbered');
    });

    it('BRN=30, FOR=30, Unencumbered → stays Unencumbered (cannot go below)', () => {
      const result = getEffectiveEncumbranceLevel('Unencumbered', { brn: 30, piernas: 30, size: 'Medium' });
      expect(result).toBe('Unencumbered');
    });

    it('BRN=29, FOR=30 does NOT qualify (both must be >= 30)', () => {
      const result = getEffectiveEncumbranceLevel('Encumbered', { brn: 29, piernas: 30, size: 'Medium' });
      expect(result).toBe('Encumbered');
    });

    it('BRN=30, FOR=29 does NOT qualify (both must be >= 30)', () => {
      const result = getEffectiveEncumbranceLevel('Encumbered', { brn: 30, piernas: 29, size: 'Medium' });
      expect(result).toBe('Encumbered');
    });
  });

  describe('getEffectiveEncumbranceLevel – Large size reduction', () => {
    it('Large size, Encumbered → reduced to LightlyEncumbered', () => {
      const result = getEffectiveEncumbranceLevel('Encumbered', { brn: 10, piernas: 10, size: 'Large' });
      expect(result).toBe('LightlyEncumbered');
    });

    it('Large size, HeavilyEncumbered → reduced to Encumbered', () => {
      const result = getEffectiveEncumbranceLevel('HeavilyEncumbered', { brn: 10, piernas: 10, size: 'Large' });
      expect(result).toBe('Encumbered');
    });

    it('Large size, Unencumbered → stays Unencumbered', () => {
      const result = getEffectiveEncumbranceLevel('Unencumbered', { brn: 10, piernas: 10, size: 'Large' });
      expect(result).toBe('Unencumbered');
    });

    it('Medium size without BRN/FOR threshold does NOT reduce', () => {
      const result = getEffectiveEncumbranceLevel('HeavilyEncumbered', { brn: 20, piernas: 20, size: 'Medium' });
      expect(result).toBe('HeavilyEncumbered');
    });

    it('Small size does NOT reduce', () => {
      const result = getEffectiveEncumbranceLevel('HeavilyEncumbered', { brn: 20, piernas: 20, size: 'Small' });
      expect(result).toBe('HeavilyEncumbered');
    });
  });

  describe('getEffectiveEncumbranceLevel – combined qualifiers do NOT stack', () => {
    it('Large + BRN>=30 + FOR>=30 still only reduces by one', () => {
      const result = getEffectiveEncumbranceLevel('HeavilyEncumbered', { brn: 40, piernas: 40, size: 'Large' });
      expect(result).toBe('Encumbered');
    });
  });

  describe('ENCUMBRANCE_LEVELS ordering', () => {
    it('exports exactly 5 levels in severity order', () => {
      expect(ENCUMBRANCE_LEVELS).toEqual([
        'Unencumbered',
        'LightlyEncumbered',
        'Encumbered',
        'HeavilyEncumbered',
        'OverEncumbered',
      ]);
    });
  });

  describe('getEffectiveEncumbranceLevel – property: reduction is monotone', () => {
    const levelArb = fc.constantFrom<EncumbranceLevel>(
      'Unencumbered',
      'LightlyEncumbered',
      'Encumbered',
      'HeavilyEncumbered',
      'OverEncumbered',
    );

    it('effective level is always <= raw level (never increases encumbrance)', () => {
      fc.assert(
        fc.property(levelArb, fc.integer({ min: 0, max: 100 }), fc.integer({ min: 0, max: 100 }), (level, brn, piernas) => {
          const effective = getEffectiveEncumbranceLevel(level, { brn, piernas, size: 'Large' });
          const rawIdx = ENCUMBRANCE_LEVELS.indexOf(level);
          const effectiveIdx = ENCUMBRANCE_LEVELS.indexOf(effective);
          expect(effectiveIdx).toBeLessThanOrEqual(rawIdx);
        }),
        { numRuns: 100 },
      );
    });
  });
});

describe('getEncumbrancePenalties – VsD v1.5 penalty schedule', () => {
  it('Unencumbered: no penalties, full move, all capabilities', () => {
    const p = getEncumbrancePenalties('Unencumbered');
    expect(p.moveRateFraction).toBe(1);
    expect(p.actionPenalty).toBe(0);
    expect(p.canSprint).toBe(true);
    expect(p.canAttack).toBe(true);
    expect(p.canTravel).toBe(true);
    expect(p.swiToDefense).toBe(true);
  });

  it('Lightly Encumbered: no penalties, full move, all capabilities', () => {
    const p = getEncumbrancePenalties('LightlyEncumbered');
    expect(p.moveRateFraction).toBe(1);
    expect(p.actionPenalty).toBe(0);
    expect(p.canSprint).toBe(true);
    expect(p.canAttack).toBe(true);
    expect(p.canTravel).toBe(true);
    expect(p.swiToDefense).toBe(true);
  });

  it('Encumbered: Move Rate reduced by 1/3, no action penalty', () => {
    const p = getEncumbrancePenalties('Encumbered');
    expect(p.moveRateFraction).toBeCloseTo(2 / 3);
    expect(p.actionPenalty).toBe(0);
    expect(p.canSprint).toBe(true);
    expect(p.canAttack).toBe(true);
    expect(p.canTravel).toBe(true);
    expect(p.swiToDefense).toBe(true);
  });

  it('Heavily Encumbered: Move Rate halved, -20 to all actions', () => {
    const p = getEncumbrancePenalties('HeavilyEncumbered');
    expect(p.moveRateFraction).toBe(0.5);
    expect(p.actionPenalty).toBe(-20);
    expect(p.canSprint).toBe(true);
    expect(p.canAttack).toBe(true);
    expect(p.canTravel).toBe(true);
    expect(p.swiToDefense).toBe(true);
  });

  it('Over Encumbered: 1/4 move, cannot sprint/attack/travel, no SWI to DEF', () => {
    const p = getEncumbrancePenalties('OverEncumbered');
    expect(p.moveRateFraction).toBe(0.25);
    expect(p.actionPenalty).toBe(0);
    expect(p.canSprint).toBe(false);
    expect(p.canAttack).toBe(false);
    expect(p.canTravel).toBe(false);
    expect(p.swiToDefense).toBe(false);
  });
});
