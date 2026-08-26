# Proposal: Open00 v2 — Full Architecture Restructure

## Intent

Eliminate architectural root causes behind three confirmed live defects and multiple fabricated-rules subsystems in the Open00 FoundryVTT v14 system. Eight prior consecutive bugfix commits failed — one (`clearAllIdentityEffects`) introduced a worse bug — proving that local patching cannot fix systemic problems (persisted derived state with no owner, fictional type layer, tests that cover only unbroken math). This major version restructures the data ownership model, corrects rules fidelity against VsD v1.5 (`.kiro/steering/vsd-*.md`), and establishes a testable boundary at the document level.

## Scope

### In Scope (10 slices — all ship in v2.0)

- Adopt community Foundry types; reduce `src/types/foundry.d.ts` to thin system augmentation
- Introduce `CONFIG.Actor/Item.documentClass` subclasses owning all derived-state computation
- Rewrite `prepareDerivedData` per VsD v1.5 (see Field Classification Table below)
- Remove persisted derived fields from Actor schema; implement `static migrateData` for existing worlds
- Rewrite fabricated rules (travel, encumbrance, drive-points, advancement) + their tests against VsD v1.5
- Implement combat tables (6 attack, 9 critical, fumble) with shipping path via vite — **BLOCKED on user-supplied table data** (see Dependencies)
- Fix three deterministic defects: `clearAllIdentityEffects` rank-wipe, Body Development name mismatch, ArrayField partial-update rejection
- Foundry v14 API compliance: Roll API for all dice, trackable attributes, token attributes, `LOCALIZATION_PREFIXES`, system.json version field, correct ArrayField initialization
- Localization sweep: extract ~190 hardcoded strings; maintain en/es parity; fix `es.json` missing `OPEN00.Saves.KinBonus` and `TYPES.Item.spellLore` missing from both files
- Establish document-level test capability (Foundry shim or mock layer)
- Correct stale context: `.kiro/steering/foundry-verification.md` paths, `.atl/skill-registry.md` OS paths, `tsconfig.json` aliases

### Out of Scope

- New game features not in VsD v1.5 core rules
- Visual/CSS redesign (handled separately in `css-foundry-cleanup`)
- Compendium content authoring beyond structural tables
- Character creation wizard / guided workflows
- Multi-system or plugin architecture
- Chat card redesign beyond Roll API integration
- Recovery tool for rank-zeroed characters (data is gone; release note + manual re-entry)

## Field Classification Table

**Architectural rule**: DERIVED fields are recomputed freely in `prepareDerivedData` and never persisted. PLAYER-OWNED fields persist and are never auto-overwritten. SEEDED fields are computed once at a defined trigger (e.g., identity item drop), then become player-owned — subsequent derivation must not overwrite them. The `clearAllIdentityEffects` data loss exists precisely because this distinction was not enforced: `skills.N.rank` (player-owned) was treated as identity-derived and zeroed on vocation change.

