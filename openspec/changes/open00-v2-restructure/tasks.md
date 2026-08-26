# Tasks: Open00 v2 — Full Architecture Restructure

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~3500 (sum of 11 slices) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 11 PRs on feature-branch-chain (tracker: `v2`) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Base | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|------|----------------------|-----------------|-------------------|
| 1 | Types foundation + tsconfig + stale context | PR #1 → `v2` | `v2` | `npx tsc --noEmit` | N/A — config only, no runtime | Revert PR #1 merge on `v2` |
| 2 | Document subclasses + schema reshape (keyed skills, no derived fields) | PR #2 → PR #1 branch | PR #1 | `npx tsc --noEmit` | N/A — Foundry runtime required | Revert PR #2; models still compile under v1 schema |
| 3 | Form & render migration — native ApplicationV2 form handling + delete auto-save.ts + partial-render.ts | PR #3 → PR #2 branch | PR #2 | `npx tsc --noEmit` | N/A — Foundry runtime required | Revert PR #3; sheet still compiles with old form layer |
| 4 | Schema migration + remove persisted derived fields | PR #4 → PR #3 branch | PR #3 | `npx tsc --noEmit` | N/A — migration runs on Foundry doc load | Revert PR #4; v1 schema restored |
| 5 | Document test shim + model-level tests | PR #5 → PR #4 branch | PR #4 | `npm test` | N/A — shim replaces Foundry runtime for tests | Revert PR #5; tests/ additions only |
| 6 | Rules: travel + encumbrance rewrite | PR #6 → PR #5 branch | PR #5 | `npm test` | N/A — pure engine, no Foundry runtime | Revert PR #6; old engine modules restored |
| 7 | Rules: drive-points + advancement rewrite | PR #7 → PR #6 branch | PR #6 | `npm test` | N/A — pure engine | Revert PR #7 independent of PR #6 |
| 8 | Rules: SR Level Bonus, TSR/WSR, DEF, HP/MP derivation | PR #8 → PR #7 branch | PR #7 | `npm test` + `npx tsc --noEmit` | N/A — derivation tested via shim | Revert PR #8; prior derivation skeleton intact |
| 9 | Combat tables (engine + loader + schema + vite) — BLOCKED | PR #9 → PR #8 branch | PR #8 | `npm test` (table lookup logic) | N/A — pure JSON + engine | Revert PR #9; empty .gitkeep tables remain |
| 10 | Roll API integration | PR #10 → PR #9 branch (or #8 if 9 still blocked) | PR #9/#8 | `npx tsc --noEmit` | N/A — Roll requires Foundry runtime for ChatMessage | Revert PR #10; Math.random paths restored |
| 11 | Localization + system.json + housekeeping | PR #11 → PR #10 branch | PR #10 | `npx tsc --noEmit` | N/A — lang JSON + manifest, no runtime | Revert PR #11; en/es.json restored |

### Per-Slice Estimates

| Slice | Est. lines | Budget risk | Sheet functional at boundary? |
|-------|-----------|-------------|-------------------------------|
| 1 | ~300 | Low | Yes — no sheet changes |
| 2 | ~350 | Low | Yes — sheet compiles, form still uses legacy auto-save until Slice 3 |
| 3 | ~400 | At budget | Yes — native form replaces auto-save; sheet persists via `submitOnChange` + `_processFormData` |
| 4 | ~300 | Low | Yes — migration strips stale derived keys on load; sheet reads keyed record |
| 5 | ~400 | At budget | Yes — no sheet changes; tests only |
| 6 | ~350 | Low | Yes — engine-only; sheet unaffected |
| 7 | ~350 | Low | Yes — engine-only; sheet unaffected |
| 8 | ~350 | Low | Yes — derivation only; sheet renders derived props |
| 9 | ~500 | Over budget — BLOCKED; low cognitive load (JSON data + lookup). Request `size:exception` when unblocked. | Yes — no sheet changes |
| 10 | ~300 | Low | Yes — Roll API replaces Math.random; sheet calls Roll instead |
| 11 | ~300 | Low | Yes — localization + manifest only |

---

## Slice 1: Types Foundation + tsconfig + Stale Context

