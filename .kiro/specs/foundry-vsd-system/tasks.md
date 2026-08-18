# Implementation Plan: FoundryVTT VsD System

## Overview

This plan implements the "Against the Darkmaster" (VsD) FoundryVTT v14 game system incrementally, starting with the build toolchain and pure engine functions, then layering on TypeDataModels, ApplicationV2 sheets, and integration features. Each task builds on previous steps so there is no orphaned code. Property-based tests validate core engine correctness as modules are implemented.

## Tasks

- [x] 1. Set up project structure, build toolchain, and test framework
  - [x] 1.1 Initialize project with Vite, TypeScript, and FoundryVTT plugin
    - Create `package.json` with dependencies: `vite`, `vite-plugin-foundryvtt`, `typescript`, `vitest`, `fast-check`
    - Create `tsconfig.json` with strict mode, ES module output, `src/` as root
    - Create `vite.config.ts` with `vite-plugin-foundryvtt` configuration, `src/` → `dist/` output
    - Create `vitest.config.ts` with `numRuns: 100` default for fast-check
    - Create directory structure: `src/engine/`, `src/models/actor/`, `src/models/item/`, `src/sheets/`, `src/data/attack-tables/`, `src/data/critical-tables/`, `src/data/`, `src/lang/`, `src/styles/`, `src/templates/actors/`, `src/templates/items/`, `tests/engine/`
    - Create `src/vsd-system.ts` entry point with placeholder `Hooks.once('init', ...)` registration
    - Create `src/system.json` with documentTypes for Actor (character, npc) and Item (weapon, armor, spell, equipment, kin, culture, vocation, trait, itemOfPower), esmodules, and languages array
    - _Requirements: 20.1, 20.2, 20.6, 21.5, 21.6_

  - [x] 1.2 Set up GitHub Actions CI pipeline
    - Create `.github/workflows/ci.yml` with steps: checkout, Node.js setup, install, TypeScript compile check, `vitest --run`
    - Create `.github/workflows/release.yml` with release-please action, build step, zip dist/ for release asset
    - Create `.releaserc` or `release-please-config.json` for conventional commit SemVer
    - _Requirements: 20.3, 20.4, 20.5, 20.7_

- [x] 2. Implement pure engine: Rank Bonus Calculator
  - [x] 2.1 Implement `src/engine/rank-bonus.ts`
    - Export `computeRankBonus(rank: number): number` implementing the piecewise formula
    - Rank 0 → 0; ranks 1–10 → rank × 5; ranks 11–20 → 50 + (rank − 10) × 2; ranks 21+ → 70 + (rank − 20) × 1
    - _Requirements: 1.6, 21.3_

  - [x] 2.2 Write property test for Rank Bonus (Property 1)
    - **Property 1: Rank Bonus Piecewise Formula**
    - **Validates: Requirements 1.6**
    - Create `tests/engine/rank-bonus.property.test.ts`
    - Test piecewise formula correctness and monotonicity for all non-negative integers

- [x] 3. Implement pure engine: Action Resolution Table
  - [x] 3.1 Implement `src/engine/action-resolution.ts`
    - Export `resolveAction(total: number): OutcomeBand` with the five outcome bands
    - Handle all integers including negatives
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 3.2 Write property test for Action Resolution (Property 2)
    - **Property 2: Action Resolution Table Completeness and Correctness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.7**
    - Create `tests/engine/action-resolution.property.test.ts`
    - Test boundary correctness and total coverage for any integer input

- [x] 4. Implement pure engine: Dice Engine
  - [x] 4.1 Implement `src/engine/dice-engine.ts`
    - Define `RollSource` type, `RollResult` interface
    - Export `computeOpenEndedRoll(source: RollSource): RollResult` with open-ended high (≥96), open-ended low (≤5), no explosion cap
    - Export `formatRollDisplay(result: RollResult): string` with arrow indicators for explosion rolls
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

  - [x] 4.2 Write property tests for Dice Engine (Properties 3 and 4)
    - **Property 3: Open-Ended Roll Computation**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - **Property 4: Roll Display Round-Trip**
    - **Validates: Requirements 4.6**
    - Create `tests/engine/dice-engine.property.test.ts`
    - Test roll computation correctness for deterministic sources and format round-trip consistency

