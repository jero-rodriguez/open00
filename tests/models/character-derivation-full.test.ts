/**
 * Character Full Derivation Tests (Slice 8)
 *
 * Validates the COMPLETE prepareDerivedData() formulas:
 * - SR Level Bonus (+5/lvl L1-10, +2/lvl L11-20, +1/lvl L21+)
 * - TSR = FOR stat total + SR Level Bonus + Kin TSR bonus
 * - WSR = WSD stat total + SR Level Bonus + Kin WSR bonus
 * - DEF = max(SWI stat total, 0) + armor bonus + shield bonus
 * - hp.max = full Body Skill Bonus, capped by Kin maxHp, reduced by soulDamage
 * - mp.max = (stat MP gain + vocation MP gain) × level + Kin MP bonus
 * - Move Rate = 15m base
 * - Size from Kin item
 * - Bruised Value = floor(hp.max / 2)
 * - Kin bonus for skills (skills.N.kin DERIVED from Kin item stat bonuses)
 * - Vocation bonus for skills (skills.N.vocation DERIVED from Vocation item)
 *
 * All tests use the foundry shim's createModel + mock parent actor with items.
 */

import { describe, it, expect } from 'vitest';
import { CharacterDataModel } from '../../src/module/models/actor/character.js';
import { createModel, MockActor, MockItem, MockCollection } from '../foundry-shim.js';
import { DEFAULT_SKILL_DEFINITIONS } from '../../src/module/data/skills.js';

// ---------------------------------------------------------------------------
// Helper: create a model with a parent actor that has items
// ---------------------------------------------------------------------------

interface MockKinData {
  statBonuses?: Record<string, number>; // e.g. { brn: 5, for: -5 }
  tsrBonus?: number;
  wsrBonus?: number;
  maxHp?: number;
  hpModifier?: number; // Kin HP modifier added to Body Skill Bonus
  mpBonus?: number;
  size?: string;
  skillBonuses?: Record<string, number>; // e.g. { stealth: 10, perception: 5 }
}

interface MockVocationData {
  skillBonuses?: Record<string, number>; // vocation bonus per skill
  mpGainPerLevel?: number;
}

function createCharacterWithItems(
  charData: Record<string, unknown>,
  kinData?: MockKinData,
  vocationData?: MockVocationData,
) {
  const parent = new MockActor({ type: 'character' });
  const asBonusArray = (bonuses: Record<string, number> = {}) =>
    Object.entries(bonuses).map(([id, bonus]) => ({
      skillName: DEFAULT_SKILL_DEFINITIONS[id as keyof typeof DEFAULT_SKILL_DEFINITIONS]?.name ?? id,
      bonus,
    }));

  if (kinData) {
    const kinItem = new MockItem({
      type: 'kin',
      name: 'Test Kin',
      system: {
        statModifiers: kinData.statBonuses ?? {},
        tsr: kinData.tsrBonus ?? 0,
        wsr: kinData.wsrBonus ?? 0,
        maxHp: kinData.maxHp ?? 999,
        hpBonus: kinData.hpModifier ?? 0,
        mpBonus: kinData.mpBonus ?? 0,
        size: kinData.size ?? 'Medium',
      },
    });
    parent.items.push(kinItem);

    if (kinData.skillBonuses) {
      parent.items.push(new MockItem({
        type: 'trait',
        system: { skillBonuses: asBonusArray(kinData.skillBonuses) },
      }));
    }
  }

  if (vocationData) {
    const vocItem = new MockItem({
      type: 'vocation',
      name: 'Test Vocation',
      system: {
        vocationalBonuses: asBonusArray(vocationData.skillBonuses),
        magicPointsPerLevel: vocationData.mpGainPerLevel ?? 0,
        magicStat: 'bea',
      },
    });
    parent.items.push(vocItem);
  }

  return createModel(CharacterDataModel as any, charData, { parent });
}

// ---------------------------------------------------------------------------
// SR Level Bonus
// ---------------------------------------------------------------------------

