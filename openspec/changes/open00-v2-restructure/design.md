# Design: Open00 v2 — Full Architecture Restructure

## Technical Approach

Replace the "persisted derived state with no owner" model with a strict separation
enforced by the **schema shape itself**: DERIVED values never appear in `defineSchema`
— they are computed as class properties in `prepareDerivedData()` on document
subclasses that read owned identity Items each cycle. PLAYER-OWNED and SEEDED fields are
the only persisted data. This makes the `clearAllIdentityEffects` bug class structurally
impossible: there is no persisted derived field to clear, and pure derivation needs no
re-application triggers. Rules kernels stay pure; a Roll adapter and a Foundry test shim
close the two capability gaps. Reference proposal `sdd/open00-v2-restructure/proposal`.

## Corrections applied to the proposal Field Classification (do not propagate the originals)

1. **`skills.N.kin` is DERIVED** (Kin Bonus term, from Kin/kin-trait Items, recomputed
   each cycle) — NOT seeded. **`skills.N.rank` is PLAYER-OWNED, SEEDED by Culture**
   (`culture.skillRankAllocations`, the 21 Cultural Skill Ranks), then never overwritten.
   Two independent concerns.
2. **`hp.max` DERIVED** = full Body Skill Bonus = `statTotal(for) + computeRankBonus(bodyRank)
   + vocation + kin + spec + item`, **capped by Kin Max HP**, then **reduced by Soul Damage**
   (permanent Body-bonus reduction). Not `bodyRank × bonus`. Requires a new PLAYER-OWNED
   `soulDamage` field and a Kin Max HP cap read from the Kin Item.
3. **`drivePoints.value` initial = 1** (`vsd-core-rules.md §Drive`), not 0.

## Architecture Decisions

