/**
 * Foundry VTT hook registrations for the VsD system.
 *
 * Registers all data models, sheet classes, combat document classes,
 * and system configuration during the 'init' hook. Post-initialization
 * work (template preloading, socket listeners) runs in the 'ready' hook.
 */

/**
 * Register the 'init' hook — runs once when Foundry first loads the system.
 *
 * Responsibilities:
 * - Register TypeDataModel classes for Actor and Item subtypes
 * - Register ApplicationV2 sheet classes
 * - Register Combat and Combatant document class overrides
 * - Configure trackable attributes for token bars
 * - Set up system-level configuration constants
 */
Hooks.once("init", () => {
  console.log("VsD | Initializing Against the Darkmaster system");

  // Configure trackable attributes for token HP bars
  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["hp"],
      value: ["drive", "wealthLevel", "experience"],
    },
    npc: {
      bar: ["hp"],
      value: ["level"],
    },
  };

  // TODO: Register TypeDataModel classes
  // CONFIG.Actor.dataModels.character = CharacterData;
  // CONFIG.Actor.dataModels.npc = NpcData;
  // CONFIG.Item.dataModels.weapon = WeaponData;
  // CONFIG.Item.dataModels.armor = ArmorData;
  // CONFIG.Item.dataModels.spell = SpellData;
  // CONFIG.Item.dataModels.equipment = EquipmentData;
  // CONFIG.Item.dataModels.kin = KinData;
  // CONFIG.Item.dataModels.culture = CultureData;
  // CONFIG.Item.dataModels.vocation = VocationData;
  // CONFIG.Item.dataModels.trait = TraitData;

  // TODO: Register sheet classes
  // DocumentSheetConfig.registerSheet(Actor, "vsd", VsdCharacterSheet, { ... });
  // DocumentSheetConfig.registerSheet(Actor, "vsd", VsdNpcSheet, { ... });
  // DocumentSheetConfig.registerSheet(Item, "vsd", VsdItemSheet, { ... });

  // TODO: Register combat document classes
  // CONFIG.Combat.documentClass = VsdCombat;
  // CONFIG.Combatant.documentClass = VsdCombatant;
});

/**
 * Register the 'ready' hook — runs once after all systems and modules are loaded.
 *
 * Responsibilities:
 * - Preload Handlebars templates
 * - Register socket listeners (if needed)
 * - Any post-initialization setup
 */
Hooks.once("ready", () => {
  console.log("VsD | System ready");

  // TODO: Preload Handlebars templates
  // loadTemplates([...]);
});
