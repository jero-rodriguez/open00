/**
 * Character Seeding Tests
 *
 * Validates that Open00Actor._onCreateDescendantDocuments correctly seeds
 * wealth and cultural skill ranks when identity items are added — and that
 * removing a Vocation does NOT zero the skills (regression: defect a).
 *
 * Seeding rules:
 * - Triggered when a Kin/Culture/Vocation Item is added to a character
 * - Wealth = Kin startingWealth + Culture startingWealth, clamped [0, 4]
 * - Cultural skill ranks distributed from Culture.skillRankAllocations
 * - Guarded by `seeded` flag — once true, never re-seeds
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Open00Actor } from '../../src/module/documents/open00-actor.js';
import { MockItem } from '../foundry-shim.js';

/**
 * Create a test Open00Actor with character system data.
 * Manually assigns required fields since Open00Actor extends MockActor
 * and class field initialization applies.
 */
function createTestActor(overrides: Record<string, unknown> = {}): InstanceType<typeof Open00Actor> {
  const actor = new Open00Actor() as any;
  actor.type = 'character';
  actor.name = 'Test Character';
  actor.system = {
    seeded: false,
    wealth: 0,
    skills: {
      armor: { rank: 0, spec: 0 },
      blades: { rank: 0, spec: 0 },
      blunt: { rank: 0, spec: 0 },
      ranged: { rank: 0, spec: 0 },
      polearms: { rank: 0, spec: 0 },
      brawl: { rank: 0, spec: 0 },
      athletics: { rank: 0, spec: 0 },
      ride: { rank: 0, spec: 0 },
      hunting: { rank: 0, spec: 0 },
      nature: { rank: 0, spec: 0 },
      wandering: { rank: 0, spec: 0 },
      acrobatics: { rank: 0, spec: 0 },
      stealth: { rank: 0, spec: 0 },
      'locks-traps': { rank: 0, spec: 0 },
      perception: { rank: 0, spec: 0 },
      deceive: { rank: 0, spec: 0 },
      arcana: { rank: 0, spec: 0 },
      charisma: { rank: 0, spec: 0 },
      cultures: { rank: 0, spec: 0 },
      healer: { rank: 0, spec: 0 },
      'songs-tales': { rank: 0, spec: 0 },
      body: { rank: 0, spec: 0 },
    },
    ...overrides,
  };
  return actor;
}

