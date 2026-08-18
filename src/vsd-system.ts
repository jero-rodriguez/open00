// Actor data models
import { CharacterDataModel } from './models/actor/character.js';
import { NpcDataModel } from './models/actor/npc.js';

// Item data models
import { WeaponDataModel } from './models/item/weapon.js';
import { ArmorDataModel } from './models/item/armor.js';
import { SpellDataModel } from './models/item/spell.js';
import { EquipmentDataModel } from './models/item/equipment.js';
import { KinDataModel } from './models/item/kin.js';
import { CultureDataModel } from './models/item/culture.js';
import { VocationDataModel } from './models/item/vocation.js';
import { KinTraitDataModel } from './models/item/kin-trait.js';
import { ItemOfPowerDataModel } from './models/item/item-of-power.js';

// Sheets
import { VsdCharacterSheet } from './sheets/character-sheet.js';

Hooks.once('init', () => {
  // Register Actor data models
  CONFIG.Actor.dataModels.character = CharacterDataModel;
  CONFIG.Actor.dataModels.npc = NpcDataModel;

  // Register Item data models
  CONFIG.Item.dataModels.weapon = WeaponDataModel;
  CONFIG.Item.dataModels.armor = ArmorDataModel;
  CONFIG.Item.dataModels.spell = SpellDataModel;
  CONFIG.Item.dataModels.equipment = EquipmentDataModel;
  CONFIG.Item.dataModels.kin = KinDataModel;
  CONFIG.Item.dataModels.culture = CultureDataModel;
  CONFIG.Item.dataModels.vocation = VocationDataModel;
  CONFIG.Item.dataModels.trait = KinTraitDataModel;
  CONFIG.Item.dataModels.itemOfPower = ItemOfPowerDataModel;

  // Register Actor sheets
  Actors.registerSheet('vsd', VsdCharacterSheet, { types: ['character'], makeDefault: true });
});
