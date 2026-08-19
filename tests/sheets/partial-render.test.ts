import { describe, expect, it } from 'vitest';
import { getCharacterSheetUpdateParts } from '../../src/module/sheets/partial-render.js';

describe('character sheet partial rendering', () => {
  it('renders only the part containing a simple edited value', () => {
    expect(getCharacterSheetUpdateParts({ 'system.hp.value': 7 })).toEqual(['combat']);
    expect(getCharacterSheetUpdateParts({ system: { biography: 'Changed' } })).toEqual([
      'biography',
    ]);
  });

  it('includes parts containing values derived from a stat or skill', () => {
    expect(getCharacterSheetUpdateParts({ 'system.stats.brn': 12 })).toEqual([
      'overview',
      'magic',
      'equipment',
    ]);
    expect(getCharacterSheetUpdateParts({ system: { skills: [{ rank: 3 }] } })).toEqual([
      'overview',
      'magic',
    ]);
  });

  it('combines parts for multi-field updates in sheet order', () => {
    expect(
      getCharacterSheetUpdateParts({
        name: 'New name',
        'system.hp.max': 25,
        'system.backgroundNotes': 'Notes',
      }),
    ).toEqual(['header', 'combat', 'biography']);
  });

  it('falls back to a full render for unknown or unusable update data', () => {
    expect(getCharacterSheetUpdateParts({ 'system.unmapped': true })).toBeUndefined();
    expect(getCharacterSheetUpdateParts({ _id: 'actor-id' })).toBeUndefined();
    expect(getCharacterSheetUpdateParts(undefined)).toBeUndefined();
  });
});
