/**
 * CharacterDataModel — TypeDataModel for the VsD Player Character Actor type.
 *
 * Defines the persisted schema for stats, vitals (HP/MP/Drive Points),
 * defense, encumbrance level, and wealth.
 */

const { SchemaField, NumberField, StringField } = foundry.data.fields;

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
    };
  }
}
