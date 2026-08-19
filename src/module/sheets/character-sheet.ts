/**
 * VsdCharacterSheet — ApplicationV2 sheet for the VsD Player Character actor type.
 *
 * Six tabs: Overview, Skills, Combat, Magic, Equipment, Biography.
 * Uses HandlebarsApplicationMixin for template rendering.
 *
 * Requirements: 8.1, 8.8, 8.9, 8.10, 8.11, 16.5, 22.3
 */

import { computeOpenEndedRoll } from '../engine/dice-engine.js';
import { computeRankBonus } from '../engine/rank-bonus.js';
import { resolveAction } from '../engine/action-resolution.js';
import { determineEncumbranceLevel, computeTotalEncumbrance } from '../engine/encumbrance.js';
import { getActiveBonuses } from '../engine/affinity.js';
import { createAutoSaveHandler, attachAutoSaveToForm } from './auto-save.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;


/** Skill data structure for rendering */
interface SkillData {
  name: string;
  category: string;
  rank: number;
  statKey: string;
  itemModifiers: number;
}
/** Stat key to full name mapping */
const STAT_NAMES: Record<string, string> = {
  brn: 'VSD.Stats.Brawn',
  swi: 'VSD.Stats.Swiftness',
  for: 'VSD.Stats.Fortitude',
  wit: 'VSD.Stats.Wits',
  wsd: 'VSD.Stats.Wisdom',
  bea: 'VSD.Stats.Bearing',
};

