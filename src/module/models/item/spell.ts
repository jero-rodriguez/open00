/**
 * SpellDataModel — TypeDataModel for the Open 00 Spell Item type.
 *
 * Defines the persisted schema for spell data matching the Grimoire format.
 * Each Spell belongs to a Spell Lore and is organized by Weave (1-10).
 * MP cost equals the Weave number. Damage comes from Attack Tables for attack spells.
 *
 * Reference: Book Five — Grimoire, Spell Lore Description (pp. 344–345)
 */

const { NumberField, StringField, HTMLField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

export class SpellDataModel extends foundry.abstract.TypeDataModel {
  declare weaveNumber: number;

  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Weave number (1-10) — determines spell power tier and MP cost
      // Characters cannot cast spells with a Weave higher than their Level
      weaveNumber: new NumberField({ integer: true, min: 1, max: 10, initial: 1 }),

      // Spell Lore this spell belongs to (e.g., "Eldritch Fire", "Healing", "Mind Control")
      spellLore: new StringField({ initial: '' }),

      // Stat that governs this Spell Lore's Skill Bonus
      // e.g., WIT for Eldritch Fire, WSD for Healing, BEA for Mind Control
      statKey: new StringField({
        choices: ['brn', 'swi', 'for', 'wit', 'wsd', 'bea'],
        initial: 'wit',
      }),

      // Full HTML description of the spell's effects
      description: new HTMLField({ initial: '' }),

      // Range descriptor (e.g., "0 (self)", "0 (touch)", "30 m", "15 m")
      range: new StringField({ initial: '' }),

      // Duration descriptor (e.g., "-", "C" for Concentration, "1 min/lvl", "P" for Permanent)
      duration: new StringField({ initial: '' }),

      // Area of Effect descriptor (e.g., "1 target", "caster", "3 m radius", "6 m cone")
      areaOfEffect: new StringField({ initial: '' }),

      // Whether the spell grants a Save Roll to resist its effects (Y/N)
      grantsSaveRoll: new BooleanField({ initial: false }),

      // Whether the spell is Instantaneous (marked with * in the rules)
      // Instantaneous spells: Half Action to cast, no Concentration benefit, no -10 Improvise penalty
      isInstantaneous: new BooleanField({ initial: false }),

      // Whether this is an Attack Spell (Bolt or Area type)
      // Attack Spells use the Bolt/Area Spells Attack Table instead of the Spell Casting Table
      isAttackSpell: new BooleanField({ initial: false }),

      // Attack spell subtype (only relevant if isAttackSpell is true)
      attackSpellType: new StringField({
        choices: ['', 'Bolt', 'Area'],
        initial: '',
        blank: true,
      }),

      // Warping Options — ways to cast the spell at a higher Weave for enhanced effects
      warpingOptions: new ArrayField(new SchemaField({
        // Additional Weave cost for this warping option (e.g., +2 Weave, +3 Weave)
        weaveCost: new NumberField({ integer: true, min: 1, max: 9, initial: 1 }),
        // Description of the enhanced effect
        description: new StringField({ initial: '' }),
        // Whether this option can be selected multiple times
        repeatable: new BooleanField({ initial: true }),
      })),
    };
  }

  /**
   * Derived property: MP cost equals the weave number.
   * A First Weave spell costs 1 MP, a Tenth Weave costs 10 MP.
   */
  get mpCost(): number {
    return this.weaveNumber;
  }
}
