/**
 * CharacterDataModel — TypeDataModel for the VsD Player Character Actor type.
 *
 * Defines the persisted schema for stats, vitals (HP/MP/Drive Points),
 * defense, encumbrance level, and wealth.
 */

const { SchemaField, NumberField, StringField, ArrayField } = foundry.data.fields;

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
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
}
