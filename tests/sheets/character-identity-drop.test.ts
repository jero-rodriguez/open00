import { describe, expect, it, vi } from 'vitest';
import { Open00CharacterSheet } from '../../src/module/sheets/character-sheet.js';
import { MockActor, MockItem } from '../foundry-shim.js';

describe('Open00CharacterSheet identity drop', () => {
  it('passes Foundry v14 resolved Item documents to the base drop handler', async () => {
    const actor = new MockActor({ type: 'character', system: {} });
    const kin = new MockItem({ type: 'kin', system: { statModifiers: {} } });
    const sheet = new Open00CharacterSheet() as any;
    sheet.document = actor;

    const actorSheetPrototype = Object.getPrototypeOf(Open00CharacterSheet.prototype);
    vi.spyOn(actorSheetPrototype, '_onDropItem').mockResolvedValue(kin);

    try {
      const event = {} as DragEvent;
      await expect(sheet._onDropItem(event, kin)).resolves.toBe(kin);
      expect(actorSheetPrototype._onDropItem).toHaveBeenCalledWith(event, kin);
    } finally {
      vi.restoreAllMocks();
    }
  });
});
