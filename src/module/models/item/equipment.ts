/**
 * EquipmentDataModel — TypeDataModel for the Open 00 Equipment Item type.
 *
 * Defines the persisted schema for general equipment/gear matching Open 00's
 * Equipment Tables [2.33]-[2.37]. Open 00 uses a qualitative encumbrance system
 * and Fare-based wealth rather than numeric weight/cost.
 *
 * Reference: Chapter 14 — Equipment and Wealth (pp. 160–169)
 */

const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class EquipmentDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // HTML description of the equipment and its uses/notes
      description: new HTMLField({ initial: '' }),

      // Quantity of the item carried
      quantity: new NumberField({ integer: true, min: 0, max: 999, initial: 1 }),

      // Fare value for wealth/purchase comparison (0-5)
      // Compared against character's Wealth Level to determine affordability
      // WL > Fare: can afford. WL = Fare: can afford but WL drops by 1. WL < Fare: cannot afford.
      fare: new NumberField({ integer: true, min: 0, max: 5, initial: 0 }),

      // Availability: how widespread and easy to find the item is
      // Common: found almost everywhere. Uncommon: medium+ towns. Rare: large cities only.
      availability: new StringField({
        choices: ['Common', 'Uncommon', 'Rare'],
        initial: 'Common',
      }),

      // Encumbrance category contribution — qualitative indicator
      // Open 00 uses common-sense encumbrance, not numeric weight.
      // "None" = negligible, "Light" = contributes to Lightly Encumbered,
      // "Moderate" = contributes to Encumbered, "Heavy" = contributes to Heavily Encumbered
      encumbranceCategory: new StringField({
        choices: ['None', 'Light', 'Moderate', 'Heavy'],
        initial: 'None',
      }),
    };
  }
}