- [x] 5. Implement pure engine: Spell Casting and Encumbrance
  - [x] 5.1 Implement `src/engine/spell-casting.ts`
    - Export `detectMagicalResonance(d100Value: number): boolean` — true when tens digit equals units digit
    - Export `computeSpellTotal(skillBonus: number, rollResult: number, casterLevel: number): number`
    - _Requirements: 6.1, 6.2, 6.7, 21.3_

  - [x] 5.2 Write property tests for Spell Casting (Properties 5 and 6)
    - **Property 5: Magical Resonance Detection**
    - **Validates: Requirements 6.2, 6.7**
    - **Property 6: Spell Casting Total Formula**
    - **Validates: Requirements 6.1**
    - Create `tests/engine/spell-casting.property.test.ts`

  - [x] 5.3 Implement `src/engine/encumbrance.ts`
    - Export `determineEncumbranceLevel(totalPoints: number, brawn: number): EncumbranceLevel`
    - Export `getEncumbrancePenalties(level: EncumbranceLevel): EncumbrancePenalties`
    - Export `computeTotalEncumbrance(items: {encumbrance: number, quantity: number}[]): number`
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.6_

  - [x] 5.4 Write property tests for Encumbrance (Properties 7 and 8)
    - **Property 7: Encumbrance Level Determination**
    - **Validates: Requirements 16.2, 16.3, 16.6**
    - **Property 8: Encumbrance Total Calculation**
    - **Validates: Requirements 16.1**
    - Create `tests/engine/encumbrance.property.test.ts`

- [x] 6. Implement pure engine: Combat Phases, Drive Points, Attack Tables, Advancement, Affinity, Travel
  - [x] 6.1 Implement `src/engine/combat-phases.ts`
    - Export phase array constant (9 phases in order)
    - Export `advancePhase(phase: number, round: number): {phase: number, round: number}`
    - Export `revertPhase(phase: number, round: number): {phase: number, round: number}`
    - Export `decrementConditions(conditions: {name: string, duration: number}[]): {name: string, duration: number}[]`
    - _Requirements: 7.1, 7.3, 7.4, 7.7, 7.8, 7.10_

  - [x] 6.2 Write property tests for Combat Phases (Properties 11, 12, 13)
    - **Property 11: Combat Phase Cycling**
    - **Validates: Requirements 7.1, 7.3, 7.4**
    - **Property 12: Phase Advance/Revert Round-Trip**
    - **Validates: Requirements 7.7**
    - **Property 13: Condition Duration Decrement**
    - **Validates: Requirements 7.10**
    - Create `tests/engine/combat-phases.property.test.ts`

  - [x] 6.3 Implement `src/engine/drive-points.ts`
    - Export `modifyDrivePoints(current: number, max: number, delta: number): number` — clamps to [0, max]
    - Export `invokePassion(current: number): {newCurrent: number, bonus: number} | {error: string}`
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.7_

  - [x] 6.4 Write property test for Drive Points (Property 10)
    - **Property 10: Drive Points Clamping Invariant**
    - **Validates: Requirements 1.8, 15.4, 15.7**
    - Create `tests/engine/drive-points.property.test.ts`

  - [x] 6.5 Implement `src/engine/attack-tables.ts`
    - Export `lookupAttackTable(rollTotal, tableId, armorCategory, tables): AttackResult | {error: string}`
    - Define `AttackResult`, `ArmorCategory`, `CriticalSeverity` types
    - _Requirements: 17.1, 17.2, 17.3, 17.6, 17.8_

  - [x] 6.6 Write property test for Attack Tables (Property 14)
    - **Property 14: Attack Table Lookup**
    - **Validates: Requirements 17.2, 17.6, 17.8**
    - Create `tests/engine/attack-tables.property.test.ts`

  - [x] 6.7 Implement `src/engine/advancement.ts`
    - Export `allocateDP(availableDP: number, cost: number, currentRank: number): {newRank: number, remainingDP: number} | {error: string}`
    - Export `checkLevelUp(totalXP: number, currentLevel: number, progressionTable: LevelEntry[]): boolean`
    - _Requirements: 12.1, 12.4, 12.5, 12.8_

  - [x] 6.8 Write property test for Advancement (Property 15)
    - **Property 15: DP Accounting Invariant**
    - **Validates: Requirements 11.7, 12.4, 12.5**
    - Create `tests/engine/advancement.property.test.ts`

  - [x] 6.9 Implement `src/engine/affinity.ts`
    - Export `getActiveBonuses(affinityLevel: number, isAttuned: boolean, bonuses: {threshold: number, effect: string}[]): {threshold: number, effect: string}[]`
    - _Requirements: 22.1, 22.2, 22.4, 22.5_

  - [x] 6.10 Write property test for Affinity (Property 16)
    - **Property 16: Affinity Bonus Activation**
    - **Validates: Requirements 22.2, 22.5**
    - Create `tests/engine/affinity.property.test.ts`

  - [x] 6.11 Implement `src/engine/travel.ts`
    - Export `computeTravelDuration(distanceMiles: number, pace: TravelPace, terrainModifier: number, partyMovementRate: number): number`
    - _Requirements: 18.1, 18.3_

  - [x] 6.12 Write property test for Travel (Property 17)
    - **Property 17: Travel Duration Computation**
    - **Validates: Requirements 18.3**
    - Create `tests/engine/travel.property.test.ts`

