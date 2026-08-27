import { describe, expect, it } from 'vitest';
import { Open00ItemSheet } from '../../src/module/sheets/item-sheet.js';
import { MockItem } from '../foundry-shim.js';

describe('Open00ItemSheet form submission', () => {
  it('updates only the edited nested field', async () => {
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
      {} as SubmitEvent,
      {} as HTMLFormElement,
      { object: { system: { statModifiers: { brn: 10 } } } } as FormDataExtended,
    );

    expect(item.system).toEqual({
      statModifiers: { brn: 10, swi: -5 },
      hpBonus: 40,
      maxHp: 150,
    });
  });
});
