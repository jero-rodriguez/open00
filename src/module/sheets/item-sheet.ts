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
  spellLore: ['details', 'description'],
  kin: ['details', 'description'],
  culture: ['details', 'description'],
  vocation: ['details', 'description'],
  trait: ['details', 'description'],
  background: ['details', 'description'],
};

/** All possible tab definitions */
const ALL_TABS: SheetTabDefinition[] = [
  { tab: 'details', label: 'OPEN00.ItemTabs.Details' },
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
  };

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

  override render(
    options: boolean | foundry.applications.api.ApplicationRenderOptions = {},
    legacyOptions: foundry.applications.api.ApplicationRenderOptions = {},
  ): Promise<unknown> {
    const parts = this.#getVisibleParts();
    if (typeof options === 'boolean') {
      return super.render(options, { ...legacyOptions, parts });
    }
    return super.render({ ...options, parts });
  }

  override async _prepareContext(
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<Record<string, unknown>> {
    const system = this.item.system as Record<string, unknown>;
    const itemType = this.item.type;

    return {
      item: this.item,
      system,
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
    return tab ? { ...context, tab } : { ...context };
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
  }

  async close(options?: Record<string, unknown>): Promise<void> {
    this.#detachAutoSave?.();
    this.#detachAutoSave = null;
    this.#autoSaveHandler?.cleanup();
    this.#autoSaveHandler = null;
    return super.close(options);
  }
}