- [x] 1.1 Install `fvtt-types@14.366.0-beta.20260825144710` (beta dist-tag); remove stale type stubs from `src/types/foundry.d.ts` that community types now cover; keep only thin system augmentations (CONFIG shapes, sheet subclass gaps)
- [x] 1.2 Fix `tsconfig.json` path aliases: `@engine/*` → `./src/module/engine/*`, `@models/*` → `./src/module/models/*`, `@sheets/*` → `./src/module/sheets/*`, `@data/*` → `./src/module/data/*`, `@documents/*` → `./src/module/documents/*`
- [x] 1.3 Create `tsconfig.test.json` extending `tsconfig.json` that includes `tests/` (so test fixtures type-check against production shapes)
- [x] 1.4 Fix `.kiro/steering/foundry-verification.md`: update paths (`src/engine/` → `src/module/engine/`, `src/models/` → `src/module/models/`, `src/sheets/` → `src/module/sheets/`, `src/vsd-system.ts` → `src/open00-system.ts`)
- [x] 1.5 Fix `.atl/skill-registry.md`: replace Windows paths (`C:\Users\jeror\.codex\skills\...`) with Linux paths (`~/.kiro/skills/...`)
- [x] 1.6 Verify: `npx tsc --noEmit` clean

## Slice 2: Document Subclasses + Schema Reshape

- [ ] 2.1 Create `src/module/documents/open00-actor.ts`: class `Open00Actor extends Actor` with `prepareDerivedData()` skeleton delegating to `this.system.prepareDerivedData()`
- [ ] 2.2 Create `src/module/documents/open00-item.ts`: class `Open00Item extends Item` registered as `CONFIG.Item.documentClass`
- [ ] 2.3 Register both document classes in `src/open00-system.ts` init hook (`CONFIG.Actor.documentClass = Open00Actor`, `CONFIG.Item.documentClass = Open00Item`); fix `trackableAttributes` to use `hp`/`mp` paths matching the new schema
- [ ] 2.4 Refactor `src/module/data/skills.ts`: add `SKILL_IDS` frozen record (22 canonical kebab-case ids: `armor`, `blades`, `blunt`, `ranged`, `polearms`, `brawl`, `athletics`, `ride`, `hunting`, `nature`, `wandering`, `acrobatics`, `stealth`, `locks-traps`, `perception`, `deceive`, `arcana`, `charisma`, `cultures`, `healer`, `songs-tales`, `body`); export `SkillId` type; retain `DEFAULT_SKILL_DEFINITIONS` keyed by id
- [ ] 2.5 Refactor `src/module/models/actor/character.ts`: replace skills `ArrayField` with keyed `SchemaField` record (one field per `SkillId`); remove all DERIVED fields from `defineSchema` (`stats.*.kin`, `hp.max`, `mp.max`, `defense`, `encumbrance`, `skills.*.vocation`, `skills.*.kin`, `skills.*.item`); add `soulDamage` NumberField (PLAYER-OWNED, initial 0); add `schemaVersion` NumberField; set `drivePoints.value` initial to 1
- [ ] 2.6 Add `prepareDerivedData()` to `CharacterDataModel`: compute derived class properties (skeleton — full formulas in slice 8)
- [ ] 2.7 Delete `src/module/sheets/kin-culture-vocation-effects.ts` (effects now owned by document lifecycle)
- [ ] 2.8 Verify: `npx tsc --noEmit` clean

## Slice 3: Form & Render Migration (co-located with schema reshape per Design Decisions 6 & 7)

Rationale: Decision 6 pairs native ApplicationV2 `form: { handler, submitOnChange: true }` + `_processFormData` with auto-save.ts deletion because the keyed record (Decision 4, Slice 2) removes the only reason the custom form layer existed. Decision 7 pairs native part-scoped render with partial-render.ts deletion. Deferring these deletions past the schema change would leave the sheet writing to paths that no longer exist. The sheet MUST remain functional at every slice boundary.

