/**
 * ApplicationV2 player-character sheet for Open 00.
 *
 * Rules calculations stay in the existing engine and DataModels. This class
 * prepares presentation data, handles sheet actions, and wires autosave for the
 * multipart form.
 */

import { computeOpenEndedRoll, formatRollDisplay } from '../engine/dice-engine.js';
import { computeRankBonus } from '../engine/rank-bonus.js';
import { resolveAction } from '../engine/action-resolution.js';
import { determineEncumbranceLevel, computeTotalEncumbrance } from '../engine/encumbrance.js';
import { getActiveBonuses } from '../engine/affinity.js';
import { createAutoSaveHandler, attachAutoSaveToForm } from './auto-save.js';
import { getCharacterSheetUpdateParts } from './partial-render.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const ACTOR_TEMPLATE_ROOT = `systems/${game.system?.id ?? 'open00'}/templates/actors`;

interface SkillData {
  name: string;
  category: string;
  rank: number;
  statKey: string;
  vocation: number;
  kin: number;
  spec: number;
  item: number;
}

interface SheetTabDefinition {
  tab: string;
  label: string;
}

interface SheetTab {
  id: string;
  group: string;
  label: string;
  active: boolean;
  cssClass: string;
}

const STAT_NAMES: Record<string, string> = {
  brn: 'OPEN00.Stats.Brawn',
  swi: 'OPEN00.Stats.Swiftness',
  for: 'OPEN00.Stats.Fortitude',
  wit: 'OPEN00.Stats.Wits',
  wsd: 'OPEN00.Stats.Wisdom',
  bea: 'OPEN00.Stats.Bearing',
};

const SKILL_CATEGORIES = ['Armor', 'Combat', 'Adventuring', 'Roguery', 'Lore', 'Spells', 'Body'];

