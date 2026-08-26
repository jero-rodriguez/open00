/**
 * Character Identity Effects Tests
 *
 * Validates two regression defects:
 *
 * Defect c: Identity modifiers must persist when an identity Item is added
 * by ANY path (drag-drop, programmatic, compendium import, duplication).
 * The old ArrayField approach could lose data on concurrent writes; the keyed
 * SchemaField record guarantees each skill has a stable dot-path.
 *
 * Defect b: HP max must use the canonical 'body' skill id (keyed record key)
 * and NOT the display string 'Body Development' or 'Body'. The derivation
 * formula reads `this.derivedSkills.body.total`, which only works if skills
 * are keyed by canonical id.
 */

import { describe, it, expect } from 'vitest';
import { CharacterDataModel } from '../../src/module/models/actor/character.js';
import { Open00Actor } from '../../src/module/documents/open00-actor.js';
import { createModel, MockItem } from '../foundry-shim.js';
import { SKILL_IDS, SKILL_ID_LIST } from '../../src/module/data/skills.js';

describe('CharacterDataModel — identity effects (defect c: any-path add)', () => {
  it('seeding via createEmbeddedDocuments persists skill ranks at stable dot-paths', async () => {
    const actor = new Open00Actor() as any;
    actor.type = 'character';
    actor.name = 'Test';
    actor.system = {
      seeded: false,
      wealth: 0,
      skills: Object.fromEntries(SKILL_ID_LIST.map((id) => [id, { rank: 0, spec: 0 }])),
    };

    const cultureItem = new MockItem({
      type: 'culture',
      name: 'Highland Folk',
      system: {
        startingWealth: 1,
        skillRankAllocations: [
          { skillName: 'Blades', ranks: 4 },
          { skillName: 'Athletics', ranks: 3 },
        ],
      },
    });

    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    // The update should have used dot-paths like 'system.skills.blades.rank'
    // which means the keyed record structure is stable and addressable
    expect(actor.system.skills.blades.rank).toBe(4);
    expect(actor.system.skills.athletics.rank).toBe(3);

    // Other skills remain untouched (stable keys, no array index shift)
    expect(actor.system.skills.stealth.rank).toBe(0);
    expect(actor.system.skills.body.rank).toBe(0);
  });

  it('concurrent identity item additions do not corrupt skill data (keyed record stability)', async () => {
    const actor = new Open00Actor() as any;
    actor.type = 'character';
    actor.name = 'Test';
    actor.system = {
      seeded: false,
      wealth: 0,
      skills: Object.fromEntries(SKILL_ID_LIST.map((id) => [id, { rank: 0, spec: 0 }])),
    };

    // Kin provides starting wealth
    const kinItem = new MockItem({
      type: 'kin',
      name: 'Man',
      system: { startingWealth: 2, maxHp: 120 },
    });

    // Culture provides skill ranks
    const cultureItem = new MockItem({
      type: 'culture',
      name: 'Urban',
      system: {
        startingWealth: 1,
        skillRankAllocations: [
          { skillName: 'Charisma', ranks: 5 },
          { skillName: 'Cultures', ranks: 4 },
          { skillName: 'Deceive', ranks: 3 },
        ],
      },
    });

    // Add both at once (simulates batch creation)
    actor.items.push(kinItem);
    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    // Skills are at their keyed positions — no index corruption possible
    expect(actor.system.skills.charisma.rank).toBe(5);
    expect(actor.system.skills.cultures.rank).toBe(4);
    expect(actor.system.skills.deceive.rank).toBe(3);

    // Wealth = Kin(2) + Culture(1) = 3
    expect(actor.system.wealth).toBe(3);
  });

  it('all 22 canonical skill ids are addressable as keyed record properties', () => {
    const model = createModel(CharacterDataModel as any, {});

    // Every canonical skill id must exist in the model's skills record
    for (const id of SKILL_ID_LIST) {
      expect(model.skills[id]).toBeDefined();
      expect(model.skills[id]).toHaveProperty('rank');
      expect(model.skills[id]).toHaveProperty('spec');
    }

    // Verify count matches
    expect(Object.keys(model.skills).length).toBe(22);
  });
});

describe('CharacterDataModel — HP max uses canonical body skill id (defect b)', () => {
  it('derives hpMax from skills.body (canonical id), not from string lookup', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 15, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 8, spec: 0 },
      },
    });

    // body skill: statKey='for', statTotal=15, rankBonus(8)=40
    // body total = 15 + 40 + 0 + 0 + 0 + 0 = 55
    // hpMax = 55 - 0 (soulDamage) = 55
    expect(model.hpMax).toBe(55);
    expect(model.derivedSkills.body.total).toBe(55);
  });

  it('SKILL_IDS.body is the canonical key used by derivation (not "Body Development")', () => {
    // Verify the canonical id is 'body', not 'body-development' or anything else
    expect(SKILL_IDS.body).toBe('body');

    // The derivation reads derivedSkills.body — if the key were wrong,
    // hpMax would be 0 (the default when body total is missing)
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 20, spec: 10 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 15, spec: 0 },
      },
    });

    // statTotal(for) = 30; rankBonus(15) = 50 + (15-10)*2 = 60
    // body total = 30 + 60 = 90
    expect(model.derivedSkills.body.total).toBe(90);
    expect(model.hpMax).toBe(90);
  });

  it('hpMax is 0 when body skill has no ranks and no FOR stat (edge case)', () => {
    const model = createModel(CharacterDataModel as any, {
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: {
        body: { rank: 0, spec: 0 },
      },
    });

    // All zeros → body total = 0, hpMax = 0
    expect(model.hpMax).toBe(0);
  });
});
