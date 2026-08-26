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

const { SchemaField, NumberField, StringField, HTMLField, ArrayField } = foundry.data.fields;

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