const ENCUMBRANCE_POINTS: Record<string, number> = {
  None: 0,
  Light: 1,
  Moderate: 2,
  Heavy: 3,
};

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value !== 'string' || value.trim() === '') return fallback;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function formatModifier(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function escapeHTML(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export class Open00CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static override DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration = {
    classes: ['open00', 'sheet', 'actor', 'character'],
    tag: 'form',
    position: { width: 1080, height: 800 },
    window: { resizable: true },
    actions: {
      rollSkill: Open00CharacterSheet.#rollSkill,
      openItem: Open00CharacterSheet.#openItem,
      removeItem: Open00CharacterSheet.#removeItem,
      setDrivePoints: Open00CharacterSheet.#setDrivePoints,
      rollDice: Open00CharacterSheet.#rollDice,
    },
  };

  static override PARTS: Record<string, foundry.applications.api.ApplicationPartDefinition> = {
    header: {
      template: `${ACTOR_TEMPLATE_ROOT}/character-header.hbs`,
    },
    tabs: {
      id: 'tabs',
      template: `${ACTOR_TEMPLATE_ROOT}/character-tabs.hbs`,
    },
    overview: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ACTOR_TEMPLATE_ROOT}/character-overview.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    combat: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ACTOR_TEMPLATE_ROOT}/character-combat.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    magic: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ACTOR_TEMPLATE_ROOT}/character-magic.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    equipment: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ACTOR_TEMPLATE_ROOT}/character-equipment.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    biography: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ACTOR_TEMPLATE_ROOT}/character-biography.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
  };

  static TABS: SheetTabDefinition[] = [
    { tab: 'overview', label: 'OPEN00.Tabs.Skills' },
    { tab: 'combat', label: 'OPEN00.Tabs.Combat' },
    { tab: 'magic', label: 'OPEN00.Tabs.Magic' },
    { tab: 'equipment', label: 'OPEN00.Tabs.Equipment' },
    { tab: 'biography', label: 'OPEN00.Tabs.Biography' },
  ];

  override tabGroups: Record<string, string> = { primary: 'overview' };

  #autoSaveHandler: ReturnType<typeof createAutoSaveHandler> | null = null;
  #detachAutoSave: (() => void) | null = null;

  override render(
    options: boolean | foundry.applications.api.ApplicationRenderOptions = {},
    legacyOptions: foundry.applications.api.ApplicationRenderOptions = {},
  ): Promise<unknown> {
    if (typeof options === 'boolean') {
      return super.render(options, this.#withPartialActorRender(legacyOptions));
    }

    return super.render(this.#withPartialActorRender(options));
  }

  #withPartialActorRender(
    options: foundry.applications.api.ApplicationRenderOptions,
  ): foundry.applications.api.ApplicationRenderOptions {
    if (options.parts || options.renderContext !== 'updateActor') return options;

    const parts = getCharacterSheetUpdateParts(options.renderData);
    return parts ? { ...options, parts } : options;
  }

  protected _getTabs(): Record<string, SheetTab> {
    const active = this.tabGroups['primary'];
    return (this.constructor as typeof Open00CharacterSheet).TABS.reduce<Record<string, SheetTab>>(
      (tabs, { tab, label }) => {
        const isActive = active === tab;
        tabs[tab] = {
          id: tab,
          group: 'primary',
          label,
          active: isActive,
          cssClass: isActive ? 'active' : '',
        };
        return tabs;
      },
      {},
    );
  }

  override async _onRender(
    context: Record<string, unknown>,
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<void> {
    await super._onRender(context, options);

    this.#autoSaveHandler ??= createAutoSaveHandler(this.actor, {
      debounceMs: 500,
      onError: (error: Error) => console.error('Open00CharacterSheet autosave failed:', error),
    });

    this.#detachAutoSave?.();
    this.#detachAutoSave = this.form
      ? attachAutoSaveToForm(this.form, this.#autoSaveHandler)
      : null;
  }

  async close(options?: Record<string, unknown>): Promise<void> {
    this.#detachAutoSave?.();
    this.#detachAutoSave = null;
    this.#autoSaveHandler?.cleanup();
    this.#autoSaveHandler = null;
    return super.close(options);
  }

  override async _prepareContext(
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<Record<string, unknown>> {
    const system = this.actor.system as Record<string, unknown>;
    const identityItem = (type: string) => this.actor.items.find((item: Item) => item.type === type);
    const kin = identityItem('kin');
    const culture = identityItem('culture');
    const vocation = identityItem('vocation');
    const drivePoints = system['drivePoints'] as { value?: number; max?: number } | undefined;
    const driveValue = asNumber(drivePoints?.value);
    const driveMax = Math.max(0, asNumber(drivePoints?.max, 5));

    return {
      actor: this.actor,
      system,
      name: this.actor.name,
      img: this.actor.img,
      experience: system['experience'],
      identity: {
        kin: kin ? { id: kin.id, name: kin.name } : null,
        culture: culture ? { id: culture.id, name: culture.name } : null,
        vocation: vocation ? { id: vocation.id, name: vocation.name } : null,
      },
      drivePips: Array.from({ length: driveMax }, (_, index) => ({
        value: index + 1,
        active: index < driveValue,
      })),
      tabs: this._getTabs(),
      options,
    };
  }

  override async _preparePartContext(
    partId: string,
    context: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const system = this.actor.system as Record<string, unknown>;
    const tabs = (context['tabs'] as Record<string, SheetTab>) ?? {};
    const tab = tabs[partId];
    context = tab ? { ...context, tab } : { ...context };

    switch (partId) {
      case 'overview': {
        const skills = (system['skills'] as SkillData[]) ?? [];
        const stats = (system['stats'] as Record<string, { base: number; kin: number; spec: number }>) ?? {};
        const skillDetails = skills.map((skill, index) => {
          const statBase = asNumber(stats[skill.statKey]?.base);
          const statKin = asNumber(stats[skill.statKey]?.kin);
          const statSpec = asNumber(stats[skill.statKey]?.spec);
          const statBonus = statBase + statKin + statSpec;
          const rankBonus = computeRankBonus(asNumber(skill.rank));
          const vocation = asNumber(skill.vocation);
          const kin = asNumber(skill.kin);
          const spec = asNumber(skill.spec);
          const item = asNumber(skill.item);
          const totalBonus = statBonus + rankBonus + vocation + kin + spec + item;
          return {
            ...skill,
            index,
            statLabel: STAT_NAMES[skill.statKey] ?? skill.statKey,
            statBonusDisplay: formatModifier(statBonus),
            rankBonusDisplay: formatModifier(rankBonus),
            vocationDisplay: formatModifier(vocation),
            kinDisplay: formatModifier(kin),
            specDisplay: formatModifier(spec),
            itemDisplay: formatModifier(item),
            totalBonus,
            totalBonusDisplay: formatModifier(totalBonus),
          };
        });

        const skillCategories = SKILL_CATEGORIES.map((category) => ({
          id: category,
          label: `OPEN00.Skills.Categories.${category}`,
          skills: skillDetails.filter((skill) => skill.category === category),
        })).filter((category) => category.skills.length > 0);

        // Build stats object with both nested (base/kin/spec) and flat (total) values for template
        const statsContext: Record<string, { base: number; kin: number; spec: number; total: number }> = {};
        for (const statKey of ['brn', 'swi', 'for', 'wit', 'wsd', 'bea'] as const) {
          const stat = stats[statKey];
          const base = asNumber(stat?.base);
          const kin = asNumber(stat?.kin);
          const spec = asNumber(stat?.spec);
          statsContext[statKey] = {
            base,
            kin,
            spec,
            total: base + kin + spec,
          };
        }

        // Build save rolls with full breakdown (Stat, Kin, Spec, Lvl, Total)
        const level = asNumber(system['level']);
        const saveRolls = [
          {
            name: 'OPEN00.Saves.Toughness',
            stat: 'FOR',
            statBase: asNumber(stats['for']?.base),
            kin: asNumber(stats['for']?.kin),
            spec: asNumber(stats['for']?.spec),
            level,
            total: asNumber(stats['for']?.base) + asNumber(stats['for']?.kin) + asNumber(stats['for']?.spec) + level,
          },
          {
            name: 'OPEN00.Saves.Willpower',
            stat: 'WSD',
            statBase: asNumber(stats['wsd']?.base),
            kin: asNumber(stats['wsd']?.kin),
            spec: asNumber(stats['wsd']?.spec),
            level,
            total: asNumber(stats['wsd']?.base) + asNumber(stats['wsd']?.kin) + asNumber(stats['wsd']?.spec) + level,
          },
        ];

        // Heroic Path: split stored string into displayable list items
        const heroicPathRaw = String(system['heroicPath'] ?? '');
        const heroicPathItems = heroicPathRaw
          ? heroicPathRaw.split('\n').map((line) => line.trim()).filter(Boolean)
          : [];

        // Special Abilities (stored as string array on the character)
        const specialAbilities = (system['specialAbilities'] as string[] | undefined) ?? [];

        // Known Languages (stored as string array on the character)
        const knownLanguages = (system['knownLanguages'] as string[] | undefined) ?? [];

        // Background Options (Item type 'background' owned by the actor)
        const backgroundOptions = this.actor.items
          .filter((item: Item) => item.type === 'background')
          .map((item: Item) => ({ id: item.id, name: item.name }));

        return {
          ...context,
          stats: statsContext,
          drivePoints: system['drivePoints'],
          passions: system['passions'],
          heroicPath: heroicPathRaw,
          heroicPathItems,
          specialAbilities,
          knownLanguages,
          backgroundOptions,
          level,
          skillCategories,
          saveRolls,
        };
      }

      case 'combat': {
        const weapons = this.actor.items
          .filter((item: Item) => item.type === 'weapon')
          .map((item: Item) => {
            const data = item.system as Record<string, unknown>;
            const qualities = [
              ['qualityBackstab', 'OPEN00.Qualities.Backstab'],
              ['qualityHandAndHalf', 'OPEN00.Qualities.HandAndHalf'],
              ['qualityHeavy', 'OPEN00.Qualities.Heavy'],
              ['qualityMartial', 'OPEN00.Qualities.Martial'],
              ['qualityMighty', 'OPEN00.Qualities.Mighty'],
              ['qualityQuickLoad', 'OPEN00.Qualities.QuickLoad'],
              ['qualityReach', 'OPEN00.Qualities.Reach'],
              ['qualityUnreliable', 'OPEN00.Qualities.Unreliable'],
            ].filter(([key]) => Boolean(data[key])).map(([, label]) => game.i18n.localize(label));
            const loadRounds = asNumber(data['qualityLoadRounds']);
            if (loadRounds > 0) qualities.push(`${game.i18n.localize('OPEN00.Qualities.Load')} ${loadRounds}`);

            return {
              id: item.id,
              img: item.img,
              name: item.name,
              hands: data['hands'] ?? '',
              length: data['length'] ?? '',
              skillUsed: data['skillUsed'] ?? '',
              clumsyRange: data['clumsyRange'] ?? '',
              attackTable: data['attackTable'] ?? '',
              maxResult: data['maxResult'] ?? '',
              primaryCritical: data['primaryCritical'] ?? '',
              alternateCritical: data['alternateCritical'] ?? '—',
              baseRange: data['baseRange'] ?? '',
              qualities: qualities.join(', ') || '—',
            };
          });

        const armor = this.actor.items
          .filter((item: Item) => item.type === 'armor')
          .map((item: Item) => {
            const data = item.system as Record<string, unknown>;
            const qualities = [
              data['qualityMetal'] ? game.i18n.localize('OPEN00.Qualities.Metal') : '',
              data['qualityRigid'] ? game.i18n.localize('OPEN00.Qualities.Rigid') : '',
            ].filter(Boolean);
            return {
              id: item.id,
              img: item.img,
              name: item.name,
              armorType: data['armorType'] ?? 'NA',
              zones: ((data['zonesProtected'] as string[] | undefined) ?? []).join(', ') || '—',
              maxSwiToDefense: data['maxSwiToDefense'] ?? '',
              moveActionsPenalty: data['moveActionsPenalty'] ?? 0,
              cmbPenalty: data['cmbPenalty'] ?? 0,
              perceptionPenalty: data['perceptionPenalty'] ?? 0,
              meleeDefenseBonus: data['meleeDefenseBonus'] ?? 0,
              missileDefenseBonus: data['missileDefenseBonus'] ?? 0,
              qualities: qualities.join(', ') || '—',
            };
          });

        const developmentPointsPerLevel = (system['developmentPointsPerLevel'] as number[] | undefined) ?? [];

        return {
          ...context,
          defense: system['defense'],
          hp: system['hp'],
          encumbrance: system['encumbrance'],
          encumbranceLabel: `OPEN00.Equipment.${String(system['encumbrance'] ?? 'Unencumbered')}`,
          weapons,
          armor,
          conditions: [],
          developmentPointsPerLevel,
        };
      }

      case 'magic': {
        const stats = (system['stats'] as Record<string, { base: number; kin: number; spec: number }>) ?? {};
        const skills = (system['skills'] as SkillData[]) ?? [];
        const level = asNumber(system['level']);

        // Build lore context from owned spellLore items
        const spellLores = this.actor.items
          .filter((item: Item) => item.type === 'spellLore')
          .map((item: Item) => {
            const data = item.system as Record<string, unknown>;
            const statKey = String(data['statKey'] ?? 'wit');
            const category = String(data['category'] ?? 'common');
            const spells = (data['spells'] as Array<{
              name: string; weave: number; range: string; duration: string;
              areaOfEffect: string; grantsSaveRoll: boolean; isInstantaneous: boolean;
            }>) ?? [];

            // Find the matching skill entry (Spells category, same name as the lore)
            const skill = skills.find((s) => s.name === item.name && s.category === 'Spells');
            const ranks = asNumber(skill?.rank);

            // Compute casting bonus from the lore's governing stat
            const stat = stats[statKey];
            const statBonus = stat
              ? asNumber(stat.base) + asNumber(stat.kin) + asNumber(stat.spec)
              : 0;
            const rankBonus = skill ? computeRankBonus(ranks) : 0;
            const vocation = asNumber(skill?.vocation);
            const kin = asNumber(skill?.kin);
            const spec = asNumber(skill?.spec);
            const itemMod = asNumber(skill?.item);
            const castingBonus = statBonus + rankBonus + vocation + kin + spec + itemMod;

            // Determine max castable Weave based on category and level
            const isCommonOnly = category === 'common';
            const maxKnownWeave = ranks;
            const maxCastableWeave = isCommonOnly
              ? Math.min(maxKnownWeave, 5, level)
              : Math.min(maxKnownWeave, level);

            // Filter spells the character knows (weave ≤ ranks) and mark castability
            const knownSpells = spells
              .filter((spell) => spell.weave <= ranks)
              .sort((a, b) => a.weave - b.weave)
              .map((spell) => ({
                ...spell,
                mpCost: spell.weave,
                canCast: spell.weave <= maxCastableWeave,
              }));

            return {
              id: item.id,
              name: item.name,
              statKey,
              category,
              ranks,
              castingBonus: formatModifier(castingBonus),
              maxCastableWeave,
              spells: knownSpells,
              spellCount: knownSpells.length,
            };
          });

        return { ...context, mp: system['mp'], level, spellLores };
      }

      case 'equipment': {
        const carriedTypes = ['equipment', 'weapon', 'armor', 'itemOfPower'];
        const mappedItems = this.actor.items
          .filter((item: Item) => carriedTypes.includes(item.type))
          .map((item: Item) => {
            const data = item.system as Record<string, unknown>;
            const quantity = Math.max(0, asNumber(data['quantity'], 1));
            const encumbranceCategory = String(data['encumbranceCategory'] ?? 'None');
            return {
              id: item.id,
              img: item.img,
              name: item.name,
              type: game.i18n.localize(`TYPES.Item.${item.type}`),
              quantity,
              fare: data['fare'] ?? '—',
              availability: data['availability'] ?? '—',
              encumbranceCategory,
              encumbrance: ENCUMBRANCE_POINTS[encumbranceCategory] ?? 0,
            };
          });
        const totalEncumbrance = computeTotalEncumbrance(mappedItems);
        const stats = (system['stats'] as Record<string, number>) ?? {};
        const brawn = asNumber(stats['brn']);
        const encumbrance = determineEncumbranceLevel(totalEncumbrance, brawn);
        const encumbrancePercentage = Math.min(
          100,
          Math.round((totalEncumbrance / Math.max(1, brawn * 3)) * 100),
        );
        const itemsOfPower = this.actor.items
          .filter((item: Item) => item.type === 'itemOfPower')
          .map((item: Item) => {
            const data = item.system as Record<string, unknown>;
            const affinityLevel = asNumber(data['affinityScore']);
            const isAttuned = Boolean(data['attunementStatus']);
            const powers = (data['powers'] as Array<{ affinityThreshold: number; description: string }> | undefined) ?? [];
            return {
              id: item.id,
              img: item.img,
              name: item.name,
              affinityLevel,
              isAttuned,
              activeBonuses: getActiveBonuses(
                affinityLevel,
                isAttuned,
                powers.map((power) => ({ threshold: power.affinityThreshold, effect: power.description })),
              ),
            };
          });

        return {
          ...context,
          items: mappedItems,
          itemsOfPower,
          totalEncumbrancePoints: totalEncumbrance,
          encumbrancePercentage,
          encumbrance,
          encumbranceLabel: `OPEN00.Equipment.${encumbrance}`,
          wealth: system['wealth'],
        };
      }

      case 'biography': {
        const itemView = (item: Item) => ({ id: item.id, img: item.img, name: item.name });
        return {
          ...context,
          biography: system['biography'] ?? '',
          appearance: system['appearance'] ?? '',
          backgroundNotes: system['backgroundNotes'] ?? '',
          traits: this.actor.items.filter((item: Item) => item.type === 'trait').map(itemView),
          backgrounds: this.actor.items.filter((item: Item) => item.type === 'background').map(itemView),
        };
      }

      default:
        return context;
    }
  }

  static #rollSkill(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const skillName = target.dataset.skillName;
    const skillBonus = Number(target.dataset.skillBonus);
    const statKey = target.dataset.statKey ?? '';
    const category = target.dataset.category ?? '';
    if (!skillName || Number.isNaN(skillBonus)) return;

    const rollResult = computeOpenEndedRoll(() => Math.floor(Math.random() * 100) + 1);
    const totalWithBonus = rollResult.total + skillBonus;
    const outcome = resolveAction(totalWithBonus);
    const statLabel = STAT_NAMES[statKey]
      ? game.i18n.localize(STAT_NAMES[statKey])
      : statKey.toUpperCase();
    const categoryLabel = game.i18n.localize(`OPEN00.Skills.Categories.${category}`);

    const chatContent = `
      <div class="open00-roll-result">
        <header class="roll-header">
          <strong>${escapeHTML(skillName)}</strong>
          <span class="roll-category">${escapeHTML(categoryLabel)}</span>
        </header>
        <div class="roll-formula">
          <span>${escapeHTML(formatRollDisplay(rollResult))}</span>
          <span>${escapeHTML(statLabel)} ${formatModifier(skillBonus)}</span>
        </div>
        <div class="roll-result">
          <strong>${totalWithBonus}</strong>
          <span>${escapeHTML(game.i18n.localize(`OPEN00.ActionResolution.${outcome}`))}</span>
        </div>
      </div>`;

    void ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: sheet.actor }),
      content: chatContent,
    });
  }

  static #openItem(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const itemId = target.dataset.itemId ?? target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
    if (!itemId) return;
    sheet.actor.items.find((item: Item) => item.id === itemId)?.sheet?.render(true);
  }

  static #removeItem(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const itemId = target.dataset.itemId ?? target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
    const itemType = target.dataset.itemType;
    const item = itemId
      ? sheet.actor.items.find((candidate: Item) => candidate.id === itemId)
      : sheet.actor.items.find((candidate: Item) => candidate.type === itemType);
    if (item) void item.delete();
  }

  static #setDrivePoints(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const selected = asNumber(Number(target.dataset.value));
    const drivePoints = sheet.actor.system['drivePoints'] as { value?: number } | undefined;
    const nextValue = asNumber(drivePoints?.value) === selected ? selected - 1 : selected;
    void sheet.actor.update({ 'system.drivePoints.value': Math.max(0, nextValue) });
  }

  static #rollDice(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const diceType = target.dataset.dice ?? '';

    let rollResult;
    let rollLabel = '';

    switch (diceType) {
      case 'd5':
        rollResult = Math.floor(Math.random() * 5) + 1;
        rollLabel = 'd5';
        break;
      case 'd10':
        rollResult = Math.floor(Math.random() * 10) + 1;
        rollLabel = 'd10';
        break;
      case 'd100':
        rollResult = Math.floor(Math.random() * 100) + 1;
        rollLabel = 'd100';
        break;
      case 'd100oe':
        rollResult = computeOpenEndedRoll(() => Math.floor(Math.random() * 100) + 1).total;
        rollLabel = 'd100 OE';
        break;
      default:
        return;
    }

    const chatContent = `
      <div class="open00-dice-roll">
        <header class="roll-header">
          <strong>${escapeHTML(rollLabel)}</strong>
        </header>
        <div class="roll-result">
          <strong class="roll-total">${rollResult}</strong>
        </div>
      </div>`;

    void ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: sheet.actor }),
      content: chatContent,
    });
  }
}
