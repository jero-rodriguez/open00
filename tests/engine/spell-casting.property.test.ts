import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  detectMagicalResonance,
  computeSpellTotal,
  computeCastingModifier,
  lookupSpellCastingTable,
  computeMpCost,
  computeWarpedWeave,
  validateCasting,
  computeOvercastingPenalty,
  computeResonanceModifier,
  computeTotalMagicPoints,
  computeRitualMaxWeave,
  computeSpellFailureModifier,
  computeCelestialOvercastLimit,
  computeCelestialCastingPenalty,
} from '../../src/module/engine/spell-casting';

// ─── Magical Resonance Detection ─────────────────────────────────────────────

describe('detectMagicalResonance', () => {
  const DOUBLES = [11, 22, 33, 44, 55, 66, 77, 88, 99];
  const d100Range = fc.integer({ min: 11, max: 99 });

  it('returns true if and only if the tens digit equals the units digit', () => {
    fc.assert(
      fc.property(d100Range, (value) => {
        const result = detectMagicalResonance(value);
        const tens = Math.floor(value / 10);
        const units = value % 10;
        expect(result).toBe(tens === units);
      }),
      { numRuns: 100 },
    );
  });

  it('returns true for all known doubles', () => {
    for (const d of DOUBLES) {
      expect(detectMagicalResonance(d)).toBe(true);
    }
  });

  it('returns false for non-double values', () => {
    const nonDoubles = fc.integer({ min: 11, max: 99 }).filter(
      (v) => !DOUBLES.includes(v),
    );
    fc.assert(
      fc.property(nonDoubles, (value) => {
        expect(detectMagicalResonance(value)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Spell Casting Total ─────────────────────────────────────────────────────

describe('computeSpellTotal', () => {
  it('returns rollResult + skillBonus + modifier', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -200, max: 500 }),
        fc.integer({ min: -100, max: 200 }),
        fc.integer({ min: -100, max: 100 }),
        (roll, skill, mod) => {
          expect(computeSpellTotal(roll, skill, mod)).toBe(roll + skill + mod);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ─── Casting Modifier Computation ────────────────────────────────────────────

describe('computeCastingModifier', () => {
  it('grants +10 per concentration round, max +40', () => {
    for (let rounds = 0; rounds <= 6; rounds++) {
      const mod = computeCastingModifier({
        concentrationRounds: rounds,
        isImprovised: false,
        isInstantaneous: false,
        targetIsStatic: false,
        rangeBand: 'short',
        armorPenalty: 0,
      });
      const expected = Math.min(rounds, 4) * 10;
      expect(mod).toBe(expected);
    }
  });

  it('applies -10 for improvised spells', () => {
    const mod = computeCastingModifier({
      concentrationRounds: 0,
      isImprovised: true,
      isInstantaneous: false,
      targetIsStatic: false,
      rangeBand: 'short',
      armorPenalty: 0,
    });
    expect(mod).toBe(-10);
  });

  it('ignores concentration and improvised penalty for instantaneous spells', () => {
    const mod = computeCastingModifier({
      concentrationRounds: 4,
      isImprovised: true,
      isInstantaneous: true,
      targetIsStatic: false,
      rangeBand: 'short',
      armorPenalty: 0,
    });
    expect(mod).toBe(0);
  });

  it('grants +10 for static target', () => {
    const mod = computeCastingModifier({
      concentrationRounds: 0,
      isImprovised: false,
      isInstantaneous: false,
      targetIsStatic: true,
      rangeBand: 'short',
      armorPenalty: 0,
    });
    expect(mod).toBe(10);
  });

  it('applies correct range modifiers', () => {
    const expected: Record<string, number> = {
      touch: 30,
      close: 10,
      short: 0,
      medium: -10,
      long: -20,
      extreme: -30,
    };
    for (const [band, bonus] of Object.entries(expected)) {
      const mod = computeCastingModifier({
        concentrationRounds: 0,
        isImprovised: false,
        isInstantaneous: false,
        targetIsStatic: false,
        rangeBand: band as any,
        armorPenalty: 0,
      });
      expect(mod).toBe(bonus);
    }
  });

  it('applies armor penalty', () => {
    const mod = computeCastingModifier({
      concentrationRounds: 0,
      isImprovised: false,
      isInstantaneous: false,
      targetIsStatic: false,
      rangeBand: 'short',
      armorPenalty: -25,
    });
    expect(mod).toBe(-25);
  });

  it('combines all modifiers correctly (Deirdre example from rules)', () => {
    // Deirdre: touching target (+30), 1 round preparation (+10), skill bonus 35
    // Total modifier = +10 (prep) + 30 (touch) = +40
    const mod = computeCastingModifier({
      concentrationRounds: 1,
      isImprovised: false,
      isInstantaneous: false,
      targetIsStatic: false,
      rangeBand: 'touch',
      armorPenalty: 0,
    });
    expect(mod).toBe(40);
  });
});

// ─── Spell Casting Table Lookup ──────────────────────────────────────────────

describe('lookupSpellCastingTable', () => {
  it('returns failure for totals ≤ 25', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100, max: 25 }), (total) => {
        const result = lookupSpellCastingTable(total);
        expect(result.outcome).toBe('failure');
        expect(result.srDifficulty).toBeNull();
      }),
      { numRuns: 50 },
    );
  });

  it('returns partial for totals 26-50', () => {
    fc.assert(
      fc.property(fc.integer({ min: 26, max: 50 }), (total) => {
        const result = lookupSpellCastingTable(total);
        expect(result.outcome).toBe('partial');
        expect(result.srDifficulty).toBeNull();
      }),
      { numRuns: 50 },
    );
  });

  it('returns success with correct SR for totals 51-150', () => {
    const result80 = lookupSpellCastingTable(80);
    expect(result80.outcome).toBe('success');
    expect(result80.srDifficulty).toBe(50);

    const result95 = lookupSpellCastingTable(95);
    expect(result95.outcome).toBe('success');
    expect(result95.srDifficulty).toBe(60);

    const result105 = lookupSpellCastingTable(105);
    expect(result105.outcome).toBe('success');
    expect(result105.srDifficulty).toBe(65);

    const result130 = lookupSpellCastingTable(130);
    expect(result130.outcome).toBe('success');
    expect(result130.srDifficulty).toBe(80);

    const result150 = lookupSpellCastingTable(150);
    expect(result150.outcome).toBe('success');
    expect(result150.srDifficulty).toBe(100);
  });

  it('returns outstanding for totals ≥ 151', () => {
    fc.assert(
      fc.property(fc.integer({ min: 151, max: 500 }), (total) => {
        const result = lookupSpellCastingTable(total);
        expect(result.outcome).toBe('outstanding');
        expect(result.srDifficulty).not.toBeNull();
      }),
      { numRuns: 50 },
    );
  });

  it('outstanding SR caps at 150 for totals ≥ 176', () => {
    expect(lookupSpellCastingTable(176).srDifficulty).toBe(150);
    expect(lookupSpellCastingTable(200).srDifficulty).toBe(150);
    expect(lookupSpellCastingTable(999).srDifficulty).toBe(150);
  });

  it('SR difficulty increases monotonically with total', () => {
    let prevSr = 0;
    for (let total = 51; total <= 200; total++) {
      const result = lookupSpellCastingTable(total);
      if (result.srDifficulty !== null) {
        expect(result.srDifficulty).toBeGreaterThanOrEqual(prevSr);
        prevSr = result.srDifficulty;
      }
    }
  });
});

// ─── MP Cost ─────────────────────────────────────────────────────────────────

describe('computeMpCost', () => {
  it('base cost equals the spell Weave', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (weave) => {
        expect(computeMpCost(weave)).toBe(weave);
      }),
      { numRuns: 10 },
    );
  });

  it('warping adds to the base cost', () => {
    // Fear (3rd Weave) + "+3 Weave" option three times = 3 + 9 = 12 MP
    expect(computeMpCost(3, [3, 3, 3])).toBe(12);
  });

  it('Malefic alignment adds +1 MP', () => {
    expect(computeMpCost(5, [], 'malefic')).toBe(6);
  });

  it('Disastrous alignment adds +1 MP', () => {
    expect(computeMpCost(3, [], 'disastrous')).toBe(4);
  });

  it('Neutral/Benefic/Auspicious alignments add nothing', () => {
    expect(computeMpCost(5, [], 'neutral')).toBe(5);
    expect(computeMpCost(5, [], 'benefic')).toBe(5);
    expect(computeMpCost(5, [], 'auspicious')).toBe(5);
  });
});

// ─── Warped Weave ────────────────────────────────────────────────────────────

describe('computeWarpedWeave', () => {
  it('returns base Weave when no warping options', () => {
    expect(computeWarpedWeave(3, [])).toBe(3);
  });

  it('adds all warping costs to base Weave', () => {
    // Fear (3rd) + three "+3 Weave" options = 12th Weave
    expect(computeWarpedWeave(3, [3, 3, 3])).toBe(12);
  });
});

// ─── Casting Validation ──────────────────────────────────────────────────────

describe('validateCasting', () => {
  it('returns null when all conditions are met', () => {
    // 4th level, 5 ranks, casting 4th Weave, 10 MP available, costs 4
    expect(validateCasting(4, 4, 10, 4, 5)).toBeNull();
  });

  it('blocks when MP is insufficient', () => {
    const result = validateCasting(3, 5, 2, 3, 5);
    expect(result).toContain('insufficient_mp');
  });

  it('blocks when Weave exceeds Level (without overcasting)', () => {
    const result = validateCasting(6, 4, 10, 6, 6, false);
    expect(result).toContain('weave_exceeds_level');
  });

  it('does NOT block Weave > Level when overcasting is allowed', () => {
    const result = validateCasting(6, 4, 10, 6, 6, true);
    expect(result).toBeNull();
  });

  it('blocks when ranks are insufficient (even with overcasting)', () => {
    // Trying to cast 7th Weave with only 5 ranks
    const result = validateCasting(7, 4, 20, 7, 5, true);
    expect(result).toContain('weave_exceeds_ranks');
  });

  it('can report multiple block reasons at once', () => {
    // 6th Weave, level 4, only 2 MP, costs 6, only 3 ranks
    const result = validateCasting(6, 4, 2, 6, 3, false);
    expect(result).toContain('insufficient_mp');
    expect(result).toContain('weave_exceeds_level');
    expect(result).toContain('weave_exceeds_ranks');
  });
});

// ─── Overcasting Penalty ─────────────────────────────────────────────────────

describe('computeOvercastingPenalty', () => {
  it('returns 0 when Weave ≤ Level', () => {
    expect(computeOvercastingPenalty(3, 5)).toBe(0);
    expect(computeOvercastingPenalty(5, 5)).toBe(0);
  });

  it('returns -10 per Weave over Level', () => {
    // 6th Weave, level 4 → -20
    expect(computeOvercastingPenalty(6, 4)).toBe(-20);
    // 7th Weave, level 4 → -30
    expect(computeOvercastingPenalty(7, 4)).toBe(-30);
  });

  it('penalty scales linearly with weaves over', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 1, max: 10 }),
        (weave, level) => {
          const penalty = computeOvercastingPenalty(weave, level);
          const weavesOver = Math.max(0, weave - level);
          const expected = weavesOver === 0 ? 0 : -10 * weavesOver;
          expect(penalty).toBe(expected);
        },
      ),
      { numRuns: 50 },
    );
  });
});

