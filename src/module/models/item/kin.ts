/**
 * KinDataModel — TypeDataModel for the VsD Kin Item type.
 *
 * Defines the persisted schema for Kin data matching the Kin Modifiers Table [1.2].
 * Each Kin grants stat modifiers, HP/Max HP, MP bonus, Save Roll bonuses (TSR/WSR),
 * Background Points, starting Wealth Level, and Special Traits.
 *
 * Reference: Chapter 3 — Kins (pp. 18–42)
 */

const { NumberField, StringField, SchemaField, ArrayField } = foundry.data.fields;

export class KinDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Stat modifiers applied directly to the character's Stat Values
      // Values typically range from -20 to +20 (e.g., Dwarf BRN +5, SWI -5)
      statModifiers: new SchemaField({
        brn: new NumberField({ integer: true, initial: 0 }),
        swi: new NumberField({ integer: true, initial: 0 }),
        for: new NumberField({ integer: true, initial: 0 }),
        wit: new NumberField({ integer: true, initial: 0 }),
        wsd: new NumberField({ integer: true, initial: 0 }),
        bea: new NumberField({ integer: true, initial: 0 }),
      }),

      // HP: added to the character's total starting Hit Points
      // e.g., Dwarf 40, Halfling 20, Man 30, Stone Troll 60
      hpBonus: new NumberField({ integer: true, initial: 0 }),

      // Max HP: characters can never exceed this HP value for their Kin
      // e.g., Dwarf 150, Halfling 100, Man 120, Stone Troll 250
      maxHp: new NumberField({ integer: true, min: 0, initial: 120 }),

      // MP: one-time Magic Points bonus added at first Level
      // e.g., Dusk Elf +3, Star Elf +5, Silver Elf +4
      mpBonus: new NumberField({ integer: true, min: 0, initial: 0 }),

      // TSR: Toughness Save Roll bonus (resist fatigue, poison, disease, physical effects)
      // e.g., Dwarf +20, Stone Troll +30, Halfling +10
      tsr: new NumberField({ integer: true, initial: 0 }),

      // WSR: Willpower Save Roll bonus (resist fear, mind control, evil magic)
      // e.g., Halfling +35, Dwarf +20
      wsr: new NumberField({ integer: true, initial: 0 }),

      // BPs: number of Background Points available for Background Options
      // e.g., Man 6, Halfling 5, Dusk Elf 3, Star Elf 2
      backgroundPoints: new NumberField({ integer: true, min: 0, initial: 4 }),

      // WL: starting Wealth Level contribution from Kin (added to Culture's WL)
      // e.g., most Elves +1, Man +0, Stone Troll +0
      startingWealth: new NumberField({ integer: true, min: 0, max: 5, initial: 0 }),

      // Special Traits granted by this Kin
      // Each trait has a name and description of its mechanical/narrative effects
      specialTraits: new ArrayField(new SchemaField({
        name: new StringField({ initial: '' }),
        description: new StringField({ initial: '' }),
      })),

      // Suggested Cultures for this Kin (narrative guidance)
      suggestedCultures: new ArrayField(new StringField({ initial: '' })),
    };
  }
}
