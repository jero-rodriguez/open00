/**
 * ApplicationV2 polymorphic item sheet for Open 00.
 *
 * Multi-tab layout dispatching type-specific content per tab.
 * Common header (name, img) is shared; tabs show Details, Qualities,
 * Commerce, and Description based on item type.
 * Native form handler persists via submitOnChange + _processFormData.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9
 */

import { DEFAULT_SKILL_DEFINITIONS, SKILL_ID_LIST } from '../data/skills.js';
import { getFormUpdates } from './form-data.js';
import type { DeepPartial } from 'fvtt-types/utils';

type ItemRenderContext = foundry.applications.sheets.ItemSheetV2.RenderContext
  & Record<string, unknown>;
type ItemRenderOptions = DeepPartial<foundry.applications.sheets.ItemSheetV2.RenderOptions>;
type PartRenderOptions = DeepPartial<foundry.applications.api.HandlebarsApplicationMixin.RenderOptions>;
const ITEM_TEMPLATE_ROOT = 'systems/open00/templates/items';

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

/** Which tab parts each item type renders (always includes header + tabs nav) */
const TYPE_TABS: Record<string, string[]> = {
  weapon: ['details', 'qualities', 'commerce', 'description'],
  armor: ['details', 'qualities', 'commerce', 'description'],
  equipment: ['details', 'commerce', 'description'],
  itemOfPower: ['details', 'qualities', 'commerce', 'description'],
  spell: ['details', 'description'],
  spellLore: ['details', 'spells', 'description'],
  kin: ['details', 'description'],
  culture: ['details', 'description'],
  vocation: ['details', 'description'],
  trait: ['details', 'description'],
  background: ['details', 'description'],
};

/** All possible tab definitions */
const ALL_TABS: SheetTabDefinition[] = [
  { tab: 'details', label: 'OPEN00.ItemTabs.Details' },
  { tab: 'spells', label: 'OPEN00.ItemTabs.Spells' },
  { tab: 'qualities', label: 'OPEN00.ItemTabs.Qualities' },
  { tab: 'commerce', label: 'OPEN00.ItemTabs.Commerce' },
  { tab: 'description', label: 'OPEN00.ItemTabs.Description' },
];