- [x] 7. Checkpoint - Pure engine complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement CharacterDataModel schema (stats and vitals)
  - [x] 8.1 Create `src/models/actor/character.ts` with base schema
    - Define `defineSchema()` with the 6 stats: BRN, SWI, FOR, WIT, WSD, BEA as `NumberField` (integer, min: -50, max: 100, initial: 0)
    - Add HP fields: `hp.value` (NumberField, min: 0, initial: 0), `hp.max` (NumberField, min: 0, initial: 0)
    - Add MP fields: `mp.value` (NumberField, min: 0, initial: 0), `mp.max` (NumberField, min: 0, initial: 0)
    - Add Drive Points: `drivePoints.value` (NumberField, min: 0, initial: 0), `drivePoints.max` (NumberField, min: 0, initial: 5)
    - Add Defense (NumberField, initial: 0), Encumbrance level (StringField, initial: 'unencumbered'), Wealth (NumberField, 0-5, initial: 0)
    - Export the class extending `foundry.abstract.TypeDataModel`
    - Verify with `tsc --noEmit`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 8.2 Add Passions, Heroic Path, and Experience fields to CharacterDataModel
    - Add Passions schema: `passions` as SchemaField with `nature` (StringField), `allegiance` (StringField), `motivation` (StringField)
    - Add `heroicPath` (StringField, initial: '')
    - Add Experience: `experience.total` (NumberField, min: 0, initial: 0), `experience.dp` (NumberField, min: 0, initial: 0)
    - Verify with `tsc --noEmit`
    - _Requirements: 1.7, 1.8, 1.9, 1.10_

  - [x] 8.3 Add Skills array schema to CharacterDataModel
    - Add `skills` as ArrayField of SchemaField entries with: `name` (StringField), `category` (StringField), `rank` (NumberField, min: 0, max: 30), `statKey` (StringField), `itemModifiers` (NumberField, initial: 0)
    - Verify with `tsc --noEmit`
    - _Requirements: 1.11, 1.12_

  - [x] 8.4 Implement `prepareDerivedData()` in CharacterDataModel
    - Import `computeRankBonus` from `src/engine/rank-bonus.ts`
    - For each skill, compute `totalBonus = statValue + computeRankBonus(rank) + itemModifiers`
    - Store computed totals on a derived `skillTotals` map
    - Verify with `tsc --noEmit`
    - _Requirements: 1.12, 1.13_

- [ ] 9. Implement NpcDataModel
  - [ ] 9.1 Create `src/models/actor/npc.ts` — NpcDataModel base fields
    - Define `defineSchema()` with `level` (NumberField, min: 1, initial: 1), `hp.value`, `hp.max` (NumberField), `defense` (NumberField), `initiativeModifier` (NumberField), `movementRate` (NumberField)
    - Add `resistances` as SchemaField: `stamina` (NumberField), `will` (NumberField), `magic` (NumberField)
    - Export the class extending `foundry.abstract.TypeDataModel`
    - Verify with `tsc --noEmit`
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 9.2 Add attacks, skills, and abilities arrays to NpcDataModel
    - Add `attacks` as ArrayField (max 10 entries) of SchemaField: `name`, `bonus` (NumberField), `tableId` (StringField), `damage` (NumberField)
    - Add `skillBonuses` as ArrayField (max 30 entries) of SchemaField: `name`, `bonus` (NumberField)
    - Add `specialAbilities` as ArrayField (max 20 entries) of SchemaField: `name`, `description`
    - Verify with `tsc --noEmit`
    - _Requirements: 2.4, 2.5, 2.6_