| Field | Classification | Derivation / Ownership Rule | VsD Reference |
|-------|---------------|----------------------------|---------------|
| `stats.*.base` | PLAYER-OWNED | Rolled/assigned at creation; never auto-modified | vsd-character.md §Stats |
| `stats.*.kin` | DERIVED | From equipped Kin item's stat modifiers | vsd-character.md §Kin Modifiers Table |
| `stats.*.spec` | PLAYER-OWNED | Background Options or special grants; player assigns | vsd-character.md §Background Options |
| `hp.max` | DERIVED | = Body Skill Bonus = (Body rank × rank bonus) + Kin HP modifier, capped by Kin Max HP | vsd-character.md §Body Skill, §Derived Attributes |
| `hp.value` | PLAYER-OWNED | Current HP; modified by damage/healing; allow negative (Incapacitated ≤0, Dying ≤-50) | vsd-core-rules.md (implicit: damage tracking) |
| `mp.max` | DERIVED | = (Stat MP gain + Vocation MP gain) × Level + Kin MP bonus | vsd-character.md §Derived Attributes |
| `mp.value` | PLAYER-OWNED | Current MP; spent by casting, recovered by rest | vsd-magic.md §Casting |
| `drivePoints.max` | DERIVED | Always 5 (VsD range: 0-5) | vsd-core-rules.md §Drive |
| `drivePoints.value` | PLAYER-OWNED | Current Drive; gained by following Passions, spent on bonuses/Heroic Path | vsd-core-rules.md §Drive |
| `defense` | DERIVED | = max(SWI stat total, 0) + armor/shield/item bonuses | vsd-character.md §Derived Attributes |
| `encumbrance` | DERIVED | Qualitative assessment from carried items (not weight-based); BRN30+/FOR30+/Large reduces by one level | vsd-travel-healing.md §Encumbrance |
| `wealth` | SEEDED | **Starting**: Kin WL + Culture WL + Background Options (clamp max 4, min 0). **Then player-owned**: buying at WL==Fare drops WL by 1; treasure where TV>WL raises to TV, TV==WL raises by +1. Must NOT re-derive after initial seed. | vsd-equipment.md §Starting WL, §Buying Goods, §WL vs Treasure Value |
| `level` | PLAYER-OWNED | Derived from `experience.total` via XP table (10/lvl L1-5, 20/lvl L6-10, 30/lvl L11-15...) but once set, level-up triggers DP allocation — effectively player-owned because rollback would lose spent DP | vsd-core-rules.md §Experience & Levels |
| `experience.total` | PLAYER-OWNED | Accumulated XP from session awards | vsd-core-rules.md §Experience & Levels |
| `experience.dp` | PLAYER-OWNED | Available DP this level; unspent DP lost at next level-up | vsd-character.md §Advancement |
| `skills.N.rank` | PLAYER-OWNED | Player spends DP to increase; max 2 ranks/skill/level. **Never zero on identity change.** | vsd-character.md §Advancement |
| `skills.N.vocation` | DERIVED | From equipped Vocation item's vocational bonuses | vsd-character.md §Vocations |
| `skills.N.kin` | SEEDED | From Kin item's cultural skill ranks at assignment; then player-owned (cultural ranks don't count toward max developable) | vsd-character.md §Cultural Skill Ranks |
| `skills.N.spec` | PLAYER-OWNED | From Background Options or special grants | vsd-character.md §Background Options |
| `skills.N.item` | DERIVED | From equipped Item of Power / magic item bonuses | vsd-equipment.md §Magic Items |
| `passions.*` | PLAYER-OWNED | Chosen at creation; change at narrative turning points (player/GM decision) | vsd-character.md §Passions |
| `heroicPath` | PLAYER-OWNED | Total Drive spent on Heroic Path (tracked, player-driven) | vsd-core-rules.md §Heroic Path & Milestones |

**Existing fidelity gap** (to fix in v2): `kin-culture-vocation-effects.ts:90-91` computes wealth as `kin.startingWealth + culture.startingWealth`, omitting Background Options and the max-4 clamp. v2 must seed wealth correctly and then never overwrite it.

## Capabilities

### New Capabilities

- `derived-state-ownership`: Document subclasses own all stat derivation per the classification table above; zero derived data in schema persistence
- `data-migration`: Versioned `static migrateData` for Actor/Item; world migration on version bump
- `combat-tables`: Attack, critical, and fumble table data + lookup engine with vite shipping path
- `document-test-shim`: Foundry mock/shim layer enabling vitest to instantiate DataModels and validate derived state

### Modified Capabilities

- `character-engine`: All rules modules (travel, encumbrance, drive-points, advancement) rewritten to VsD v1.5
- `character-sheet`: Sheet becomes presentation-only; no longer computes or persists derived state
- `dice-rolling`: Replace `Math.random()` with Foundry Roll API across all roll paths

## Approach

**Workstream order** (dependency-driven):

1. **Types foundation** — Adopt community Foundry types; compiler finds existing defects. Fix tsconfig aliases.
2. **Document subclasses + derived state** — Create Actor/Item document classes in `CONFIG.*`; move derivation to `prepareDerivedData`; remove derived fields from schema; implement `migrateData`.
3. **Rules fidelity** — Rewrite each fabricated module + its test suite together (travel → encumbrance → drive-points → advancement → SR Level Bonus / TSR / WSR).
4. **Combat tables** — Transcribe user-supplied table data; engine lookup module; fix vite copy path. **Blocked until user provides numeric grids.**
5. **Foundry v14 compliance** — Roll API, trackableAttributes, token attrs, LOCALIZATION_PREFIXES, system.json version, ArrayField init.
6. **Localization + housekeeping** — Extract hardcoded strings (en/es parity), correct stale steering/registry/tsconfig.

