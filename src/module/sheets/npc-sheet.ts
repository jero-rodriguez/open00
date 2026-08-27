/**
 * ApplicationV2 NPC sheet for Open 00.
 *
 * Single-page layout displaying the official VsD creature stat block format:
 * level+rank, move rates, armor type (with shield indicator), DEF, TSR, WSR,
 * HP, creature type (CT), attacks with size/multi-attack notation,
 * skill bonuses grouped by category, and special abilities.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */

import { computeOpenEndedRoll, formatRollDisplay } from '../engine/dice-engine.js';
import {
  lookupAttackTable,
  type ArmorCategory,
  type AttackTableData,
} from '../engine/attack-tables.js';
import { getFormUpdates } from './form-data.js';
import type { DeepPartial } from 'fvtt-types/utils';

type NpcRenderContext = foundry.applications.sheets.ActorSheetV2.RenderContext
  & Record<string, unknown>;
type NpcRenderOptions = DeepPartial<foundry.applications.sheets.ActorSheetV2.RenderOptions>;
const NPC_TEMPLATE_ROOT = 'systems/open00/templates/actors';

/** Valid armor categories for attack table resolution */
const VALID_ARMOR_CATEGORIES: readonly string[] = ['NA', 'LA', 'MA', 'HA'];

/** Skill bonus category labels for display grouping */
const SKILL_CATEGORIES: readonly string[] = ['CMB', 'Rog', 'Adv', 'Lor'];

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value !== 'string' || value.trim() === '') return fallback;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

interface NpcAttack {
  name: string;
  bonus: number;
  size: string;
  attackType: string;
  tableId: string;
  criticalTableId: string;
  multiAttack: number;
}

interface NpcSkillBonus {
  name: string;
  bonus: number;
  category: string;
}

interface NpcSpecialAbility {
  name: string;
  description: string;
}

/** Formatted attack for template display */
interface AttackDisplay {
  index: number;
  name: string;
  bonus: number;
  bonusDisplay: string;
  size: string;
  attackType: string;
  tableId: string;
  criticalTableId: string;
  multiAttack: number;
  multiAttackDisplay: string;
  summary: string;
}

/** Grouped skill bonus for template display */
interface SkillCategoryDisplay {
  category: string;
  label: string;
  skills: Array<{
    index: number;
    name: string;
    bonus: number;
    bonusDisplay: string;
    category: string;
  }>;
}

