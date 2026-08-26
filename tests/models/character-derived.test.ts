/**
 * Character Derived Data Tests
 *
 * Validates that CharacterDataModel.prepareDerivedData() correctly computes
 * derived fields — especially hpMax from body skill total minus soulDamage.
 *
 * Formula (skeleton, Slice 5):
 *   body total = statTotal(FOR) + rankBonus(body.rank) + kin + vocation + spec + item
 *   hpMax = max(0, body total - soulDamage)
 *
 * With kin/vocation/item = 0 in skeleton:
 *   statTotal(FOR) = stats.for.base + stats.for.spec
 *   rankBonus(5)   = 5 * 5 = 25
 *   body total     = 10 + 25 + 0 + 0 + 0 + 0 = 35
 *   hpMax          = 35 - 0 = 35
 */

import { describe, it, expect } from 'vitest';
import { CharacterDataModel } from '../../src/module/models/actor/character.js';
import { createModel } from '../foundry-shim.js';

describe('CharacterDataModel — prepareDerivedData', () => {
  it('computes hpMax from body skill total (FOR=10, rank=5, soulDamage=0)', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 10, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 5, spec: 0 },
      },
      soulDamage: 0,
    });

    // rankBonus(5) = 25; statTotal(for) = 10; body total = 35
    expect(model.hpMax).toBe(35);
  });

  it('reduces hpMax by soulDamage', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 10, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 5, spec: 0 },
      },
      soulDamage: 10,
    });

    // body total = 35, soulDamage = 10 → hpMax = 25
    expect(model.hpMax).toBe(25);
  });

  it('clamps hpMax to minimum 0 when soulDamage exceeds body total', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 5, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 1, spec: 0 },
      },
      soulDamage: 100,
    });

    // body total = 5 + 5 = 10; soulDamage = 100 → hpMax = 0 (clamped)
    expect(model.hpMax).toBe(0);
  });

  it('includes stat spec in body skill total', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 5, spec: 5 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 5, spec: 0 },
      },
      soulDamage: 0,
    });

    // statTotal(for) = 5+5 = 10; rankBonus(5) = 25; total = 35
    expect(model.hpMax).toBe(35);
  });

  it('computes derivedSkills with correct total for each skill', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 20, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        blades: { rank: 10, spec: 5 },
      },
    });

    // blades: statKey=brn, statTotal=20; rankBonus(10)=50; spec=5
    // total = 20 + 50 + 0(kin) + 0(vocation) + 5(spec) + 0(item) = 75
    expect(model.derivedSkills.blades.total).toBe(75);
    expect(model.derivedSkills.blades.rank).toBe(10);
    expect(model.derivedSkills.blades.spec).toBe(5);
  });

  it('does not persist derived fields in toObject-like access', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 10, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 5, spec: 0 },
      },
    });

    // The skills record should only have rank + spec (player-owned), not derived bonuses
    const bodySkill = model.skills.body;
    expect(bodySkill).toEqual({ rank: 5, spec: 0 });

    // hp.max is a derived mirror of hpMax (exposed for Foundry token bar tracking)
    // It must NOT be persisted in the schema — only set during prepareDerivedData
    expect((model.hp as any).max).toBe(model.hpMax);
  });
});