// ─── Resonance Modifier ──────────────────────────────────────────────────────

describe('computeResonanceModifier', () => {
  it('base modifier is the spell Weave', () => {
    const mod = computeResonanceModifier(5, 'other', false, false, null);
    expect(mod).toBe(5);
  });

  it('Safe Haven subtracts 20', () => {
    const mod = computeResonanceModifier(3, 'other', true, false, null);
    expect(mod).toBe(3 - 20);
  });

  it('Blighted Land adds 20', () => {
    const mod = computeResonanceModifier(3, 'other', false, true, null);
    expect(mod).toBe(3 + 20);
  });

  it('Healing/Spirit/Light spells subtract 20', () => {
    expect(computeResonanceModifier(4, 'healing', false, false, null)).toBe(4 - 20);
    expect(computeResonanceModifier(4, 'spirit', false, false, null)).toBe(4 - 20);
    expect(computeResonanceModifier(4, 'light', false, false, null)).toBe(4 - 20);
  });

  it('Natural/Elven/Illusory spells subtract 10', () => {
    expect(computeResonanceModifier(4, 'natural', false, false, null)).toBe(4 - 10);
    expect(computeResonanceModifier(4, 'elven', false, false, null)).toBe(4 - 10);
    expect(computeResonanceModifier(4, 'illusory', false, false, null)).toBe(4 - 10);
  });

  it('Attack spells add 20', () => {
    expect(computeResonanceModifier(4, 'attack', false, false, null)).toBe(4 + 20);
  });

  it('Dark spells add 30', () => {
    expect(computeResonanceModifier(4, 'dark', false, false, null)).toBe(4 + 30);
  });

  it('overcasting adds -30 + 10×(weaves over level)', () => {
    // 6th Weave, level 4 → -30 + 10*2 = -10
    const mod = computeResonanceModifier(6, 'other', false, false, { spellWeave: 6, casterLevel: 4 });
    expect(mod).toBe(6 + (-30 + 10 * 2));
  });
});

