import { describe, expect, it } from 'vitest';
import { Open00NpcSheet } from '../../src/module/sheets/npc-sheet.js';
import { MockActor } from '../foundry-shim.js';

describe('Open00NpcSheet form submission', () => {
  it('ignores stale unrelated fields when autosaving one array entry', async () => {
    const actor = new MockActor({
      type: 'npc',
      system: {
        hp: 80,
        hasShield: true,
        attacks: [
          { name: 'Claw', bonus: 35 },
          { name: 'Bite', bonus: 20 },
        ],
      },
    });
    const handler = Open00NpcSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { actor },
      {
        type: 'change',
        target: { name: 'system.attacks.0.bonus' },
      } as unknown as Event,
      {} as HTMLFormElement,
      {
        object: {
          system: {
            hp: 0,
            hasShield: false,
            attacks: [
              { name: '', bonus: 45 },
              { name: '', bonus: 0 },
            ],
          },
        },
      } as FormDataExtended,
    );

    expect(actor._lastUpdate).toEqual({ 'system.attacks.0.bonus': 45 });
    expect(actor.system).toEqual({
      hp: 80,
      hasShield: true,
      attacks: [
        { name: 'Claw', bonus: 45 },
        { name: 'Bite', bonus: 20 },
      ],
    });
  });

  it('persists all submitted fields on an explicit form submit', async () => {
    const actor = new MockActor({
      type: 'npc',
      system: { hp: 80, hasShield: true },
    });
    const handler = Open00NpcSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { actor },
      { type: 'submit' } as SubmitEvent,
      {} as HTMLFormElement,
      {
        object: {
          name: 'Ash Drake',
          system: { hp: 90, hasShield: false },
        },
      } as FormDataExtended,
    );

    expect(actor._lastUpdate).toEqual({
      name: 'Ash Drake',
      'system.hp': 90,
      'system.hasShield': false,
    });
  });

  it('persists only the submitter field when Enter triggers submit on a named input', async () => {
    const actor = new MockActor({
      type: 'npc',
      system: { hp: 80, hasShield: true, defense: 10 },
    });
    const handler = Open00NpcSheet.DEFAULT_OPTIONS.form?.handler;

    await handler?.call(
      { actor },
      {
        type: 'submit',
        submitter: { name: 'system.hp' },
      } as unknown as SubmitEvent,
      {} as HTMLFormElement,
      {
        object: {
          system: { hp: 90, hasShield: false, defense: 0 },
        },
      } as FormDataExtended,
    );

    expect(actor._lastUpdate).toEqual({ 'system.hp': 90 });
    expect(actor.system).toEqual({
      hp: 90,
      hasShield: true,
      defense: 10,
    });
  });
});