### Decision 1 — Derived-state mechanism: pure `prepareDerivedData`, not ActiveEffects
**Choice**: Compute all DERIVED fields in `prepareDerivedData()` on the DataModel/document
subclass, reading owned identity Items directly. **Rejected**: ActiveEffects on identity
Items; AE/computation hybrid. **Rationale**: AEs cannot express SEEDED ("seed once then
leave alone") — the exact `wealth`/`skills.N.rank` category; AE ordering/stacking adds
non-determinism that is hard to unit-test; the current data is plain numbers, so AE
migration cost is high. Pure derivation is trivially testable (instantiate model, assert
output) and identity modifiers become visible on the sheet as read-only computed rows.
GMs override by editing the identity Item, not the actor — the single source of truth.

### Decision 2 — Contract enforcement: schema-level exclusion, fails loud
**Choice**: DERIVED values are **absent from `defineSchema`** and declared as typed class
instance properties assigned in `prepareDerivedData`. Persisted schema = PLAYER-OWNED +
SEEDED only. **Rejected**: markdown table (not enforcement); typed accessor layer alone;
lint rules. **Rationale**: Foundry silently drops updates to non-schema paths and
`toObject()` omits non-schema properties, so derived state *cannot* be persisted. Fails
loud via three guards: (a) a document-level test asserting `toObject().system` contains no
derived keys; (b) `migrateData` strips any legacy derived keys; (c) TypeScript separates
the persisted-source type from the prepared-instance type.

### Decision 3 — Re-derivation triggers: none for DERIVED, seed-guarded hooks for SEEDED
**Choice**: DERIVED fields (`stats.*.kin`, `skills.N.kin`, `skills.N.vocation`, `hp.max`,
`mp.max`, `defense`, `encumbrance`, `skills.N.item`) read owned Items every
`prepareDerivedData` — **no triggers needed** (this is the decisive argument for pure
derivation). SEEDED fields (`wealth`, `skills.N.rank` from Culture) are written **once**
by `Open00Actor._onCreateDescendantDocuments` when the Kin/Culture Item is first added
(fires on drag-drop, programmatic create, compendium import, duplication), guarded by a
`seeded` flag so re-adds never clobber player edits. Removing an identity does not unwind a
seeded value (per classification). **Rejected**: sheet-only drag-drop handlers (miss
programmatic paths — the current bug); Item-side `_onCreate`.

### Decision 4 — ArrayField → keyed SchemaField (record) for the fixed skills
**Choice**: Replace `skills: ArrayField` with a `SchemaField` whose keys are the 23 canonical
skill ids (one `SchemaField` per skill). **Rejected**: keep the array and always write whole.
**Rationale**: Foundry rejects partial indexed ArrayField updates (`auto-save.ts:118-127`),
the exact cause of silently-dropped identity modifiers; a keyed record supports partial
updates (`system.skills.blades.rank`) natively and eliminates array-index-as-path coupling
and `skill.name === 'Body'` matching. Spell Lores stay a separate collection (dynamic,
per-character). **Migration**: `migrateData` converts the legacy array to the keyed record
by canonical id, preserving `rank`/`spec` (player-owned) and dropping `kin`/`vocation`/`item`
(now derived).

### Decision 5 — Skill identity: canonical id constants + localized display
**Choice**: `SKILL_IDS` frozen constant map (stable ids: `blades`, `body`, …) in
`module/data/skills.ts`; templates and data reference **ids**, display names come from
`OPEN00.Skills.<id>` localization keys. **Rationale**: kills the 5+ bare-string `===`
comparisons and the live `'Body Development'` vs `'Body'` defect; ids are stable across
renames and localization.

### Decision 6 — Form/persistence: adopt native ApplicationV2, delete auto-save.ts
**Choice**: `form: { handler, submitOnChange: true }` + `_processFormData`; delete the
427-line `auto-save.ts`. Apply to **both** character and npc sheets (fixes the
`npc-sheet.ts:96` inconsistency). **Rationale**: native provides change submission, type
coercion, and form expansion; the keyed-record (Decision 4) removes the only thing the
custom layer existed for (ArrayField partial writes). **What native does not cover**:
per-field optimistic revert UX — acceptable because `submitOnChange` re-renders from
persisted state on failure, which is the correct recovery.

### Decision 7 — Partial-render routing: drop it
**Choice**: Delete `partial-render.ts`; rely on ApplicationV2's native part-scoped
re-render on document update. **Rationale**: the hand-maintained data→template map is
already wrong, duplicates the dependency graph, and item changes bypass it entirely. The
optimization is not worth a perpetually-drifting map; native render is already part-aware.

### Decision 8 — Types: pin `fvtt-types` v14 prerelease, thin augmentation
**Choice**: Adopt `fvtt-types` (the current name for the League of Foundry Developers
package) pinned to **`14.366.0-beta.20260816170037`** (the `prerelease` dist-tag). Verified
on npm: `latest` is `13.346.0-beta` (Foundry **v13**); v14 coverage exists **only** on the
`prerelease`/`beta` tags and there is **no stable v14 release**. **Local augmentation keeps
only**: system-specific `CONFIG` shapes, sheet subclasses, and any genuine v14 gaps the
package lags. **tsconfig**: fix `paths` to real dirs (see Decision 13); **remove `tests/`
from `exclude`** (add a `tsconfig.test.json` extending the base with `include: [tests]`) so
fixtures type-check against production shapes.

### Decision 9 — Roll API: `OpenEndedD100Roll extends Roll`, kernel stays pure
**Choice**: Keep `dice-engine.ts` as the pure total-of-record kernel for unit tests. Add
`module/apps/roll/open-ended-roll.ts`, a `Roll` subclass: the additive high side uses native
`d100x>=96`; the subtracting low side (01–05, continuing while ≥96) uses a **custom
subtract-exploding DiceTerm** (native modifiers cannot subtract-explode). Call sites build
the Roll, `await roll.evaluate()`, and `ChatMessage.create({ rolls: [roll], rollMode })`
honouring the GM roll mode. **Rationale**: real `Roll` objects give dice tooltips, Dice So
Nice, and roll-mode support that `Math.random()` bypasses.

### Decision 10 — Test capability: shim in setup + lazy global reads
**Choice**: `tests/foundry-shim.ts` (loaded via `setupFiles`, so globals exist before any
module import) defines `foundry.data.fields.*`, `foundry.abstract.TypeDataModel` (running
`defineSchema`/`prepareBaseData`/`prepareDerivedData`), `Actor`, `Item`, `game`, `CONFIG`.
Fields record their options and hydrate `initial`s so a test can `new CharacterDataModel(src)`
and assert `prepareDerivedData` output. **Resolve the import-time blocker**: refactor
value-dependent module-load reads to be lazy — `character-sheet.ts:21`
(`game.system?.id`) moves into a method/getter. Models destructuring `foundry.data.fields`
at load is fine once the shim defines `globalThis.foundry` first.

### Decision 11 — Migration: `static migrateData` + `schemaVersion`, forward-only
**Choice**: Add a `schemaVersion` NumberField; `static migrateData(source)` on each document
class runs on load. Forward-only from any 1.x: delete persisted derived keys
(`stats.*.kin`, `hp.max`, `skills.N.vocation`/`kin`/`item`); convert skills array→keyed
record; preserve `wealth`, `skills.N.rank`, `spec`, `hp.value`; drop the `min:0` on
`hp.value` and the `rank:30` cap. **Replace** the unversioned `ready`-hook mass update
(`open00-system.ts:84-95`) — per-document `migrateData` needs no bulk `actor.update`.
`drivePoints.value` initial becomes 1 for **new** docs only; existing values are not rewritten
(cannot distinguish a legitimately-spent 0 — same reasoning as the unrecoverable rank-zeroed
characters).

### Decision 12 — Combat table contract (BLOCKED on user data)
**Choice**: Freeze the JSON schema now so implementation is mechanical on data arrival.
`src/data/attack-tables/<id>.json`: `{ name, columns:["NA","LA","MA","HA"],
rows:[{min,max,results:[string×4]}] }`. `src/data/critical-tables/<id>.json`:
`{ name, rows:[{min,max,severity,effect}] }`. Fumble table structure UNSPECIFIED — needs the
grid to finalise. `module/data/combat-loader.ts` reads JSON into `Map`s at init; vite copies
`src/data/` to `dist/data/` (Decision 13). The existing `engine/attack-tables.ts` interface
is the lookup contract. **The numeric grids do not exist and MUST NOT be invented** — Slice 8
stays blocked; all other slices proceed.

### Decision 13 — File/module organisation + naming
```
src/open00-system.ts                 entry point (register in init)
src/module/documents/                NEW — Open00Actor, Open00Item (subclasses; SEEDED hooks)
src/module/models/{actor,item}/      TypeDataModels (persisted schema only)
src/module/engine/                   pure rules kernels (zero Foundry imports); + engine/combat/
src/module/sheets/                   presentation-only ApplicationV2 sheets
src/module/data/                     canonical catalogues (skills.ts) + combat-loader.ts
src/module/apps/roll/                Roll subclass adapter (Foundry-dependent)
src/data/{attack,critical,fumble}-tables/*.json   shipped static grids
src/types/foundry.d.ts               thin augmentation only
```
**Naming**: kebab-case filenames; PascalCase classes; DataModels suffixed `DataModel`;
document subclasses `Open00Actor`/`Open00Item`; skill ids lowercase-kebab in a frozen map.
**tsconfig `paths`** corrected to `@documents|@models|@engine|@sheets|@data → src/module/*`.
**Stale context fixed**: `.kiro/steering/foundry-verification.md` (`src/engine`→`src/module/engine`,
`src/models`→`src/module/models`, `src/sheets`→`src/module/sheets`, `src/vsd-system.ts`→`src/open00-system.ts`);
`.atl/skill-registry.md` Windows→Linux paths.

## Data Flow

```
Owned Items (Kin/Culture/Vocation/ItemOfPower)
        │  read each cycle (DERIVED)              seed once (SEEDED)
        ▼                                              ▼
Open00Actor.prepareDerivedData ──► class props   _onCreateDescendantDocuments ──► persisted
   (stats.kin, skills.kin/vocation/item,             (wealth, skills.rank from Culture)
    hp.max, mp.max, defense, encumbrance)                    │
        │                                                    ▼
        └──────────────► Sheet (presentation-only) ◄── persisted PLAYER-OWNED (rank, hp.value…)
                              │  submitOnChange
                              ▼
                        Actor.update ──► DataModel validate ──► re-render
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/module/documents/open00-actor.ts` | Create | Actor subclass: `prepareDerivedData` derivation + `_on*DescendantDocuments` SEEDED seeding |
| `src/module/documents/open00-item.ts` | Create | Item subclass registration |
| `src/module/models/actor/character.ts` | Modify | Remove derived fields from schema; skills→keyed record; add `schemaVersion`, `soulDamage`; `migrateData`; fix `drivePoints` initial |
| `src/module/models/actor/npc.ts` | Modify | Add `schemaVersion`/`migrateData`; derive only bestiary-defined fields |
| `src/module/data/skills.ts` | Modify | `SKILL_IDS` constants; keyed-record helpers |
| `src/module/data/combat-loader.ts` | Create | Load combat JSON into Maps at init |
| `src/module/engine/combat/{critical,fumble}-tables.ts` | Create | Critical/fumble lookup (mirror attack-tables) |
| `src/module/apps/roll/open-ended-roll.ts` | Create | `Roll` subclass + subtract-exploding DiceTerm |
| `src/module/sheets/character-sheet.ts` | Modify | Presentation-only; native form handler; lazy `game.system.id`; Roll adapter |
| `src/module/sheets/npc-sheet.ts` | Modify | Native form handler (remove custom autosave) |
| `src/module/sheets/auto-save.ts` | Delete | Replaced by native ApplicationV2 form handling |
| `src/module/sheets/partial-render.ts` | Delete | Replaced by native part-scoped render |
| `src/module/sheets/kin-culture-vocation-effects.ts` | Delete | Logic moves to `Open00Actor` (derivation + seeding) |
| `src/module/engine/{travel,encumbrance,drive-points,advancement}.ts` | Modify | Rewrite to VsD v1.5 |
| `src/open00-system.ts` | Modify | Register document classes; fix `trackableAttributes` (`drivePoints.value`); remove `ready`-hook mass update |
| `src/system.json` | Modify | `version` field; valid npc token attrs; `LOCALIZATION_PREFIXES` |
| `src/data/**/*.json` | Create | Combat grids — BLOCKED on user data |
| `vite.config.ts` | Modify | Copy `src/data/` → `dist/data/` |
| `tsconfig.json` / `tsconfig.test.json` | Modify/Create | Fix `paths`; include `tests/` |
| `tests/foundry-shim.ts` | Create | Document-level test shim |
| `tests/setup.ts` | Modify | Load shim |
| `src/types/foundry.d.ts` | Modify | Reduce to thin augmentation over `fvtt-types` |
| `src/lang/{en,es}.json` | Modify | +~190 keys; skill-id keys; fix missing `OPEN00.Saves.KinBonus`, `TYPES.Item.spellLore` |
| `.kiro/steering/foundry-verification.md`, `.atl/skill-registry.md` | Modify | Fix stale paths |

## Interfaces / Contracts

```typescript
// Persisted skills as keyed record (Decision 4) — one SchemaField per canonical id
skills: new SchemaField(Object.fromEntries(SKILL_IDS.map(id => [id, new SchemaField({
  rank: new NumberField({ integer: true, min: 0, initial: 0 }),  // PLAYER-OWNED, Culture-seeded
  spec: new NumberField({ integer: true, initial: 0 }),          // PLAYER-OWNED
})])));  // kin/vocation/item are DERIVED — NOT persisted

// Derived, assigned in prepareDerivedData (Decision 2) — class props, never schema:
declare skillTotals: Record<SkillId, number>;
declare hpMax: number;  // full Body Skill Bonus, Kin-capped, Soul-Damage-reduced
```

## Testing Strategy (strict TDD — RED first)

| Layer | What | Approach |
|-------|------|----------|
| Unit | Pure kernels (rank-bonus, dice-engine, rewritten rules) | vitest, VsD named worked examples (follow `spell-casting.ts`) |
| Model | `prepareDerivedData` per classification; SEEDED survives identity change | Instantiate DataModel via shim; assert derived output + `toObject()` has no derived keys |
| Regression | 3 live defects: rank-wipe, Body-name, ArrayField write | Test asserts the update **lands**, not just object shape |
| Migration | 1.x → v2 keyed record, derived-key stripping | `migrateData(legacySource)` assertions |
| Combat | attack/critical/fumble lookup | Table-driven — BLOCKED on data |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or
process-integration boundary. `vite.config.ts` copies static files at build time only.

## Migration / Rollout

Forward-only `static migrateData` per document, gated by `schemaVersion`; runs on load, no
user action. Per-slice rollback = revert the merge commit on the `v2` tracker branch.
Existing worlds untouched until the user installs v2.

## Open Questions

- [ ] **BLOCKER (Slice 8)**: user must supply the 6 attack + 9 critical + fumble numeric
      grids. Fumble JSON structure cannot be finalised until a sample grid arrives. No values
      will be invented.
- [ ] **Kin Max HP cap** source field/value on the Kin Item — confirm the exact path in
      `vsd-character.md` / Kin model (UNSPECIFIED here).
- [ ] **Soul Damage** mechanic — new PLAYER-OWNED field; confirm it permanently reduces the
      Body bonus and whether it has its own recovery rule (`vsd-character.md`).
- [ ] `fvtt-types@14.x` is **beta-only** for v14 — accept the beta pin or wait for stable
      (risk recorded).