- [ ] 10. Implement Item TypeDataModels: Weapon and Armor
  - [ ] 10.1 Implement `src/models/item/weapon.ts` — WeaponDataModel
    - Define `defineSchema()` with `attackBonus` (NumberField), `attackTable` (StringField), `damage` (NumberField), `weaponGroup` (StringField), `reach` (StringField), `encumbrance` (NumberField), `fumbleRange` (NumberField, min: 1, max: 5, initial: 1)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.1_

  - [ ] 10.2 Implement `src/models/item/armor.ts` — ArmorDataModel
    - Define `defineSchema()` with `category` (StringField, choices: ['NA','LA','MA','HA'], initial: 'NA'), `defensePenalty` (NumberField, max: 0), `maneuverPenalty` (NumberField, max: 0), `encumbrance` (NumberField)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.2_

- [ ] 11. Implement Item TypeDataModels: Spell and Equipment
  - [ ] 11.1 Implement `src/models/item/spell.ts` — SpellDataModel
    - Define `defineSchema()` with `weaveNumber` (NumberField, min: 1, max: 10, initial: 1), `spellLore` (StringField), `description` (HTMLField), `range` (StringField), `duration` (StringField), `areaOfEffect` (StringField), `castingTime` (StringField)
    - Add derived getter `get mpCost() { return this.weaveNumber; }`
    - Verify with `tsc --noEmit`
    - _Requirements: 3.3, 3.11_

  - [ ] 11.2 Implement `src/models/item/equipment.ts` — EquipmentDataModel
    - Define `defineSchema()` with `description` (HTMLField), `quantity` (NumberField, min: 0, max: 999, initial: 1), `weight` (NumberField, min: 0), `encumbranceContribution` (NumberField, min: 0), `wealthRequirement` (NumberField, min: 0, max: 5, initial: 0)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.4_

- [ ] 12. Implement Item TypeDataModels: Kin, Culture, Vocation
  - [ ] 12.1 Implement `src/models/item/kin.ts` — KinDataModel
    - Define `defineSchema()` with `statModifiers` (SchemaField with BRN/SWI/FOR/WIT/WSD/BEA as NumberField), `specialAbilities` (ArrayField of StringField), `backgroundPoints` (NumberField, min: 0), `resistances` (SchemaField: stamina/will/magic as NumberField), `baseHpModifier` (NumberField)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.5_

  - [ ] 12.2 Implement `src/models/item/culture.ts` — CultureDataModel
    - Define `defineSchema()` with `skillRankAllocations` (ArrayField of SchemaField: skillName/ranks), `equipmentOptions` (ArrayField of StringField), `backgroundPoints` (NumberField, min: 0), `languages` (ArrayField of StringField)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.6_

  - [ ] 12.3 Implement `src/models/item/vocation.ts` — VocationDataModel
    - Define `defineSchema()` with `keyStats` (ArrayField of StringField, max 3), `favoredSkills` (ArrayField of StringField), `professionalAbilities` (ArrayField of StringField), `dpCostModifiers` (ArrayField of SchemaField: skillCategory/modifier), `baseSpellLores` (ArrayField of StringField)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.7_

- [ ] 13. Implement Item TypeDataModels: Trait and ItemOfPower
  - [ ] 13.1 Implement `src/models/item/trait.ts` — TraitDataModel
    - Define `defineSchema()` with `category` (StringField, choices: ['Physical','Mental','Social','Special']), `description` (HTMLField), `mechanicalEffects` (ArrayField of StringField), `prerequisites` (ArrayField of StringField), `cost` (NumberField, min: 1, max: 10, initial: 1)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.8_

  - [ ] 13.2 Implement `src/models/item/item-of-power.ts` — ItemOfPowerDataModel
    - Define `defineSchema()` with `powerDescription` (HTMLField), `affinityLevel` (NumberField, min: 0, max: 5, initial: 0), `attunementRequirements` (StringField), `attunementStatus` (BooleanField, initial: false), `mechanicalBonuses` (ArrayField of SchemaField: type/value)
    - Export the class
    - Verify with `tsc --noEmit`
    - _Requirements: 3.9, 22.1, 22.4_

