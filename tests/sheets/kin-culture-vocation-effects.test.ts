import { describe, expect, it } from 'vitest';
import { deriveKinCultureVocationEffects } from '../../src/module/sheets/kin-culture-vocation-effects.js';

describe('deriveKinCultureVocationEffects', () => {
  it('applies all kin stat modifiers and HP from the dropped kin data', () => {
    const updates = deriveKinCultureVocationEffects(
      { skills: [{ name: 'Body Development', rank: 3 }] },
      {
        kin: {
          statModifiers: { brn: 5, swi: -5, for: 10, wit: 0, wsd: 3, bea: -2 },
          hpBonus: 40,
        },
      },
    );

    expect(updates).toMatchObject({
      'system.stats.brn.kin': 5,
      'system.stats.swi.kin': -5,
      'system.stats.for.kin': 10,
      'system.stats.wit.kin': 0,
      'system.stats.wsd.kin': 3,
      'system.stats.bea.kin': -2,
      'system.hp.max': 55,
    });
  });

  it('combines Kin and Culture starting Wealth on the character', () => {
    const updates = deriveKinCultureVocationEffects(
      { skills: [] },
      {
        kin: { startingWealth: 1 },
        culture: { startingWealth: 2 },
      },
    );

    expect(updates['system.wealth']).toBe(3);
  });
});
