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
import {
  SKILL_ID_LIST,
  DEFAULT_SKILL_DEFINITIONS,
  type SkillId,
} from '../data/skills.js';
import type { DerivedSkillData } from '../models/actor/character.js';
import { flattenFormData } from './form-data.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

const ACTOR_TEMPLATE_ROOT = 'systems/open00/templates/actors';

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
    form: { handler: Open00CharacterSheet.#processFormData, submitOnChange: true },
    actions: {
      rollSkill: Open00CharacterSheet.#rollSkill,
      rollStat: Open00CharacterSheet.#rollStat,
      rollSave: Open00CharacterSheet.#rollSave,
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
    if (options.parts) return options;

    // For actor updates, re-render header + the active tab (native part-scoped render)
    if (options.renderContext === 'updateActor') {
      const activeTab = this.tabGroups['primary'] ?? 'overview';
      return { ...options, parts: ['header', activeTab] };
    }

    // For item changes (create/delete/update), re-render only the active tab + header
    if (
      options.renderContext === 'createItem'
      || options.renderContext === 'deleteItem'
      || options.renderContext === 'updateItem'
    ) {
      const activeTab = this.tabGroups['primary'] ?? 'overview';
      return { ...options, parts: ['header', activeTab] };
    }

    return options;
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
    // Form submission now handled by native submitOnChange + _processFormData
  }

  async close(options?: Record<string, unknown>): Promise<void> {
    return super.close(options);
  }

  /**
   * Native form handler for ApplicationV2.
   * Processes form data submitted via submitOnChange and converts field names
   * to actor.update() paths, handling keyed skill record paths like "skills.armor.rank".
   */
  static async #processFormData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): Promise<void> {
    const sheet = (this as unknown as Open00CharacterSheet);
    // FormDataExtended may return nested objects. Actor.update requires dot-path
    // keys so a single stat edit does not replace the whole system object.
    const updates = flattenFormData(formData.object);

    if (Object.keys(updates).length > 0) {
      await sheet.actor.update(updates);
    }
  }

  override async _onDropItem(
    event: DragEvent,
    data: Record<string, unknown>,
  ): Promise<Item[] | false> {
    const item = await (Item as unknown as { fromDropData(data: Record<string, unknown>): Promise<Item> }).fromDropData(data);
    if (!item) return super._onDropItem(event, data);

    const itemType = item.type;

    // Replace the existing identity choice. Derived effects are read directly
    // from owned Items during Actor data preparation.
    if (itemType === 'kin' || itemType === 'culture' || itemType === 'vocation') {
      const existing = this.actor.items.find((i: Item) => i.type === itemType);
      if (existing) await existing.delete();

      return super._onDropItem(event, data);
    }

    return super._onDropItem(event, data);
  }

  override async _prepareContext(
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<Record<string, unknown>> {
    const baseContext = await super._prepareContext(options);
    const system = this.actor.system as Record<string, unknown>;
    const identityItem = (type: string) => this.actor.items.find((item: Item) => item.type === type);
    const kin = identityItem('kin');
    const culture = identityItem('culture');
    const vocation = identityItem('vocation');
    const drivePoints = system['drivePoints'] as { value?: number; max?: number } | undefined;
    const driveValue = asNumber(drivePoints?.value);
    const driveMax = Math.max(0, asNumber(drivePoints?.max, 5));

    return {
      ...baseContext,
      actor: this.actor,
      system,
      source: (this.actor as unknown as { system: { _source: Record<string, unknown> } }).system._source ?? system,
      name: this.actor.name,
      img: this.actor.img,
      experience: system['experience'],
      level: asNumber(system['level']),
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
        const skillsRecord = (system['skills'] as Record<string, { rank: number; spec: number }>) ?? {};
        const dataModel = (this.actor as unknown as { system: { derivedSkills?: Record<string, DerivedSkillData> } }).system;
        const derivedSkills = dataModel.derivedSkills ?? {};
        const stats = (system['stats'] as Record<string, { base: number; kin: number; spec: number }>) ?? {};
        const skillDetails = SKILL_ID_LIST.map((id, index) => {
          const def = DEFAULT_SKILL_DEFINITIONS[id];
          const persisted = skillsRecord[id] ?? { rank: 0, spec: 0 };
          const derived = derivedSkills[id];
          const statBase = asNumber(stats[def.statKey]?.base);
          const statKin = asNumber(stats[def.statKey]?.kin);
          const statSpec = asNumber(stats[def.statKey]?.spec);
          const statBonus = statBase + statSpec;
          const rankBonus = computeRankBonus(asNumber(persisted.rank));
          const vocation = asNumber(derived?.vocation);
          const kin = asNumber(derived?.kin);
          const spec = asNumber(persisted.spec);
          const item = asNumber(derived?.item);
          const totalBonus = derived?.total
            ?? statBonus + rankBonus + vocation + kin + spec + item;
          return {
            id,
            name: def.name,
            category: def.category,
            statKey: def.statKey,
            rank: persisted.rank,
            vocation,
            kin,
            spec,
            item,
            index,
            statLabel: STAT_NAMES[def.statKey] ?? def.statKey,
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

        const vocationItem = this.actor.items.find((item: Item) => item.type === 'vocation');
        const vocationDevelopmentPoints = vocationItem
          ? ((vocationItem.system as Record<string, unknown>)['developmentPoints'] as Record<string, unknown> | undefined)
          : undefined;
        const skillCategories = SKILL_CATEGORIES.map((category) => ({
          id: category,
          label: `OPEN00.Skills.Categories.${category}`,
          developmentPoints: asNumber(vocationDevelopmentPoints?.[category.toLowerCase()]),
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

        // Build save rolls with full breakdown (Stat, Kin, Spec, Lvl, Kin Bonus, Total)
        const level = asNumber(system['level']);
        const saveRollBonus = asNumber(system['saveRollBonus']);
        const kinItem = this.actor.items.find((item: Item) => item.type === 'kin');
        const kinData = kinItem ? (kinItem.system as Record<string, unknown>) : null;
        const kinTsr = asNumber(kinData?.['tsr']);
        const kinWsr = asNumber(kinData?.['wsr']);

        const saveRolls = [
          {
            name: 'OPEN00.Saves.Toughness',
            stat: 'FOR',
            statBase: asNumber(stats['for']?.base),
            kin: asNumber(stats['for']?.kin),
            spec: asNumber(stats['for']?.spec),
            level: saveRollBonus,
            kinBonus: kinTsr,
            total: asNumber(system['tsr']),
          },
          {
            name: 'OPEN00.Saves.Willpower',
            stat: 'WSD',
            statBase: asNumber(stats['wsd']?.base),
            kin: asNumber(stats['wsd']?.kin),
            spec: asNumber(stats['wsd']?.spec),
            level: saveRollBonus,
            kinBonus: kinWsr,
            total: asNumber(system['wsr']),
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

        return {
          ...context,
          defense: (this.actor as unknown as { system: { derivedDefense?: number } }).system.derivedDefense ?? 0,
          hp: system['hp'],
          hpMax: asNumber(system['hpMax']),
          encumbrance: (this.actor as unknown as { system: { derivedEncumbrance?: string } }).system.derivedEncumbrance ?? 'Unencumbered',
          encumbranceLabel: `OPEN00.Equipment.${(this.actor as unknown as { system: { derivedEncumbrance?: string } }).system.derivedEncumbrance ?? 'Unencumbered'}`,
          weapons,
          armor,
          conditions: [],
        };
      }

      case 'magic': {
        const stats = (system['stats'] as Record<string, { base: number; kin: number; spec: number }>) ?? {};
        const skillsRecord = (system['skills'] as Record<string, { rank: number; spec: number }>) ?? {};
        const magicDerivedSkills = ((this.actor as unknown as { system: { derivedSkills?: Record<string, DerivedSkillData> } }).system).derivedSkills ?? {};
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

            // Find the matching skill entry by lore name → canonical id lookup
            // Spell lores may not map to a canonical skill; use the keyed record if found
            const loreId = item.name?.toLowerCase().replace(/\s+/g, '-') as SkillId | undefined;
            const skillPersisted = loreId ? skillsRecord[loreId] : undefined;
            const skillDerived = loreId ? magicDerivedSkills[loreId] : undefined;
            const ranks = asNumber(skillPersisted?.rank);

            // Compute casting bonus from the lore's governing stat
            const stat = stats[statKey];
            const statBonus = stat
              ? asNumber(stat.base) + asNumber(stat.spec)
              : 0;
            const rankBonus = skillPersisted ? computeRankBonus(ranks) : 0;
            const vocation = asNumber(skillDerived?.vocation);
            const kin = skillDerived ? asNumber(skillDerived.kin) : asNumber(stat?.kin);
            const spec = asNumber(skillPersisted?.spec);
            const itemMod = asNumber(skillDerived?.item);
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

        const mpMax = (this.actor as unknown as { system: { mpMax?: number } }).system.mpMax ?? 0;
        return { ...context, mp: system['mp'], mpMax, level, spellLores };
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
        const stats = (system['stats'] as Record<string, { base: number; kin: number; spec: number }>) ?? {};
        const brawnStat = stats['brn'];
        const brawn = brawnStat
          ? asNumber(brawnStat.base) + asNumber(brawnStat.kin) + asNumber(brawnStat.spec)
          : 0;
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
        const enrichOptions = { async: true, relativeTo: this.actor };
        return {
          ...context,
          biography: system['biography'] ?? '',
          appearance: system['appearance'] ?? '',
          backgroundNotes: system['backgroundNotes'] ?? '',
          enrichedBiography: await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(system['biography'] ?? ''), enrichOptions),
          enrichedAppearance: await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(system['appearance'] ?? ''), enrichOptions),
          enrichedBackgroundNotes: await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(system['backgroundNotes'] ?? ''), enrichOptions),
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

  static #rollStat(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const statKey = target.dataset.statKey ?? '';
    const statBonus = Number(target.dataset.statBonus);
    if (!statKey || Number.isNaN(statBonus)) return;

    const statLabel = STAT_NAMES[statKey]
      ? game.i18n.localize(STAT_NAMES[statKey])
      : statKey.toUpperCase();

    const rollResult = computeOpenEndedRoll(() => Math.floor(Math.random() * 100) + 1);
    const totalWithBonus = rollResult.total + statBonus;
    const outcome = resolveAction(totalWithBonus);

    const chatContent = `
      <div class="open00-roll-result">
        <header class="roll-header">
          <strong>${escapeHTML(statLabel)}</strong>
          <span class="roll-category">${escapeHTML(game.i18n.localize('OPEN00.Overview.Stats'))}</span>
        </header>
        <div class="roll-formula">
          <span>${escapeHTML(formatRollDisplay(rollResult))}</span>
          <span>${escapeHTML(statLabel)} ${formatModifier(statBonus)}</span>
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

  static #rollSave(event: Event, target: HTMLElement): void {
    event.preventDefault();
    const sheet = this as unknown as Open00CharacterSheet;
    const row = target.closest<HTMLElement>('[data-save-name]') ?? target;
    const saveName = row.dataset.saveName ?? '';
    const saveBonus = Number(row.dataset.saveBonus);
    if (!saveName || Number.isNaN(saveBonus)) return;

    const saveLabel = game.i18n.localize(saveName);

    const rollResult = computeOpenEndedRoll(() => Math.floor(Math.random() * 100) + 1);
    const totalWithBonus = rollResult.total + saveBonus;
    const outcome = resolveAction(totalWithBonus);

    const chatContent = `
      <div class="open00-roll-result">
        <header class="roll-header">
          <strong>${escapeHTML(saveLabel)}</strong>
          <span class="roll-category">${escapeHTML(game.i18n.localize('OPEN00.Overview.SaveRolls'))}</span>
        </header>
        <div class="roll-formula">
          <span>${escapeHTML(formatRollDisplay(rollResult))}</span>
          <span>${escapeHTML(saveLabel)} ${formatModifier(saveBonus)}</span>
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
    if (!item) return;

    const type = item.type;

    // Derived identity effects disappear automatically during Actor data
    // preparation; seeded player-owned values intentionally remain.
    if (type === 'kin' || type === 'culture' || type === 'vocation') {
      void sheet.#removeIdentityItem(item, type);
      return;
    }

    void item.delete();
  }

  async #removeIdentityItem(item: Item, _type: string): Promise<void> {
    await item.delete();
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
