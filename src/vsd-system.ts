/**
 * VsD System — Entry point for the Against the Darkmaster game system.
 *
 * Registers Data Models, Document sub-types, and Actor sheets
 * following the official Foundry VTT system development guide.
 *
 * Reference: https://foundryvtt.com/article/system-development/
 */

// Actor data models
import { CharacterDataModel } from './module/models/actor/character.js';
import { NpcDataModel } from './module/models/actor/npc.js';

// Item data models
import { WeaponDataModel } from './module/models/item/weapon.js';
import { ArmorDataModel } from './module/models/item/armor.js';
import { SpellDataModel } from './module/models/item/spell.js';
import { EquipmentDataModel } from './module/models/item/equipment.js';
import { KinDataModel } from './module/models/item/kin.js';
import { CultureDataModel } from './module/models/item/culture.js';
import { VocationDataModel } from './module/models/item/vocation.js';
import { KinTraitDataModel } from './module/models/item/kin-trait.js';
import { ItemOfPowerDataModel } from './module/models/item/item-of-power.js';
import { BackgroundDataModel } from './module/models/item/background.js';

// Sheets
import { VsdCharacterSheet } from './module/sheets/character-sheet.js';

Hooks.once('init', () => {
  // Configure System Data Models
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel,
    npc: NpcDataModel,
  };

  CONFIG.Item.dataModels = {
    weapon: WeaponDataModel,
    armor: ArmorDataModel,
    spell: SpellDataModel,
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
      value: ['drivePoints.current'],
    },
    npc: {
      bar: ['hp'],
      value: ['level'],
    },
  };

  // Register Actor sheets
  Actors.registerSheet('vsd', VsdCharacterSheet, {
    types: ['character'],
    makeDefault: true,
  });
});
