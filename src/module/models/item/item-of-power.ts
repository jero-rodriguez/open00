/**
 * ItemOfPowerDataModel — TypeDataModel for the Open 00 Item of Power Item type.
 *
 * Defines the persisted schema for Items of Power — legendary artifacts with
 * their own will, Purpose, and Affinity-gated powers.
 *
 * Reference: Chapter 20 — Rewards, Items of Power (pp. 270–271)
 */

const { NumberField, StringField, HTMLField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

export class ItemOfPowerDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // HTML description of the item's history, appearance, and lore
      description: new HTMLField({ initial: '' }),

      // Purpose — the item's driving Passion/goal (similar to a character's Motivation)
      // e.g., "Reunite the Elvenkind under a single banner"
      // The item will cooperate with wielders who follow its Purpose and resist those who don't.
      purpose: new StringField({ initial: '' }),

      // Affinity Score (1-10) — measure of the item's disposition toward its wielder
      // Starts at 1 when first picked up. Increases when wielder acts per Purpose.
      // Decreases when wielder acts against Purpose. Below 0 = item stops working.
      affinityScore: new NumberField({ integer: true, min: 0, max: 10, initial: 1 }),

      // Whether the character has Attuned to the item (requires ~1 hour + Arcana Roll)
      attunementStatus: new BooleanField({ initial: false }),

      // Text describing attunement requirements or restrictions
      attunementRequirements: new StringField({ initial: '' }),

      // Powers unlocked at specific Affinity thresholds
      // Each power has a required affinity level and description of its effect
      powers: new ArrayField(new SchemaField({
        // Minimum Affinity Score required to access this power
        affinityThreshold: new NumberField({ integer: true, min: 1, max: 10, initial: 1 }),
        // Description of the power granted at this threshold
        description: new HTMLField({ initial: '' }),
        // Mechanical bonus type (optional, for automated calculations)
        bonusType: new StringField({ initial: '' }),
        // Mechanical bonus value (optional)
        bonusValue: new NumberField({ integer: true, initial: 0 }),
      })),

      // Whether this item is Tainted.
      // Gaining Affinity with a Tainted item causes Taint to the wielder
      isTainted: new BooleanField({ initial: false }),

      // Whether this item is Cursed
      isCursed: new BooleanField({ initial: false }),

      // Description of the curse and how to break it (if cursed)
      curseDescription: new StringField({ initial: '' }),
    };
  }
}
