/**
 * VsdCharacterSheet — ApplicationV2 sheet for the VsD Player Character actor type.
 *
 * Six tabs: Overview, Skills, Combat, Magic, Equipment, Biography.
 * Uses HandlebarsApplicationMixin for template rendering.
 *
 * Requirements: 8.1, 8.11
 */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class VsdCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static override DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration = {
    classes: ['vsd', 'sheet', 'actor', 'character'],
    position: { width: 720, height: 680 },
    window: { resizable: true },
    actions: {},
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
      case 'skills':
        return {
          ...context,
          tab: 'skills',
          skills: system['skills'],
        };
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
}