- [ ] 3.1 Update `src/module/sheets/character-sheet.ts`: make presentation-only; adopt native `form: { handler: this._processFormData, submitOnChange: true }` in `static DEFAULT_OPTIONS`; implement `_processFormData` for keyed skill record paths; remove all derivation logic; fix `game.system?.id` import-time read → lazy getter
- [ ] 3.2 Update `src/module/sheets/npc-sheet.ts`: adopt native `form: { handler, submitOnChange: true }` — remove the conflicting `submitOnChange: true` at line 96 that co-existed with the custom auto-save handler (the original bug)
- [ ] 3.3 Delete `src/module/sheets/auto-save.ts` (427 lines) — native ApplicationV2 form handling replaces it entirely; both sheets now persist via native `submitOnChange`
- [ ] 3.4 Delete `src/module/sheets/partial-render.ts` — native ApplicationV2 part-scoped re-render replaces the hand-maintained data→template map
- [ ] 3.5 Verify: `npx tsc --noEmit` clean; confirm both sheets compile with native form handler and no references to deleted modules remain

## Slice 4: Schema Migration + Remove Persisted Derived Fields

- [ ] 4.1 Implement `static migrateData(source)` on `CharacterDataModel`: convert skills array → keyed record by matching name to canonical id; strip derived keys (`stats.*.kin`, `hp.max`, `skills.*.vocation`, `skills.*.kin`, `skills.*.item`, `defense`, `mp.max`, `encumbrance`); preserve `wealth`, `skills.*.rank`, `stats.*.base`, `stats.*.spec`, `hp.value`; remove `min:0` on `hp.value`; remove rank-30 cap; bump `schemaVersion`
- [ ] 4.2 Implement `static migrateData(source)` on `NpcDataModel` (`src/module/models/actor/npc.ts`): strip any derived keys present in NPC data; add `schemaVersion`
- [ ] 4.3 Remove the unversioned ready-hook mass update from `src/open00-system.ts` (lines ~84-95); migration now runs via `migrateData` on document load
- [ ] 4.4 Implement seeding in `Open00Actor._onCreateDescendantDocuments`: when a Kin/Culture/Vocation Item is added (any path: drag-drop, programmatic, compendium import, duplication), seed `wealth` (Kin WL + Culture WL + Background Options, clamped [0,4]) and cultural skill ranks (21 ranks into `skills.*.rank`) guarded by `seeded` flag; never re-derive after seeding
- [ ] 4.5 Verify: `npx tsc --noEmit` clean

## Slice 5: Document Test Shim + Model-Level Tests (RED → GREEN)

- [ ] 5.1 Create `tests/foundry-shim.ts`: define `globalThis.foundry.data.fields.*` (NumberField, StringField, SchemaField, BooleanField, ArrayField, HTMLField), `globalThis.foundry.abstract.TypeDataModel` (runs defineSchema/prepareBaseData/prepareDerivedData), mock `Actor`/`Item`/`game`/`CONFIG`; register in vitest `setupFiles` (update `tests/setup.ts` or vitest config)
- [ ] 5.2 RED: Write `tests/models/character-derived.test.ts` — test that `prepareDerivedData` computes `hp.max` correctly for a Man (FOR=10, Body rank=5, rankBonus=25, kinHP=30, vocational=0, cap 120, soulDamage=0 → hp.max=65); test that `toObject().system` contains NO derived keys
- [ ] 5.3 GREEN: Ensure CharacterDataModel + shim make the test pass
- [ ] 5.4 RED: Write `tests/models/character-seeded.test.ts` — test that adding a Culture Item seeds 21 skill ranks into `skills.*.rank`; test that removing a Vocation does NOT zero `skills.*.rank` (regression: defect a)
- [ ] 5.5 GREEN: Ensure `_onCreateDescendantDocuments` seeding + guard pass
- [ ] 5.6 RED: Write `tests/models/character-identity.test.ts` — test that identity modifiers persist when an identity Item is added by any path (regression: defect c, ArrayField fix); test HP max uses canonical `body` skill id not `'Body Development'` string (regression: defect b)
- [ ] 5.7 GREEN: Ensure keyed record + canonical SKILL_IDS make the tests pass
- [ ] 5.8 RED: Write `tests/models/character-migration.test.ts` — test `migrateData` converts legacy array skills → keyed record, strips derived keys, preserves player-owned/seeded
- [ ] 5.9 GREEN: Ensure `static migrateData` passes
- [ ] 5.10 Verify: `npm test` all pass; `npx tsc --noEmit` clean

