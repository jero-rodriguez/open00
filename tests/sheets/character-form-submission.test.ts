import { describe, expect, it } from 'vitest';
import { Open00CharacterSheet } from '../../src/module/sheets/character-sheet.js';
import { MockActor } from '../foundry-shim.js';

describe('Open00CharacterSheet form submission', () => {
  it('updates only the edited stat field when FormDataExtended returns nested data', async () => {
    const actor = new MockActor({
      system: {
        stats: {
          brn: { base: 0, spec: 0 },
          swi: { base: 1, spec: 2 },
        },
        hp: { value: 12 },
        mp: { value: 3 },
      },
    });
    const handler = Open00CharacterSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { actor },
      {} as SubmitEvent,
      {} as HTMLFormElement,
      { object: { system: { stats: { brn: { base: 5 } } } } } as FormDataExtended,
    );

    expect(actor._lastUpdate).toEqual({ 'system.stats.brn.base': 5 });
    expect(actor.system).toEqual({
      stats: {
        brn: { base: 5, spec: 0 },
        swi: { base: 1, spec: 2 },
      },
      hp: { value: 12 },
      mp: { value: 3 },
    });
  });

  it('ignores stale stat and skill values when autosaving one changed field', async () => {
    const actor = new MockActor({
      system: {
        stats: {
          brn: { base: 3, spec: 4 },
          swi: { base: 7, spec: 8 },
        },
        skills: {
          armor: { rank: 2, spec: 6 },
          body: { rank: 5, spec: 9 },
        },
      },
    });
    const handler = Open00CharacterSheet.DEFAULT_OPTIONS.form?.handler;
    const changedInput = { name: 'system.skills.armor.rank' };

    await handler?.call(
      { actor },
      { type: 'change', target: changedInput } as unknown as Event,
      {} as HTMLFormElement,
      {
        object: {
          system: {
            stats: {
              brn: { base: 0, spec: 0 },
              swi: { base: 0, spec: 0 },
            },
            skills: {
              armor: { rank: 4, spec: 0 },
              body: { rank: 0, spec: 0 },
            },
          },
        },
      } as FormDataExtended,
    );

    expect(actor._lastUpdate).toEqual({ 'system.skills.armor.rank': 4 });
    expect(actor.system).toEqual({
      stats: {
        brn: { base: 3, spec: 4 },
        swi: { base: 7, spec: 8 },
      },
      skills: {
        armor: { rank: 4, spec: 6 },
        body: { rank: 5, spec: 9 },
      },
    });
  });
});
