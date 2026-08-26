# Apply Progress: Open00 v2 Restructure

## Current Work Unit

- Change: `open00-v2-restructure`
- Slice: 9 — combat lookup, loader validation, and static data copying
- Mode: Strict TDD
- Delivery: `auto-chain`, `feature-branch-chain`
- Starting point: completed Slice 8
- Completed in this batch: tasks 9.1–9.7
- Still blocked: tasks 9.8–9.10 pending user-supplied numeric grids

## Review Boundary

The aggregate apply diff is 660 authored changed lines, so review should preserve the
selected feature-branch-chain while splitting Slice 9 into two child boundaries:

1. Lookup engines and focused engine tests: approximately 335 lines.
2. Loader validation, Vite static copy, SDD progress, and focused integration tests: approximately 325 lines.

No commits or PRs were created by this apply executor.

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 9.1–9.2 | `tests/engine/combat/attack-lookup.test.ts` | Unit | Existing attack lookup: 8/8 passing | Missing module failed before implementation | 4/4 passing | Row/column, Max Result, automatic miss, unavailable/gap paths | No behavior change needed after combined focused run |
| 9.3–9.4 critical | `tests/engine/combat/critical-lookup.test.ts` | Unit | N/A — new module | Missing module failed before implementation | 4/4 passing | Five modifiers, Normal/Heroic/Epic reductions, negation, two lookup paths | No behavior change needed after combined focused run |
| 9.4 fumble | `tests/engine/combat/fumble-lookup.test.ts` | Unit | N/A — new module | Missing module failed before implementation | 2/2 passing | In-range boundaries, out-of-range, modified and unmodified totals | No behavior change needed after combined focused run |
| 9.5 | `tests/module/data/combat-loader.test.ts` | Unit/integration | N/A — new module | Missing module failed before implementation | 3/3 passing | Malformed attack, malformed critical, two-map loading | Extracted a typed severity predicate; focused tests remained green |
| 9.6 | `tests/config/vite-static-data.test.ts` | Integration | Existing Vite config had no focused test | `copyStaticData` absent; 1/1 failed | 1/1 passing | Triangulation skipped: structural copy task has one output path; nested file and placeholder behavior are both asserted | Extracted a focused copy helper used by the Vite plugin |
| 9.7 | All focused tests plus full suite/typecheck | Verification | 8/8 legacy attack tests passing before edits | N/A — verification task | Focused 14/14; full 318/318; typecheck exit 0 | N/A — verification task | N/A — verification task |

## Test Summary

- Tests written: 14
- Focused tests passing: 14/14 across 5 files
- Full suite: 27 files, 318 tests passing
- Typecheck: `npm run typecheck` exit 0
- Approval tests: none; no existing behavior was refactored
- Pure functions created: attack lookup/parser, critical modifier/reduction/lookup, fumble detection/result, and table validators

## Work Unit Evidence

| Evidence | Result |
|----------|--------|
| Focused test command | `npx vitest --run tests/engine/combat/attack-lookup.test.ts tests/engine/combat/critical-lookup.test.ts tests/engine/combat/fumble-lookup.test.ts tests/module/data/combat-loader.test.ts tests/config/vite-static-data.test.ts` — exit 0; 5 files and 14 tests passed |
| Runtime harness | `tests/config/vite-static-data.test.ts` invokes the real recursive copy helper against a temporary `src/data` tree — exit 0; 1 test passed. Foundry table fetching is not executable without supplied shipping JSON; loader behavior is covered through an injected fetch boundary. |
| Full verification | `npm test` — exit 0; 27 files and 318 tests passed. `npm run typecheck` — exit 0. No build was run per repository verification rules. |
| Rollback boundary | Revert `src/module/engine/combat/`, `src/module/data/combat-loader.ts`, `src/data/fumble-tables/.gitkeep`, the three new test directories/files, and the `vite.config.ts` static-data helper/call; this removes Slice 9 lookup/loader/copy behavior without touching prior slices. |

## Data Boundary

No numeric attack, critical, or fumble grid values were added. All numeric rows used by tests are synthetic fixtures under `tests/` only. Shipping attack and critical directories retain placeholders, and the new fumble directory contains only `.gitkeep`.