## Slice 6: Rules Rewrite — Travel + Encumbrance (RED → GREEN)

- [ ] 6.1 RED: Rewrite `tests/engine/travel.property.test.ts` — delete fabricated assertions; write new tests anchored to the VsD overland movement table (spec: `openspec/changes/open00-v2-restructure/specs/character-engine/spec.md` §Travel Distance Computation). Encumbrance bands: Up to Lightly / Encumbered / Heavily / Over. Terrain types: Normal / Rough / Arduous. Each has foot and mount columns. Assert exact values: Up to Lightly + Normal foot = 50, Normal mount = 95, Rough foot = 30, Rough mount = 40, Arduous foot = 15, Arduous mount = 8; Encumbered + Normal foot = 30, Normal mount = 65, Rough foot = 15, Rough mount = 25, Arduous foot = 8, Arduous mount = 8; Heavily + Normal foot = 15, Normal mount = 30, Rough foot = 8, Rough mount = 15, Arduous foot = 3, Arduous mount = 0; Over = 0 for all columns
- [ ] 6.2 GREEN: Rewrite `src/module/engine/travel.ts` to match VsD v1.5 terrain × encumbrance × mode (foot/mount) table (no pace system, no miles, no pace-multiplier formula); make tests pass
- [ ] 6.3 RED: Rewrite `tests/engine/encumbrance.property.test.ts` — delete fabricated assertions; write new tests: 5 qualitative levels (Unencumbered, Lightly Encumbered, Encumbered, Heavily Encumbered, Over Encumbered); Lightly Encumbered = NO penalties; BRN ≥ 30 AND FOR ≥ 30, OR Large size, reduces effective level by one; armor NEVER factored into encumbrance level (armor has its own separate penalties)
- [ ] 6.4 GREEN: Rewrite `src/module/engine/encumbrance.ts` to match VsD v1.5 encumbrance rules; make tests pass
- [ ] 6.5 Verify: `npm test` all pass; `npx tsc --noEmit` clean

## Slice 7: Rules Rewrite — Drive Points + Advancement (RED → GREEN)

- [ ] 7.1 RED: Rewrite `tests/engine/drive-points.property.test.ts` — delete fabricated assertions; write new tests: initial=1, max=5, spending gives +10/point, NO +30 invokePassion mechanic
- [ ] 7.2 GREEN: Rewrite `src/module/engine/drive-points.ts` to match VsD v1.5; make tests pass
- [ ] 7.3 RED: Rewrite `tests/engine/advancement.property.test.ts` — delete fabricated assertions; write new tests: per-category DP spending, max 2 ranks/skill/level, 2:1 DP transfer, unspent DP lost at level-up, cultural ranks excluded from max developable, NO rank-30 cap, XP thresholds (10/lvl L1-5, 20/lvl L6-10)
- [ ] 7.4 GREEN: Rewrite `src/module/engine/advancement.ts` to match VsD v1.5; make tests pass
- [ ] 7.5 Verify: `npm test` all pass; `npx tsc --noEmit` clean

## Slice 8: Derivation — SR Level Bonus, TSR/WSR, DEF, HP/MP, Kin Max HP, Soul Damage

- [ ] 8.1 RED: Write tests (in `tests/models/` via shim) for full `prepareDerivedData` formulas: SR Level Bonus (+5/lvl L1-10, +2/lvl L11-20, +1/lvl L21+); DEF = max(SWI stat total, 0) + armor/shield; hp.max = full Body Skill Bonus, capped by Kin `maxHp` (Dwarf 150, Halfling 100, Man 120, etc.), reduced by `soulDamage`; mp.max derivation; skills.N.kin DERIVED from Kin Item traits; skills.N.vocation DERIVED from Vocation Item
- [ ] 8.2 GREEN: Complete `prepareDerivedData()` in `CharacterDataModel` with full formulas; wire Kin `maxHp` cap reading from owned Kin Item; apply `soulDamage` reduction; compute all missing DERIVED attributes (DEF, Total MP, Move Rate 15m, Size, Bruised Value, SR Level Bonus)
- [ ] 8.3 RED: Write NPC derivation tests — only fields defined in `vsd-bestiary.md` (Level, MR, AT, DEF, TSR, WSR, HPs, CT, Attacks, Abilities)
- [ ] 8.4 GREEN: Implement lightweight `prepareDerivedData()` on `NpcDataModel`
- [ ] 8.5 Verify: `npm test` all pass; `npx tsc --noEmit` clean

