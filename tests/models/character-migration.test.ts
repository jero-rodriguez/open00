/**
 * Character Migration Tests
 *
 * Validates that CharacterDataModel.migrateData() correctly:
 * - Converts legacy skills array → keyed record (matching name → canonical id)
 * - Strips DERIVED fields (stats.*.kin, hp.max, mp.max, defense, encumbrance,
 *   skills.*.vocation, skills.*.kin, skills.*.item)
 * - Preserves PLAYER-OWNED/SEEDED fields (wealth, rank, spec, stats.*.base,
 *   stats.*.spec, hp.value)
 * - Bumps schemaVersion to 2
 * - Is idempotent (no-ops if schemaVersion >= 2)
 */

import { describe, it, expect } from 'vitest';
import { CharacterDataModel } from '../../src/module/models/actor/character.js';
import { SKILL_ID_LIST } from '../../src/module/data/skills.js';

describe('CharacterDataModel.migrateData — legacy array → keyed record', () => {
  it('converts a skills array with display names to keyed record by canonical id', () => {
    const source: Record<string, unknown> = {
      skills: [
        { name: 'Blades', rank: 8, spec: 2 },
        { name: 'Athletics', rank: 5, spec: 0 },
        { name: 'Body', rank: 12, spec: 3 },
        { name: 'Locks & Traps', rank: 3, spec: 1 },
        { name: 'Songs & Tales', rank: 7, spec: 0 },
      ],
    };

    const migrated = CharacterDataModel.migrateData(source);
    const skills = migrated.skills as Record<string, { rank: number; spec: number }>;

    expect(skills.blades).toEqual({ rank: 8, spec: 2 });
    expect(skills.athletics).toEqual({ rank: 5, spec: 0 });
    expect(skills.body).toEqual({ rank: 12, spec: 3 });
    expect(skills['locks-traps']).toEqual({ rank: 3, spec: 1 });
    expect(skills['songs-tales']).toEqual({ rank: 7, spec: 0 });
  });

  it('fills missing skills with defaults (rank: 0, spec: 0)', () => {
    const source: Record<string, unknown> = {
      skills: [
        { name: 'Blades', rank: 5, spec: 0 },
      ],
    };

    const migrated = CharacterDataModel.migrateData(source);
    const skills = migrated.skills as Record<string, { rank: number; spec: number }>;

    // All 22 skills should be present
    expect(Object.keys(skills).length).toBe(22);

    // The provided skill has its value
    expect(skills.blades).toEqual({ rank: 5, spec: 0 });

    // Missing skills get defaults
    expect(skills.body).toEqual({ rank: 0, spec: 0 });
    expect(skills.stealth).toEqual({ rank: 0, spec: 0 });
    expect(skills.arcana).toEqual({ rank: 0, spec: 0 });
  });

  it('handles case-insensitive name matching', () => {
    const source: Record<string, unknown> = {
      skills: [
        { name: 'BLADES', rank: 3, spec: 1 },
        { name: 'athletics', rank: 2, spec: 0 },
        { name: 'Locks & traps', rank: 1, spec: 0 },
      ],
    };

    const migrated = CharacterDataModel.migrateData(source);
    const skills = migrated.skills as Record<string, { rank: number; spec: number }>;

    expect(skills.blades).toEqual({ rank: 3, spec: 1 });
    expect(skills.athletics).toEqual({ rank: 2, spec: 0 });
    expect(skills['locks-traps']).toEqual({ rank: 1, spec: 0 });
  });

  it('preserves ranks above 30 (no cap in v2)', () => {
    const source: Record<string, unknown> = {
      skills: [
        { name: 'Body', rank: 45, spec: 10 },
      ],
    };

    const migrated = CharacterDataModel.migrateData(source);
    const skills = migrated.skills as Record<string, { rank: number; spec: number }>;

    // v2 removes the rank-30 cap
    expect(skills.body).toEqual({ rank: 45, spec: 10 });
  });
});