// ─── Total Magic Points ──────────────────────────────────────────────────────

describe('computeTotalMagicPoints', () => {
  it('Silver Elf Wizard example: WIT 25, vocation 3, level 1, kin 4 → 9 MP', () => {
    expect(computeTotalMagicPoints(25, 3, 1, 4)).toBe(9);
  });

  it('Silver Elf Wizard at level 2 → 14 MP', () => {
    expect(computeTotalMagicPoints(25, 3, 2, 4)).toBe(14);
  });

  it('High Man Animist: WSD 10, vocation 2, level 1, kin 0 → 3 MP', () => {
    expect(computeTotalMagicPoints(10, 2, 1, 0)).toBe(3);
  });

  it('Star Elf Dabbler: BEA 30, vocation 1, level 1, kin 5 → 9 MP', () => {
    // statMpGain = floor(30/10) = 3, total per level = 3+1 = 4, at level 1 = 4 + 5 = 9
    expect(computeTotalMagicPoints(30, 1, 1, 5)).toBe(9);
  });

  it('stat value below 10 gives 0 stat MP gain', () => {
    // Stat 8, vocation 2, level 3, kin 0 → (0+2)*3 + 0 = 6
    expect(computeTotalMagicPoints(8, 2, 3, 0)).toBe(6);
  });

  it('formula: (floor(stat/10) + vocationMp) × level + kinBonus', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 5 }),
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 0, max: 10 }),
        (stat, vocMp, level, kinBonus) => {
          const statGain = stat >= 10 ? Math.floor(stat / 10) : 0;
          const expected = (statGain + vocMp) * level + kinBonus;
          expect(computeTotalMagicPoints(stat, vocMp, level, kinBonus)).toBe(expected);
        },
      ),
      { numRuns: 50 },
    );
  });
});

