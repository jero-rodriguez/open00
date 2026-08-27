import { describe, expect, it } from 'vitest';
import { CharacterDataModel } from '../../src/module/models/actor/character.js';
import { createModel, MockActor, MockItem } from '../foundry-shim.js';

describe('CharacterDataModel — canonical identity item schemas', () => {
  it('derives character modifiers from Kin and Vocation schema field names', () => {
    const parent = new MockActor({ type: 'character' });
    parent.items.push(new MockItem({
      type: 'kin',
      name: 'Dwarf',
      system: {
        statModifiers: { brn: 5, swi: -5, for: 15, wit: 0, wsd: 5, bea: -5 },
        hpBonus: 40,
        maxHp: 150,
        mpBonus: 0,
        tsr: 20,
        wsr: 20,
        size: 'Medium',
      },
    }));
    parent.items.push(new MockItem({
      type: 'vocation',
      name: 'Wizard',
      system: {
        vocationalBonuses: [{ skillName: 'Arcana', bonus: 15 }],
        magicPointsPerLevel: 3,
        magicStat: 'wit',
      },
    }));

    const model = createModel(CharacterDataModel as any, {
      level: 2,
      stats: {
        brn: { base: 10, spec: 0 },
        swi: { base: 10, spec: 0 },
        for: { base: 10, spec: 0 },
        wit: { base: 20, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 5, spec: 0 },
        arcana: { rank: 0, spec: 0 },
      },
    }, { parent });

    expect((model.stats.brn as any).kin).toBe(5);
    expect(model.getStatTotal('brn')).toBe(15);
    expect(model.derivedSkills.arcana.vocation).toBe(15);
    expect(model.derivedSkills.arcana.total).toBe(35);
    expect(model.hpMax).toBe(90);
    expect(model.mpMax).toBe(10);
    expect(model.tsr).toBe(55);
    expect(model.wsr).toBe(35);
    expect(model.derivedDefense).toBe(5);
    expect(model.size).toBe('Medium');
  });

  it('repairs missing HP and MP containers during preparation instead of crashing', () => {
    const model = createModel(CharacterDataModel as any, {});
    (model as any).hp = undefined;
    (model as any).mp = undefined;

    expect(() => model.prepareDerivedData()).not.toThrow();
    expect((model as any).hp).toEqual({ value: 0, max: 0 });
    expect((model as any).mp).toEqual({ value: 0, max: 0 });
  });
});
