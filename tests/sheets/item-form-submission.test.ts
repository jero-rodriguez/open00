import { describe, expect, it } from 'vitest';
import { Open00ItemSheet } from '../../src/module/sheets/item-sheet.js';
import { MockItem } from '../foundry-shim.js';

describe('Open00ItemSheet form submission', () => {
  it('ignores stale unrelated fields when autosaving one changed field', async () => {
    const item = new MockItem({
      type: 'kin',
      system: {
        statModifiers: { brn: 5, swi: -5 },
        hpBonus: 40,
        maxHp: 150,
      },
    });
    const handler = Open00ItemSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { item },
      {
        type: 'change',
        target: { name: 'system.statModifiers.brn' },
      } as unknown as Event,
      {} as HTMLFormElement,
      {
        object: {
          system: {
            statModifiers: { brn: 10, swi: 0 },
            hpBonus: 0,
            maxHp: 0,
          },
        },
      } as FormDataExtended,
    );

    expect(item._lastUpdate).toEqual({ 'system.statModifiers.brn': 10 });
    expect(item.system).toEqual({
      statModifiers: { brn: 10, swi: -5 },
      hpBonus: 40,
      maxHp: 150,
    });
  });

  it('persists a changed array control as one field-scoped value', async () => {
    const item = new MockItem({
      type: 'armor',
      system: {
        zonesProtected: ['Head'],
        armorType: 'HA',
      },
    });
    const handler = Open00ItemSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { item },
      {
        type: 'change',
        target: { name: 'system.zonesProtected' },
      } as unknown as Event,
      {} as HTMLFormElement,
      {
        object: {
          system: {
            zonesProtected: ['Head', 'Arms'],
            armorType: 'NA',
          },
        },
      } as FormDataExtended,
    );

    expect(item._lastUpdate).toEqual({
      'system.zonesProtected': ['Head', 'Arms'],
    });
    expect(item.system).toEqual({
      zonesProtected: ['Head', 'Arms'],
      armorType: 'HA',
    });
  });

  it('persists all submitted fields on an explicit form submit', async () => {
    const item = new MockItem({
      type: 'kin',
      system: {
        statModifiers: { brn: 5, swi: -5 },
        hpBonus: 40,
      },
    });
    const handler = Open00ItemSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { item },
      { type: 'submit' } as SubmitEvent,
      {} as HTMLFormElement,
      {
        object: {
          name: 'High Man',
          system: {
            statModifiers: { brn: 10, swi: 0 },
            hpBonus: 50,
          },
        },
      } as FormDataExtended,
    );

    expect(item._lastUpdate).toEqual({
      name: 'High Man',
      'system.statModifiers.brn': 10,
      'system.statModifiers.swi': 0,
      'system.hpBonus': 50,
    });
  });
});
