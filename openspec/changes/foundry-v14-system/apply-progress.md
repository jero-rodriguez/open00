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
| 1.1 | `test/foundation.test.mjs` | Unit/build | N/A — greenfield | `node --test test/*.test.mjs` failed: missing `tools/build.mjs` | `npm test` passed | Manifest creation and build output checked | Clean |
| 1.2 | `test/foundation.test.mjs` | Unit/harness | N/A — greenfield | Missing build/runtime modules failed | Exact manifest assertions pass; runtime remains blocked | Wrong build and missing-runtime cases produce `NOT VERIFIED` | Clean |
| 1.3 | `test/foundation.test.mjs` | Unit | N/A — greenfield | Guard exports absent | Private authorization/SHA and Conventional Commit checks pass | Private and multiple unsafe states covered | Clean |
| 1.4 | `test/foundation.test.mjs` | Unit | N/A — greenfield | Threat-gate exports absent | Documentation, selectors, mutable/empty commit states, and package audit pass | Multiple disallowed paths/states covered | Clean |
| 1.5 | `test/roll-resolution.test.mjs` | Unit | N/A — greenfield | Missing resolver failed import | Invalid GM inputs return no outcome | Missing, malformed difficulty/modifier inputs covered | Clean |
| 1.6 | `test/roll-resolution.test.mjs` | Unit | N/A — greenfield | Missing resolver failed import | Exact supplied/resolved trace passes | Repeated invocation proves deterministic replay | Clean |
| 1.7 | `test/roll-resolution.test.mjs` | Unit | N/A — greenfield | Missing resolver failed import | Open-ended ordering test passes | High and low continuations plus replay covered | Corrected continuation direction; tests still pass |

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
| P1 identity correction | `test/foundation.test.mjs` | Unit/build metadata | `node --test test/foundation.test.mjs` — exit 0; 1 file passed | Same command — exit 1 after adding `open00` manifest/package assertions against stale metadata | Same command — exit 0; 1 file passed after metadata updates | Manifest identity and npm package name are independent values asserted together; structural single-output configuration | No code refactor needed; `npm test` and `npm run build` remain green |

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `node --test test/foundation.test.mjs` — RED exit 1, then GREEN exit 0; 1 file passed. |
| Full regression command | `npm test` — exit 0; 2 test files passed. |
| Build command | `npm run build` — exit 0; regenerated `dist/system.json` with `id`, `title`, and `description` set to `open00`. |
| Runtime harness | N/A for this identity-only correction. It does not replace the missing exact Foundry `14.367` package-load evidence for task 1.2. |
| Rollback boundary | Revert `system.json`, `package.json`, `package-lock.json`, `test/foundation.test.mjs`, and the listed OpenSpec artifacts; rebuild `dist/system.json`. |
