/**
 * NPC Derived Data Tests (Slice 8)
 *
 * NPC stat blocks are GM-entered directly — fields like Level, MR, AT, DEF,
 * TSR, WSR, HPs, CT are all PLAYER-OWNED (persisted as-is).
 *
 * The lightweight prepareDerivedData() only needs to:
 * 1. Expose hp as {value, max} for Foundry token bar tracking (hp is flat number in schema)
 * 2. Compute SR Level Bonus from level (for display/reference)
 * 3. Not crash on missing or partial data
 *
 * Source: vsd-bestiary.md stat block format, tasks §Slice 8.3-8.4
 */

import { describe, it, expect } from 'vitest';
import { NpcDataModel } from '../../src/module/models/actor/npc.js';
import { createModel } from '../foundry-shim.js';

describe('NpcDataModel — prepareDerivedData', () => {
  it('exposes hpMax equal to persisted hp for token bar tracking', () => {
    const model = createModel(NpcDataModel as any, {
      hp: 85,
      level: 5,
    });
    expect(model.hpMax).toBe(85);
  });

  it('exposes hpValue equal to persisted hp (NPC hp is flat)', () => {
    const model = createModel(NpcDataModel as any, {
      hp: 120,
    });
    expect(model.hpValue).toBe(120);
  });

  it('computes saveRollBonus from NPC level', () => {
    const model = createModel(NpcDataModel as any, {
      level: 8,
    });
    // L8 → 8 × 5 = 40
    expect(model.saveRollBonus).toBe(40);
  });

  it('computes saveRollBonus for high-level NPC (level 15)', () => {
    const model = createModel(NpcDataModel as any, {
      level: 15,
    });
    // 50 (L1-10) + 5×2 (L11-15) = 60
    expect(model.saveRollBonus).toBe(60);
  });

  it('preserves persisted DEF, TSR, WSR as-is (no derivation override)', () => {
    const model = createModel(NpcDataModel as any, {
      level: 3,
      defense: 25,
      tsr: 45,
      wsr: 30,
    });
    expect(model.defense).toBe(25);
    expect(model.tsr).toBe(45);
    expect(model.wsr).toBe(30);
  });

  it('preserves all bestiary fields (armorType, moveRates, creatureType)', () => {
    const model = createModel(NpcDataModel as any, {
      armorType: 'MA',
      moveRates: '50F/10L',
      creatureType: 'UD',
    });
    expect(model.armorType).toBe('MA');
    expect(model.moveRates).toBe('50F/10L');
    expect(model.creatureType).toBe('UD');
  });

  it('handles level 0 NPC gracefully', () => {
    const model = createModel(NpcDataModel as any, {
      level: 0,
      hp: 1,
    });
    expect(model.saveRollBonus).toBe(0);
    expect(model.hpMax).toBe(1);
  });

  it('handles default values (no explicit data)', () => {
    const model = createModel(NpcDataModel as any, {});
    expect(model.saveRollBonus).toBe(5); // level defaults to 1
    expect(model.hpMax).toBe(1); // hp defaults to 1
    expect(model.hpValue).toBe(1);
  });
});