Workstreams 1-2 sequential. 3-4 parallelize after 2. 5-6 parallelize after 2.

**NPCs**: Derive only the fields `vsd-bestiary.md` actually defines (Level, MR, AT, DEF, TSR, WSR, HPs, CT, Attacks, Abilities). No character-grade full derivation. NPCs stay lightweight with manual entry for fields the bestiary doesn't specify.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/foundry.d.ts` | Modified | Thin augmentation over community types |
| `src/module/models/actor/*` | Modified | Schema removes derived fields; classification enforced |
| `src/module/models/item/*` | Modified | Minor: Item subclass registration |
| `src/module/sheets/*` | Modified | Becomes presentation-only |
| `src/module/engine/*` | Modified | Rules rewrite (4 modules + combat) |
| `src/open00-system.ts` | Modified | Register document classes, fix trackable attrs |
| `src/data/` | New | Combat table JSON files (when data is supplied) |
| `src/module/documents/` | New | Actor/Item document subclasses |
| `tests/` | Modified | New shim, document-level tests, rewritten rule tests |
| `vite.config.ts` | Modified | Copy `src/data/` to `dist/` |
| `src/system.json` | Modified | version field, correct token attrs |
| `src/lang/{en,es}.json` | Modified | +190 keys extracted; fix missing keys |
| `.kiro/steering/foundry-verification.md` | Modified | Correct file paths |
| `.atl/skill-registry.md` | Modified | Linux paths |
| `tsconfig.json` | Modified | Fix path aliases |

## Data Migration Strategy

**What must migrate (forward-only, accepts any 1.x):**
- Persisted `stats.*.kin` → delete from stored data (now derived at runtime)
- `hp.max` persisted → delete (derived from Body rank + kin cap)
- `skills.N.vocation` → delete (derived from Vocation item)
- `wealth` → **preserve as-is** (it is SEEDED then player-owned; re-deriving would erase purchases/treasure)
- `hp.value` `min: 0` constraint removed → allow negative (Incapacitated/Dying)
- Fabricated `rank: 30` cap in schema → removed (VsD has no global cap; limit is per-category DP)

**What is unrecoverable:**
- Characters whose `skills.N.rank` was zeroed by `clearAllIdentityEffects` — data is gone from the Actor. Release note + manual re-entry. No recovery tool (cannot distinguish legitimate 0 from bug-induced 0).
- Players who invested DP under the fabricated rank-30 ceiling — their builds are valid under real VsD rules.

**Migration mechanism:** `static migrateData(source)` on each document class, versioned by a new `schemaVersion` field. Runs transparently on document load; batch migration optional via settings dialog. Accepts any 1.x source (forward-only, cheap).

## Testing Strategy Shift

1. **Document-level shim** (`tests/foundry-shim.ts`): mock `TypeDataModel`/`Actor`/`Item` for vitest
2. **Model unit tests** (`tests/models/`): validate derived state end-to-end (the exact path where all 3 live defects exist)
3. **Rules tests rewritten against VsD v1.5** named worked examples (following `spell-casting.ts` pattern)
4. **Existing engine tests preserved**; rewritten modules get new tests simultaneously (strict TDD: test first)

## Slice Plan (auto-chain, feature-branch-chain)

Tracker branch: `v2`. PR #1 targets `v2`; later PRs target the previous PR branch.

| # | Slice | Est. lines | Notes |
|---|-------|-----------|-------|
| 1 | Types foundation + tsconfig fix + stale context | ~300 | ≤400 |
| 2 | Document subclasses + prepareDerivedData skeleton | ~350 | ≤400 |
| 3 | Schema migration + remove persisted derived fields | ~350 | ≤400 |
| 4 | Document test shim + model tests | ~400 | At budget |
| 5 | Rules: travel + encumbrance rewrite (code+tests) | ~350 | ≤400 |
| 6 | Rules: drive-points + advancement rewrite (code+tests) | ~350 | ≤400 |
| 7 | Rules: SR Level Bonus, TSR/WSR, DEF, HP/MP derivation | ~350 | ≤400 |
| 8 | Combat tables (data + engine + vite path) | ~500 | **BLOCKED** — awaiting user-supplied table data. Data JSONs irreducible; low cognitive load despite line count |
| 9 | Roll API integration | ~300 | ≤400 |
| 10 | Localization + system.json + housekeeping | ~400 | At budget |

