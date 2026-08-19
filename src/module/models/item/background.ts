/**
 * BackgroundDataModel — TypeDataModel for the Open 00 Background Item type.
 *
 * Defines the persisted schema for Background Options matching Chapter 7.
 * Each background has a Minor tier (typically 1 BP) and Major tier (typically 3 BPs),
 * with narrative requirements and mechanical effects.
 *
 * Reference: Chapter 7 — Backgrounds (pp. 86–97)
 */

const { NumberField, StringField, HTMLField, ArrayField, SchemaField } = foundry.data.fields;

export class BackgroundDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Background narrative description — explains context and theme
      description: new HTMLField({ initial: '' }),

      // Minor Tier option
      minor: new SchemaField({
        // Cost in Background Points (typically 1, Shapechanger = 2)
        cost: new NumberField({ integer: true, min: 1, max: 10, initial: 1 }),

        // Narrative requirement for choosing this option
        // e.g., "Write your Allegiance about your ties to your old master"
        requirement: new HTMLField({ initial: '' }),

        // Description of the mechanical effects granted
        effects: new HTMLField({ initial: '' }),
      }),

      // Major Tier option (includes Minor benefits unless stated otherwise)
      major: new SchemaField({
        // Cost in Background Points (typically 3, Shapechanger = 4, Exceptional Training = 2)
        cost: new NumberField({ integer: true, min: 1, max: 10, initial: 3 }),

        // Additional narrative requirement for the Major tier (if any)
        requirement: new HTMLField({ initial: '' }),

        // Description of the additional mechanical effects granted (on top of Minor)
        effects: new HTMLField({ initial: '' }),
      }),
    };
  }
}
