/**
 * SpellLoreDataModel — TypeDataModel for the Open 00 Spell Lore Item type.
 *
 * A Spell Lore is a "school" or "branch" of magic (e.g., Eldritch Fire, Healing,
 * Mind Control). It is developed as a Skill — each rank grants knowledge of one
 * Weave (rank 3 = knows Weaves 1–3).
 *
 * When owned by a character, it represents that character having learned this lore.
 * The character's ranks in their skills array (category "Spells") determine how
 * many spells from this lore they can cast.
 *
 * Access categories:
 * - Common: open to all Vocations, max 5th Weave unless also Vocational/Kin
 * - Vocational: tied to a specific Vocation, no Weave restriction
 * - Kin: tied to a character's Kin, no Weave restriction, 1:1 DP from any category
 *
 * Each lore contains up to 10 spells (one per Weave), embedded directly.
 * Spells do NOT exist as standalone Items — they are always part of a lore.
 *
 * Reference: Book Four — Magic and Spells, Book Five — Grimoire
 */

const { NumberField, StringField, HTMLField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

export class SpellLoreDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      statKey: new StringField({
        choices: ['brn', 'swi', 'for', 'wit', 'wsd', 'bea'],
        initial: 'wit',
      }),

      category: new StringField({
        choices: ['common', 'vocational', 'kin'],
        initial: 'common',
      }),

      description: new HTMLField({ initial: '' }),

      spells: new ArrayField(new SchemaField({
        name: new StringField({ initial: '' }),
        weave: new NumberField({ integer: true, min: 1, max: 10, initial: 1 }),
        range: new StringField({ initial: '' }),
        duration: new StringField({ initial: '' }),
        areaOfEffect: new StringField({ initial: '' }),
        description: new HTMLField({ initial: '' }),

        grantsSaveRoll: new BooleanField({ initial: false }),
        isInstantaneous: new BooleanField({ initial: false }),

        // Attack spells use Bolt/Area Attack Tables instead of the Spell Casting Table
        isAttackSpell: new BooleanField({ initial: false }),
        attackType: new StringField({
          choices: ['', 'bolt', 'area'],
          initial: '',
          blank: true,
        }),

        // Determines the Magical Resonance modifier when doubles are rolled.
        // healing/spirit/light → -20, natural/elven/illusory → -10, attack → +20, dark → +30
        resonanceType: new StringField({
          choices: ['healing', 'spirit', 'light', 'natural', 'elven', 'illusory', 'attack', 'dark', 'other'],
          initial: 'other',
        }),

        // Modifier added to the d100 Spell Failure roll (higher = worse consequences).
        // 0 = safest (healing/divination), 50 = most dangerous (dark/elemental).
        // Values: 0, 10, 20, 30, 50 per the Spell Failures Modifiers table.
        failureSeverity: new NumberField({
          integer: true,
          choices: [0, 10, 20, 30, 50],
          initial: 10,
        }),

        // Warping: cast at a higher Weave for an enhanced effect
        warpingOptions: new ArrayField(new SchemaField({
          weaveCost: new NumberField({ integer: true, min: 1, max: 9, initial: 1 }),
          effect: new StringField({ initial: '' }),
          repeatable: new BooleanField({ initial: true }),
        })),
      })),
    };
  }

  /** Common lores cap at 5th Weave for characters without vocational/kin access. */
  static COMMON_WEAVE_CAP = 5;
}
