/**
 * NpcDataModel — TypeDataModel for the VsD NPC/Monster Actor type.
 *
 * Defines the persisted schema matching the official Against the Darkmaster
 * creature stat block format: level, rank, hit points, defenses, saves,
 * movement, creature type, attacks, skill bonuses, and special abilities.
 *
 * All stat block values are GM-entered (PLAYER-OWNED). The lightweight
 * prepareDerivedData() only computes SR Level Bonus from level and exposes
 * convenience HP accessors for Foundry token bar compatibility.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7
 */

import { computeSaveRollBonus } from '../../engine/save-roll-bonus.js';

const { SchemaField, NumberField, StringField, HTMLField, BooleanField, ArrayField } = foundry.data.fields;

export class NpcDataModel extends foundry.abstract.TypeDataModel {
  // -- Derived properties (computed, not persisted) --------------------------

  /** Save Roll Bonus computed from NPC level. */
  saveRollBonus!: number;

  /** HP max — mirrors persisted hp for token bar compatibility. */
  hpMax!: number;

  /** HP value — mirrors persisted hp for token bar compatibility. */
  hpValue!: number;

  // -- Schema fields (type annotations for access) ---------------------------

  level!: number;
  hp!: number;
  defense!: number;
  tsr!: number;
  wsr!: number;
  armorType!: string;
  moveRates!: string;
  creatureType!: string;
  static override defineSchema(): Record<string, foundry.data.fields.DataField> {
    return {
      // Schema version for migration tracking
      schemaVersion: new NumberField({ integer: true, min: 0, initial: 2 }),

      // Level (0–50, default 1) — Req 2.1
      level: new NumberField({ integer: true, min: 0, max: 50, initial: 1 }),

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
            choices: ['CMB', 'Rog', 'Adv', 'Lor', ''] as const,
            initial: '',
          }),
        }),
        { max: 30 },
      ),

      // Special abilities (max 20 entries) — Req 2.4
      specialAbilities: new ArrayField(
        new SchemaField({
          name: new StringField({ max: 80, initial: '' }),
          description: new HTMLField({ initial: '' }),
        }),
        { max: 20 },
      ),
    };
  }

  // ---------------------------------------------------------------------------
  // Derived data computation — lightweight for NPCs
  // ---------------------------------------------------------------------------

  /**
   * Compute derived data for NPCs.
   *
   * NPC stat blocks are GM-entered directly. This only computes:
   * - SR Level Bonus from level (for display/reference)
   * - hpMax / hpValue mirrors of the flat hp field (for Foundry token bars)
   */
  override prepareDerivedData(): void {
    this.saveRollBonus = computeSaveRollBonus(this.level ?? 0);
    this.hpMax = this.hp ?? 0;
    this.hpValue = this.hp ?? 0;
  }

  // ---------------------------------------------------------------------------
  // Data Migration — strips any derived keys that might exist in NPC data.
  // ---------------------------------------------------------------------------

  /**
   * Forward-only migration for NPC documents.
   * NPCs have minimal derived state, but we defensively strip any keys
   * that might have leaked into the persisted data.
   *
   * Idempotent: no-ops if schemaVersion >= 2.
   */
  static override migrateData(source: Record<string, unknown>): Record<string, unknown> {
    if (typeof source.schemaVersion === 'number' && source.schemaVersion >= 2) {
      return super.migrateData(source);
    }

    // Defensive: strip any derived top-level keys that shouldn't be persisted
    delete source.encumbrance;

    // Bump schema version
    source.schemaVersion = 2;

    return super.migrateData(source);
  }
}
