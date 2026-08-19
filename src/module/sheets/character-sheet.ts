/**
 * VsdCharacterSheet — ApplicationV2 sheet for the VsD Player Character actor type.
 *
 * Six tabs: Overview, Skills, Combat, Magic, Equipment, Biography.
 * Uses HandlebarsApplicationMixin for template rendering.
 *
 * Requirements: 8.1, 8.11, 8.4, 8.5
 */

import { computeOpenEndedRoll } from '../engine/dice-engine.js';
import { computeRankBonus } from '../engine/rank-bonus.js';
import { resolveAction } from '../engine/action-resolution.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

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
        const skills = (system['skills'] as Array<{ name: string; category: string; rank: number; statKey: string; itemModifiers: number }>) || [];
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
      case 'combat':
        return {
          ...context,
          tab: 'combat',
          defense: system['defense'],
          hp: system['hp'],
        };
      case 'magic':
        return {
          ...context,
          tab: 'magic',
          mp: system['mp'],
        };
      case 'equipment':
        return {
          ...context,
          tab: 'equipment',
          encumbrance: system['encumbrance'],
          wealth: system['wealth'],
          items: this.actor.items,
        };
      case 'biography':
        return {
          ...context,
          tab: 'biography',
        };
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
}
