/**
 * Open00Actor — Custom Actor document class for the Open 00 system.
 *
 * Delegates derived-data computation to the TypeDataModel on `this.system`,
 * ensuring each actor sub-type (character, npc) owns its own derivation logic.
 *
 * Implements identity seeding: when a Kin/Culture/Vocation Item is added to
 * a character (via any path: drag-drop, programmatic, compendium import,
 * duplication), seeds wealth and cultural skill ranks — guarded by a `seeded`
 * flag so it only runs once.
 */

import { SKILL_ID_LIST, DEFAULT_SKILL_DEFINITIONS, type SkillId } from '../data/skills.js';

/** Item types that trigger identity seeding when added to a character. */
const IDENTITY_ITEM_TYPES = new Set(['kin', 'culture', 'vocation']);

export class Open00Actor extends Actor {
  override prepareDerivedData(): void {
    super.prepareDerivedData();

    // Delegate to the TypeDataModel's prepareDerivedData (if defined).
    if (
      this.system &&
      typeof (this.system as any).prepareDerivedData === 'function'
    ) {
      (this.system as any).prepareDerivedData();
    }
  }

  /**
   * Called when embedded documents are created on this actor (any creation path).
   *
   * Seeds wealth and cultural skill ranks when identity items (Kin, Culture,
   * Vocation) are added to a character — but only if the character hasn't
   * been seeded yet (`system.seeded === false`).
   */
  override _onCreateDescendantDocuments(
    parent: any,
    collection: string,
    documents: Item[],
    data: Record<string, unknown>[],
    options: Record<string, unknown>,
    userId: string,
  ): void {
    super._onCreateDescendantDocuments(parent, collection, documents, data, options, userId);

    // Only seed characters, not NPCs
    if (this.type !== 'character') return;

    // Already seeded — never re-derive
    if ((this.system as any).seeded) return;

    // Check if any of the created items are identity items
    const hasIdentityItem = documents.some(
      (doc) => IDENTITY_ITEM_TYPES.has(doc.type),
    );
    if (!hasIdentityItem) return;

    // Run seeding asynchronously (update is async but lifecycle hook is sync)
    this._seedIdentity(documents).catch((err) => {
      console.error(`Open00Actor | Identity seeding failed for ${this.name}:`, err);
    });
  }

  /**
   * Seed wealth and cultural skill ranks from owned identity items.
   *
   * Wealth = Kin startingWealth + Culture startingWealth, clamped [0, 4].
   * Cultural skill ranks = Culture's skillRankAllocations (21 total ranks
   * distributed into skills.*.rank).
   *
   * Guarded by the `seeded` flag — once set, this never runs again.
   */
  private async _seedIdentity(createdItems: Item[]): Promise<void> {
    // Gather all identity items (both newly created and already owned)
    const allItems = [...this.items];
    for (const item of createdItems) {
      if (!allItems.some((existing) => existing.id === item.id)) {
        allItems.push(item);
      }
    }

    const kinItem = allItems.find((i) => i.type === 'kin');
    const cultureItem = allItems.find((i) => i.type === 'culture');

    // We need at least a Kin OR Culture to seed meaningfully
    if (!kinItem && !cultureItem) return;

    const updateData: Record<string, unknown> = {};

    // --- Seed wealth: Kin WL + Culture WL, clamped [0, 4] ---
    const kinWealth = kinItem ? ((kinItem.system as any).startingWealth ?? 0) : 0;
    const cultureWealth = cultureItem ? ((cultureItem.system as any).startingWealth ?? 0) : 0;
    const totalWealth = Math.max(0, Math.min(4, kinWealth + cultureWealth));
    updateData['system.wealth'] = totalWealth;

    // --- Seed cultural skill ranks from Culture's skillRankAllocations ---
    if (cultureItem) {
      const allocations = (cultureItem.system as any).skillRankAllocations;
      if (Array.isArray(allocations)) {
        // Build a name→id map for matching allocation skillNames to canonical ids
        const nameToId = new Map<string, SkillId>(
          SKILL_ID_LIST.map((id) => [DEFAULT_SKILL_DEFINITIONS[id].name.toLowerCase(), id]),
        );

        for (const alloc of allocations) {
          if (!alloc || typeof alloc !== 'object') continue;
          const skillName = alloc.skillName;
          const ranks = alloc.ranks;
          if (typeof skillName !== 'string' || typeof ranks !== 'number' || ranks <= 0) continue;

          const id = nameToId.get(skillName.toLowerCase());
          if (!id) continue;

          // Seed into skills.<id>.rank — additive to any existing rank
          const currentRank = ((this.system as any).skills?.[id]?.rank) ?? 0;
          updateData[`system.skills.${id}.rank`] = currentRank + ranks;
        }
      }
    }

    // Mark as seeded so this never runs again
    updateData['system.seeded'] = true;

    await this.update(updateData);
  }
}
