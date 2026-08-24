/**
 * SpellDataModel — TypeDataModel for the Open 00 Spell Item type.
 *
 * A standalone Spell represents a single magical effect that belongs to a
 * Spell Lore. Spells can be created independently (e.g. in compendiums) and
 * then drag-and-dropped onto a SpellLore item, which copies the spell data
 * into the lore's embedded spells array.
 *
 * The schema mirrors the embedded spell entries in SpellLoreDataModel so that
 * copy-on-drop is a straightforward field-to-field mapping.
 *
 * Reference: Book Four — Magic and Spells, Book Five — Grimoire
 */

const { NumberField, StringField, HTMLField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

export class SpellDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Weave level (1–10). Determines MP cost and when the spell becomes available.
      weave: new NumberField({ integer: true, min: 1, max: 10, initial: 1 }),

      range: new StringField({ initial: '' }),
      duration: new StringField({ initial: '' }),
      areaOfEffect: new StringField({ initial: '' }),
      description: new HTMLField({ initial: '' }),

      // Whether the target gets a Save Roll to resist
      grantsSaveRoll: new BooleanField({ initial: false }),

      // Instantaneous spells cannot be maintained and take effect immediately
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
    };
  }
}
