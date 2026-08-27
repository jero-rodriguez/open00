/**
 * VocationDataModel — TypeDataModel for the Open 00 Vocation Item type.
 *
 * Defines the persisted schema for Vocation data matching Chapter 5 and Table [1.7].
 * Vocations define Development Points per skill category, fixed Vocational Bonuses
 * to specific skills, Combat Skill Choice bonuses, MP per Level, and Vocational Spell Lores.
 *
 * Reference: Chapter 5 — Vocations (pp. 62–69)
 */

const { NumberField, StringField, SchemaField, ArrayField } = foundry.data.fields;

export class VocationDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Development Points (DP) available per skill category each Level
      // Characters spend DP to buy Skill Ranks (1:1 basis, max 2 ranks per skill per level).
      // DP can be transferred between categories on a 2:1 basis.
      developmentPoints: new SchemaField({
        armor: new NumberField({ integer: true, min: 0, initial: 0 }),
        combat: new NumberField({ integer: true, min: 0, initial: 0 }),
        adventuring: new NumberField({ integer: true, min: 0, initial: 0 }),
        roguery: new NumberField({ integer: true, min: 0, initial: 0 }),
        lore: new NumberField({ integer: true, min: 0, initial: 0 }),
        spells: new NumberField({ integer: true, min: 0, initial: 0 }),
        body: new NumberField({ integer: true, min: 0, initial: 0 }),
      }),

      // Fixed Vocational Bonuses applied to specific skills during character creation
      // These represent focused training and never change during the game.
      // e.g., Warrior: Athletics +10, Ride +10, Body +15
      vocationalBonuses: new ArrayField(new SchemaField({
        // The skill receiving the fixed bonus (e.g., "Athletics", "Arcana", "Stealth")
        skillName: new StringField({ initial: '' }),
        // The fixed bonus value (typically +5, +10, +15, or +20)
        bonus: new NumberField({ integer: true, initial: 0 }),
      })),

      // Combat Skill Choice bonuses — player chooses which Combat skills receive these
      // Warriors get 5 choices (+20 each), Rogues get 3 (+10, +5, +5), etc.
      // Each entry is a bonus value the player assigns to a Combat skill of their choice.
      combatSkillChoices: new ArrayField(
        new NumberField({ integer: true, initial: 0 }),
      ),

      // Magic Points gained per character Level (including first Level)
      // Added to Stat MP gain to determine total MP per level.
      // e.g., Wizard 3, Animist 2, Champion 1, Warrior 0
      magicPointsPerLevel: new NumberField({ integer: true, min: 0, initial: 0 }),

      magicStat: new StringField({
        choices: ['wit', 'wsd', 'bea'],
        initial: 'bea',
      }),

      // Vocational Spell Lores — spells from these lores can be cast without restrictions
      // Characters can learn and cast from these up to their Level's Weave.
      // e.g., Wizard: Eldritch Fire, Mind Control, Illusions, etc.
      vocationalSpellLores: new ArrayField(new StringField({ initial: '' })),
    };
  }
}