Slices 1-7, 9, 10 proceed independently of slice 8. Slice 8 unblocks only when the user supplies the numeric grids.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Community Foundry types lag behind v14 API | Medium | Pin exact version; keep thin augmentation layer for gaps |
| Migration destroys rank-zeroed chars further | Low | Migration preserves all numeric values; only removes fields that become derived |
| Existing worlds break on load without migration running | High | `migrateData` is sync on load; no explicit user action required |
| Combat table data never supplied (blocks slice 8) | Medium | Slices 1-7/9/10 deliver independently; v2.0 ships without combat if data absent |
| Seeded fields re-derived by future code | High | Classification table is the contract; tests assert wealth/kin-skills survive identity changes |
| Scope creep into visual redesign | Low | Explicitly out-of-scope; css-foundry-cleanup is a separate change |

## Rollback Plan

Per-slice: revert merge commit on tracker branch. Full: delete `v2` branch, keep shipping v1.x from `main`. Existing worlds are never modified by v2 code until the user installs the v2 release — at that point `migrateData` is forward-only.

## Dependencies

- Community Foundry type package (evaluate in slice 1)
- VsD v1.5 rules reference (`.kiro/steering/vsd-*.md`) — already in-repo
- **BLOCKED (slice 8)**: User must supply combat table numeric grids before implementation:
  - 6 attack tables (Edged, Blunt, Missile, Unarmed/Grappling, Beast, Bolt/Area Spells): CMB result → base damage + critical severity, per armor column (NA/LA/MA/HA)
  - 9 critical tables (Impact, Cut, Pierce, Grapple, Fire, Lightning, Frost, Dark Magic, Beast): roll result → effect text rows
  - Fumble tables

  **Proposed data format for handoff** (so the user knows exactly what to deliver):
  ```
  src/data/attack-tables/{table-name}.json
  {
    "name": "Edged",
    "columns": ["NA", "LA", "MA", "HA"],
    "rows": [
      { "min": 1, "max": 10, "results": ["-", "-", "-", "-"] },
      { "min": 11, "max": 20, "results": ["0", "-", "-", "-"] },
      { "min": 21, "max": 30, "results": ["4", "0", "-", "-"] },
      ...
      { "min": 141, "max": 150, "results": ["22 Mod", "18 Lig", "14 Sup", "10 Sup"] }
    ]
  }

  src/data/critical-tables/{table-name}.json
  {
    "name": "Impact",
    "rows": [
      { "min": 1, "max": 5, "severity": "Superficial", "effect": "Bruise. No additional effect." },
      ...
    ]
  }
  ```
  **Under no circumstances will table values be generated, inferred, approximated, or defaulted.** Fabricating rules data is the single most damaging failure mode in this codebase (produced `travel.ts`, `encumbrance.ts`, `drive-points.ts`, `advancement.ts`).

  **What IS already available** (do not ask for these): weapon Max Result values (vsd-equipment.md weapons table), beast attack max results by size (vsd-bestiary.md), critical severity modifiers (+0/+10/+20/+30/+50), attack/critical table names, armor column names, result-reading semantics, Heroic/Epic severity reduction, clumsy range per weapon, fumble modifier per weapon category.

## Success Criteria

- [ ] Zero persisted derived state in Actor schema (per classification table)
- [ ] `prepareDerivedData` correctly computes all DERIVED fields per VsD v1.5 (tested)
- [ ] SEEDED fields (wealth, skills.N.kin) computed once at trigger, never overwritten after
- [ ] Three confirmed live defects are fixed with regression tests
- [ ] All four fabricated rules replaced with VsD-accurate implementations (tested)
- [ ] Combat tables shipped and functional (attack resolution returns a result) — conditional on data delivery
- [ ] All rolls use Foundry Roll API (dice tooltips visible, roll modes work)
- [ ] `static migrateData` upgrades any 1.x world without data loss (beyond unrecoverable items)
- [ ] Document-level tests exist for every derivation path
- [ ] `tsc --noEmit` clean with community types (not `Record<string, unknown>`)
- [ ] Localization: zero hardcoded user-facing strings; en/es at parity; missing keys fixed