- [ ] 14. Wire registration in entry point and system.json
  - [ ] 14.1 Register Actor data models in `src/vsd-system.ts`
    - Import CharacterDataModel and NpcDataModel
    - Register in `CONFIG.Actor.dataModels` within `Hooks.once('init', ...)`
    - Verify with `tsc --noEmit`
    - _Requirements: 1.13, 2.6, 21.5_

  - [ ] 14.2 Register Item data models in `src/vsd-system.ts`
    - Import all Item data models (Weapon, Armor, Spell, Equipment, Kin, Culture, Vocation, Trait, ItemOfPower)
    - Register in `CONFIG.Item.dataModels` within `Hooks.once('init', ...)`
    - Verify with `tsc --noEmit`
    - _Requirements: 3.10, 21.5_

- [ ] 15. Checkpoint - Data models and registration complete
  - Ensure all tests pass via `tsc --noEmit`, ask the user if questions arise.

- [ ] 16. Implement Character Sheet (ApplicationV2) — structure and Overview
  - [ ] 16.1 Implement `src/sheets/character-sheet.ts` base class with six tabs
    - Extend ApplicationV2 (ActorSheetV2)
    - Create Handlebars templates in `src/templates/actors/` for each tab: Overview, Skills, Combat, Magic, Equipment, Biography
    - Implement tab switching, data binding, and field rendering
    - _Requirements: 8.1, 8.11_

  - [ ] 16.2 Implement Overview tab content
    - Display six stats with computed bonuses
    - Display Passions (Nature/Allegiance/Motivation), Drive Points, Heroic Path
    - _Requirements: 8.2, 8.3_

- [ ] 17. Implement Character Sheet — Skills tab
  - [ ] 17.1 Implement Skills tab with roll buttons
    - Display skills grouped by 7 categories with rank, rank bonus, stat bonus, total bonus
    - Skill roll buttons trigger Dice_Engine roll with skill total bonus, display in chat with skill name
    - _Requirements: 8.4, 8.5_

- [ ] 18. Implement Character Sheet — Combat, Magic, Equipment, Biography tabs
  - [ ] 18.1 Implement Combat and Magic tabs
    - Combat: HP, Defense, equipped weapons/armor, active conditions
    - Magic: MP, spells by Spell Lore, casting bonuses
    - _Requirements: 8.6, 8.7_

  - [ ] 18.2 Implement Equipment and Biography tabs
    - Equipment: carried items, encumbrance level with progress bar, wealth level, Items of Power with affinity display
    - Biography: bio, appearance, Kin, Culture, Vocation, background notes
    - _Requirements: 8.8, 8.9, 16.5, 22.3_

  - [ ] 18.3 Implement auto-save on field edit
    - Persist changes on blur/Enter within 500ms debounce
    - On persistence failure, revert displayed value and show notification
    - _Requirements: 8.10, 8.12_

- [ ] 19. Implement NPC Sheet (ApplicationV2)
  - [ ] 19.1 Implement `src/sheets/npc-sheet.ts` — single-page layout
    - Extend ApplicationV2 (ActorSheetV2), no tabs
    - Create Handlebars template in `src/templates/actors/npc-sheet.hbs`
    - Display all NPC fields: level, HP, defense, initiative, movement, attacks, skills, abilities, resistances
    - _Requirements: 9.1, 9.2_

  - [ ] 19.2 Implement NPC attack roll resolution
    - Attack click triggers open-ended roll with attack bonus
    - Prompt for target armor category
    - Resolve against attack table, display damage + critical in chat
    - Auto-roll critical table on critical hit
    - _Requirements: 9.3, 9.5_

  - [ ] 19.3 Implement NPC field auto-save
    - Persist changes on field commit
    - _Requirements: 9.4_