describe('CharacterDataModel — Save Roll Bonus', () => {
  it('computes +5/lvl for levels 1-10 (level 7 → 35)', () => {
    const model = createCharacterWithItems({ level: 7 });
    expect(model.saveRollBonus).toBe(35);
  });

  it('computes +2/lvl for levels 11-20 (level 12 → 54)', () => {
    const model = createCharacterWithItems({ level: 12 });
    // 50 (L1-10) + 2×2 (L11-12) = 54
    expect(model.saveRollBonus).toBe(54);
  });

  it('computes +1/lvl for levels 21+ (level 25 → 75)', () => {
    const model = createCharacterWithItems({ level: 25 });
    // 50 (L1-10) + 20 (L11-20) + 5 (L21-25) = 75
    expect(model.saveRollBonus).toBe(75);
  });

  it('returns 0 at level 0', () => {
    const model = createCharacterWithItems({ level: 0 });
    expect(model.saveRollBonus).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// TSR / WSR
// ---------------------------------------------------------------------------

describe('CharacterDataModel — TSR / WSR', () => {
  it('TSR = FOR total + SR Level Bonus + Kin TSR bonus', () => {
    const model = createCharacterWithItems(
      {
        level: 7,
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 5 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
      },
      { tsrBonus: 20 },
    );
    // FOR total = 15, SR Level Bonus = 35, Kin TSR = 20 → TSR = 70
    expect(model.tsr).toBe(70);
  });

  it('WSR = WSD total + SR Level Bonus + Kin WSR bonus', () => {
    const model = createCharacterWithItems(
      {
        level: 5,
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 20, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
      },
      { wsrBonus: 10 },
    );
    // WSD total = 20, SR Level Bonus = 25, Kin WSR = 10 → WSR = 55
    expect(model.wsr).toBe(55);
  });

  it('TSR defaults to FOR + SR Level Bonus when no Kin item', () => {
    const model = createCharacterWithItems({
      level: 3,
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 10, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
    });
    // FOR total = 10, SR Level Bonus = 15, no kin → TSR = 25
    expect(model.tsr).toBe(25);
  });
});

// ---------------------------------------------------------------------------
// DEF (Defense)
// ---------------------------------------------------------------------------

describe('CharacterDataModel — DEF', () => {
  it('DEF = max(SWI total, 0) when no armor/shield', () => {
    const model = createCharacterWithItems({
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 15, spec: 0 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
    });
    expect(model.derivedDefense).toBe(15);
  });

  it('DEF floors at 0 when SWI is negative', () => {
    const model = createCharacterWithItems({
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: -10, spec: 0 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
    });
    expect(model.derivedDefense).toBe(0);
  });

  it('DEF includes SWI spec bonus', () => {
    const model = createCharacterWithItems({
      stats: {
        brn: { base: 0, spec: 0 },
        swi: { base: 10, spec: 5 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
    });
    expect(model.derivedDefense).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// HP Max — Body Skill Bonus, Kin cap, Soul Damage
// ---------------------------------------------------------------------------

describe('CharacterDataModel — HP Max (full formula)', () => {
  it('hp.max = FOR + rankBonus(body.rank) + kinHpModifier + vocationBonus, capped by Kin maxHp', () => {
    // Man: maxHp=120, hpModifier=30
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 5, spec: 0 } },
        soulDamage: 0,
      },
      { maxHp: 120, hpModifier: 30 },
    );
    // FOR=10, rankBonus(5)=25, kinHpMod=30, voc=0 → body bonus = 65
    // capped at 120, no soul damage → hpMax = 65
    expect(model.hpMax).toBe(65);
  });

  it('caps hp.max at Kin maxHp (Halfling cap 100)', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 30, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 20, spec: 0 } },
        soulDamage: 0,
      },
      { maxHp: 100, hpModifier: 20 },
    );
    // FOR=30, rankBonus(20)=70, kinHpMod=20 → body bonus = 120
    // capped at 100 → hpMax = 100
    expect(model.hpMax).toBe(100);
  });

  it('reduces hp.max by soulDamage (applied after cap)', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 5, spec: 0 } },
        soulDamage: 10,
      },
      { maxHp: 120, hpModifier: 30 },
    );
    // body bonus = 65, capped 120, soulDamage=10 → 55
    expect(model.hpMax).toBe(55);
  });

  it('hp.max floors at 0 when soulDamage exceeds capped body bonus', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 5, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 1, spec: 0 } },
        soulDamage: 200,
      },
      { maxHp: 120, hpModifier: 0 },
    );
    // FOR=5, rankBonus(1)=5, kinHpMod=0 → body bonus=10, capped 120, soul 200 → 0
    expect(model.hpMax).toBe(0);
  });

  it('uses Kin Dwarf maxHp cap of 150', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 40, spec: 10 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 20, spec: 10 } },
        soulDamage: 0,
      },
      { maxHp: 150, hpModifier: 40 },
    );
    // FOR=50, rankBonus(20)=70, spec=10, kinHpMod=40 → body total = 50+70+10+40 = 170
    // But wait — spec is part of the skill bonus equation:
    // body total = stat(for) + rankBonus(rank) + kin + vocation + spec + item + kinHpModifier
    // stat(for) = 50, rankBonus(20) = 70, kin=0, vocation=0, spec=10, item=0, kinHpMod=40
    // total = 170, capped at 150 → hpMax = 150
    expect(model.hpMax).toBe(150);
  });

  it('includes vocation bonus in body skill total', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 5, spec: 0 } },
        soulDamage: 0,
      },
      { maxHp: 120, hpModifier: 30 },
      { skillBonuses: { body: 10 } },
    );
    // FOR=10, rankBonus(5)=25, kinHpMod=30, vocation(body)=10 → 75
    expect(model.hpMax).toBe(75);
  });

  it('exposes hp.max on schema for Foundry token bar', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 5, spec: 0 } },
        soulDamage: 0,
      },
      { maxHp: 120, hpModifier: 30 },
    );
    expect((model.hp as any).max).toBe(model.hpMax);
  });
});

