/**
 * CharacterDataModel — TypeDataModel for the VsD Player Character Actor type.
 *
 * Defines the persisted schema for stats, vitals (HP/MP/Drive Points),
 * defense, encumbrance level, and wealth.
 */

import { computeRankBonus } from '../../engine/rank-bonus.js';

const { SchemaField, NumberField, StringField, ArrayField } = foundry.data.fields;

/** Stat key identifiers matching the schema */
type StatKey = 'brn' | 'swi' | 'for' | 'wit' | 'wsd' | 'bea';

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  /** Derived skill totals computed in prepareDerivedData(). Keyed by skill name. */
  skillTotals: Map<string, number> = new Map();

  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Six stats: value IS the bonus (signed integer, -50 to +100)
      stats: new SchemaField({
        brn: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        swi: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        for: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        wit: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        wsd: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
        bea: new NumberField({ integer: true, min: -50, max: 100, initial: 0 }),
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

      // Skills array (Req 1.11, 1.12)
      skills: new ArrayField(
        new SchemaField({
          name: new StringField({ required: true, initial: '' }),
          category: new StringField({ required: true, initial: '' }),
          rank: new NumberField({ integer: true, min: 0, max: 30, initial: 0 }),
          statKey: new StringField({ required: true, initial: '' }),
          itemModifiers: new NumberField({ integer: true, initial: 0 }),
        }),
      ),
    };
  }

  /**
   * Compute derived data for the character.
   *
   * Populates `skillTotals` map with totalBonus for each skill:
   *   totalBonus = statValue + computeRankBonus(rank) + itemModifiers
   *
   * Requirements: 1.12, 1.13
   */
  override prepareDerivedData(): void {
    this.skillTotals = new Map();

    const stats = (this as unknown as { stats: Record<StatKey, number> }).stats;
    const skills = (this as unknown as { skills: Array<{ name: string; statKey: string; rank: number; itemModifiers: number }> }).skills;

    for (const skill of skills) {
      const statValue = stats[skill.statKey as StatKey] ?? 0;
      const rankBonus = computeRankBonus(skill.rank);
      const totalBonus = statValue + rankBonus + skill.itemModifiers;
      this.skillTotals.set(skill.name, totalBonus);
    }
  }
}
