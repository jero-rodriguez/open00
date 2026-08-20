/**
 * NpcDataModel — TypeDataModel for the VsD NPC/Monster Actor type.
 *
 * Defines the persisted schema matching the official Against the Darkmaster
 * creature stat block format: level, rank, hit points, defenses, saves,
 * movement, creature type, attacks, skill bonuses, and special abilities.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7
 */

const { SchemaField, NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

export class NpcDataModel extends foundry.abstract.TypeDataModel {
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Level (1–50, default 1) — Req 2.1
      level: new NumberField({ integer: true, min: 1, max: 50, initial: 1 }),

      // Creature rank descriptor — Req 2.1
      rank: new StringField({
        choices: ['Normal', 'Elite', 'Champion', 'Lord'] as const,
        initial: 'Normal',
      }),

      // Hit Points (flat integer, minimum 1) — Req 2.1
      hp: new NumberField({ integer: true, min: 1, initial: 1 }),

      // Armor type code — Req 2.1
      armorType: new StringField({
        choices: ['NA', 'LA', 'MA', 'HA'] as const,
        initial: 'NA',
      }),

      // Shield flag — Req 2.1
      hasShield: new BooleanField({ initial: false }),

      // Defense bonus — Req 2.1
      defense: new NumberField({ integer: true, initial: 0 }),

      // Toughness Save Roll bonus — Req 2.5
      tsr: new NumberField({ integer: true, initial: 0 }),

      // Willpower Save Roll bonus — Req 2.5
      wsr: new NumberField({ integer: true, initial: 0 }),

      // Movement rates (multi-mode string, e.g. "50F/10L") — Req 2.1
      moveRates: new StringField({ initial: '30L' }),

      // Creature type code (2-char: critical reduction tier + category) — Req 2.7
      creatureType: new StringField({ max: 2, initial: 'NH' }),

      // Attacks (max 10 entries) — Req 2.2
      attacks: new ArrayField(
        new SchemaField({
          name: new StringField({ max: 80, initial: '' }),
          bonus: new NumberField({ integer: true, initial: 0 }),
          size: new StringField({
            choices: ['Small', 'Medium', 'Large', 'Huge'] as const,
            initial: 'Medium',
          }),
          attackType: new StringField({ max: 40, initial: '' }),
          tableId: new StringField({ initial: '' }),
          criticalTableId: new StringField({ initial: '' }),
          multiAttack: new NumberField({ integer: true, min: 1, max: 5, initial: 1 }),
        }),
        { max: 10 },
      ),

      // Skill bonuses (max 30 entries) — Req 2.3
      skillBonuses: new ArrayField(
        new SchemaField({
          name: new StringField({ max: 80, initial: '' }),
          bonus: new NumberField({ integer: true, initial: 0 }),
          category: new StringField({
            choices: ['Rog', 'Adv', 'Lor', ''] as const,
            initial: '',
          }),
        }),
        { max: 30 },
      ),

      // Special abilities (max 20 entries) — Req 2.4
      specialAbilities: new ArrayField(
        new SchemaField({
          name: new StringField({ max: 80, initial: '' }),
          description: new StringField({ max: 500, initial: '' }),
        }),
        { max: 20 },
      ),
    };
  }
}
