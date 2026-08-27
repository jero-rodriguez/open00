import { describe, expect, it, vi } from 'vitest';
import { Open00CharacterSheet } from '../../src/module/sheets/character-sheet.js';
import { MockActor, MockItem } from '../foundry-shim.js';

describe('Open00CharacterSheet identity drop', () => {
  it('accepts Foundry returning a single created Item', async () => {
    const actor = new MockActor({ type: 'character', system: {} });
    const kin = new MockItem({ type: 'kin', system: { statModifiers: {} } });
    const sheet = new Open00CharacterSheet() as any;
    sheet.document = actor;

    Object.defineProperty(Item, 'fromDropData', {
      configurable: true,
      value: vi.fn().mockResolvedValue(kin),
    });
    const actorSheetPrototype = Object.getPrototypeOf(Open00CharacterSheet.prototype);
    vi.spyOn(actorSheetPrototype, '_onDropItem').mockResolvedValue(kin);

    try {
      await expect(sheet._onDropItem({} as DragEvent, {})).resolves.toBe(kin);
    } finally {
      delete (Item as any).fromDropData;
      vi.restoreAllMocks();
    }
  });
});
