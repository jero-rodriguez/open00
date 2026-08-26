# Character Sheet Specification (Modified)

## Purpose

Specifies that sheets become presentation-only (no computation or persistence of derived state) and defines Foundry v14 compliance requirements for trackable attributes, localization, ArrayField initialization, and system.json correctness.

## Requirements

### Requirement: Presentation-Only Sheets

Character and NPC sheets MUST NOT compute derived state. All derivation logic MUST reside in document class `prepareDerivedData`. Sheets read and display already-computed values from the Actor's derived data.

Source: proposal §Capabilities ("Sheet becomes presentation-only; no longer computes or persists derived state").

#### Scenario: Sheet renders derived HP

- GIVEN a Character Actor whose `prepareDerivedData` computed `hp.max = 85`
- WHEN the character sheet renders
- THEN it MUST display `85` as max HP without recalculating

### Requirement: Trackable Attributes Resolution

`CONFIG.Actor.trackableAttributes` MUST point to real schema paths. For characters: `hp` (bar1) and `mp` (bar2). The current `drivePoints.current` path is invalid (schema uses `drivePoints.value`). For NPCs: `hp` only (NPC schema has no `mp`).

Source: exploration §FOUNDRY v14 GAPS ("trackableAttributes value:['drivePoints.current'] — schema has drivePoints.value").

#### Scenario: Token bar resolves

- GIVEN a Character Actor token
- WHEN the token renders its resource bars
- THEN bar1 MUST resolve to `system.hp.value / system.hp.max`
- AND bar2 MUST resolve to `system.mp.value / system.mp.max`

### Requirement: Localization Compliance

The system MUST use `LOCALIZATION_PREFIXES` for automatic template localization. All ~190 hardcoded strings in templates MUST be extracted to `en.json` and `es.json` with matching keys. Missing keys MUST be added: `es.json` → `OPEN00.Saves.KinBonus`; both files → `TYPES.Item.spellLore`.

Source: exploration §FOUNDRY v14 GAPS; scope-decisions §DECISIONS ("keep en/es at parity").

#### Scenario: No hardcoded strings in templates

- GIVEN any `.hbs` template file
- WHEN inspected for user-visible text
- THEN it MUST contain only localization helper calls (e.g., `{{localize "OPEN00...."}}`) for all UI text

### Requirement: ArrayField Initialization

ArrayField `initial` values (e.g., `createDefaultSkills()`) MUST be functions, not shared object references. Each document instance MUST receive its own independent array copy.

Source: exploration §FOUNDRY v14 GAPS ("ArrayField initial: createDefaultSkills() evaluated ONCE at class-definition time, shared across all documents").

#### Scenario: Independent skill arrays

- GIVEN two Character Actors created in the same session
- WHEN one Actor's skills array is modified
- THEN the other Actor's skills array MUST NOT be affected

### Requirement: System.json Version Field

`system.json` MUST include a `version` field at build time. Local dev builds MUST have a valid version string (not empty/undefined).

Source: exploration §FOUNDRY v14 GAPS ("system.json has NO version field").

#### Scenario: Local build has version

- GIVEN a local development build
- WHEN Foundry loads the system
- THEN `game.system.version` MUST be a non-empty semver-compatible string

### Requirement: NPC Lightweight Derivation

NPC Actors MUST derive only the fields defined in vsd-bestiary.md: Level, MR, AT, DEF, TSR, WSR, HPs, CT, Attacks, Skills, Abilities. No full character-grade derivation (no per-skill bonus, no advancement, no seeded fields).

Source: scope-decisions §DECISIONS ("derive only the fields vsd-bestiary.md defines"); vsd-bestiary.md §Creature Stat Block Structure.

#### Scenario: NPC has no skill rank derivation

- GIVEN an NPC Actor
- WHEN `prepareDerivedData` runs
- THEN no per-skill rank bonus or vocational bonus MUST be computed
- AND the NPC MUST use its directly-entered stat block values
