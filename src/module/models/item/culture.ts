/**
 * CultureDataModel — TypeDataModel for the Open 00 Culture Item type.
 *
 * Defines the persisted schema for Culture data matching Chapter 4 and Table [1.4].
 * Cultures grant cultural skill ranks, outfitting options, optional spell lore ranks,
 * starting wealth, and narrative guidance for passions and worldview.
 *
 * Reference: Chapter 4 — Cultures (pp. 44–60)
 */

const { NumberField, StringField, HTMLField, SchemaField, ArrayField } = foundry.data.fields;

export class CultureDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Cultural Skill Ranks granted during character creation
      // These ranks don't count toward the max developable ranks.
      // Total of 21 ranks distributed per rules (Table [1.4])
      skillRankAllocations: new ArrayField(new SchemaField({
        skillName: new StringField({ initial: '' }),
        ranks: new NumberField({ integer: true, min: 0, max: 5, initial: 0 }),
      })),

      // Spell Lore ranks granted by this Culture (optional — only Fey and Noble cultures)
      // Players distribute these among the listed spell lores as they wish.
      // Contains the total ranks available and which lores they can be assigned to.
      spellLoreRanks: new NumberField({ integer: true, min: 0, max: 3, initial: 0 }),

      // Available Spell Lores to distribute the above ranks among
      availableSpellLores: new ArrayField(new StringField({ initial: '' })),

      // Outfitting options — sets of starting equipment choices
      // Each group is a pick-one set (player chooses one from each group)
      outfitting: new ArrayField(new SchemaField({
        // Group label (e.g., "Clothing", "Weapons", "Gear")
        group: new StringField({ initial: '' }),
        // Options within this group (player picks one)
        options: new ArrayField(new StringField({ initial: '' })),
      })),

      // Starting Wealth Level contribution from Culture (added to Kin's WL)
      // Ranges from 0 (Arctic, Hill, Woad) to 2 (Fey, Noble)
      startingWealth: new NumberField({ integer: true, min: 0, max: 5, initial: 1 }),

      // Narrative guidance: passions and worldview suggestions
      // Helps players write their character's Passions informed by their culture
      passionsGuidance: new HTMLField({ initial: '' }),

      // Cultural description — worldview, beliefs, typical behavior
      description: new HTMLField({ initial: '' }),
    };
  }
}