## Slice 9: Combat Tables — BLOCKED on User-Supplied Numeric Grids

**Status: BLOCKED** — user must supply 6 attack tables (Edged, Blunt, Missile, Unarmed/Grappling, Beast, Bolt/Area Spells) × 4 armor columns, 9 critical tables, and fumble tables. No task may generate, infer, approximate, or default any table value.

Implementable now (unblocked):

- [x] 9.1 RED: Write `tests/engine/combat/attack-lookup.test.ts` — table-driven tests for attack lookup logic (result → row, column selection, Max Result cap applied LAST)
- [x] 9.2 GREEN: Create `src/module/engine/combat/attack-tables.ts` — lookup engine implementing the attack-table interface (takes table data + result + armor → damage string + critical severity)
- [x] 9.3 RED: Write `tests/engine/combat/critical-lookup.test.ts` — severity modifier (+0/+10/+20/+30/+50), Heroic/Epic severity reduction (-1/-2, below Superficial = negated)
- [x] 9.4 GREEN: Create `src/module/engine/combat/critical-tables.ts` and `src/module/engine/combat/fumble-tables.ts` lookup engines
- [x] 9.5 Create `src/module/data/combat-loader.ts` — reads JSON files at init, returns `Map` structures; add JSON schema validation for attack/critical table shapes
- [x] 9.6 Update `vite.config.ts` to copy `src/data/` → `dist/data/` at build time
- [x] 9.7 Verify: `npm test` passes for lookup logic (with synthetic fixture data in tests only); `npx tsc --noEmit` clean

Blocked tasks (awaiting user data):

- [ ] 9.8 **BLOCKED**: Populate `src/data/attack-tables/*.json` with user-supplied numeric grids
- [ ] 9.9 **BLOCKED**: Populate `src/data/critical-tables/*.json` with user-supplied data
- [ ] 9.10 **BLOCKED**: Populate `src/data/fumble-tables/*.json` (structure UNSPECIFIED until sample grid arrives)

## Slice 10: Roll API Integration

- [ ] 10.1 Create `src/module/apps/roll/open-ended-roll.ts`: `OpenEndedD100Roll extends Roll`; high-side explosion via native `d100x>=96`; low-side (01-05 subtract, continue while ≥96) via custom subtract-exploding `DiceTerm`
- [ ] 10.2 Replace all `Math.random()` calls in sheets/system with Roll API calls; ensure `ChatMessage.create({rolls:[roll], rollMode})` for GM roll mode + Dice So Nice support
- [ ] 10.3 RED: Write `tests/engine/dice-engine.property.test.ts` updates — verify pure `dice-engine.ts` kernel still works (open-ended math, probability distribution); add test for the new Roll subclass instantiation (via shim if needed)
- [ ] 10.4 GREEN: Ensure all roll paths use Roll API; tests pass
- [ ] 10.5 Verify: `npx tsc --noEmit` clean (Roll requires Foundry runtime for full execution, but types must compile)

## Slice 11: Localization + system.json + Housekeeping

- [ ] 11.1 Extract ~190 hardcoded strings from sheets/templates into `src/lang/en.json` and `src/lang/es.json`; use `OPEN00.Skills.<id>` pattern for skill names, `OPEN00.Stats.<key>` for stats; fix missing keys (`es.json`: `OPEN00.Saves.KinBonus`; both: `TYPES.Item.spellLore`)
- [ ] 11.2 Add `LOCALIZATION_PREFIXES` to sheet classes per Foundry v14 API
- [ ] 11.3 Update `src/system.json`: add `version` field placeholder (present at build); verify `primaryTokenAttribute`/`secondaryTokenAttribute` match new hp/mp schema paths
- [ ] 11.4 Fix `ArrayField` initialization in remaining models (use factory functions, not shared object references)
- [ ] 11.5 Verify: `npx tsc --noEmit` clean; `npm test` all pass (no engine regressions)
