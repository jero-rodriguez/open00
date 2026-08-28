# Proposal: Foundry VTT 14 open00 System

## Intent

Build a private-use open00 v1.5 system as mechanics-first vertical slices for Foundry VTT `14.367`. Automate deterministic play without replacing GM judgment.

## Scope

### In Scope
- Core rules, character options, seven Skill Categories, separate Magic Points bucket, tables, equipment, Bestiary, and Grimoire.
- Public Foundry APIs only: `foundry.abstract.TypeDataModel`, `CONFIG.<Document>.dataModels`, and ApplicationV2.
- Independent optional-rule world settings, all disabled by default.
- Deterministic calculations and lookups; explicit GM confirmation before GM-owned decisions change state.
- `src/`, `test/`, generated `dist/`, GitHub Actions, Conventional Commits, and private automatic releases that fail closed against public exposure.
- First deliverable: test/build/release harness plus one testable roll-kernel slice using GM-supplied difficulty and modifiers.

### Out of Scope
- Bundled adventure and public distribution of protected content.
- Private Foundry APIs, inferred GM decisions, and a single 574-page implementation batch.

## Capabilities

### New Capabilities
- `system-foundation`: Strict-TDD harness, `14.367` manifest/smoke boundary, packaging, CI, and private-release safeguards.
- `rules-source-governance`: PDF-first provenance and validation; Spell Casting `136–140 → SR 90`; VSD secondary-only.
- `deterministic-roll-resolution`: Open-ended rolls and lookup with GM-provided inputs.
- `foundry-document-ui`: TypeDataModel documents and ApplicationV2 interactions.
- `gm-authority-and-options`: Confirmation gates and independent disabled-by-default optional rules.
- `core-system-content`: Incremental character, save, combat, condition, tactical, equipment, advancement, travel, Bestiary, and Grimoire.

### Modified Capabilities
None.

## Approach

Create the harness before product logic, then deliver each mechanic end-to-end: failing test, domain logic, Foundry adapter/UI, `14.367` evidence, and package. PDF v1.5 is authoritative; approved canonicalizations override ambiguities.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/`, `test/` | New | Domain slices, adapters, tests |
| `system.json`, `dist/` | New | Manifest and generated package |
| `.github/workflows/` | New | CI and fail-closed private releases |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Protected-content exposure | High | Verify privacy and contents before upload; abort on uncertainty |
| Transcription drift | High | Record provenance and validate imported records |
| Platform/runtime gaps | Medium | Require build-14.367 smoke evidence per Foundry-facing slice |
| Unreviewable scope | High | Bound slices and enforce the 400-line review guard |

## Rollback Plan

Revert the slice and regenerate `dist/`; disable publication on privacy-check failure. Version reversible migrations before schemas change.

## Dependencies

- User-supplied v1.5 PDF; Foundry `14.367`; official v14 public API documentation.

## Success Criteria

- [ ] The first slice proves RED→GREEN→REFACTOR, deterministic rolls, a `14.367` smoke check, and reproducible private packaging.
- [ ] GM-owned outcomes cannot mutate state without explicit confirmation.
- [ ] Later slices can cover the complete in-scope core without importing unverified VSD data or the bundled adventure.
