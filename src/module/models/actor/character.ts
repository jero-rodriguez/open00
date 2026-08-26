/**
 * CharacterDataModel — TypeDataModel for the Open 00 Player Character Actor type.
 *
 * Defines the PERSISTED schema only. Derived values (hp.max, mp.max, defense,
 * encumbrance, skill totals, stat kin bonuses, vocation/item bonuses) are
 * computed in prepareDerivedData() and never stored in the database.
 *
 * Skills use a keyed SchemaField record (one field per canonical SkillId)
 * instead of an ArrayField. Each skill stores only player-owned data:
 * rank and spec bonus.
 */

import { computeRankBonus } from '../../engine/rank-bonus.js';
import {
  SKILL_ID_LIST,
  DEFAULT_SKILL_DEFINITIONS,
  type SkillId,
  type SkillRecord,
} from '../../data/skills.js';

// ---------------------------------------------------------------------------
// Migration helpers
// ---------------------------------------------------------------------------

/** Reverse map: display name → canonical SkillId for legacy array migration. */
const NAME_TO_SKILL_ID: ReadonlyMap<string, SkillId> = new Map(
  SKILL_ID_LIST.map((id) => [DEFAULT_SKILL_DEFINITIONS[id].name.toLowerCase(), id]),
);

/** Keys that are DERIVED and must be stripped from persisted source data. */
const DERIVED_STAT_KEYS = ['kin'] as const;
const DERIVED_SKILL_KEYS = ['vocation', 'kin', 'item'] as const;
const DERIVED_TOP_LEVEL_KEYS = ['defense', 'encumbrance'] as const;

const { SchemaField, NumberField, StringField, HTMLField, ArrayField, BooleanField } = foundry.data.fields;

/** Stat key identifiers matching the schema. */
export type StatKey = 'brn' | 'swi' | 'for' | 'wit' | 'wsd' | 'bea';

// ---------------------------------------------------------------------------
// Helper: build the keyed skills SchemaField at define-time.
// ---------------------------------------------------------------------------
function buildSkillsSchema(): foundry.data.fields.DataField {
  const fields: Record<string, foundry.data.fields.DataField> = {};
  for (const id of SKILL_ID_LIST) {
    fields[id] = new SchemaField({
      rank: new NumberField({ integer: true, min: 0, initial: 0 }),
      spec: new NumberField({ integer: true, initial: 0 }),
    });
  }
  return new SchemaField(fields);
}

// ---------------------------------------------------------------------------
// Derived-data shape (not persisted, populated in prepareDerivedData).
// ---------------------------------------------------------------------------