export class Open00ItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2<ItemRenderContext>,
) {
  static override DEFAULT_OPTIONS = {
    classes: ['open00', 'sheet', 'item'],
    tag: 'form',
    position: { width: 560, height: 520 },
    window: { resizable: true },
    form: { handler: Open00ItemSheet.#processFormData, submitOnChange: true },
    actions: {
      removeSpell: Open00ItemSheet.#removeSpell,
    },
  };

  /** Wider sheets for types with large tables */
  static WIDE_TYPES: Set<string> = new Set(['spellLore']);

  override render(
    options: boolean | ItemRenderOptions = {},
    legacyOptions: ItemRenderOptions = {},
  ): Promise<this> {
    if ((this.constructor as typeof Open00ItemSheet).WIDE_TYPES.has(this.item.type)) {
      this.position.width = 732;
    }
    if (typeof options === 'boolean') {
      return super.render(options, this.#withItemRenderParts(legacyOptions));
    }
    return super.render(this.#withItemRenderParts(options));
  }

  static override PARTS: Record<
    string,
    foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart
  > = {
    header: {
      template: `${ITEM_TEMPLATE_ROOT}/item-header.hbs`,
    },
    tabs: {
      id: 'tabs',
      template: `${ITEM_TEMPLATE_ROOT}/item-tabs.hbs`,
    },
    details: {
      classes: ['tab-body'],
      template: `${ITEM_TEMPLATE_ROOT}/item-details.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    qualities: {
      classes: ['tab-body'],
      template: `${ITEM_TEMPLATE_ROOT}/item-qualities.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    commerce: {
      classes: ['tab-body'],
      template: `${ITEM_TEMPLATE_ROOT}/item-commerce.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    description: {
      classes: ['tab-body'],
      template: `${ITEM_TEMPLATE_ROOT}/item-description.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    spells: {
      classes: ['tab-body'],
      template: `${ITEM_TEMPLATE_ROOT}/item-spells.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
  };

  override tabGroups: Record<string, string> = { primary: 'details' };

  #spellLoreListeners?: AbortController;

  /** Determine which PARTS to render based on item type */
  #getVisibleParts(): string[] {
    const itemType = this.item.type;
    const tabParts = TYPE_TABS[itemType] ?? ['details', 'description'];
    return ['header', 'tabs', ...tabParts];
  }

  #withItemRenderParts(
    options: ItemRenderOptions,
  ): ItemRenderOptions {
    if (options.parts) return options;

    // For data changes, re-render only header + active tab (partial render)
    const ctx = options.renderContext;
    if (ctx === 'updateItem' || ctx === 'updateActor'
      || ctx === 'createItem' || ctx === 'deleteItem') {
      const activeTab = this.tabGroups['primary'] ?? 'details';
      return { ...options, parts: ['header', activeTab] };
    }

    return { ...options, parts: this.#getVisibleParts() };
  }

  /** Build tab objects filtered by visible tabs for this item type */
  protected _getTabs(): Record<string, SheetTab> {
    const active = this.tabGroups['primary'];
    const visibleTabs = TYPE_TABS[this.item.type] ?? ['details', 'description'];
    return ALL_TABS
      .filter((def) => visibleTabs.includes(def.tab))
      .reduce<Record<string, SheetTab>>((tabs, { tab, label }) => {
        const isActive = active === tab;
        tabs[tab] = {
          id: tab,
          group: 'primary',
          label,
          active: isActive,
          cssClass: isActive ? 'active' : '',
        };
        return tabs;
      }, {});
  }

  override async _prepareContext(
    options: ItemRenderOptions & { isFirstRender: boolean },
  ): Promise<ItemRenderContext> {
    const baseContext = await super._prepareContext(options);
    const system = this.item.system as Record<string, unknown>;
    const itemType = this.item.type;

    return {
      ...baseContext,
      item: this.item,
      system,
      source: (this.item as unknown as { system: { _source: Record<string, unknown> } }).system._source ?? system,
      name: this.item.name,
      img: this.item.img,
      itemType,
      // Type flags for conditional rendering in templates
      isWeapon: itemType === 'weapon',
      isArmor: itemType === 'armor',
      isEquipment: itemType === 'equipment',
      isKin: itemType === 'kin',
      isCulture: itemType === 'culture',
      isVocation: itemType === 'vocation',
      isTrait: itemType === 'trait',
      isItemOfPower: itemType === 'itemOfPower',
      isBackground: itemType === 'background',
      isSpell: itemType === 'spell',
      isSpellLore: itemType === 'spellLore',
      tabs: this._getTabs(),
      options,
    };
  }

  override async _preparePartContext(
    partId: string,
    context: ItemRenderContext,
    _options: PartRenderOptions = {},
  ): Promise<ItemRenderContext> {
    const tabs = (context['tabs'] as Record<string, SheetTab>) ?? {};
    const tab = tabs[partId];
    context = tab ? { ...context, tab } : { ...context };

    const system = (context['system'] as Record<string, unknown>) ?? {};
    const enrichOptions = { relativeTo: this.item };

    // Enrich editor content for each part that uses {{editor}}
    if (partId === 'description') {
      context['enrichedItemDescription'] = await foundry.applications.ux.TextEditor.enrichHTML(String(system['description'] ?? ''), enrichOptions);
      context['enrichedNotes'] = await foundry.applications.ux.TextEditor.enrichHTML(String(system['notes'] ?? ''), enrichOptions);
      context['enrichedPassionsGuidance'] = await foundry.applications.ux.TextEditor.enrichHTML(String(system['passionsGuidance'] ?? ''), enrichOptions);
    }

    if (partId === 'details' && context['isBackground']) {
      const minor = (system['minor'] as Record<string, unknown>) ?? {};
      const major = (system['major'] as Record<string, unknown>) ?? {};
      context['enrichedMinorRequirement'] = await foundry.applications.ux.TextEditor.enrichHTML(String(minor['requirement'] ?? ''), enrichOptions);
      context['enrichedMinorEffects'] = await foundry.applications.ux.TextEditor.enrichHTML(String(minor['effects'] ?? ''), enrichOptions);
      context['enrichedMajorRequirement'] = await foundry.applications.ux.TextEditor.enrichHTML(String(major['requirement'] ?? ''), enrichOptions);
      context['enrichedMajorEffects'] = await foundry.applications.ux.TextEditor.enrichHTML(String(major['effects'] ?? ''), enrichOptions);
    }

    if (partId === 'spells') {
      const spells = (system['spells'] as Array<Record<string, unknown>>) ?? [];
      const enrichedSpells = await Promise.all(
        spells.map(async (spell) => ({
          ...spell,
          enrichedSpellDescription: await foundry.applications.ux.TextEditor.enrichHTML(String(spell['description'] ?? ''), enrichOptions),
        })),
      );
      context['system'] = { ...system, spells: enrichedSpells };
    }

    // Add armor zones flags for the details template
    if (partId === 'details' && context['isArmor']) {
      const zones = (system['zonesProtected'] as string[] | undefined) ?? [];
      context['zonesFlags'] = {
        Head: zones.includes('Head'),
        Face: zones.includes('Face'),
        Neck: zones.includes('Neck'),
        Torso: zones.includes('Torso'),
        Arms: zones.includes('Arms'),
        Forearms: zones.includes('Forearms'),
        Hands: zones.includes('Hands'),
        Legs: zones.includes('Legs'),
        LowerLegs: zones.includes('LowerLegs'),
        ShieldArm: zones.includes('ShieldArm'),
      };
    }

    // Build culture skill allocation data for the editable table
    if (partId === 'details' && context['isCulture']) {
      const existingAllocations = (system['skillRankAllocations'] as Array<{ skillName: string; ranks: number }>) ?? [];
      context['cultureSkillAllocations'] = SKILL_ID_LIST.map((id, index) => {
        const skill = DEFAULT_SKILL_DEFINITIONS[id];
        const match = existingAllocations.find((a) => a.skillName === skill.name);
        return {
          skillName: skill.name,
          ranks: match?.ranks ?? 0,
          index,
        };
      });
    }

    return context;
  }

  override async _onRender(
    context: DeepPartial<ItemRenderContext>,
    options: ItemRenderOptions,
  ): Promise<void> {
    await super._onRender(context, options);
    this.#spellLoreListeners?.abort();
    this.#spellLoreListeners = undefined;

    // Enable drag-and-drop on spellLore sheets for receiving spell items
    if (this.item.type === 'spellLore') {
      this.#setupSpellLoreDropZone();
    }
  }

  /** Set up drag-and-drop zone for receiving spell Items on a SpellLore sheet. */
  #setupSpellLoreDropZone(): void {
    const el = this.element;
    if (!el) return;
    const listeners = new AbortController();
    this.#spellLoreListeners = listeners;

    el.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    }, { signal: listeners.signal });

    el.addEventListener('drop', async (event: DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer?.getData('text/plain');
      if (!rawData) return;

      let dropData: { type?: string; uuid?: string };
      try {
        dropData = JSON.parse(rawData);
      } catch {
        return;
      }

      if (dropData.type !== 'Item' || !dropData.uuid) return;

      const droppedItem = await (fromUuid(dropData.uuid) as Promise<Item | null>);
      if (!droppedItem || droppedItem.type !== 'spell') return;

      const spellSystem = droppedItem.system as Record<string, unknown>;
      const currentSpells = ((this.item.system as Record<string, unknown>)['spells'] as unknown[]) ?? [];

      const newSpell = {
        name: droppedItem.name,
        weave: spellSystem['weave'] ?? 1,
        range: spellSystem['range'] ?? '',
        duration: spellSystem['duration'] ?? '',
        areaOfEffect: spellSystem['areaOfEffect'] ?? '',
        description: spellSystem['description'] ?? '',
        grantsSaveRoll: spellSystem['grantsSaveRoll'] ?? false,
        isInstantaneous: spellSystem['isInstantaneous'] ?? false,
        isAttackSpell: spellSystem['isAttackSpell'] ?? false,
        attackType: spellSystem['attackType'] ?? '',
        resonanceType: spellSystem['resonanceType'] ?? 'other',
        failureSeverity: spellSystem['failureSeverity'] ?? 10,
        warpingOptions: spellSystem['warpingOptions'] ?? [],
      };

      await this.item.update({ 'system.spells': [...currentSpells, newSpell] });
    }, { signal: listeners.signal });
  }

  static async #removeSpell(_event: Event, target: HTMLElement): Promise<void> {
    const sheet = this as unknown as Open00ItemSheet;
    const index = Number(target.dataset['spellIndex']);
    if (Number.isNaN(index)) return;

    const currentSpells = [...(((sheet.item.system as Record<string, unknown>)['spells'] as unknown[]) ?? [])];
    currentSpells.splice(index, 1);
    await sheet.item.update({ 'system.spells': currentSpells });
  }

  /**
   * Native form handler for ApplicationV2.
   * Processes form data submitted via submitOnChange and persists via item.update().
   */
  static async #processFormData(
    event: SubmitEvent | Event,
    _form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void> {
    const sheet = (this as unknown as Open00ItemSheet);
    const updates = getFormUpdates(event, formData.object);

    if (Object.keys(updates).length > 0) {
      await sheet.item.update(updates);
    }
  }

  override async close(
    options?: foundry.applications.api.ApplicationV2.ClosingOptions,
  ): Promise<this | void> {
    this.#spellLoreListeners?.abort();
    this.#spellLoreListeners = undefined;
    return super.close(options);
  }
}