// ─── Ritual Overcasting ──────────────────────────────────────────────────────

describe('computeRitualMaxWeave', () => {
  it('Mornien example: level 4, 3 participants → max Weave 7', () => {
    expect(computeRitualMaxWeave(4, 3)).toBe(7);
  });

  it('returns level + participants', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 1, max: 10 }),
        (level, participants) => {
          expect(computeRitualMaxWeave(level, participants)).toBe(level + participants);
        },
      ),
      { numRuns: 50 },
    );
  });
});

// ─── Spell Failure Modifier ──────────────────────────────────────────────────

describe('computeSpellFailureModifier', () => {
  it('returns the failureSeverity value directly', () => {
    expect(computeSpellFailureModifier(0)).toBe(0);
    expect(computeSpellFailureModifier(10)).toBe(10);
    expect(computeSpellFailureModifier(20)).toBe(20);
    expect(computeSpellFailureModifier(30)).toBe(30);
    expect(computeSpellFailureModifier(50)).toBe(50);
  });
});

// ─── Celestial Alignment ─────────────────────────────────────────────────────

describe('computeCelestialOvercastLimit', () => {
  it('Benefic allows 3 Weaves over', () => {
    expect(computeCelestialOvercastLimit('benefic')).toBe(3);
  });

  it('Auspicious allows 1 Weave over', () => {
    expect(computeCelestialOvercastLimit('auspicious')).toBe(1);
  });

  it('Neutral/Malefic/Disastrous allow 0', () => {
    expect(computeCelestialOvercastLimit('neutral')).toBe(0);
    expect(computeCelestialOvercastLimit('malefic')).toBe(0);
    expect(computeCelestialOvercastLimit('disastrous')).toBe(0);
  });
});

describe('computeCelestialCastingPenalty', () => {
  it('Disastrous imposes -10', () => {
    expect(computeCelestialCastingPenalty('disastrous')).toBe(-10);
  });

  it('all other alignments impose no penalty', () => {
    expect(computeCelestialCastingPenalty('neutral')).toBe(0);
    expect(computeCelestialCastingPenalty('benefic')).toBe(0);
    expect(computeCelestialCastingPenalty('auspicious')).toBe(0);
    expect(computeCelestialCastingPenalty('malefic')).toBe(0);
  });
});
