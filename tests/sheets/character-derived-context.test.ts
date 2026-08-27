import { describe, expect, it } from 'vitest';
import { Open00CharacterSheet } from '../../src/module/sheets/character-sheet.js';
import { MockActor } from '../foundry-shim.js';

function createSheet(): any {
  const actor = new MockActor({
    type: 'character',
    system: {
      level: 7,
      stats: {
        brn: { base: 10, kin: 5, spec: 0 },
        swi: { base: 0, kin: 0, spec: 0 },
        for: { base: 10, kin: 0, spec: 0 },
        wit: { base: 0, kin: 0, spec: 0 },
        wsd: { base: 0, kin: 0, spec: 0 },
        bea: { base: 0, kin: 0, spec: 0 },
      },
      skills: { blades: { rank: 0, spec: 0 } },
      derivedSkills: {
        blades: { rank: 0, spec: 0, kin: 5, vocation: 0, item: 0, total: 15 },
      },
      saveRollBonus: 35,
      tsr: 65,
      wsr: 35,
      hp: { value: -5, max: 65 },
      hpMax: 65,
    },
  });
  const sheet = new Open00CharacterSheet() as any;
  sheet.document = actor;
  return sheet;
}

describe('Open00CharacterSheet derived context', () => {
  it('uses model-derived skill and save totals without double-counting Kin', async () => {
    const context = await createSheet()._preparePartContext('overview', { tabs: {} });
    const skills = context.skillCategories.flatMap((category: any) => category.skills);
    const blades = skills.find((skill: any) => skill.id === 'blades');

    expect(blades.totalBonus).toBe(15);
    expect(context.saveRolls[0].level).toBe(35);
    expect(context.saveRolls[0].total).toBe(65);
  });

  it('uses the model-derived HP maximum in combat context', async () => {
    const context = await createSheet()._preparePartContext('combat', { tabs: {} });
    expect(context.hpMax).toBe(65);
  });
});
