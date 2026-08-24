/**
 * ApplicationV2 polymorphic item sheet for Open 00.
 *
 * Multi-tab layout dispatching type-specific content per tab.
 * Common header (name, img) is shared; tabs show Details, Qualities,
 * Commerce, and Description based on item type.
 * Auto-save on field commit follows the same debounced pattern as actor sheets.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9
 */

import { createAutoSaveHandler, attachAutoSaveToForm } from './auto-save.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const ITEM_TEMPLATE_ROOT = `systems/${game.system?.id ?? 'open00'}/templates/items`;

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

export class Open00ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static override DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration = {
    classes: ['open00', 'sheet', 'item'],
    tag: 'form',
    position: { width: 560, height: 520 },
    window: { resizable: true },
    form: { submitOnChange: true },
  };

  /** Wider sheets for types with large tables */
  static WIDE_TYPES: Set<string> = new Set(['spellLore']);

  override render(
    options: boolean | foundry.applications.api.ApplicationRenderOptions = {},
    legacyOptions: foundry.applications.api.ApplicationRenderOptions = {},
  ): Promise<unknown> {
    if ((this.constructor as typeof Open00ItemSheet).WIDE_TYPES.has(this.item.type)) {
      this.position.width = 732;
    }
    const parts = this.#getVisibleParts();
    if (typeof options === 'boolean') {
      return super.render(options, { ...legacyOptions, parts });
    }
    return super.render({ ...options, parts });
  }

  static override PARTS: Record<string, foundry.applications.api.ApplicationPartDefinition> = {
    header: {
      template: `${ITEM_TEMPLATE_ROOT}/item-header.hbs`,
    },
    tabs: {
      id: 'tabs',
      template: `${ITEM_TEMPLATE_ROOT}/item-tabs.hbs`,
    },
    details: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ITEM_TEMPLATE_ROOT}/item-details.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    qualities: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ITEM_TEMPLATE_ROOT}/item-qualities.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    commerce: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ITEM_TEMPLATE_ROOT}/item-commerce.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    description: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ITEM_TEMPLATE_ROOT}/item-description.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
    spells: {
      container: { classes: ['tab-body'], id: 'tabs' },
      template: `${ITEM_TEMPLATE_ROOT}/item-spells.hbs`,
      scrollable: ['.open00-tab-scroll'],
    },
  };

  override tabGroups: Record<string, string> = { primary: 'details' };

  #autoSaveHandler: ReturnType<typeof createAutoSaveHandler> | null = null;
  #detachAutoSave: (() => void) | null = null;

  /** Determine which PARTS to render based on item type */
  #getVisibleParts(): string[] {
    const itemType = this.item.type;
    const tabParts = TYPE_TABS[itemType] ?? ['details', 'description'];
    return ['header', 'tabs', ...tabParts];
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
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<Record<string, unknown>> {
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
    context: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const tabs = (context['tabs'] as Record<string, SheetTab>) ?? {};
    const tab = tabs[partId];
    context = tab ? { ...context, tab } : { ...context };

    const system = (context['system'] as Record<string, unknown>) ?? {};
    const enrichOptions = { async: true, relativeTo: this.item };

    // Enrich editor content for each part that uses {{editor}}
    if (partId === 'description') {
      context['enrichedItemDescription'] = await TextEditor.enrichHTML(String(system['description'] ?? ''), enrichOptions);
      context['enrichedNotes'] = await TextEditor.enrichHTML(String(system['notes'] ?? ''), enrichOptions);
      context['enrichedPassionsGuidance'] = await TextEditor.enrichHTML(String(system['passionsGuidance'] ?? ''), enrichOptions);
    }

    if (partId === 'details' && context['isBackground']) {
      const minor = (system['minor'] as Record<string, unknown>) ?? {};
      const major = (system['major'] as Record<string, unknown>) ?? {};
      context['enrichedMinorRequirement'] = await TextEditor.enrichHTML(String(minor['requirement'] ?? ''), enrichOptions);
      context['enrichedMinorEffects'] = await TextEditor.enrichHTML(String(minor['effects'] ?? ''), enrichOptions);
      context['enrichedMajorRequirement'] = await TextEditor.enrichHTML(String(major['requirement'] ?? ''), enrichOptions);
      context['enrichedMajorEffects'] = await TextEditor.enrichHTML(String(major['effects'] ?? ''), enrichOptions);
    }

    if (partId === 'spells') {
      const spells = (system['spells'] as Array<Record<string, unknown>>) ?? [];
      const enrichedSpells = await Promise.all(
        spells.map(async (spell) => ({
          ...spell,
          enrichedSpellDescription: await TextEditor.enrichHTML(String(spell['description'] ?? ''), enrichOptions),
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

    return context;
  }

  override async _onRender(
    context: Record<string, unknown>,
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<void> {
    await super._onRender(context, options);

    this.#autoSaveHandler ??= createAutoSaveHandler(this.item as unknown as Actor, {
      debounceMs: 500,
      onError: (error: Error) => console.error('Open00ItemSheet autosave failed:', error),
    });

    this.#detachAutoSave?.();
    this.#detachAutoSave = this.form
      ? attachAutoSaveToForm(this.form, this.#autoSaveHandler)
      : null;

    // Enable drag-and-drop on spellLore sheets for receiving spell items
    if (this.item.type === 'spellLore') {
      this.#setupSpellLoreDropZone();
    }
  }

  /** Set up drag-and-drop zone for receiving spell Items on a SpellLore sheet. */
  #setupSpellLoreDropZone(): void {
    const el = this.element;
    if (!el) return;

    el.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });

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
    });

    // Wire up remove-spell buttons
    el.querySelectorAll<HTMLElement>('[data-action="removeSpell"]').forEach((button: HTMLElement) => {
      button.addEventListener('click', async (event: Event) => {
        const target = (event.currentTarget as HTMLElement);
        const index = Number(target.dataset['spellIndex']);
        if (Number.isNaN(index)) return;

        const currentSpells = [...(((this.item.system as Record<string, unknown>)['spells'] as unknown[]) ?? [])];
        currentSpells.splice(index, 1);
        await this.item.update({ 'system.spells': currentSpells });
      });
    });
  }

  async close(options?: Record<string, unknown>): Promise<void> {
    this.#detachAutoSave?.();
    this.#detachAutoSave = null;
    this.#autoSaveHandler?.cleanup();
    this.#autoSaveHandler = null;
    return super.close(options);
  }
}
