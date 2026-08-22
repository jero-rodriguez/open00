/**
 * WeaponDataModel — TypeDataModel for the Open 00 Weapon Item type.
 *
 * Defines the persisted schema for weapon data matching the Open 00 Weapons Table [2.40].
 * Open 00 uses a table-driven combat system where damage comes from Attack Table results,
 * not flat damage values. Weapons are defined by their skill, length, critical types,
 * clumsy range, max result cap, and special qualities.
 *
 * Reference: Chapter 14 — Equipment and Wealth, Weapons (pp. 176–180)
 */

const { NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

export class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Hands required: "1H" or "2H"
      // 1H can be used with a shield; 2H limits Parry to half CMB
      hands: new StringField({
        choices: ['1H', '2H'],
        initial: '1H',
      }),

      // Skill(s) Used: primary skill used to determine the weapon's CMB.
      skillUsed: new StringField({ initial: '' }),

      // Secondary skill (optional) with penalty — e.g., Battle Axe can use "Blades -20"
      // Empty string means no secondary skill
      secondarySkill: new StringField({ initial: '' }),

      // Penalty applied when using the secondary skill (negative value, e.g., -20)
      secondarySkillPenalty: new NumberField({ integer: true, max: 0, initial: 0 }),

      // Clumsy Range: if the Unmodified Attack Roll falls within 01 to this value,
      // the attack automatically misses and the attacker must roll on the Fumble table.
      // Typical values: 1-8 (e.g., longsword = 4, whip = 8, dagger = 1)
      clumsyRange: new NumberField({ integer: true, min: 1, max: 10, initial: 3 }),

      // Weapon length determining strike order in the Melee Phase
      // Longest > Long > Short > Hand
      length: new StringField({
        choices: ['Hand', 'Short', 'Long', 'Longest'],
        initial: 'Short',
      }),

      // Attack Table used to resolve hits
      // Edged, Blunt, Missile, Unarmed, Beast
      attackTable: new StringField({
        choices: ['Edged', 'Blunt', 'Missile', 'Unarmed', 'Beast'],
        initial: 'Edged',
      }),

      // Maximum Result cap on the Attack Table
      // Limits the highest row that can be read (e.g., 110, 120, 130, 140, 150, 175)
      maxResult: new NumberField({ integer: true, min: 80, max: 175, initial: 130 }),

      // Primary Critical Strike type inflicted by this weapon
      primaryCritical: new StringField({
        choices: ['Cut', 'Impact', 'Pierce', 'Grapple', 'Fire', 'Frost', 'Lightning', 'DarkMagic'],
        initial: 'Cut',
      }),

      // Alternate Critical Strike type (optional, attacker can choose freely).
      // Empty string means no alternate critical.
      alternateCritical: new StringField({
        choices: ['', 'Cut', 'Impact', 'Pierce', 'Grapple', 'Fire', 'Frost', 'Lightning', 'DarkMagic'],
        initial: '',
        blank: true,
      }),

      // Base Range in meters for ranged/thrown weapons (0 = melee only)
      // Medium Range = 1-2x Base, Long = 2-3x, Extreme = 3-4x
      baseRange: new NumberField({ integer: true, min: 0, initial: 0 }),

      // Weapon Qualities — boolean flags for each quality
      // Backstab: ignore armor on Surprised/Held targets
      qualityBackstab: new BooleanField({ initial: false }),
      // Hand and a Half: can use 1H with -10 or 2H at full
      qualityHandAndHalf: new BooleanField({ initial: false }),
      // Heavy: requires a Half Action to ready before attacking
      qualityHeavy: new BooleanField({ initial: false }),
      // Load (#): number of rounds to reload (for missile weapons)
      qualityLoadRounds: new NumberField({ integer: true, min: 0, max: 5, initial: 0 }),
      // Martial: +20 bonus to all Martial Moves
      qualityMartial: new BooleanField({ initial: false }),
      // Mighty: +20 CMB when attacking without parrying
      qualityMighty: new BooleanField({ initial: false }),
      // Quick Load: can reload as a Half Action
      qualityQuickLoad: new BooleanField({ initial: false }),
      // Reach: can attack from second line with -20 penalty
      qualityReach: new BooleanField({ initial: false }),
      // Unreliable: fumble inflicts Superficial Critical on wielder
      qualityUnreliable: new BooleanField({ initial: false }),

      // Rules exceptions, drawbacks, and other special handling for this weapon.
      notes: new StringField({ initial: '', blank: true }),

      // Physical description of the weapon and its variants.
      description: new StringField({ initial: '', blank: true }),

      // Item quality modifier (from Superior/Masterwork quality)
      // Adds to CMB: +5 for Superior, +15 for Masterwork
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
