/**
 * Open 00 System — Entry point for the Open 00 game system.
 *
 * Registers Data Models, Document sub-types, and Actor sheets
 * following the official Foundry VTT system development guide.
 *
 * Reference: https://foundryvtt.com/article/system-development/
 */

// Document subclasses
import { Open00Actor } from './module/documents/open00-actor.js';
import { Open00Item } from './module/documents/open00-item.js';

// Actor data models
import { CharacterDataModel } from './module/models/actor/character.js';
import { NpcDataModel } from './module/models/actor/npc.js';

// Item data models
import { WeaponDataModel } from './module/models/item/weapon.js';
import { ArmorDataModel } from './module/models/item/armor.js';
import { SpellDataModel } from './module/models/item/spell.js';
import { SpellLoreDataModel } from './module/models/item/spell-lore.js';
import { EquipmentDataModel } from './module/models/item/equipment.js';
import { KinDataModel } from './module/models/item/kin.js';
import { CultureDataModel } from './module/models/item/culture.js';
import { VocationDataModel } from './module/models/item/vocation.js';
import { KinTraitDataModel } from './module/models/item/kin-trait.js';
import { ItemOfPowerDataModel } from './module/models/item/item-of-power.js';
import { BackgroundDataModel } from './module/models/item/background.js';

// Sheets
import { Open00CharacterSheet } from './module/sheets/character-sheet.js';
import { Open00NpcSheet } from './module/sheets/npc-sheet.js';
import { Open00ItemSheet } from './module/sheets/item-sheet.js';

Hooks.once('init', () => {
  // Register custom document classes
  CONFIG.Actor.documentClass = Open00Actor as any;
  CONFIG.Item.documentClass = Open00Item as any;

  // Configure System Data Models
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel,
    npc: NpcDataModel,
  };

  CONFIG.Item.dataModels = {
    weapon: WeaponDataModel,
    armor: ArmorDataModel,
    spell: SpellDataModel,
    spellLore: SpellLoreDataModel,
    equipment: EquipmentDataModel,
    kin: KinDataModel,
    culture: CultureDataModel,
    vocation: VocationDataModel,
    trait: KinTraitDataModel,
    itemOfPower: ItemOfPowerDataModel,
    background: BackgroundDataModel,
  };

  // Configure trackable attributes
  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ['hp', 'mp'],
      value: ['drivePoints.value'],
    },
    npc: {
      bar: [],
      value: ['hp', 'level'],
    },
  };

  // Register Actor sheets
  foundry.documents.collections.Actors.registerSheet('open00', Open00CharacterSheet, {
    types: ['character'],
    makeDefault: true,
  });

  foundry.documents.collections.Actors.registerSheet('open00', Open00NpcSheet, {
    types: ['npc'],
    makeDefault: true,
  });

  // Register Item sheets
  foundry.documents.collections.Items.registerSheet('open00', Open00ItemSheet, {
    makeDefault: true,
  });
});