describe('Open00Actor — identity seeding', () => {
  it('seeds correctly when Kin and Culture are dropped sequentially', async () => {
    const actor = createTestActor();
    const kinItem = new MockItem({
      type: 'kin',
      system: { startingWealth: 1 },
    });
    const cultureItem = new MockItem({
      type: 'culture',
      system: {
        startingWealth: 2,
        skillRankAllocations: [{ skillName: 'Athletics', ranks: 3 }],
      },
    });

    await actor.createEmbeddedDocuments('Item', [kinItem as any]);
    await new Promise((r) => setTimeout(r, 10));
    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    expect(actor.system.skills.athletics.rank).toBe(3);
    expect(actor.system.wealth).toBe(3);
    expect(actor.system.cultureSeeded).toBe(true);
    expect(actor.system.wealthSeeded).toBe(true);
  });

  it('does not duplicate cultural ranks when Culture is dropped before Kin', async () => {
    const actor = createTestActor();
    const cultureItem = new MockItem({
      type: 'culture',
      system: {
        startingWealth: 2,
        skillRankAllocations: [{ skillName: 'Athletics', ranks: 3 }],
      },
    });
    const kinItem = new MockItem({
      type: 'kin',
      system: { startingWealth: 1 },
    });

    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);
    await new Promise((r) => setTimeout(r, 10));
    await actor.createEmbeddedDocuments('Item', [kinItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    expect(actor.system.skills.athletics.rank).toBe(3);
    expect(actor.system.wealth).toBe(3);
  });

  it('seeds cultural skill ranks when a Culture item is added', async () => {
    const actor = createTestActor();

    // Culture item with 21 ranks distributed across skills
    const cultureItem = new MockItem({
      type: 'culture',
      name: 'Woodland Folk',
      system: {
        startingWealth: 2,
        skillRankAllocations: [
          { skillName: 'Athletics', ranks: 3 },
          { skillName: 'Stealth', ranks: 4 },
          { skillName: 'Nature', ranks: 5 },
          { skillName: 'Perception', ranks: 3 },
          { skillName: 'Hunting', ranks: 3 },
          { skillName: 'Wandering', ranks: 3 },
        ],
      },
    });

    // Simulate adding the item via createEmbeddedDocuments
    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);

    // Wait for async seeding to complete
    await new Promise((r) => setTimeout(r, 10));

    // Verify skill ranks were seeded
    expect(actor.system.skills.athletics.rank).toBe(3);
    expect(actor.system.skills.stealth.rank).toBe(4);
    expect(actor.system.skills.nature.rank).toBe(5);
    expect(actor.system.skills.perception.rank).toBe(3);
    expect(actor.system.skills.hunting.rank).toBe(3);
    expect(actor.system.skills.wandering.rank).toBe(3);

    // Verify wealth was seeded (Culture startingWealth=2, no Kin yet)
    expect(actor.system.wealth).toBe(2);

    // Verify seeded flag is set
    expect(actor.system.seeded).toBe(true);
  });

  it('seeds wealth from Kin + Culture combined, clamped [0, 4]', async () => {
    const actor = createTestActor();

    const kinItem = new MockItem({
      type: 'kin',
      name: 'Dwarf',
      system: { startingWealth: 3 },
    });

    const cultureItem = new MockItem({
      type: 'culture',
      name: 'Mountain Folk',
      system: {
        startingWealth: 2,
        skillRankAllocations: [],
      },
    });

    // Add both items — kin first, then culture triggers seeding
    actor.items.push(kinItem);
    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    // Wealth = 3 + 2 = 5, clamped to 4
    expect(actor.system.wealth).toBe(4);
  });

  it('does NOT re-seed when seeded flag is already true (guard)', async () => {
    const actor = createTestActor({ seeded: true });
    actor.system.skills.athletics = { rank: 10, spec: 0 };

    const cultureItem = new MockItem({
      type: 'culture',
      name: 'River Folk',
      system: {
        startingWealth: 1,
        skillRankAllocations: [
          { skillName: 'Athletics', ranks: 5 },
        ],
      },
    });

    await actor.createEmbeddedDocuments('Item', [cultureItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    // Should NOT have changed — seeded guard prevents it
    expect(actor.system.skills.athletics.rank).toBe(10);
    expect(actor.system.wealth).toBe(0);
  });

  it('removing a Vocation does NOT zero skill ranks (regression: defect a)', async () => {
    // Start with a character that has been seeded and has skill ranks
    const actor = createTestActor({ seeded: true });
    actor.system.skills.blades = { rank: 8, spec: 2 };
    actor.system.skills.athletics = { rank: 5, spec: 0 };

    // Simulate "removing" a vocation — since Open00Actor only seeds on CREATE,
    // deleting an item should NOT trigger any re-derivation of skill ranks
    const vocationItem = new MockItem({
      type: 'vocation',
      name: 'Warrior',
      system: {},
    });
    actor.items.push(vocationItem);

    // Delete the item (no _onDeleteDescendantDocuments seeding logic exists)
    await vocationItem.delete();

    // Skills must remain unchanged
    expect(actor.system.skills.blades.rank).toBe(8);
    expect(actor.system.skills.blades.spec).toBe(2);
    expect(actor.system.skills.athletics.rank).toBe(5);
  });

  it('does NOT seed NPC actors', async () => {
    const actor = createTestActor();
    actor.type = 'npc';

    const kinItem = new MockItem({
      type: 'kin',
      name: 'Orc',
      system: { startingWealth: 1 },
    });

    await actor.createEmbeddedDocuments('Item', [kinItem as any]);
    await new Promise((r) => setTimeout(r, 10));

    // NPC should not be seeded
    expect(actor.system.seeded).toBe(false);
    expect(actor.system.wealth).toBe(0);
  });

  it('ignores non-identity items (equipment)', async () => {
    const actor = createTestActor();

    const sword = new MockItem({
      type: 'weapon',
      name: 'Longsword',
      system: { damage: '1d8' },
    });

    await actor.createEmbeddedDocuments('Item', [sword as any]);
    await new Promise((r) => setTimeout(r, 10));

    // No seeding should have occurred
    expect(actor.system.seeded).toBe(false);
    expect(actor.system.wealth).toBe(0);
  });
});