// ---------------------------------------------------------------------------
// MP Max
// ---------------------------------------------------------------------------

describe('CharacterDataModel — MP Max', () => {
  it('mpMax = 0 for non-caster (no vocation mpGainPerLevel, no kin mpBonus)', () => {
    const model = createCharacterWithItems(
      { level: 5 },
      { mpBonus: 0 },
      { mpGainPerLevel: 0 },
    );
    expect(model.mpMax).toBe(0);
  });

  it('mpMax = mpGainPerLevel × level + kinMpBonus', () => {
    const model = createCharacterWithItems(
      { level: 5 },
      { mpBonus: 10 },
      { mpGainPerLevel: 3 },
    );
    // 3 × 5 + 10 = 25
    expect(model.mpMax).toBe(25);
  });

  it('mpMax works at level 0 (just kin bonus)', () => {
    const model = createCharacterWithItems(
      { level: 0 },
      { mpBonus: 5 },
      { mpGainPerLevel: 3 },
    );
    // 3 × 0 + 5 = 5
    expect(model.mpMax).toBe(5);
  });

  it('exposes mp.max on schema for Foundry token bar', () => {
    const model = createCharacterWithItems(
      { level: 5 },
      { mpBonus: 10 },
      { mpGainPerLevel: 3 },
    );
    expect((model.mp as any).max).toBe(model.mpMax);
  });
});

// ---------------------------------------------------------------------------
// Move Rate, Size, Bruised Value
// ---------------------------------------------------------------------------

describe('CharacterDataModel — Move Rate, Size, Bruised Value', () => {
  it('moveRate is always 15', () => {
    const model = createCharacterWithItems({});
    expect(model.moveRate).toBe(15);
  });

  it('size comes from Kin item (default Medium)', () => {
    const model = createCharacterWithItems({}, { size: 'Large' });
    expect(model.size).toBe('Large');
  });

  it('size defaults to Medium when no Kin item', () => {
    const model = createCharacterWithItems({});
    expect(model.size).toBe('Medium');
  });

  it('bruisedValue = floor(hpMax / 2)', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 5, spec: 0 } },
        soulDamage: 0,
      },
      { maxHp: 120, hpModifier: 30 },
    );
    // hpMax = 65, bruised = floor(65/2) = 32
    expect(model.bruisedValue).toBe(32);
  });

  it('bruisedValue is 0 when hpMax is 0', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 0, spec: 0 } },
        soulDamage: 100,
      },
      { maxHp: 120, hpModifier: 0 },
    );
    expect(model.bruisedValue).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Kin bonus on Skills (direct Trait bonuses only)
