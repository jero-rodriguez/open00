/**
 * ApplicationV2 polymorphic item sheet for Open 00.
 *
 * Single sheet class that dispatches its body template based on the item's type.
 * Common header (name, img) is shared; type-specific fields are rendered below.
 * Auto-save on field commit follows the same debounced pattern as actor sheets.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9
 */

import { createAutoSaveHandler, attachAutoSaveToForm } from './auto-save.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const ITEM_TEMPLATE_ROOT = `systems/${game.system?.id ?? 'open00'}/templates/items`;

/** Map registered item type to its body template filename */
const TYPE_TEMPLATES: Record<string, string> = {
  weapon: 'item-weapon.hbs',
  armor: 'item-armor.hbs',
  spell: 'item-spell.hbs',
  equipment: 'item-equipment.hbs',
  kin: 'item-kin.hbs',
  culture: 'item-culture.hbs',
  vocation: 'item-vocation.hbs',
  trait: 'item-trait.hbs',
  itemOfPower: 'item-of-power.hbs',
  background: 'item-background.hbs',
};

export class Open00ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static override DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration = {
    classes: ['open00', 'sheet', 'item'],
    tag: 'form',
    position: { width: 560, height: 480 },
    window: { resizable: true },
  };

  static override PARTS: Record<string, foundry.applications.api.ApplicationPartDefinition> = {
    body: {
      template: `${ITEM_TEMPLATE_ROOT}/item-sheet.hbs`,
    },
  };

  #autoSaveHandler: ReturnType<typeof createAutoSaveHandler> | null = null;
  #detachAutoSave: (() => void) | null = null;

  override async _prepareContext(
    options: foundry.applications.api.ApplicationRenderOptions,
  ): Promise<Record<string, unknown>> {
    const system = this.item.system as Record<string, unknown>;
    const itemType = this.item.type;

    // Resolve the body template path for this item type
    const bodyTemplate = TYPE_TEMPLATES[itemType]
      ? `${ITEM_TEMPLATE_ROOT}/${TYPE_TEMPLATES[itemType]}`
      : '';

    return {
      item: this.item,
      system,
      name: this.item.name,
      img: this.item.img,
      itemType,
      bodyTemplate,
      // Type flags for conditional rendering
      isWeapon: itemType === 'weapon',
      isArmor: itemType === 'armor',
      isSpell: itemType === 'spell',
      isEquipment: itemType === 'equipment',
      isKin: itemType === 'kin',
      isCulture: itemType === 'culture',
      isVocation: itemType === 'vocation',
      isTrait: itemType === 'trait',
      isItemOfPower: itemType === 'itemOfPower',
      isBackground: itemType === 'background',
      options,
    };
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