export interface DerivedSkillData {
  rank: number;
  spec: number;
  /** Bonus from kin traits (DERIVED). */
  kin: number;
  /** Bonus from vocation (DERIVED). */
  vocation: number;
  /** Bonus from equipped items (DERIVED). */
  item: number;
  /** Total skill bonus = stat + rankBonus + kin + vocation + spec + item. */
  total: number;
}

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  // -- Derived properties (computed, not persisted) --------------------------

  /** Derived skill totals and breakdowns, keyed by SkillId. */
  derivedSkills!: Record<SkillId, DerivedSkillData>;

  /** Derived HP max (full Body Skill Bonus, capped by Kin maxHp, reduced by soulDamage). */
  hpMax!: number;

  /** Derived MP max. */
  mpMax!: number;

  /** Derived defense value. */
  derivedDefense!: number;

  /** Derived encumbrance level. */
  derivedEncumbrance!: string;

  // -- Schema fields (type annotations for access) ---------------------------

  stats!: Record<StatKey, { base: number; spec: number }>;
  hp!: { value: number };
  mp!: { value: number };
  drivePoints!: { value: number; max: number };
  wealth!: number;
  passions!: { nature: string; allegiance: string; motivation: string };
  heroicPath!: string;
  experience!: { total: number; dp: number };
  level!: number;
  skills!: Record<SkillId, SkillRecord>;
  soulDamage!: number;
  schemaVersion!: number;
  seeded!: boolean;

  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Schema version for migration tracking
      schemaVersion: new NumberField({ integer: true, min: 0, initial: 2 }),

      // Six stats: each has base and spec modifiers (kin is DERIVED from owned Kin Item)
      stats: new SchemaField({
        brn: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        swi: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        for: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        wit: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        wsd: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        bea: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
      }),

      // Hit Points — only current value is persisted; max is derived
      hp: new SchemaField({
        value: new NumberField({ integer: true, initial: 0 }),
      }),

      // Magic Points — only current value is persisted; max is derived
      mp: new SchemaField({
        value: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Drive Points — value is current pool, max is persisted (default 5)
      drivePoints: new SchemaField({
        value: new NumberField({ integer: true, min: 0, initial: 1 }),
        max: new NumberField({ integer: true, min: 0, initial: 5 }),
      }),

      // Soul Damage — reduces HP max; player-owned, starts at 0
      soulDamage: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Wealth level (seeded from Kin + Culture + Background, then player-owned)
      wealth: new NumberField({ integer: true, min: 0, max: 5, initial: 0 }),

      // Passions: Nature, Allegiance, Motivation
      passions: new SchemaField({
        nature: new StringField({ initial: '' }),
        allegiance: new StringField({ initial: '' }),
        motivation: new StringField({ initial: '' }),
      }),

      // Heroic Path
      heroicPath: new StringField({ initial: '' }),

      // Experience and Development Points
      experience: new SchemaField({
        total: new NumberField({ integer: true, min: 0, initial: 0 }),
        dp: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Character Level
      level: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Whether identity seeding (wealth + cultural skill ranks) has already run.
      // Once true, subsequent identity item additions do NOT re-seed.
      seeded: new BooleanField({ initial: false }),

      // Development Points Per Level history
      developmentPointsPerLevel: new ArrayField(
        new NumberField({ integer: true, min: 0, initial: 0 }),
        { initial: [] },
      ),

      // Skills — keyed record by canonical SkillId; only rank + spec are persisted
      skills: buildSkillsSchema(),

      // Special Abilities (free-form text entries)
      specialAbilities: new ArrayField(
        new StringField({ initial: '' }),
        { initial: [] },
      ),

      // Known Languages
      knownLanguages: new ArrayField(
        new StringField({ initial: '' }),
        { initial: [] },
      ),

      // Biography
      biography: new HTMLField({ initial: '' }),

      // Appearance
      appearance: new HTMLField({ initial: '' }),

      // Background notes
      backgroundNotes: new HTMLField({ initial: '' }),
    };
  }

  // ---------------------------------------------------------------------------
  // Data Migration — converts any 1.x source to v2 schema on document load.
  // ---------------------------------------------------------------------------

  /**
   * Forward-only migration from 1.x schema to v2.
   *
   * - Converts legacy skills array → keyed record (matching name to canonical id)
   * - Strips DERIVED fields (stats.*.kin, hp.max, mp.max, defense, encumbrance,
   *   skills.*.vocation, skills.*.kin, skills.*.item)
   * - Preserves PLAYER-OWNED fields (wealth, rank, spec, stats.*.base, stats.*.spec, hp.value)
   * - Removes rank-30 cap (values preserved as-is)
   * - Bumps schemaVersion to 2
   *
   * Idempotent: no-ops if schemaVersion >= 2.
   */
  static override migrateData(source: Record<string, unknown>): Record<string, unknown> {
    // Already migrated — idempotent
    if (typeof source.schemaVersion === 'number' && source.schemaVersion >= 2) {
      return super.migrateData(source);
    }

    // --- Skills: array → keyed record ---
    const rawSkills = source.skills;
    if (Array.isArray(rawSkills)) {
      const keyed: Record<string, { rank: number; spec: number }> = {};

      for (const entry of rawSkills) {
        if (!entry || typeof entry !== 'object') continue;
        const name = (entry as Record<string, unknown>).name;
        if (typeof name !== 'string') continue;

        const id = NAME_TO_SKILL_ID.get(name.toLowerCase());
        if (!id) continue; // Unknown skill name — skip (shouldn't happen)

        const rank = typeof (entry as any).rank === 'number' ? (entry as any).rank : 0;
        const spec = typeof (entry as any).spec === 'number' ? (entry as any).spec : 0;
        keyed[id] = { rank, spec };
      }

      // Fill any missing skills with defaults
      for (const id of SKILL_ID_LIST) {
        if (!keyed[id]) {
          keyed[id] = { rank: 0, spec: 0 };
        }
      }

      source.skills = keyed;
    } else if (rawSkills && typeof rawSkills === 'object' && !Array.isArray(rawSkills)) {
      // Already a keyed record — strip derived keys from each skill entry
      const record = rawSkills as Record<string, Record<string, unknown>>;
      for (const id of Object.keys(record)) {
        if (record[id] && typeof record[id] === 'object') {
          for (const key of DERIVED_SKILL_KEYS) {
            delete record[id][key];
          }
        }
      }
    }

    // --- Stats: strip derived 'kin' key from each stat ---
    const rawStats = source.stats;
    if (rawStats && typeof rawStats === 'object') {
      const stats = rawStats as Record<string, Record<string, unknown>>;
      for (const statKey of Object.keys(stats)) {
        if (stats[statKey] && typeof stats[statKey] === 'object') {
          for (const key of DERIVED_STAT_KEYS) {
            delete stats[statKey][key];
          }
        }
      }
    }

    // --- HP: strip derived 'max' key ---
    const rawHp = source.hp;
    if (rawHp && typeof rawHp === 'object') {
      delete (rawHp as Record<string, unknown>).max;
    }

    // --- MP: strip derived 'max' key ---
    const rawMp = source.mp;
    if (rawMp && typeof rawMp === 'object') {
      delete (rawMp as Record<string, unknown>).max;
    }

    // --- Top-level derived keys ---
    for (const key of DERIVED_TOP_LEVEL_KEYS) {
      delete source[key];
    }

    // --- Bump schema version ---
    source.schemaVersion = 2;

    return super.migrateData(source);
  }

  // ---------------------------------------------------------------------------
  // Derived data computation (skeleton — full formulas in Slice 8)
  // ---------------------------------------------------------------------------

  /**
   * Compute all derived data for the character.
   *
   * TODO(v2-slice-8): Implement full formulas for:
   *   - hp.max (Body Skill Bonus, capped by Kin maxHp, reduced by soulDamage)
   *   - mp.max
   *   - defense (SWI total + armor/shield)
   *   - encumbrance level
   *   - stat kin bonuses (from owned Kin Item traits)
   *   - skill vocation/kin/item bonuses
   *   - SR Level Bonus, TSR/WSR
   */
  override prepareDerivedData(): void {
    this._computeDerivedSkills();
    this._computeDerivedVitals();
  }

  private _computeDerivedSkills(): void {
    const derived = {} as Record<SkillId, DerivedSkillData>;

    for (const id of SKILL_ID_LIST) {
      const skill = this.skills?.[id];
      const rank = skill?.rank ?? 0;
      const spec = skill?.spec ?? 0;

      // Stat contribution
      const def = DEFAULT_SKILL_DEFINITIONS[id];
      const statTotal = def.statKey ? this.getStatTotal(def.statKey as StatKey) : 0;

      // Rank bonus from engine
      const rankBonus = computeRankBonus(rank);

      // Derived bonuses (skeleton — populated in Slice 8 from owned Items)
      const kin = 0;
      const vocation = 0;
      const item = 0;

      const total = statTotal + rankBonus + kin + vocation + spec + item;

      derived[id] = { rank, spec, kin, vocation, item, total };
    }

    this.derivedSkills = derived;
  }

  private _computeDerivedVitals(): void {
    // Skeleton — full formulas in Slice 8
    // hp.max = full Body Skill Bonus, capped by Kin maxHp, reduced by soulDamage
    const bodyTotal = this.derivedSkills?.body?.total ?? 0;
    this.hpMax = Math.max(0, bodyTotal - (this.soulDamage ?? 0));
    this.mpMax = 0;
    this.derivedDefense = 0;
    this.derivedEncumbrance = 'Unencumbered';
  }

  /**
   * Get the total value for a stat (base + spec).
   * Kin bonus will be added in Slice 8 when derived from owned Kin Item.
   */
  getStatTotal(statKey: StatKey): number {
    const stat = this.stats?.[statKey];
    if (!stat) return 0;
    return (stat.base ?? 0) + (stat.spec ?? 0);
  }
}