// ---------------------------------------------------------------------------

describe('CharacterDataModel — Kin Bonus on Skills', () => {
  it('applies Kin stat bonuses through the governing Stat, not the Skill Kin component', () => {
    // Kin gives BRN +5. The stat is now 15, while Skill Kin remains reserved
    // for direct Trait bonuses.
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 10, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { blades: { rank: 0, spec: 0 } },
      },
      { statBonuses: { brn: 5 } },
    );
    expect(model.getStatTotal('brn')).toBe(15);
    expect(model.derivedSkills.blades.kin).toBe(0);
    expect(model.derivedSkills.blades.total).toBe(15);
  });

  it('applies Kin direct skill bonuses', () => {
    // An owned Trait gives Perception +10 directly.
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 10, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { perception: { rank: 3, spec: 0 } },
      },
      { statBonuses: {}, skillBonuses: { perception: 10 } },
    );
    expect(model.derivedSkills.perception.kin).toBe(10);
  });

  it('kin bonus is 0 when no Kin item present', () => {
    const model = createCharacterWithItems({
      stats: {
        brn: { base: 10, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: { blades: { rank: 5, spec: 0 } },
    });
    expect(model.derivedSkills.blades.kin).toBe(0);
  });

  it('includes the Kin stat modifier once through the governing Stat', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 10, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { blades: { rank: 5, spec: 0 } },
      },
      { statBonuses: { brn: 5 } },
    );
    // blades: governing BRN=10+5, rankBonus(5)=25, direct Trait Kin=0 → 40
    expect(model.derivedSkills.blades.total).toBe(40);
  });
});

// ---------------------------------------------------------------------------
// Vocation Bonus on Skills (DERIVED from Vocation Item)
// ---------------------------------------------------------------------------

describe('CharacterDataModel — Vocation Bonus on Skills', () => {
  it('applies vocation skill bonuses from Vocation item', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { blades: { rank: 5, spec: 0 } },
      },
      undefined,
      { skillBonuses: { blades: 15 } },
    );
    expect(model.derivedSkills.blades.vocation).toBe(15);
  });

  it('vocation bonus is 0 when no Vocation item present', () => {
    const model = createCharacterWithItems({
      stats: {
        brn: { base: 10, spec: 0 },
        swi: { base: 0, spec: 0 },
        for: { base: 0, spec: 0 },
        wit: { base: 0, spec: 0 },
        wsd: { base: 0, spec: 0 },
        bea: { base: 0, spec: 0 },
      },
      skills: { blades: { rank: 5, spec: 0 } },
    });
    expect(model.derivedSkills.blades.vocation).toBe(0);
  });

  it('includes vocation bonus in skill total', () => {
    const model = createCharacterWithItems(
      {
        stats: {
          brn: { base: 10, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 0, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { blades: { rank: 5, spec: 0 } },
      },
      undefined,
      { skillBonuses: { blades: 10 } },
    );
    // blades: stat(brn)=10, rankBonus(5)=25, kin=0, voc=10, spec=0, item=0 → 45
    expect(model.derivedSkills.blades.total).toBe(45);
  });
});

// ---------------------------------------------------------------------------
// Combined derivation scenario (spec example from spec.md)
// ---------------------------------------------------------------------------

describe('CharacterDataModel — Spec scenario: Man, L7, FOR=10, rank=5', () => {
  it('matches spec: hp.max=65, TSR=65, SR Bonus=35', () => {
    const model = createCharacterWithItems(
      {
        level: 7,
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 0, spec: 0 },
          for: { base: 10, spec: 0 },
          wit: { base: 0, spec: 0 },
          wsd: { base: 0, spec: 0 },
          bea: { base: 0, spec: 0 },
        },
        skills: { body: { rank: 5, spec: 0 } },
        soulDamage: 0,
      },
      { maxHp: 120, hpModifier: 30, tsrBonus: 20 },
    );

    expect(model.saveRollBonus).toBe(35);
    expect(model.hpMax).toBe(65); // FOR(10) + rankBonus(25) + kinHpMod(30) = 65
    expect(model.tsr).toBe(65); // FOR(10) + SRBonus(35) + kinTSR(20) = 65
  });
});