- [ ] 20. Implement Item Sheet (ApplicationV2)
  - [ ] 20.1 Implement `src/sheets/item-sheet.ts` — polymorphic item sheet
    - Extend ApplicationV2 (ItemSheetV2)
    - Common header (name, description) + type-dispatched body
    - Create Handlebars templates in `src/templates/items/` for each item type
    - Display type-specific fields for: Weapon, Armor, Spell, Equipment, Kin, Culture, Vocation, Trait, ItemOfPower
    - Auto-save on field commit
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 21. Checkpoint - All sheets implemented
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 22. Implement Combat Tracker
  - [ ] 22.1 Implement `src/sheets/combat-tracker.ts` — VsdCombatTracker
    - Extend Foundry combat tracker with 9-phase management
    - Display current phase name and round number to all players
    - Implement advance/revert phase buttons
    - Start at Assessment phase, round 1
    - Clamp revert at Assessment round 1
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7, 7.8_

  - [ ] 22.2 Implement combatant action declaration and condition tracking
    - Allow GM to assign declared actions to phases per combatant
    - Track conditions with integer duration (1-99), decrement on new round, remove at 0
    - _Requirements: 7.6, 7.9, 7.10_

- [ ] 23. Implement Spell Casting integration
  - [ ] 23.1 Implement spell casting flow in Character Sheet Magic tab
    - Cast button computes total: skill bonus + open-ended d100 + (5 × level)
    - Deduct MP equal to weave number before resolution
    - Resolve against Action Resolution Table
    - Detect Magical Resonance on initial d100, display distinct indicator + clickable resonance table button
    - Prevent cast if MP insufficient, show warning
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 24. Implement Drive and Passions system integration
  - [ ] 24.1 Implement Passion invocation in Character Sheet
    - Deduct 1 Drive Point on invocation, prompt for Passion selection, add +30 bonus
    - Prevent invocation if zero DP, display message
    - GM can award/remove Drive Points with clamping
    - Milestone completion increases max DP
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 25. Implement Character Creation Wizard
  - [ ] 25.1 Implement `src/sheets/creation-wizard.ts` — 8-step wizard
    - Step structure: Concept, Kin, Culture, Stats, Vocation, Background Options, Skills, Equipment
    - Each step validates before allowing progression
    - Back navigation recalculates dependents, clears invalidated selections
    - _Requirements: 11.1, 11.9, 11.10, 11.11_

  - [ ] 25.2 Implement Kin, Culture, Vocation selection steps
    - Kin: apply stat modifiers, abilities, background points
    - Culture: apply skill rank allocations, background points
    - Vocation: apply favored skills, DP cost modifiers, spell lores
    - _Requirements: 11.2, 11.3, 11.5_

  - [ ] 25.3 Implement Stats, Background Options, Skills, Equipment steps
    - Stats: point-buy or dice roll, assign to 6 stats, enforce all assigned before progression
    - Background Options: point-buy with combined Kin+Culture budget enforcement
    - Skills: display DP, vocation-modified costs, max rank 3 at level 1
    - Final confirmation: create Actor with all values computed
    - _Requirements: 11.4, 11.6, 11.7, 11.8_

- [ ] 26. Implement Advancement Panel
  - [ ] 26.1 Implement `src/sheets/advancement-panel.ts`
    - Display remaining DP, per-skill costs (vocation-modified), current level, total XP, XP to next level
    - Level-up notification when XP threshold reached
    - DP allocation increases rank by 1, deducts cost; reject if insufficient DP or rank 30
    - Level-up grants HP, recalculates TSR/WSR (+5 per level), grants professional abilities
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

- [ ] 27. Implement Travel Panel
  - [ ] 27.1 Implement `src/sheets/travel-panel.ts`
    - Prompt for terrain, weather, distance, pace
    - Compute duration via travel engine
    - Trigger hazard check, display result in chat
    - Track provisions (1 per party member per full day)
    - Display travel log of completed segments
    - Indicate exhaustion for Forced March
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8_

- [ ] 28. Checkpoint - All interactive features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 29. Implement Token Integration
  - [ ] 29.1 Implement token HP bar and condition icons
    - HP bar as proportional fill (current/max), visible to owner and GM only
    - Active condition icons using game-icons.net SVGs (up to 10)
    - Severity differentiation via icon tint/border color
    - Real-time updates on HP/condition change for all clients
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 30. Implement Localization
  - [ ] 30.1 Create `src/lang/en.json` and `src/lang/es.json`
    - All UI labels, sheet fields, system messages, chat output, dialog text
    - Use `VSD.{Section}.{Label}` key pattern
    - Ensure no hardcoded user-visible strings in templates or code
    - Fallback to English for missing keys
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

