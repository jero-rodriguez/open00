/**
 * ArmorDataModel — TypeDataModel for the VsD Armor Item type.
 *
 * Defines the persisted schema for armor data matching the VsD Armors & Shields Table [2.38].
 * VsD armor is detailed with zone protection, multiple penalty types, DEF bonuses,
 * and special qualities (Metal, Rigid).
 *
 * Reference: Chapter 14 — Equipment and Wealth, Armors (pp. 170–175)
 */

const { NumberField, StringField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

export class ArmorDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Armor Type determines which column on the Attack Table is used
      // NA: No Armor, LA: Light Armor, MA: Medium Armor, HA: Heavy Armor
      // "Shield" type is for shields specifically
      armorType: new StringField({
        choices: ['NA', 'LA', 'MA', 'HA', 'Shield'],
        initial: 'NA',
      }),

      // Zones Protected — which body parts this armor covers
      // Used to determine Critical Strike results ("if wearing armor" checks)
      zonesProtected: new ArrayField(new StringField({
        choices: ['Head', 'Face', 'Neck', 'Torso', 'Arms', 'Forearms', 'Hands', 'Legs', 'LowerLegs', 'ShieldArm'],
        initial: 'Torso',
      })),

      // Qualities
      // Metal: use "metal armor" results for Critical Strikes
      qualityMetal: new BooleanField({ initial: false }),
      // Rigid: use "rigid armor" results for Critical Strikes
      qualityRigid: new BooleanField({ initial: false }),

      // Maximum Swiftness bonus applicable to Defense when wearing this armor
      // A value of null/0 means no cap; typical values: +15 to +30
      maxSwiToDefense: new NumberField({ integer: true, min: 0, max: 50, initial: 30 }),

      // Move Actions Penalty — applied to Spell Casting, Athletics, Acrobatics, Ride, Stealth
      // This penalty CAN be offset by the Armor Skill Bonus (to a minimum of 0)
      // Negative value (e.g., -45 for chain mail)
      moveActionsPenalty: new NumberField({ integer: true, max: 0, initial: 0 }),

      // Combat (CMB) Penalty — applied to Attack Bonus
      // This penalty CANNOT be offset by Armor Skill
      // Negative value (e.g., -5 for some armors)
      cmbPenalty: new NumberField({ integer: true, max: 0, initial: 0 }),

      // Perception Penalty — applied to Perception Skill
      // This penalty CANNOT be offset
      // Negative value (e.g., -5 for full helm)
      perceptionPenalty: new NumberField({ integer: true, max: 0, initial: 0 }),

      // Melee Defense Bonus — straight bonus to DEF against melee attacks
      // Positive value (e.g., +25 for full shield)
      meleeDefenseBonus: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Missile Defense Bonus — straight bonus to DEF against ranged attacks
      // Positive value (e.g., +50 for wall shield)
      missileDefenseBonus: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Item quality modifier (from Superior/Masterwork quality)
      // Applies to DEF or reduces penalties
      itemModifier: new NumberField({ integer: true, initial: 0 }),

      // Fare value for wealth/purchase comparison (0-5)
      fare: new NumberField({ integer: true, min: 0, max: 5, initial: 1 }),

      // Availability: how easy to find on the market
      availability: new StringField({
        choices: ['Common', 'Uncommon', 'Rare'],
        initial: 'Common',
      }),
    };
  }
}
