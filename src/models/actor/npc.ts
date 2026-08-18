/**
 * NpcDataModel — TypeDataModel for the VsD NPC Actor type.
 *
 * Defines the persisted schema for NPC stats including level, HP, defense,
 * initiative, movement rate, and resistances.
 *
 * Requirements: 2.1, 2.2, 2.3
 */

const { SchemaField, NumberField } = foundry.data.fields;

export class NpcDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Level (minimum 1, default 1) — Req 2.1
      level: new NumberField({ integer: true, min: 1, initial: 1 }),

      // Hit Points — Req 2.1
      hp: new SchemaField({
        value: new NumberField({ integer: true, min: 0, initial: 0 }),
        max: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Defense — Req 2.1
      defense: new NumberField({ integer: true, initial: 0 }),

      // Initiative modifier — Req 2.2
      initiativeModifier: new NumberField({ integer: true, initial: 0 }),

      // Movement rate — Req 2.3
      movementRate: new NumberField({ integer: true, min: 0, initial: 30 }),

      // Resistances: Stamina, Will, Magic — Req 2.1
      resistances: new SchemaField({
        stamina: new NumberField({ integer: true, min: 0, initial: 0 }),
        will: new NumberField({ integer: true, min: 0, initial: 0 }),
        magic: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),
    };
  }
}