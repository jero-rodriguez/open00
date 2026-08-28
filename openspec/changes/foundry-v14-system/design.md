# Design: Foundry VTT 14 open00 System

## Technical Approach

Deliver mechanics-first vertical slices. Authoritative PDF evidence and approved decisions become verified canonical records; validators admit them to pure Foundry-free mechanics; adapters then generate Foundry v14 documents, packs, UI, and runtime tests. TypeScript, Vitest, an npm lockfile, and Node `.mjs` tools establish the greenfield harness; generated `dist/` is never authored source.

## Architecture Decisions

| Decision | Choice and rationale | Rejected tradeoff |
|---|---|---|
| Trust | `PDF/approved decisions -> canonical records -> validators -> src/domain -> src/foundry/packs/tests`. VSD `data-toolbox` commit `e04ce2023870cfea333b25f26a1ddc29d769aa22` feeds reproducible comparison reports only; production generators cannot read raw VSD files. | Direct import would elevate unproven, contaminated Foundry-12 data. |
| Mechanics | Pure attack, critical, and general-table resolvers accept explicit records/rolls and return immutable structured results, choices, and proposed effects without Foundry globals, randomness, writes, or mutation. | Embedded document mutation hides GM decisions and inputs. |
| Foundry | Public `TypeDataModel`, `CONFIG.<Document>.dataModels`, and ApplicationV2 adapters own registration, permissions, confirmation, and writes. A central gateway binds authorized GM confirmation to exact pending inputs. | ApplicationV1/private APIs or direct writes violate the boundary. |
| Content views | Canonical content generates v14 document sources and private compendium packs. RollTables are optional random/convenience views, never canonical deterministic lookup storage. | Authoring RollTables first loses typed semantics and stable identity. |
| Compatibility | `dist/system.json` minimum/verified is exactly `14.367`; each Foundry-facing pack/slice needs exact `14.367` load/query/render evidence or remains `NOT VERIFIED`. | Node proof or generation `14` overclaims runtime compatibility. |
| Options/migration | Optional rules are independent world booleans defaulting false. Integer schema versions use pure idempotent migrations; GM-only world migration requires backup, dry-run, and bounded batches. | Coupled settings and monolithic migrations weaken isolation and rollback. |

## Canonical Contracts

`SourceEvidence` carries stable record ID, PDF page/anchor/hash, verifier/date, approved-decision ID, secondary snapshot path/row/hash, scope, and license disposition. `Interval<T>` uses explicit inclusive/open bounds and stable order. `AttackMatrix` owns attack kind, armour columns, bands, hits, and optional `CriticalSeverity`; `CriticalTable` owns bands with typed predicate and `CriticalOutcome` branches. General `ResolutionTable<T>` owns bands plus structured outcomes/choices.

At comparison/import boundaries, aliases normalize to stable `CriticalSeverity` and `ArmourCategory` enums before validation; unknown values fail. Content types are `Weapon` + stable `WeaponAttackMode`, `Background`, `Kin` + `KinTrait`, and `SpellLore` + `Spell` + optional `SpellAttackProfile`. Repeated display names never define identity.

## Data and Evidence Flow

```text
PDF/decisions -> canonical records -> validation -> domain resolvers
VSD snapshot -----------------------> comparison report only
domain -> proposed effects -> GM confirmation -> Foundry update
canonical -> deterministic v14 sources/packs -> exact 14.367 evidence
```

Generators sort stable IDs, normalize Unicode, emit stable hashes/order, and reject missing per-record PDF proof, unknown licensing, adventure scope, VSD-only records, contamination, dangling/duplicate identities, and absolute paths. Magical Resonance, generic saves/resistance, Kin records, and Bestiary remain PDF-authored. Contaminated spell rows cannot be bulk promoted; each field requires PDF verification. Approved corrections remain `136–140 -> SR 90` and seven Skill Categories plus separate Magic Points.

## Files and Testing

| Boundary | Paths and proof |
|---|---|
| Domain/content | `src/domain/`, `src/content/`; unit fixtures cover intervals, matrices, branches, normalization, replay, contamination, provenance, and deterministic hashes. |
| Comparison/build | `tools/`; snapshot-pin/comparison contracts and production-input allowlists prove VSD isolation and path sanitization. |
| Foundry/package | `src/foundry/`, `src/templates/`, `test/runtime/foundry-14.367/`, generated `dist/`; public API, permission, migration, pack, and smoke receipts. |
| Delivery | `.github/workflows/`; Conventional Commits, reproducible build, content/privacy audit, and fail-closed private release. |

## Threat Matrix

| Boundary | Applicability; safe/failure behavior; planned RED tests |
|---|---|
| Documentation-like paths | **Applicable.** Allowlist build inputs; reject executable/unknown files. RED: `requirements.txt`, `CMakeLists.txt`, executable Markdown/MDX, `README.sh`. |
| Git repository selection | **Applicable.** Require resolved root and exact repository identity. RED: `git -C`, relative, absolute selectors. |
| Commit state | **Applicable.** Build exact tagged tree; reject divergence. RED: staged, `commit -a`, empty index. |
| Release mutation/upload | **Applicable.** Recheck private authorization, repository/tag/SHA, contents, and privacy before every mutation/upload/publication; fail closed on unknown. |
| Push state | **N/A.** Workflow performs no push. |
| PR commands | **N/A.** No PR composition is designed. |

## Rollout

Keep existing feature-branch-chain slices and release gates. Add comparison tooling before affected content slices, then bounded PDF-verified table/pack batches; generated-package rollback and reversible migrations remain mandatory. No blocking open questions.
