# Apply Progress: Foundry V14 System — P1

## Status

**Blocked pending exact Foundry runtime evidence.** The Node/package implementation for P1 is complete except task 1.2's required generated-package load on an actual Foundry `14.367` runtime. The harness deliberately reports `NOT VERIFIED` rather than asserting a runtime pass.

## Completed Tasks

- [x] 1.1-FND-harness/build/.gitignore-verify
- [ ] 1.2-FND-manifest[compatibility.minimum=14.367,verified=14.367]/loading the generated installable package on exactly Foundry 14.367/wrong-build=NOT-VERIFIED
- [x] 1.3-FND-private-release-gates/Conventional-Commit
- [x] 1.4-FND-threat-RED
- [x] 1.5-Roll-missing/malformed-difficulty/modifiers/no-GM-inference
- [x] 1.6-Roll-trace/exact-supplied/resolved-inputs
- [x] 1.7-Roll-outcome/open-ended-order/replay

## TDD Cycle Evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| 1.1 | `test/foundation.test.ts` | Unit/build | N/A — greenfield | `tsx --test test/*.test.ts` failed: missing `tools/build.ts` | `npm test` passed | Manifest creation and build output checked | Clean |
| 1.2 | `test/foundation.test.ts` | Unit/harness | N/A — greenfield | Missing build/runtime modules failed | Exact manifest assertions pass; runtime remains blocked | Wrong build and missing-runtime cases produce `NOT VERIFIED` | Clean |
| 1.3 | `test/foundation.test.ts` | Unit | N/A — greenfield | Guard exports absent | Private authorization/SHA and Conventional Commit checks pass | Private and multiple unsafe states covered | Clean |
| 1.4 | `test/foundation.test.ts` | Unit | N/A — greenfield | Threat-gate exports absent | Documentation, selectors, mutable/empty commit states, and package audit pass | Multiple disallowed paths/states covered | Clean |
| 1.5 | `test/roll-resolution.test.ts` | Unit | N/A — greenfield | Missing resolver failed import | Invalid GM inputs return no outcome | Missing, malformed difficulty/modifier inputs covered | Clean |
| 1.6 | `test/roll-resolution.test.ts` | Unit | N/A — greenfield | Missing resolver failed import | Exact supplied/resolved trace passes | Repeated invocation proves deterministic replay | Clean |
| 1.7 | `test/roll-resolution.test.ts` | Unit | N/A — greenfield | Missing resolver failed import | Open-ended ordering test passes | High and low continuations plus replay covered | Corrected continuation direction; tests still pass |

## Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `npm test` — exit 0; 2 test files passed. |
| Build command | `npm run build` — exit 0; generated `dist/system.json`. |
| Runtime harness | `FOUNDRY_VERSION=14.366 npm run smoke:foundry` — `NOT VERIFIED` (wrong build). `FOUNDRY_VERSION=14.367 npm run smoke:foundry` — `NOT VERIFIED` (runtime command unavailable). No real Foundry runtime was executed. |
| Release fail-closed check | `npm run check:release` — expected exit 1 with unset authorization/visibility inputs; no publication path is reached. |
| Rollback boundary | `foundation+rolls`: revert `.github/`, `.gitignore`, `package*.json`, `system.json`, `src/domain/`, `test/`, and `tools/`; no later P2 behavior is included. |

## P1 Boundary

- Delivery strategy: `ask-on-risk`, resolved as `feature-branch-chain`.
- Current child slice: P1, targeting the feature/tracker branch; it must not target `main` directly.
- Authored line count: 266 lines excluding generated `dist/` and canonical content, within the 390-line budget.
- Out of scope: P2+ authority/settings/content/UI work.

## Deviations

None in implementation design. Acceptance remains blocked because a real Foundry `14.367` package-load receipt is unavailable; Node proof is not substituted for runtime evidence.

## Next Step

Run the generated `dist/system.json` package-load smoke in an actual Foundry `14.367` runtime and record the receipt. Keep task 1.2 unchecked until then.

## Identity Correction: open00

All repository-owned product branding has been renamed to `open00`, including the Foundry manifest, npm metadata, lockfile, generated package output, and OpenSpec planning artifacts. Task 1.2 remains unchecked because this metadata correction does not provide the missing exact Foundry `14.367` runtime load evidence.

### TDD Cycle Evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| P1 identity correction | `test/foundation.test.ts` | Unit/build metadata | `tsx --test test/foundation.test.ts` — exit 0; 1 file passed | Same command — exit 1 after adding `open00` manifest/package assertions against stale metadata | Same command — exit 0; 1 file passed after metadata updates | Manifest identity and npm package name are independent values asserted together; structural single-output configuration | No code refactor needed; `npm test` and `npm run build` remain green |

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `tsx --test test/foundation.test.ts` — RED exit 1, then GREEN exit 0; 1 file passed. |
| Full regression command | `npm test` — exit 0; 2 test files passed. |
| Build command | `npm run build` — exit 0; regenerated `dist/system.json` with `id`, `title`, and `description` set to `open00`. |
| Runtime harness | N/A for this identity-only correction. It does not replace the missing exact Foundry `14.367` package-load evidence for task 1.2. |
| Rollback boundary | Revert `system.json`, `package.json`, `package-lock.json`, `test/foundation.test.ts`, and the listed OpenSpec artifacts; rebuild `dist/system.json`. |

