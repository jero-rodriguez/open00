/**
 * ArmorDataModel — TypeDataModel for the VsD Armor Item type.
 *
 * Defines the persisted schema for armor data including category,
 * defense penalty, maneuver penalty, and encumbrance.
 *
 * Requirements: 3.2
 */

const { NumberField, StringField } = foundry.data.fields;

export class ArmorDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Armor category — Req 3.2
      // NA: No Armor, LA: Light Armor, MA: Medium Armor, HA: Heavy Armor
      category: new StringField({
        choices: ['NA', 'LA', 'MA', 'HA'],
        initial: 'NA',
      }),

      // Defense penalty applied when armor is equipped — Req 3.2
      // Negative value that reduces defense
      defensePenalty: new NumberField({ integer: true, max: 0, initial: 0 }),

      // Maneuver penalty applied when armor is equipped — Req 3.2
      // Negative value that reduces maneuverability
      maneuverPenalty: new NumberField({ integer: true, max: 0, initial: 0 }),

      // Encumbrance value contributed to the carrier — Req 3.2
      encumbrance: new NumberField({ integer: true, min: 0, initial: 0 }),
    };
  }
}