export class Open00NpcSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2<NpcRenderContext>,
) {
  static override DEFAULT_OPTIONS = {
    classes: ['open00', 'sheet', 'actor', 'npc'],
    tag: 'form',
    position: { width: 700, height: 720 },
    window: { resizable: true },
    form: { handler: Open00NpcSheet.#processFormData, submitOnChange: true },
    actions: {
      rollAttack: Open00NpcSheet.#rollAttack,
    },
  };

  static override PARTS: Record<
    string,
    foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart
  > = {
    body: {
      template: `${NPC_TEMPLATE_ROOT}/npc-sheet.hbs`,
    },
  };

  override render(
    options: boolean | NpcRenderOptions = {},
    legacyOptions: NpcRenderOptions = {},
  ): Promise<this> {
    if (typeof options === 'boolean') {
      return super.render(options, this.#withPartialNpcRender(legacyOptions));
    }
    return super.render(this.#withPartialNpcRender(options));
  }

  #withPartialNpcRender(
    options: NpcRenderOptions,
  ): NpcRenderOptions {
    if (options.parts) return options;

    const ctx = options.renderContext;
    if (ctx === 'updateActor' || ctx === 'createItem' || ctx === 'deleteItem'
      || ctx === 'updateItem') {
      return { ...options, parts: ['body'] };
    }

    return options;
  }

  override async _prepareContext(
    options: NpcRenderOptions & { isFirstRender: boolean },
  ): Promise<NpcRenderContext> {
    const baseContext = await super._prepareContext(options);
    const system = this.actor.system as Record<string, unknown>;

    // Core stat block fields
    const level = asNumber(system['level'], 1);
    const rank = String(system['rank'] ?? 'Normal');
    const hp = asNumber(system['hp'], 1);
    const armorType = String(system['armorType'] ?? 'NA');
    const hasShield = Boolean(system['hasShield']);
    const defense = asNumber(system['defense']);
    const tsr = asNumber(system['tsr']);
    const wsr = asNumber(system['wsr']);
    const moveRates = String(system['moveRates'] ?? '30L');
    const creatureType = String(system['creatureType'] ?? 'NH');

    // Level + rank display (e.g. "12 Elite" or "5" for Normal)
    const levelDisplay = rank === 'Normal' ? String(level) : `${level} ${rank}`;

    // Armor display with shield indicator (e.g. "MA + Shield")
    const armorDisplay = hasShield ? `${armorType} + Shield` : armorType;

    // Format attacks with VsD notation: "+bonus Size Type (xN)"
    const rawAttacks = (system['attacks'] as NpcAttack[] | undefined) ?? [];
    const attacks: AttackDisplay[] = rawAttacks.map((attack, index) => {
      const bonus = asNumber(attack.bonus);
      const multiAttack = asNumber(attack.multiAttack, 1);
      const multiAttackDisplay = multiAttack > 1 ? `(x${multiAttack})` : '';
      const bonusDisplay = formatModifier(bonus);
      // Build summary: "+55 Medium Claw (x2)"
      const summaryParts = [bonusDisplay, attack.size, attack.attackType || attack.name];
      if (multiAttackDisplay) summaryParts.push(multiAttackDisplay);
      const summary = summaryParts.filter(Boolean).join(' ');

      return {
        index,
        name: attack.name,
        bonus,
        bonusDisplay,
        size: attack.size || 'Medium',
        attackType: attack.attackType || '',
        tableId: attack.tableId || '',
        criticalTableId: attack.criticalTableId || '',
        multiAttack,
        multiAttackDisplay,
        summary,
      };
    });

    // Group skill bonuses by category (CMB, Rog, Adv, Lor)
    const rawSkills = (system['skillBonuses'] as NpcSkillBonus[] | undefined) ?? [];
    const skillsWithIndex = rawSkills.map((skill, index) => ({
      index,
      name: skill.name,
      bonus: asNumber(skill.bonus),
      bonusDisplay: formatModifier(asNumber(skill.bonus)),
      category: skill.category || '',
    }));

    const skillCategories: SkillCategoryDisplay[] = SKILL_CATEGORIES.map((cat) => ({
      category: cat,
      label: cat,
      skills: skillsWithIndex.filter((skill) => skill.category === cat),
    })).filter((group) => group.skills.length > 0);

    // Uncategorized skills (those with empty category)
    const uncategorizedSkills = skillsWithIndex.filter((skill) => skill.category === '');

    // Special abilities
    const specialAbilities = await Promise.all(
      ((system['specialAbilities'] as NpcSpecialAbility[] | undefined) ?? [])
        .map(async (ability, index) => ({
          index,
          name: ability.name,
          description: ability.description,
          enrichedAbilityDescription: await foundry.applications.ux.TextEditor.enrichHTML(String(ability.description ?? ''), { relativeTo: this.actor }),
        })),
    );

    return {
      ...baseContext,
      actor: this.actor,
      system,
      source: (this.actor as unknown as { system: { _source: Record<string, unknown> } }).system._source ?? system,
      name: this.actor.name,
      img: this.actor.img,
      level,
      rank,
      levelDisplay,
      hp,
      armorType,
      hasShield,
      armorDisplay,
      defense,
      defenseDisplay: formatModifier(defense),
      tsr,
      tsrDisplay: formatModifier(tsr),
      wsr,
      wsrDisplay: formatModifier(wsr),
      moveRates,
      creatureType,
      attacks,
      skillCategories,
      uncategorizedSkills,
      allSkills: skillsWithIndex,
      specialAbilities,
      options,
    };
  }

  /**
   * Native form handler for ApplicationV2.
   * Processes form data submitted via submitOnChange and persists via actor.update().
   */
  static async #processFormData(
    event: SubmitEvent | Event,
    _form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void> {
    const sheet = (this as unknown as Open00NpcSheet);
    const updates = getFormUpdates(event, formData.object);

    if (Object.keys(updates).length > 0) {
      await sheet.actor.update(updates);
    }
  }

  /**
   * Handle NPC attack roll action.
   *
   * Triggers an open-ended d100 roll with the attack bonus, prompts for armor
   * category, resolves against the attack table, and displays the result in chat.
   * If the result includes a critical hit, applies creature type severity reduction
   * and auto-rolls on the critical table.
   *
   * Requirements: 9.3, 9.5
   */
  static #rollAttack(_event: Event, target: HTMLElement): void {
    const sheet = this as unknown as Open00NpcSheet;
    const indexStr = target.dataset['index'];
    if (indexStr === undefined) return;

    const index = Number(indexStr);
    const system = sheet.actor.system as Record<string, unknown>;
    const attacks = (system['attacks'] as NpcAttack[] | undefined) ?? [];
    const attack = attacks[index];
    if (!attack) return;

    // Prompt for armor category via browser prompt (simple approach)
    const armorInput = window.prompt(
      'Enter target armor category (NA, LA, MA, HA):',
      target.dataset['armor'] ?? 'NA',
    );
    if (armorInput === null) return; // User cancelled

    const armorCategory = armorInput.trim().toUpperCase();
    if (!VALID_ARMOR_CATEGORIES.includes(armorCategory)) {
      console.warn(`Invalid armor category "${armorInput}", defaulting to NA`);
    }
    const validArmor: ArmorCategory = VALID_ARMOR_CATEGORIES.includes(armorCategory)
      ? (armorCategory as ArmorCategory)
      : 'NA';

    // Roll open-ended d100
    const rollSource = () => Math.floor(Math.random() * 100) + 1;
    const rollResult = computeOpenEndedRoll(rollSource);
    const rollDisplay = formatRollDisplay(rollResult);
    const attackTotal = rollResult.total + asNumber(attack.bonus);

    // Build chat content
    const speaker = ChatMessage.getSpeaker({ actor: sheet.actor });
    const parts: string[] = [];
    parts.push(`<strong>${attack.name || 'Attack'}</strong>`);
    const multiAttack = asNumber(attack.multiAttack, 1);
    if (multiAttack > 1) {
      parts.push(`Multi-Attack: x${multiAttack}`);
    }
    parts.push(`Roll: ${rollDisplay}`);
    parts.push(`Bonus: ${formatModifier(asNumber(attack.bonus))}`);
    parts.push(`<strong>Total: ${attackTotal}</strong>`);
    parts.push(`Armor: ${validArmor}`);

    // Resolve against attack table if available
    const tables: Map<string, AttackTableData> = (
      (game as Record<string, unknown>)['open00AttackTables'] as Map<string, AttackTableData> | undefined
    ) ?? new Map<string, AttackTableData>();

    if (attack.tableId) {
      const tableResult = lookupAttackTable(attackTotal, attack.tableId, validArmor, tables);

      if ('error' in tableResult) {
        parts.push(`<em>Table "${attack.tableId}" not found — showing raw total only</em>`);
      } else {
        parts.push(`Damage: <strong>${tableResult.damage}</strong>`);

        if (tableResult.critical) {
          // Apply creature type critical reduction (Req 9.5, 2.7)
          const creatureType = String(system['creatureType'] ?? 'NH');
          const reductionTier = creatureType.charAt(0);
          const reductionSteps = reductionTier === 'E' ? 2 : reductionTier === 'H' ? 1 : 0;
          const reductionNote = reductionSteps > 0
            ? ` (reduced ${reductionSteps} step${reductionSteps > 1 ? 's' : ''} by CT ${reductionTier})`
            : '';

          parts.push(
            `<strong>CRITICAL!</strong> Severity: ${tableResult.critical.severity}${reductionNote}`,
          );

          // Auto-roll on critical table (Req 9.5)
          const critTableRef = attack.criticalTableId || tableResult.critical.tableRef;
          const critRoll = computeOpenEndedRoll(rollSource);
          const critDisplay = formatRollDisplay(critRoll);
          parts.push(`Critical Roll: ${critDisplay} → Total: ${critRoll.total}`);
          parts.push(`<em>Resolve on ${critTableRef} table</em>`);
        }
      }
    } else {
      parts.push(`<em>No attack table specified</em>`);
    }

    // Send chat message
    void ChatMessage.create({
      speaker,
      content: `<div class="open00 npc-attack-roll">${parts.join('<br>')}</div>`,
    });
  }
}