## P2 Authority and Optional Settings Progress

### Completed Tasks

- [x] 2.1-GM-gateway/pending-no-write
- [x] 2.2-GM-confirm/authorized-success/bind-inputs
- [x] 2.3-GM-confirm-malformed-unauthorized-reject/cancel/stale
- [x] 2.4-Options-complete-PDF-registry
- [x] 2.5-Options-each-world-boolean/default-false
- [x] 2.6-Options-independent/no-cross-enable/intended-boundary
- [ ] 2.7-Options-Node-contracts/14.367-registration-receipt — Node contract is complete; exact Foundry `14.367` registration receipt remains NOT VERIFIED.

### TDD Cycle Evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| 2.1 | `test/gm-authority.test.ts` | Unit/authority | `npm test` — exit 0; 12 tests passed before P2 | New test import failed with `ERR_MODULE_NOT_FOUND` for `src/domain/gm-confirmation.js` | `./node_modules/.bin/tsx --test test/gm-authority.test.ts` — exit 0; pending state made zero writes | Pending no-write and confirmed write exercise distinct paths | Snapshot/boundary helpers kept local; focused test remains green |
| 2.2 | `test/gm-authority.test.ts` | Unit/authority | Same baseline | Missing gateway module blocked the authorized-confirmation assertion | Focused test exit 0; authorized GM applies only stored change and receives original inputs | Authorized confirmation is contrasted with unauthorized/stale rejection | No further refactor needed |
| 2.3 | `test/gm-authority.test.ts` | Unit/authority | Same baseline | Missing gateway module blocked malformed/unauthorized/cancel/stale assertions | Focused test exit 0; every rejected or cancelled path made zero writes | Unauthorized, revision mismatch, malformed request, and post-cancel stale request are separate cases | No further refactor needed |
| 2.4 | `test/gm-authority.test.ts` | Unit/registry | N/A — new adapter file | Missing registry module blocked verified-PDF source validation | Focused test exit 0; only stable `open00.optional.*` IDs with verified PDF metadata are admitted | Invalid source and valid registry paths are covered | Empty production registry intentionally remains the safe boundary until PDF records are verified |
| 2.5 | `test/gm-authority.test.ts` | Unit/registry | Same baseline | Missing registry module blocked defaults assertion | Focused test exit 0; every registered option defaulted to `false` | Two independent option keys are asserted | No further refactor needed |
| 2.6 | `test/gm-authority.test.ts` | Unit/registry | Same baseline | Missing registry module blocked independent-enable assertion | Focused test exit 0; enabling alpha leaves beta false | Defaults and one-enabled state cover separate branches | No further refactor needed |
| 2.7 (Node portion) | `test/gm-authority.test.ts` | Adapter contract | N/A — new adapter file | Missing adapter blocked public `game.settings.register`-shape assertions | Focused test exit 0; each setting registers `scope: world`, `type: Boolean`, `default: false` | Exact-build and unavailable-runtime receipts both remain `NOT VERIFIED` | No fabricated runtime pass; task checkbox remains open for the receipt |

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `./node_modules/.bin/tsx --test test/gm-authority.test.ts` — exit 0; 5 tests passed. |
| Full regression command | `npm test` — exit 0; 17 tests passed. |
| Typecheck | `npm run typecheck` — exit 0. |
| Build | `npm run build` — exit 0. |
| Runtime harness | `FOUNDRY_VERSION=14.367 npm run smoke:foundry` — `{"status":"NOT VERIFIED","reason":"Foundry runtime command is unavailable"}`. This is not a Foundry settings-registration run and does not satisfy task 2.7's exact runtime receipt. |
| Rollback boundary | Revert `src/domain/gm-confirmation.ts`, `src/foundry/optional-rules.ts`, and `test/gm-authority.test.ts`; then restore only P2 checkbox/evidence edits. This removes the authority/settings behavior without removing P1 or the unrelated TypeScript migration. |

### P2 Boundary

- Delivery strategy: `ask-on-risk`, resolved as `feature-branch-chain`, with maintainer-approved mixed-worktree `size:exception`.
- Current child slice: P2 authority/settings. It remains independently reversible even though pre-existing TypeScript, CI, release, and README changes remain in the worktree.
- Authored P2 code/test line count: recorded separately from pre-existing worktree changes in the executor return; no PDF rules content was copied or invented.
- Out of scope: P3+ source/content/UI work and any assertion of an exact Foundry runtime registration pass.

### Deviations

The production optional-rule registry is intentionally empty. It provides only a verified-PDF admission boundary and the independent world-boolean contract because no item-level PDF-verified optional-rule records were supplied. Test fixtures use synthetic IDs and contain no game-rule content. Task 2.7 remains unchecked pending an actual Foundry `14.367` registration receipt.