export class VsdCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static override DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration = {
    classes: ['vsd', 'sheet', 'actor', 'character'],
    position: { width: 720, height: 680 },
    window: { resizable: true },
    actions: {
      rollSkill: VsdCharacterSheet.#rollSkill,
      removeItem: VsdCharacterSheet.#removeItem,
    },
  };

  static override PARTS: Record<string, foundry.applications.api.ApplicationPartDefinition> = {
    overview: {
      template: 'systems/vsd/templates/actors/character-overview.hbs',
    },
    skills: {
      template: 'systems/vsd/templates/actors/character-skills.hbs',
    },
    combat: {
      template: 'systems/vsd/templates/actors/character-combat.hbs',
    },
    magic: {
      template: 'systems/vsd/templates/actors/character-magic.hbs',
    },
    equipment: {
      template: 'systems/vsd/templates/actors/character-equipment.hbs',
    },
    biography: {
      template: 'systems/vsd/templates/actors/character-biography.hbs',
    },
  };

  /** Primary tab group — defaults to overview tab */
  override tabGroups: Record<string, string> = {
    primary: 'overview',
  };

  /** Auto-save handler instance for this sheet */
  #autoSaveHandler: ReturnType<typeof createAutoSaveHandler> | null = null;

  /**
   * Render method to attach auto-save handlers after content is rendered.
   * Requirements: 8.10, 8.12
   */
  async render(force?: boolean, options?: Record<string, unknown>): Promise<unknown> {
    const result = await super.render(force, options);

    // Create auto-save handler for this actor if not already created
    if (!this.#autoSaveHandler) {
      this.#autoSaveHandler = createAutoSaveHandler(this.actor, {
        debounceMs: 500,
        onError: (error: Error) => {
          console.error('Auto-save error in CharacterSheet:', error);
        },
      });
    }

    // Find the form element and attach auto-save handlers to all inputs/textareas
    const form = this.form as HTMLFormElement | null;
    if (form && this.#autoSaveHandler) {
      attachAutoSaveToForm(form, this.#autoSaveHandler);
    }

    return result;
  }

  /**
   * Close method to clean up auto-save handler.
   */
  async close(options?: Record<string, unknown>): Promise<void> {
    if (this.#autoSaveHandler) {
      this.#autoSaveHandler.cleanup();
      this.#autoSaveHandler = null;
    }
    return super.close(options);
  }

  /**
   * Handle changes to form fields with auto-save on blur or Enter key.
   * This ensures stats, skills, biography, appearance, and background notes are saved within 500ms.
   * Requirements: 8.10, 8.12
   */
  async _onChangeForm(
    event: Event,
    formData?: Record<string, unknown>,
  ): Promise<void> {
    // Auto-save is now handled by the event listeners attached in render()
    // This method remains as a fallback for form submission events
  }

  /**
   * Prepare the top-level render context shared by all tabs.
   */
  override async _prepareContext(
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<Record<string, unknown>> {
    const actor = this.actor;
    return {
      actor,
      system: actor.system,
      name: actor.name,
      img: actor.img,
      tabs: this.tabGroups,
      options,
    };
  }

  /**
   * Prepare per-tab (part) context, adding tab-specific data to the shared context.
   */
  override async _preparePartContext(
    partId: string,
    context: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const system = this.actor.system as Record<string, unknown>;

    switch (partId) {
      case 'overview':
        return {
          ...context,
          tab: 'overview',
          stats: system['stats'],
          hp: system['hp'],
          mp: system['mp'],
          drivePoints: system['drivePoints'],
          passions: system['passions'],
          heroicPath: system['heroicPath'],
          defense: system['defense'],
          encumbrance: system['encumbrance'],
          wealth: system['wealth'],
        };
      case 'skills': {
        // Get skills and stats from actor system
        const skills = (system['skills'] as SkillData[]) || [];
        const stats = (system['stats'] as Record<string, number>) || {};

        // Compute skill details with bonuses (Req 8.4)
        const skillDetails = skills.map(skill => {
          const statValue = stats[skill.statKey] || 0;
          const rankBonus = computeRankBonus(skill.rank);
          const statBonus = statValue; // In VsD, stat value IS the bonus
          const totalBonus = statBonus + rankBonus + skill.itemModifiers;
          return {
            name: skill.name,
            category: skill.category,
            rank: skill.rank,
            statKey: skill.statKey,
            rankBonus,
            statBonus,
            totalBonus,
          };
        });

        // Group by category
        const categories = ['Armor', 'Combat', 'Adventuring', 'Roguery', 'Lore', 'Spells', 'Body'];
        const skillsByCategory = categories.reduce((acc, cat) => {
          acc[cat] = skillDetails.filter(s => s.category === cat);
          return acc;
        }, {} as Record<string, typeof skillDetails>);

        return {
          ...context,
          tab: 'skills',
          skillsByCategory,
          categories,
        };
      }
      case 'combat': {
        // Gather equipped weapons and armor from owned items
        const weapons = this.actor.items
          .filter((item: Item) => item.type === 'weapon')
          .map((item: Item) => {
            const itemSystem = item.system as Record<string, unknown>;
            return {
              name: item.name,
              type: item.type,
              skillUsed: itemSystem['skillUsed'] || '',
              hands: itemSystem['hands'] || '',
              length: itemSystem['length'] || '',
              attackTable: itemSystem['attackTable'] || '',
              primaryCritical: itemSystem['primaryCritical'] || '',
            };
          });

        const armor = this.actor.items
          .filter((item: Item) => item.type === 'armor')
          .map((item: Item) => {
            const itemSystem = item.system as Record<string, unknown>;
            return {
              name: item.name,
              armorType: itemSystem['armorType'] || 'NA',
              meleeDefenseBonus: itemSystem['meleeDefenseBonus'] || 0,
              missileDefenseBonus: itemSystem['missileDefenseBonus'] || 0,
              cmbPenalty: itemSystem['cmbPenalty'] || 0,
              moveActionsPenalty: itemSystem['moveActionsPenalty'] || 0,
            };
          });

        // TODO: Conditions will come from actor flags or a dedicated conditions system
        const conditions: Array<{ name: string; duration?: number }> = [];

        return {
          ...context,
          tab: 'combat',
          defense: system['defense'],
          hp: system['hp'],
          weapons,
          armor,
          conditions,
        };
      }
      case 'magic': {
        // Gather spells from owned items and group by Spell Lore
        const spellItems = this.actor.items
          .filter((item: Item) => item.type === 'spell')
          .map((item: Item) => {
            const itemSystem = item.system as Record<string, unknown>;
            return {
              name: item.name,
              weaveNumber: itemSystem['weaveNumber'] as number || 1,
              spellLore: itemSystem['spellLore'] as string || '',
              statKey: itemSystem['statKey'] as string || 'wit',
              range: itemSystem['range'] as string || '',
              duration: itemSystem['duration'] as string || '',
              areaOfEffect: itemSystem['areaOfEffect'] as string || '',
              grantsSaveRoll: itemSystem['grantsSaveRoll'] as boolean || false,
              mpCost: itemSystem['weaveNumber'] as number || 1, // MP cost = weave number
            };
          });

        // Group spells by spell lore and compute casting bonus for each lore
        const stats = (system['stats'] as Record<string, number>) || {};
        const skills = (system['skills'] as SkillData[]) || [];

        // Create a map of spell lore to spells
        const loreMap = new Map<string, typeof spellItems>();
        for (const spell of spellItems) {
          if (!loreMap.has(spell.spellLore)) {
            loreMap.set(spell.spellLore, []);
          }
          loreMap.get(spell.spellLore)!.push(spell);
        }

        // Convert to array and compute casting bonus for each lore
        const spellsByLore = Array.from(loreMap.entries()).map(([loreName, spells]) => {
          // For casting bonus, we need the spell casting skill bonus
          // Find the Spells skill from the skills array
          const spellsSkill = skills.find((s) => s.name.toLowerCase().includes('spells') || s.category === 'Spells');

          let castingBonus = 0;
          if (spellsSkill) {
            const statValue = stats[spellsSkill.statKey] || 0;
            const rankBonus = computeRankBonus(spellsSkill.rank);
            castingBonus = statValue + rankBonus + spellsSkill.itemModifiers;
          }

          // Sort spells by weave number
          const sortedSpells = [...spells].sort((a, b) => a.weaveNumber - b.weaveNumber);

          return {
            loreName: loreName || 'Unknown Lore',
            castingBonus,
            spells: sortedSpells,
          };
        });

        return {
          ...context,
          tab: 'magic',
          mp: system['mp'],
          spellsByLore,
        };
      }
      case 'equipment': {
        // Gather equipment items and compute encumbrance
        const equipmentItems = this.actor.items.filter(
          (item: Item) =>
            item.type === 'equipment' ||
            item.type === 'weapon' ||
            item.type === 'armor' ||
            item.type === 'spell' ||
            item.type === 'itemOfPower'
        );

        // Map equipment items for rendering
        const mappedItems = equipmentItems.map((item: Item) => {
          const itemSystem = item.system as Record<string, unknown>;
          return {
            id: item.id,
            name: item.name,
            type: item.type,
            quantity: itemSystem['quantity'] as number || 1,
            weight: itemSystem['weight'] as number || 0,
            encumbrance: itemSystem['encumbrance'] as number || itemSystem['encumbranceContribution'] as number || 0,
          };
        });

        // Compute total encumbrance
        const totalEncumbrance = computeTotalEncumbrance(
          mappedItems.map(item => ({
            encumbrance: item.encumbrance,
            quantity: item.quantity,
          }))
        );

        // Determine encumbrance level (Req 16.5)
        const stats = (system['stats'] as Record<string, number>) || {};
        const brawn = stats['brn'] || 0;
        const encumbranceLevel = determineEncumbranceLevel(totalEncumbrance, brawn);

        // Calculate encumbrance percentage for progress bar (0-100%)
        // Use 3x brawn as the threshold for "over encumbered"
        const maxThreshold = brawn * 3;
        const encumbrancePercentage = Math.min(100, (totalEncumbrance / maxThreshold) * 100);

        // Gather Items of Power (Req 22.3)
        const itemsOfPower = this.actor.items
          .filter((item: Item) => item.type === 'itemOfPower')
          .map((item: Item) => {
            const itemSystem = item.system as Record<string, unknown>;
            const affinityLevel = itemSystem['affinityScore'] as number || 0;
            const isAttuned = itemSystem['attunementStatus'] as boolean || false;
            const powers = (itemSystem['powers'] as Array<{ affinityThreshold: number; description: string }>) || [];

            // Get active bonuses (Req 22.3, 22.5)
            const activeBonuses = getActiveBonuses(
              affinityLevel,
              isAttuned,
              powers.map(p => ({
                threshold: p.affinityThreshold,
                effect: p.description,
              }))
            );

            return {
              id: item.id,
              name: item.name,
              affinityLevel,
              isAttuned,
              activeBonuses,
            };
          });

        return {
          ...context,
          tab: 'equipment',
          items: mappedItems,
          itemsOfPower,
          totalEncumbrancePoints: totalEncumbrance,
          encumbrancePercentage,
          encumbrance: encumbranceLevel,
          wealth: system['wealth'],
        };
      }
      case 'biography': {
        // Get biography fields and associated items (Req 8.9)
        const biography = (system['biography'] as string) || '';
        const appearance = (system['appearance'] as string) || '';
        const backgroundNotes = (system['backgroundNotes'] as string) || '';

        // Find Kin, Culture, and Vocation items
        const kinItem = this.actor.items.find((item: Item) => item.type === 'kin');
        const cultureItem = this.actor.items.find((item: Item) => item.type === 'culture');
        const vocationItem = this.actor.items.find((item: Item) => item.type === 'vocation');

        return {
          ...context,
          tab: 'biography',
          biography,
          appearance,
          backgroundNotes,
          kinItem: kinItem ? { id: kinItem.id, name: kinItem.name } : null,
          cultureItem: cultureItem ? { id: cultureItem.id, name: cultureItem.name } : null,
          vocationItem: vocationItem ? { id: vocationItem.id, name: vocationItem.name } : null,
        };
      }
      default:
        return context;
    }
  }

  /**
   * Roll a skill check.
   *
   * Computes: skill total bonus + open-ended d100 roll, then resolves against
   * the Action Resolution Table and displays the result in chat.
   *
   * Requirements: 8.4, 8.5
   */
  static #rollSkill(
    event: Event,
    target: HTMLElement,
  ): void {
    // Get skill data from the clicked element
    const skillName = target.dataset.skillName;
    const skillBonus = Number(target.dataset.skillBonus);
    const statKey = target.dataset.statKey;
    const category = target.dataset.category;

    if (!skillName || isNaN(skillBonus)) {
      console.warn('VsdCharacterSheet: Missing skill data for roll');
      return;
    }

    // Use a random roll source (d100)
    const d100Source = () => Math.floor(Math.random() * 100) + 1;

    // Compute the open-ended roll
    const rollResult = computeOpenEndedRoll(d100Source);

    // Add skill bonus to roll total
    const totalWithBonus = rollResult.total + skillBonus;

    // Resolve against Action Resolution Table
    const outcome = resolveAction(totalWithBonus);

    // Get localized skill and outcome names
    const localize = game.i18n.localize.bind(game.i18n);
    const skillLabel = skillName;
    const statLabel = STAT_NAMES[statKey || ''] ? localize(STAT_NAMES[statKey || '']) : statKey;
    const categoryLabel = category || 'Unknown';

    // Format the roll display
    let rollDisplay = String(rollResult.total);
    if (rollResult.isOpenEndedHigh) {
      const explodeParts = rollResult.rolls
        .filter(r => r.type === 'high-explode')
        .map(r => `↑${r.value}`);
      rollDisplay = `${rollResult.rolls[0].value} ${explodeParts.join(' ')} ${rollResult.rolls[rollResult.rolls.length - 1].value}`;
    } else if (rollResult.isOpenEndedLow) {
      const explodeParts = rollResult.rolls
        .filter(r => r.type === 'low-explode')
        .map(r => `↓${r.value}`);
      rollDisplay = `${rollResult.rolls[0].value} ${explodeParts.join(' ')} ${rollResult.rolls[rollResult.rolls.length - 1].value}`;
    }

    // Build chat message
    const outcomeKey = `VSD.ActionResolution.${outcome}`;
    const chatContent = `
      <div class="vsd-roll-result">
        <div class="roll-header">
          <strong>${skillLabel}</strong>
          <span class="roll-category">${categoryLabel}</span>
        </div>
        <div class="roll-details">
          <span class="stat-bonus">${statLabel}: +${skillBonus}</span>
          <span class="roll-total">${rollDisplay}</span>
        </div>
        <div class="roll-result">
          <strong>${totalWithBonus}</strong> — ${localize(outcomeKey)}
        </div>
        ${rollResult.isOpenEndedHigh ? '<div class="roll-type open-ended-high">⬆ Open-ended High!</div>' : ''}
        ${rollResult.isOpenEndedLow ? '<div class="roll-type open-ended-low">⬇ Open-ended Low!</div>' : ''}
      </div>
    `;

    // Create and display chat message using Foundry's ChatMessage
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ alias: game.user?.name || 'Character' }),
      content: chatContent,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    });
  }

  /**
   * Remove an item from the character (e.g., Kin, Culture, Vocation from Biography tab).
   *
   * Requirements: 8.9
   */
  static #removeItem(event: Event, target: HTMLElement): void {
    const itemType = target.dataset.itemType;
    if (!itemType) return;

    // Find and delete the item of the specified type
    const actor = (this as any).actor as Actor;
    const itemToRemove = actor.items.find((item: Item) => item.type === itemType);
    if (itemToRemove) {
      itemToRemove.delete();
    }
  }
}
