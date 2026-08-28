## Exploration: Foundry VTT 14 system for open00

### Current State
The repository is intentionally greenfield: the current checkout contains no application source, package manifest, test runner, or build configuration. `openspec/config.yaml` records Strict TDD but no executable test or build command. CodeGraph confirms that there are no indexed source files, so there is no current architecture to preserve.

The platform boundary and target are now explicit:

- The official API is currently labeled **Foundry VTT v14.365 Stable** and documents the supported public API surface ([v14 API](https://foundryvtt.com/api/)).
- Foundry's system-development guidance recommends starting with a minimal data model and expanding incrementally, and requires a root `system.json` manifest ([system development guide](https://foundryvtt.com/article/system-development/)).
- Foundry's data-model guide says type-specific system data should extend `foundry.abstract.TypeDataModel` and be registered through `CONFIG.<Document>.dataModels` ([system data models](https://foundryvtt.com/article/system-data-models/)).
- The v14 application guide says ApplicationV2 replaced the original Application API and was fully adopted by core in v13 ([ApplicationV2 guide](https://foundryvtt.com/api/modules/foundry.applications.html)).
- The system baseline is exactly **Foundry VTT 14.367**. The current `dnd5e` 6.0.x manifest also declares minimum `14.367` and verified generation `14` ([dnd5e 6.0.x manifest](https://raw.githubusercontent.com/foundryvtt/dnd5e/6.0.x/system.json)), but remains a reference implementation only. Compatibility claims must come from this system's own tests against build 14.367, not from dnd5e's manifest or architecture.

The supplied Markdown extraction supports the proposed vertical decomposition, but it is not canonical. The readable 574-page v1.5 PDF supplied for open00 is the primary rules source.

- Dice and open-ended roll foundations are introduced at lines 462-514; skill bonus construction and progression appear under `Chapter 6 - Skills`, lines 1978-2128.
- A minimal skill-roll kernel is independently testable from `Chapter 11 - Resolving Actions`, especially lines 3594-3645. The GM decides when and what to roll at lines 3602-3610 and chooses difficulty at lines 3629-3639, so those decisions must remain manual inputs rather than inferred automation.
- Save rolls are defined at lines 3700-3779; attacks defer to combat at lines 3781-3789; spell casting is defined at lines 3918-4051.
- Combat sequencing is defined at lines 5667-5805; a melee attack and attack-table resolution are defined at lines 5924-5992; conditions and health are defined at lines 6181-6292 and 6483-6595.
- Character creation spans lines 518-565 and chapters 2-9 (lines 590-3466); advancement begins at line 3467; travel, equipment, bestiary, and grimoire begin at lines 4243, 5011, 8945, and 10706 respectively.
- The extraction says there are eight skill categories at line 1982, but the table and advancement data list seven categories at lines 2001-2044 and 2110-2121. The approved canonicalization is **seven Skill Categories**, with **Magic Points as a separate development bucket**.
- The Spell Casting Table overlaps result 135 at lines 4042-4043. The approved canonicalization changes the second interval to **136-140 with SR 90**.
- Character-sheet extraction is unreadable at lines 3576-3584 and 19055-19125. These and all other extraction defects must be transcribed or checked against the PDF rather than repaired by inference.
- Distribution is private-use only. Complete core rules, character options, tables, equipment, Bestiary, and Grimoire are in scope; the bundled adventure is explicitly excluded. Automated packages and releases must fail closed against accidental public publication of protected content.

Source authority order is fixed:

1. The supplied v1.5 PDF is authoritative for rules and content.
2. The two approved local canonicalizations above override the corresponding PDF/extraction ambiguity for implementation.
3. Official Foundry v14 API and system-development documentation are authoritative for platform behavior; only public APIs may be used.
4. The VSD data toolbox at inspected commit [`e04ce2023870cfea333b25f26a1ddc29d769aa22`](https://gitlab.com/jbhuddleston/vsd/-/tree/e04ce2023870cfea333b25f26a1ddc29d769aa22/data-toolbox) is a secondary cross-check only. It targets Foundry 12, repeats known defects, lacks provenance and validators, omits the Bestiary, and contains contaminated spell text; no value may be imported without PDF verification.
5. dnd5e is a platform-pattern reference only, and the Foundry League material is supplemental only.

### Affected Areas
- `openspec/config.yaml` — existing Strict TDD and greenfield constraints that all later phases must honor.
- `src/` — prospective source boundary for pure mechanics, Foundry data models/documents, ApplicationV2 sheets, and platform adapters; it does not exist yet.
- `test/` — prospective unit, contract, and Foundry integration tests; it does not exist yet and needs a test runner before product code.
- `dist/` — prospective generated installable private-use system package; it must be reproducible from approved inputs and never treated as authored source.
- `.github/workflows/` — prospective CI and tagged automatic-release automation; release jobs must verify repository/release privacy and abort before upload if public exposure is possible.
- `system.json` — prospective manifest pinned to minimum build `14.367`, with verified compatibility supported by this system's own build-14.367 smoke evidence.

### Approaches
1. **Mechanics-first vertical slices behind a Foundry adapter** — keep deterministic game mechanics in pure modules, then expose each completed slice through TypeDataModel-backed documents and ApplicationV2 sheets.
   - Pros: Enables micro-TDD without a Foundry runtime for most rules; validates real user journeys incrementally; limits Foundry API coupling; supports the requested `src/`, `test/`, and `dist/` split.
   - Cons: Requires explicit adapter contracts and a small Foundry test fixture; some integration behavior cannot be proven with unit tests alone.
   - Effort: High

2. **Platform shell first, then broad rules implementation** — establish manifests, sheets, document types, CI, and packaging before implementing mechanics by subsystem.
   - Pros: Produces an installable Foundry package early and exposes integration problems quickly.
   - Cons: Encourages placeholder schemas and UI-driven domain coupling; delays proof of rules correctness; creates larger, less reviewable batches.
   - Effort: High

3. **Content-first compendium conversion** — populate all in-scope tables, spells, equipment, and creatures before mechanics.
   - Pros: Makes reference material visible early.
   - Cons: Front-loads the largest and least reliable scope; amplifies transcription risk; risks encoding incorrect tables before the roll kernel and validators exist.
   - Effort: Very High

### Recommendation
Use **mechanics-first vertical slices behind a Foundry adapter**. Establish the test/build/release skeleton as the first enabling slice, but make every later slice complete from deterministic rules test through Foundry-facing interaction and packaged output. Do not copy dnd5e's domain model, scale, or rules; use it only to observe packaging and integration patterns.

Recommended dependency order:

1. Build and release foundation: `src/`, `test/`, generated `dist/`, lint/type/test/build checks, GitHub Actions, Conventional Commits, and tag-driven automatic private packaging/release. Pin Foundry `14.367`, add a compatibility smoke test, and make privacy validation a release precondition.
2. Roll kernel: open-ended d100 plus outcome mapping, with GM-supplied difficulty and modifiers.
3. Minimal PC: one Actor TypeDataModel, derived skill bonus, one skill, and one ApplicationV2 sheet interaction.
4. Toughness and Willpower saves.
5. One melee weapon attack, one armor target, and only the canonical attack/critical tables needed for that journey.
6. HP, one critical path, bleeding/stun, and the minimum condition lifecycle.
7. Tactical Round phases and action accounting, preserving GM overrides where the text requires judgment.
8. Equipment and wealth mechanics.
9. One representative Spell Lore through casting, save, cost, and duration, using the approved `136-140 -> SR 90` canonicalization.
10. Character builder, then advancement.
11. Complete the remaining core content in bounded slices: travel, wealth extensions, Bestiary, Grimoire, and other core options. Exclude the bundled adventure from source, tests, packages, and releases.

Automation must compute deterministic consequences and table lookups only. GM choices—whether a roll is needed, difficulty, situational rulings, complications, phase exceptions, and fiction-dependent outcomes—must remain explicit prompts or manual controls and require GM confirmation before state changes. Each optional rule must be an independent Foundry world setting and default to disabled.

### Risks
- **Private-release exposure** — an incorrect repository visibility or workflow permission could publish protected material. CI must inspect visibility, use an explicit private-release authorization, audit package contents, and abort before upload on any mismatch.
- **Transcription drift** — the 574-page PDF and defective Markdown make manual data entry error-prone. Every imported table/content record needs provenance plus validators or fixture comparisons against the PDF.
- **Secondary-source contamination** — VSD toolbox values, especially spell text, cannot be trusted without item-level PDF verification and must never silently override primary data.
- **Runtime proof gap** — pure mechanics tests cannot prove Foundry document, sheet, hook, permission, migration, or world-setting behavior. Every platform-facing slice requires build-14.367 integration or smoke evidence.
- **Scope volume** — complete core rules, Bestiary, and Grimoire are large. Vertical slices and the 400-line review guard must prevent content volume from becoming unreviewable batches.
- **GM-authority regression** — later convenience automation may accidentally cross the approved boundary. Tests must assert confirmation gates for every rule-assigned or narrative GM decision.

### Ready for Proposal
Yes. The source hierarchy, approved canonicalizations, Foundry 14.367 baseline, private complete-core scope, adventure exclusion, optional-rule settings model, GM-confirmation boundary, and private automatic-release constraint are explicit. No evidence-based product or source blocker remains for proposal work; the residual risks above should become acceptance criteria and delivery safeguards.

## Amendment: VSD Data Toolbox Inventory

### Inspection Scope and Trust Boundary

The local read-only shallow clone at `/tmp/vsd-source` is clean, tracks `origin/main`, and resolves to the requested commit `e04ce2023870cfea333b25f26a1ddc29d769aa22` (`2026-01-20`, `hp and mp in template`). All 48 tracked files under `data-toolbox/` were inspected: 10 data files, 21 HTML tables, 11 templates, four JSON character examples, one XML character example, and one XLSX helper. The clone contains only that shallow commit, so it proves the reviewed snapshot but not earlier authorship history.

CodeGraph was checked first. It indexes only `openspec/config.yaml` and no application code; it does not index the OpenSpec Markdown or the external toolbox. The exact OpenSpec files and toolbox files were therefore read directly. Local evidence was sufficient, so no live GitLab browsing was needed.

The toolbox is a **secondary comparison corpus**, never an import authority. The user-supplied v1.5 PDF remains authoritative; approved decisions still override extraction ambiguity: Spell Casting `136–140 -> SR 90`, seven Skill Categories, and a separate Magic Points bucket. Legacy Foundry architecture, document shapes, formulas, HTML event classes, and templates must not be ported.

### Reusable Table Candidates

Every row below is reusable only after item-level PDF verification and canonical re-authoring.

| Source path | Format and semantics | Embedded metadata | Parser complexity | Classification | Canonical ownership | Provenance/licensing concern |
|---|---|---|---|---|---|---|
| `tables/attacks/edged.html` | HTML matrix; Edged attack total by NA/LA/MA/HA, 29 attributed bands `11–35` through `171–175`, plus implicit `<=10` miss | Table `7.1`; armor code, hits, critical severity | Medium: HTML cells and `data-*` agree often, but must be cross-validated | rules-engine lookup | `AttackTable(edged)` in canonical content; pure lookup in domain | Full rules text/numbers require PDF proof; Apache repository license is not evidence of game-content redistribution rights |
| `tables/attacks/blunt.html` | Same matrix shape for Blunt attacks | Table `7.2`; armor, hits, critical | Medium | rules-engine lookup | `AttackTable(blunt)` | Same concern |
| `tables/attacks/missile.html` | Same matrix shape for Missile attacks | Table `7.3`; armor, hits, critical | Medium | rules-engine lookup | `AttackTable(missile)` | Same concern |
| `tables/attacks/unarmed.html` | Same matrix shape for Unarmed/Grapple attacks | Table `7.4`; armor, hits, critical | Medium | rules-engine lookup | `AttackTable(unarmed)` | Same concern |
| `tables/attacks/area-spells.html` | Same matrix shape for Area Spell attacks | Table `7.5`; armor, hits, critical | Medium | rules-engine lookup | `AttackTable(area-spell)` | Same concern |
| `tables/attacks/bolt-spells.html` | Same matrix shape for Bolt Spell attacks | Table `7.6`; armor, hits, critical | Medium | rules-engine lookup | `AttackTable(bolt-spell)` | Same concern |
| `tables/attacks/beast.html` | Same matrix shape for Beast attacks | Table `7.7`; armor, hits, critical | Medium | rules-engine lookup | `AttackTable(beast)` | Same concern |
| `tables/critical/{beast,impact,cut,pierce,grapple,fire,lightning,frost,darkmagic}.html` | Nine HTML critical tables, each with 23 roll bands through `150`; narrative plus conditional wounds/effects | Tables `7.8–7.16`; wound title, condition discriminator, two branches of hits/bleed/action/effect | High: conditional branches encode legacy assumptions; string `"null"`, inconsistent first-band spelling, and malformed non-breaking-space tags require rejection/normalization | rules-engine lookup | Nine `CriticalTable` records plus typed `CriticalOutcome` branches | Narrative and mechanics require per-band PDF proof; do not treat legacy branch decomposition as canonical merely because attributes exist |
| `tables/general/SpellCastingTable.html` | HTML casting outcomes: failure, partial-success choices, save target numbers, and outstanding-success choices | Table `2.6`; roll bands and prose outcome | High: 18 unique bands but 27 choice-level attributes; malformed tags and choice rows | rules-engine lookup | `SpellCastingTable` plus typed choice/outcome records | Contains the known invalid `135–140 -> SR 90`; canonical record MUST use approved `136–140 -> SR 90` and retain decision provenance |
| `tables/general/SpellFailureTable.html` | Five-band spell-failure fallout with one or more player/GM choices and resonance references | Table `2.10`; band, selectable effect prose | High: 12 choice-level outcomes, mixed random/GM target selection, references a missing Magical Resonance table | random RollTable | `SpellFailureTable`; domain resolves the explicit random total and returns pending choices | PDF verification required; missing resonance dependency prevents standalone completion and GM choices must not auto-mutate |
| `tables/general/FearSaveRollsTable.html` | Five modified-save bands with named fear outcomes; one band has three choices | Table `3.9`; band, outcome, effect | Medium-high: seven outcome attributes for five bands and scene-dependent consequences | rules-engine lookup | `FearSaveTable` and pending-effect proposals | PDF proof required; death, rerolls, random direction, and scene duration cross the authority/effect boundary |
| `tables/general/ReactionRollsTable-{Combat,Interaction}.html` | Two five-band reaction/disposition views sharing thresholds but different narrative guidance | Table `3.4`; band, disposition, context text | Low-medium | rules-engine lookup | One `ReactionTable` with typed `combat` and `interaction` contexts | Narrative is GM guidance, not autonomous NPC behavior; retain as proposed/reference outcome until confirmed |

No standalone generic Toughness Save, Willpower Save, resistance, Magical Resonance, skill-category, advancement, or random-background table exists in the toolbox. Those records remain PDF-only work. Fear is the only supplied save-outcome table; spell casting supplies save target numbers, not the target's save resolver.

### Reusable Compendium Candidates

| Source path | Format and semantics | Embedded metadata | Parser complexity | Classification | Canonical ownership | Provenance/licensing concern |
|---|---|---|---|---|---|---|
| `data/Backgrounds.csv` | UTF-8-BOM CSV; 40 backgrounds with intro, minor benefit, and major benefit | Names and full rules prose; no source locator/version/hash | Medium because quoted prose contains punctuation and rules references | compendium | `Background` canonical records; generated Item compendium | Complete protected prose with no item provenance; PDF page/anchor and verification are mandatory |
| `data/vsd-background-container-data.csv` | 40 names plus double-encoded JSON arrays of legacy Trait/Modifier/Variable documents | Legacy `chartype`, categories, formulas, modifier targets | High | reference-only | None; compare possible structured effects against verified `Background` records | Derived legacy documents duplicate `Backgrounds.csv`; never import or own canonical effects |
| `data/vsd-kin-trait-data.csv` | UTF-8-BOM CSV; 38 kin-trait names and descriptions | No kin ownership, source location, or mechanical typing | Low syntactically, high semantically | compendium | `KinTrait` records linked from PDF-authored `Kin` records | Toolbox has traits but no Kin records; PDF must establish ownership and exact rules |
| `data/vsd-kin-trait-container-data.csv` | 38 double-encoded legacy document arrays | Trait/Modifier data and formula targets | High | reference-only | None | Name drift (`Aversion` versus `Aversion to Iron`) proves the derived container is not identity-safe |
| `data/vsd-melee-attack-data.csv` | UTF-8-BOM CSV; 49 rows describing melee weapons/attack modes | Hands, skill, clumsy, length, attack/critical tables, cap, range, qualities, formula | Medium-high | compendium | `Weapon` plus explicit `WeaponAttackMode` variants | 13 repeated names encode alternate modes and some duplicate-looking rows without stable IDs; identity and values require PDF verification |
| `data/vsd-ranged-attack-data.csv` | UTF-8-BOM CSV; 11 ranged rows | Same 14 columns as melee | Medium | compendium | `Weapon` plus ranged attack modes | `Sling` appears twice with different maxima (`110`, `130`); do not deduplicate by name or choose by inference |
| `data/vsd-spell-lore.csv` | Wide UTF-8-BOM CSV; 38 lores x ten repeated weave column groups (105 columns) | Lore stat, PDF-like page number, vocations, spell fields, warps, slug | Very high: denormalized schema, OCR/table-header contamination, embedded next-lore prose | reference-only | None directly; cross-check normalized `SpellLore` and `Spell` canonical records | All 38 rows show contamination signatures; page numbers are unverified and cannot serve as provenance alone |
| `data/vsd-spells.csv` | Normalized UTF-8-BOM CSV; 380 rows = 38 lores x ten weaves | Range, area, duration, save, description, up to three warps, lore slug, optional attack linkage | High | compendium | `SpellLore` and `Spell` records; generated Lore/Spell compendiums | At least 38 boundary-contaminated descriptions include repeated `Weave Spell Range...` headers or next-lore prose; reject known signatures and verify every field against PDF |
| `data/vsd-spell-attack-data.csv` | UTF-8-BOM CSV; 18 attack spells derived from spell data | Lore/weave/spell, range/effect/save, attack kind, critical type, table references, maximum | Medium | reference-only | Derived view generated from canonical `Spell` attack profiles | Descriptions/warps are blank; this duplicates spell linkage and must never become a second source of truth |

`vsd-spells.csv` has exactly ten records per lore and 18 attack-linked spells, but those cardinalities are validation hints only. Repeated spell names can legitimately occur across lores, so canonical identity must be `(loreId, weave, spellId)`, not display name.

### Non-Reusable and Architecture-Bound Assets

| Source path/pattern | Finding | Classification | Disposition |
|---|---|---|---|
| `templates/vsd-*.json` | Eleven Mustache-style legacy generators emit old `data` payloads, custom document types (`Melee-Attack`, `Rollable`, etc.), HTML journals, magic formulas, and hard-coded UI classes/events | UI / ignore | Do not port. Re-specify v14 TypeDataModel schemas and ApplicationV2 views; at most use field presence as a discovery checklist |
| `data/token-tooltip-alt-vsd-config.json` | Third-party/token-tooltip configuration tied to legacy `system.*` paths, `flags.vsd.action`, actor types, icon classes, and expression syntax | UI / ignore | Defer unless token tooltips become an explicit v14 requirement; never make it a core schema dependency |
| `NPC Stat Block Creator.xlsx` | One sheet (`B2:E33`), 77 cells, 16 formulas; concatenates a manually entered NPC text block | reference-only / ignore | The labels hint at NPC display fields, but it is not a canonical Bestiary schema, importer, or validator |
| `{gandrell,mornien,syndel,robbie}.json`, `robbie.xml` | Five external character examples with inconsistent root shapes, embedded avatars, eight categories, and unrelated progression/import fields | ignore | Do not use as fixtures or migrations; they conflict with the approved seven-plus-Magic-Points model and have no PDF provenance |

The repository root carries Apache-2.0 and no NOTICE file. That license can govern repository-authored software, but the snapshot does not establish that copied open00 rule text, tables, names, or other game content may be redistributed under Apache-2.0. The README calls the project the official Foundry system, but that statement is not a content-license grant. Private-use packaging remains the only approved distribution posture, with source records tracking both PDF provenance and secondary snapshot references.

### Canonical Data and Build Boundaries

Canonical content should use normalized, Foundry-free types owned under `src/content/`, not legacy HTML/CSV shapes:

- `SourceEvidence`: stable record ID, source kind, PDF page/anchor, source hash, verifier/date, approved-decision ID, secondary `{repository, commit, path, row-or-band, hash}`, scope, and license disposition.
- `Interval<T>`: explicit inclusive lower/upper bounds (or open bound), with a typed value and stable ordering.
- `AttackTable`: attack kind, armor columns, bands, hits, and optional critical severity.
- `CriticalTable`: critical kind, bands, narrative, typed condition predicate, and one or more effect branches.
- `SpellCastingTable`, `SpellFailureTable`, `FearSaveTable`, and `ReactionTable`: bands plus typed outcomes/choices; GM-owned branches remain pending commands.
- `Weapon` with stable `WeaponAttackMode`; `Background`; `Kin` and `KinTrait`; `SpellLore`; and `Spell` with optional attack profile.

Pure `src/domain/` services consume those records and explicit roll/input sequences. They own lookup, validation, and proposed effects, but not prose rendering, random-number generation hidden from traces, or state mutation. `src/foundry/` owns v14 document registration, permissions, confirmation, ApplicationV2 presentation, and conversion from canonical records to Foundry document sources.

The deterministic content toolchain should read only PDF-verified canonical records, validate them aggressively, sort by stable IDs, emit reproducible document-source JSON, and then build private compendium packs under `dist/`. VSD files may feed a separate read-only comparison report, never the production generator input. The pack adapter and emitted packs require exact Foundry `14.367` load/query/render evidence; Node-only snapshots prove determinism but not Foundry compatibility. Generated packs must preserve source IDs and provenance without exposing local absolute paths.

### Validation and Boundary-Test Requirements

- Reject missing PDF evidence, VSD-only records, adventure scope, unknown license disposition, duplicate stable IDs, unstable order, dangling table/lore/trait references, and output containing local paths.
- Require complete, non-overlapping interval coverage appropriate to each table. Pin boundaries: attack `10/11`, `35/36`, `175`; critical `5/6`, `149/150`; fear `-51/-50`, `-25/-24`, `-1/0`, `50/51`; reaction `0/1`, `25/26`, `75/76`, `100/101`; failure `75/76`, `100/101`, `125/126`, `150/151`; casting `25/26`, `50/51`, `135/136`, `140/141`, `150/151`, `175/176`.
- Require the corrected casting bands `131–135 -> SR 85` and `136–140 -> SR 90`; explicitly reject legacy `135–140` overlap.
- Validate attack matrices against their armor-column domain and validate critical branch fields against narrative/effect schemas; string `"null"` is invalid canonical data.
- Validate 38 lores x ten weaves only after PDF verification; reject known contamination markers such as `Weave Spell Range Area of Effect Duration Save` and appended next-lore introductions.
- Exercise BOM handling, quoted multiline CSV, double-encoded JSON rejection, malformed non-breaking-space HTML tags, repeated display names with distinct variants, Unicode normalization, and deterministic rebuild hashes.
- Prove that lookup results are immutable and replayable, random results retain supplied die traces, GM choices create no writes before confirmation, and compendium generation cannot bypass the central mutation/privacy gates.

### Task-Plan Impact

The current 112-leaf plan remains directionally valid but needs discovery-driven refinement before affected apply slices:

1. **Expand P3 source governance** into canonical evidence/schema, secondary-snapshot manifest, comparison-only readers, contamination/license/adventure rejection, and deterministic generator/pack audit. Do not create a production VSD importer.
2. **Split P13–P16 by table family**: seven attack-table records, nine critical-table records, PDF fixtures, interval/matrix validators, lookup mechanics, compendium emission, and exact-14.367 pack evidence. Keep each bounded batch below the review guard.
3. **Split P23–P25 and P32–P33** into casting/failure schemas, lore/spell schemas, contamination rejection, representative verified lore, attack-profile derivation, then bounded per-lore PDF batches. Add Magical Resonance as an explicit dependency or defer spell-failure completion.
4. **Route backgrounds and kin traits to P27**, weapons to P10/P22, and reaction/fear tables to the saves/social-content slices. Add Kin records and generic Toughness/Willpower/resistance content from the PDF because the toolbox does not supply them.
5. **Keep Bestiary P30–P31 PDF-only**. The XLSX and character examples are not Bestiary fixtures. Defer legacy templates, tooltip configuration, and sample-character migration unless separately requested.
6. **Add per-pack runtime receipts** for generated Background, Kin, Weapon, Spell Lore/Spell, attack-table, critical-table, and general-table compendiums; Node generator proof cannot satisfy the Foundry boundary.

The exploration does not require production code. Proposal/spec/design scope remains valid; tasks require these splits and dependencies before the corresponding content batches begin.
