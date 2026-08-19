---
inclusion: fileMatch
fileMatchPattern: "src/**/*.ts"
---

# FoundryVTT System Development Guide

Reference material for developing the VsD game system for Foundry Virtual Tabletop v14.
Based on the official Foundry documentation and community guides.

Sources:
- [Introduction to System Development](https://foundryvtt.com/article/system-development/)
- [Introduction to System Data Models](https://foundryvtt.com/article/system-data-models/)
- [Community System Development Tutorial](https://github.com/foundry-vtt-community/wiki/blob/main/System-Development-Tutorial-Start-to-Finish.md)

## System File Structure

A Foundry system lives under `{userData}/Data/systems/{id}/`. The minimal structure:

```
{userData}/Data/systems/mysystem/
system.json
mysystem.mjs
module/
  data-models.mjs
  documents.mjs
styles/
  system-styles.css
packs/
  monsters/
  items/
lang/
  en.json
```

Only `system.json` is strictly required. All paths in the manifest are relative to the system root.

## system.json Manifest

Key fields:
- `id`: unique lowercase identifier, must match the folder name
- `title`: human-readable name shown in world creation
- `version`: semver string
- `compatibility`: object with `minimum`, `verified`, `maximum` (Foundry core version numbers)
- `esmodules`: array of ES module entry points (e.g. `["vsd-system.mjs"]`)
- `styles`: array of CSS files to include
- `languages`: array of `{lang, name, path}` objects
- `documentTypes`: declares Actor/Item sub-types so the server validates them
- `initiative`: dice formula for combat tracker (e.g. `"1d100"`)
- `grid`: `{distance, units}` for default scene grid
- `primaryTokenAttribute` / `secondaryTokenAttribute`: dot-path to schema objects with `value` and `max`
- `manifest`: stable URL to the latest system.json (for auto-update)
- `download`: URL to the release zip for installation

### documentTypes

Declares sub-types the server should accept. Optional `htmlFields` and `filePathFields` for sanitization:

```json
{
  "documentTypes": {
    "Actor": {
      "character": { "htmlFields": ["biography"] },
      "npc": {}
    },
    "Item": {
      "weapon": {},
      "spell": {}
    }
  }
}
```

## Data Models (TypeDataModel)

System data models define the schema for each document sub-type. They extend `foundry.abstract.TypeDataModel`.

### Defining a Schema

```javascript
const { NumberField, StringField, SchemaField, ArrayField, HTMLField } = foundry.data.fields;

class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      health: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      xp: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
    };
  }
}
```

### Registering Data Models

Done in the `init` hook:

```javascript
Hooks.once("init", () => {
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Item.dataModels.weapon = WeaponData;
});
```

### Data Preparation

Override `prepareBaseData()` (before ActiveEffects) or `prepareDerivedData()` (after ActiveEffects) to compute derived values:

```javascript
class CharacterData extends foundry.abstract.TypeDataModel {
  prepareDerivedData() {
    super.prepareDerivedData();
    this.health.value = Math.min(this.health.value, this.health.max);
    this.level = Math.floor(this.xp / 100);
  }
}
```

### Migrations

Override `static migrateData(source)` to transform legacy data before instantiation:

```javascript
static migrateData(source) {
  if ("oldField" in source) {
    source.newField = source.oldField * 5;
  }
  return super.migrateData(source);
}
```

### Enhancing Models

Add getters and methods for game logic:

```javascript
get dead() {
  return this.health.value <= 0;
}
```

Access the parent document via `this.parent`.

## Custom Document Implementations

Override Actor or Item to add system-wide logic:

```javascript
class SystemActor extends Actor {
  async applyDamage(damage) {
    damage = Math.round(Math.max(1, damage));
    const { value } = this.system.resources.health;
    await this.update({ "system.resources.health.value": value - damage });
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    const { health } = this.system.resources;
    health.value = Math.clamp(health.value, health.min, health.max);
  }
}
```

Register with:
```javascript
CONFIG.Actor.documentClass = SystemActor;
CONFIG.Item.documentClass = SystemItem;
```

## Token Trackable Attributes

Configure which schema paths can be used as Token bars/values:

```javascript
CONFIG.Actor.trackableAttributes = {
  character: {
    bar: ["health"],    // must have value + max
    value: ["xp"]      // any number
  }
};
```

## Entry Point Pattern

The system entry point (`esmodules` in manifest) imports everything and configures in `Hooks.once("init")`:

```javascript
import { HeroDataModel, VillainDataModel } from "./module/data-models.mjs";
import { SystemActor, SystemItem } from "./module/documents.mjs";

Hooks.once("init", () => {
  CONFIG.Actor.documentClass = SystemActor;
  CONFIG.Item.documentClass = SystemItem;

  CONFIG.Actor.dataModels = {
    hero: HeroDataModel,
    villain: VillainDataModel
  };

  CONFIG.Actor.trackableAttributes = {
    hero: { bar: ["resources.health"], value: ["progress"] }
  };
});
```

## Sheet Development (ApplicationV2)

Foundry v14 uses ApplicationV2 with HandlebarsApplicationMixin:

- Define `static DEFAULT_OPTIONS` for classes, position, window config, actions
- Define `static PARTS` mapping part IDs to template paths
- Override `_prepareContext()` for shared render data
- Override `_preparePartContext()` for per-tab/part data
- Use `tabGroups` for tab navigation
- Register sheets via `Actors.registerSheet(scope, SheetClass, { types, makeDefault })`

## Distribution

For release, zip the built system folder contents at root level (not nested in a subdirectory).
The release should include both the zip and `system.json` as separate assets.
The manifest URL should point to a stable location (e.g. raw file in main branch or latest release asset).

Content was rephrased for compliance with licensing restrictions.
