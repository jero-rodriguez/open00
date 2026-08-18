/**
 * WeaponDataModel — TypeDataModel for the VsD Weapon Item type.
 *
 * Defines the persisted schema for weapon data including attack bonus,
 * attack table reference, damage, weapon group, reach, encumbrance, and fumble range.
 *
 * Requirements: 3.1
 */

const { NumberField, StringField } = foundry.data.fields;

export class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Attack bonus applied to the roll — Req 3.1
      attackBonus: new NumberField({ integer: true, initial: 0 }),

      // Attack table reference identifier — Req 3.1
      attackTable: new StringField({ initial: '' }),

      // Base damage value — Req 3.1
      damage: new NumberField({ integer: true, initial: 0 }),

      // Weapon group classification (e.g., Sword, Axe, Bow) — Req 3.1
      weaponGroup: new StringField({ initial: '' }),

      // Reach descriptor (e.g., "5 ft", "10 ft", "Reach") — Req 3.1
      reach: new StringField({ initial: '' }),

      // Encumbrance value contributed to the carrier — Req 3.1
      encumbrance: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Fumble range threshold — Req 3.1
      // On a d100 roll at or below this value, a fumble occurs
      fumbleRange: new NumberField({ integer: true, min: 1, max: 5, initial: 1 }),
    };
  }
}