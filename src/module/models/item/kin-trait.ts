/**
 * KinTraitDataModel — TypeDataModel for the Open 00 Kin Trait Item type.
 *
 * Represents an individual Special Trait granted by a character's Kin.
 * These are dragged onto characters as separate items so their effects
 * can be tracked and automated individually.
 *
 * Examples: Dark Sight, Forgekin, Immortal, Keen Senses, Nimble, etc.
 *
 * Reference: Chapter 3 — Kins, Special Traits sections (pp. 18–42)
 */

const { NumberField, StringField, HTMLField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

export class KinTraitDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Full description of the trait's effects (narrative + mechanical)
      description: new HTMLField({ initial: '' }),

      // Skill bonuses granted by this trait
      // e.g., Keen Senses: Perception +10; Nimble: Stealth +20, Acrobatic +20
      skillBonuses: new ArrayField(new SchemaField({
        skillName: new StringField({ initial: '' }),
        bonus: new NumberField({ integer: true, initial: 0 }),
      })),

      // Save Roll bonuses granted by this trait
      // e.g., Forgekin: +30 to SR against heat and cold attacks
      saveRollBonuses: new ArrayField(new SchemaField({
        // What the bonus applies against (e.g., "heat and cold attacks", "sickness and disease")
        against: new StringField({ initial: '' }),
        bonus: new NumberField({ integer: true, initial: 0 }),
      })),

      // Defense bonuses granted by this trait
      // e.g., Forgekin: +30 to Defense against heat and cold attacks
      defenseBonuses: new ArrayField(new SchemaField({
        against: new StringField({ initial: '' }),
        bonus: new NumberField({ integer: true, initial: 0 }),
      })),

      // Whether this trait grants a vision mode
      grantsVision: new BooleanField({ initial: false }),
      // Vision type granted (if any)
      visionType: new StringField({
        choices: ['', 'DarkSight', 'NightSight', 'StarSight'],
        initial: '',
        blank: true,
      }),

      // Whether this trait imposes a restriction (e.g., Superstitious, Sun Sensitivity)
      isRestriction: new BooleanField({ initial: false }),

      // Description of restrictions or drawbacks (if any)
      restrictionDescription: new StringField({ initial: '' }),

      // Kin Spell Lores granted by this trait (e.g., Lore of the Ages grants Elven Lore + Spell Songs)
      grantsSpellLores: new ArrayField(new StringField({ initial: '' })),

      // Free ranks in Spell Lores granted (e.g., Lore of the Ages: 2 ranks to distribute)
      grantedSpellLoreRanks: new NumberField({ integer: true, min: 0, initial: 0 }),
    };
  }
}
