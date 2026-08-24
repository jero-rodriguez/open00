/**
 * CharacterDataModel — TypeDataModel for the Open 00 Player Character Actor type.
 *
 * Defines the persisted schema for stats, vitals (HP/MP/Drive Points),
 * defense, encumbrance level, and wealth.
 */

import { computeRankBonus } from '../../engine/rank-bonus.js';
import { createDefaultSkills, ensureCharacterSkills, type SkillData } from '../../data/skills.js';

const { SchemaField, NumberField, StringField, HTMLField, ArrayField } = foundry.data.fields;

/** Stat key identifiers matching the schema */
type StatKey = 'brn' | 'swi' | 'for' | 'wit' | 'wsd' | 'bea';

function asFiniteNumber(value: unknown): number {
  const numericValue = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  /** Derived skill totals computed in prepareDerivedData(). Keyed by skill name. */
  skillTotals: Map<string, number> = new Map();

  /** Stat values with base, kin, and spec modifiers */
  stats!: Record<StatKey, { base: number; kin: number; spec: number }>;
  skills!: SkillData[];

  override prepareBaseData(): void {
    this.skills = ensureCharacterSkills(this.skills);
  }

  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Six stats: each has base, kin, spec modifiers that sum to total bonus
      // value = base + kin + spec (signed integer, -50 to +100)
      stats: new SchemaField({
        brn: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          kin: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        swi: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          kin: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        for: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          kin: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        wit: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          kin: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        wsd: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          kin: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
        bea: new SchemaField({
          base: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          kin: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
          spec: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        }),
      }),

      // Hit Points
      hp: new SchemaField({
        value: new NumberField({ integer: true, min: 0, initial: 0 }),
        max: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Magic Points
      mp: new SchemaField({
        value: new NumberField({ integer: true, min: 0, initial: 0 }),
        max: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Drive Points
      drivePoints: new SchemaField({
        value: new NumberField({ integer: true, min: 0, initial: 0 }),
        max: new NumberField({ integer: true, min: 0, initial: 5 }),
      }),

      // Defense
      defense: new NumberField({ integer: true, initial: 0 }),

      // Encumbrance level (qualitative)
      encumbrance: new StringField({
        initial: 'Unencumbered',
        choices: ['Unencumbered', 'LightlyEncumbered', 'Encumbered', 'HeavilyEncumbered', 'OverEncumbered'] as const,
      }),

      // Wealth level (0-5)
      wealth: new NumberField({ integer: true, min: 0, max: 5, initial: 0 }),

      // Passions: Nature, Allegiance, Motivation (Req 1.7)
      passions: new SchemaField({
        nature: new StringField({ initial: '' }),
        allegiance: new StringField({ initial: '' }),
        motivation: new StringField({ initial: '' }),
      }),

      // Heroic Path (Req 1.9)
      heroicPath: new StringField({ initial: '' }),

      // Experience and Development Points (Req 1.10)
      experience: new SchemaField({
        total: new NumberField({ integer: true, min: 0, initial: 0 }),
        dp: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Character Level
      level: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Development Points Per Level (array tracking DP earned at each level)
      developmentPointsPerLevel: new ArrayField(
        new NumberField({ integer: true, min: 0, initial: 0 }),
        { initial: [] },
      ),

      // Skills array (Req 1.11, 1.12)
      skills: new ArrayField(
        new SchemaField({
          name: new StringField({ required: true, initial: '' }),
          category: new StringField({ required: true, initial: '' }),
          rank: new NumberField({ integer: true, min: 0, max: 30, initial: 0 }),
          statKey: new StringField({ required: true, initial: '' }),
          vocation: new NumberField({ integer: true, initial: 0 }),
          kin: new NumberField({ integer: true, initial: 0 }),
          spec: new NumberField({ integer: true, initial: 0 }),
          item: new NumberField({ integer: true, initial: 0 }),
        }),
        { initial: createDefaultSkills() },
      ),

      // Special Abilities (free-form text entries shown on the Overview tab)
      specialAbilities: new ArrayField(
        new StringField({ initial: '' }),
        { initial: [] },
      ),

      // Known Languages (free-form text entries shown on the Overview tab)
      knownLanguages: new ArrayField(
        new StringField({ initial: '' }),
        { initial: [] },
      ),

      // Biography (Req 8.9)
      biography: new HTMLField({ initial: '' }),

      // Appearance (Req 8.9)
      appearance: new HTMLField({ initial: '' }),

      // Background notes (Req 8.9)
      backgroundNotes: new HTMLField({ initial: '' }),
    };
  }

  /**
   * Compute derived data for the character.
   *
   * Populates `skillTotals` map with totalBonus for each skill:
   *   totalBonus = statValue + computeRankBonus(rank) + vocation + kin + spec + item
   *
   * Requirements: 1.12, 1.13
   */
  override prepareDerivedData(): void {
    this.skillTotals = new Map();

    // Guard: stats or skills may be undefined during intermediate data preparation
    // (e.g., when an Item drop triggers Actor.reset before schema hydration completes).
    if (!this.stats) return;

    const skills = this.skills;
    if (!skills) return;

    for (const skill of skills) {
      // If statKey is empty, the skill has no stat component (e.g., "Armor")
      if (!skill.statKey || skill.statKey.trim() === '') {
        const rankBonus = computeRankBonus(asFiniteNumber(skill.rank));
        const totalBonus = rankBonus + asFiniteNumber(skill.vocation) + asFiniteNumber(skill.kin) + asFiniteNumber(skill.spec) + asFiniteNumber(skill.item);
        this.skillTotals.set(skill.name, totalBonus);
        continue;
      }

      const stat = this.stats[skill.statKey as StatKey];
      if (!stat) {
        this.skillTotals.set(skill.name, 0);
        continue;
      }
      const statValue = asFiniteNumber(stat.base) +
                        asFiniteNumber(stat.kin) +
                        asFiniteNumber(stat.spec);
      const rankBonus = computeRankBonus(asFiniteNumber(skill.rank));
      const totalBonus = statValue + rankBonus + asFiniteNumber(skill.vocation) + asFiniteNumber(skill.kin) + asFiniteNumber(skill.spec) + asFiniteNumber(skill.item);
      this.skillTotals.set(skill.name, totalBonus);
    }
  }

  /**
   * Get the total value for a stat (base + kin + spec).
   */
  getStatTotal(statKey: StatKey): number {
    const stat = this.stats?.[statKey];
    if (!stat) return 0;
    return asFiniteNumber(stat.base) + asFiniteNumber(stat.kin) + asFiniteNumber(stat.spec);
  }
}