describe('CharacterDataModel.migrateData — strips DERIVED fields', () => {
  it('strips stats.*.kin derived key from each stat', () => {
    const source: Record<string, unknown> = {
      stats: {
        brn: { base: 20, spec: 5, kin: 10 },
        swi: { base: 15, spec: 0, kin: 5 },
        for: { base: 10, spec: 0, kin: 0 },
        wit: { base: 8, spec: 3, kin: -5 },
        wsd: { base: 12, spec: 0, kin: 0 },
        bea: { base: 5, spec: 0, kin: 10 },
      },
      skills: [],
    };

    const migrated = CharacterDataModel.migrateData(source);
    const stats = migrated.stats as Record<string, Record<string, unknown>>;

    // kin key must be stripped
    expect(stats.brn).toEqual({ base: 20, spec: 5 });
    expect(stats.swi).toEqual({ base: 15, spec: 0 });
    expect(stats.wit).toEqual({ base: 8, spec: 3 });

    // Explicitly check no kin property
    expect('kin' in stats.brn).toBe(false);
    expect('kin' in stats.for).toBe(false);
  });

  it('strips hp.max and mp.max derived keys', () => {
    const source: Record<string, unknown> = {
      hp: { value: 45, max: 65 },
      mp: { value: 10, max: 20 },
      skills: [],
    };

    const migrated = CharacterDataModel.migrateData(source);

    expect((migrated.hp as any).value).toBe(45);
    expect((migrated.hp as any).max).toBeUndefined();
    expect((migrated.mp as any).value).toBe(10);
    expect((migrated.mp as any).max).toBeUndefined();
  });

  it('strips top-level derived keys (defense, encumbrance)', () => {
    const source: Record<string, unknown> = {
      defense: 42,
      encumbrance: 'Heavily Encumbered',
      skills: [],
    };

    const migrated = CharacterDataModel.migrateData(source);

    expect(migrated.defense).toBeUndefined();
    expect(migrated.encumbrance).toBeUndefined();
  });

  it('strips derived keys from keyed skill records (vocation, kin, item)', () => {
    const source: Record<string, unknown> = {
      schemaVersion: 1,
      skills: {
        blades: { rank: 8, spec: 2, vocation: 10, kin: 5, item: 3 },
        athletics: { rank: 5, spec: 0, vocation: 0, kin: 0, item: 0 },
      },
    };

    const migrated = CharacterDataModel.migrateData(source);
    const skills = migrated.skills as Record<string, Record<string, unknown>>;

    expect(skills.blades).toEqual({ rank: 8, spec: 2 });
    expect(skills.athletics).toEqual({ rank: 5, spec: 0 });
    expect('vocation' in skills.blades).toBe(false);
    expect('kin' in skills.blades).toBe(false);
    expect('item' in skills.blades).toBe(false);
  });
});

describe('CharacterDataModel.migrateData — preserves PLAYER-OWNED fields', () => {
  it('preserves wealth, hp.value, stats.*.base, stats.*.spec', () => {
    const source: Record<string, unknown> = {
      wealth: 3,
      hp: { value: 55, max: 80 },
      stats: {
        brn: { base: 25, spec: 5, kin: 10 },
        swi: { base: 18, spec: 3, kin: 5 },
        for: { base: 20, spec: 0, kin: 0 },
        wit: { base: 15, spec: 0, kin: 0 },
        wsd: { base: 12, spec: 2, kin: 0 },
        bea: { base: 8, spec: 0, kin: 10 },
      },
      skills: [
        { name: 'Blades', rank: 10, spec: 3 },
      ],
    };

    const migrated = CharacterDataModel.migrateData(source);

    expect(migrated.wealth).toBe(3);
    expect((migrated.hp as any).value).toBe(55);
    expect((migrated.stats as any).brn.base).toBe(25);
    expect((migrated.stats as any).brn.spec).toBe(5);
    expect((migrated.stats as any).swi.base).toBe(18);
    expect((migrated.stats as any).for.base).toBe(20);
  });
});

describe('CharacterDataModel.migrateData — schema version + idempotency', () => {
  it('bumps schemaVersion to 2', () => {
    const source: Record<string, unknown> = {
      skills: [],
    };

    const migrated = CharacterDataModel.migrateData(source);
    expect(migrated.schemaVersion).toBe(2);
  });

  it('is idempotent when schemaVersion >= 2', () => {
    const source: Record<string, unknown> = {
      schemaVersion: 2,
      skills: {
        blades: { rank: 8, spec: 2 },
        body: { rank: 5, spec: 0 },
      },
      stats: {
        brn: { base: 20, spec: 5 },
      },
      hp: { value: 45 },
    };

    const migrated = CharacterDataModel.migrateData({ ...source });

    // Nothing should change
    expect(migrated.schemaVersion).toBe(2);
    expect((migrated.skills as any).blades).toEqual({ rank: 8, spec: 2 });
    expect((migrated.stats as any).brn).toEqual({ base: 20, spec: 5 });
    expect((migrated.hp as any).value).toBe(45);
  });

  it('does not run migration on schemaVersion 3 (forward compat)', () => {
    const source: Record<string, unknown> = {
      schemaVersion: 3,
      skills: {
        blades: { rank: 10, spec: 5, someNewField: true },
      },
    };

    const migrated = CharacterDataModel.migrateData({ ...source });

    // Should pass through unchanged
    expect(migrated.schemaVersion).toBe(3);
    expect((migrated.skills as any).blades.someNewField).toBe(true);
  });
});