- [ ] 31. Implement Static Data and Compendium Packs
  - [ ] 31.1 Create static JSON data files
    - `src/data/attack-tables/*.json` — attack table data per weapon type
    - `src/data/critical-tables/*.json` — critical table data
    - `src/data/level-progression.json` — XP thresholds, DP grants, HP per vocation
    - _Requirements: 17.1, 17.4_

  - [ ] 31.2 Create compendium packs
    - 13 Kins, 13 Cultures, 7 Vocations
    - Weapons, Armor, Equipment packs
    - Spells organized by Spell Lore
    - Traits (Background Options) with point costs
    - Attack tables and critical tables
    - Bestiary (NPC/Monster stat blocks)
    - All icons from game-icons.net SVG library
    - Names/descriptions in both English and Spanish
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.11, 13.12_

  - [ ] 31.3 Implement compendium drag-and-drop behavior
    - Drag compendium item onto Actor creates a copy
    - Kin/Culture/Vocation drag onto Character with existing same-type item shows replacement confirmation
    - _Requirements: 13.9, 13.10_

- [ ] 32. Implement CSS styles
  - [ ] 32.1 Create `src/styles/vsd-system.css`
    - Use FoundryVTT V2 CSS variables and layout patterns
    - Adapt Roll20 VsD sheet organization to Foundry styling
    - Grid layouts for character sheet tabs, NPC compact layout, item sheets
    - Do not override Foundry core styles
    - _Requirements: 8.11_

- [ ] 33. Final checkpoint - Full system integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Top-level tasks are executed in strict linear order — each top-level task must be completed before starting the next
- Sub-tasks within a single top-level task can be executed in parallel since they share the same development branch
- **Before creating any new branch**: always switch to main and sync with remote (`git checkout main && git pull origin main`)
- Each top-level task corresponds to a single feature branch (e.g., `feature/task-1-project-setup`) with a conventional commit and PR
- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation before proceeding
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All pure engine functions are implemented and tested before Foundry-dependent code
- TypeScript is used throughout with strict mode enabled
- The `src/engine/` modules have zero imports from FoundryVTT (Requirement 21.7)
- **Verification for Foundry-dependent code**: Use `tsc --noEmit` only. Do NOT attempt `npm test` or `vite build` for TypeDataModel or Sheet tasks — they require the Foundry runtime.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "6.8", "6.9", "6.10", "6.11", "6.12"] },
    { "id": 6, "tasks": ["8.1", "8.2", "8.3", "8.4"] },
    { "id": 7, "tasks": ["9.1", "9.2"] },
    { "id": 8, "tasks": ["10.1", "10.2"] },
    { "id": 9, "tasks": ["11.1", "11.2"] },
    { "id": 10, "tasks": ["12.1", "12.2", "12.3"] },
    { "id": 11, "tasks": ["13.1", "13.2"] },
    { "id": 12, "tasks": ["14.1", "14.2"] },
    { "id": 13, "tasks": ["16.1", "16.2"] },
    { "id": 14, "tasks": ["17.1"] },
    { "id": 15, "tasks": ["18.1", "18.2", "18.3"] },
    { "id": 16, "tasks": ["19.1", "19.2", "19.3"] },
    { "id": 17, "tasks": ["20.1"] },
    { "id": 18, "tasks": ["22.1", "22.2"] },
    { "id": 19, "tasks": ["23.1"] },
    { "id": 20, "tasks": ["24.1"] },
    { "id": 21, "tasks": ["25.1", "25.2", "25.3"] },
    { "id": 22, "tasks": ["26.1"] },
    { "id": 23, "tasks": ["27.1"] },
    { "id": 24, "tasks": ["29.1"] },
    { "id": 25, "tasks": ["30.1"] },
    { "id": 26, "tasks": ["31.1", "31.2", "31.3"] },
    { "id": 27, "tasks": ["32.1"] }
  ]
}
```
