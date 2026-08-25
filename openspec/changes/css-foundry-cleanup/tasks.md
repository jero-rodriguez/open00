# Tasks: css-foundry-cleanup

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 240–300 (deletions + rewrites) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Strip all forbidden declarations + verify | PR 1 (single) | `tsc --noEmit` + `grep -cE` | N/A — CSS-only, no runtime needed | `git revert` the single commit |

## Phase 1: Strip Declarations (Deletion Pass)

- [x] 1.1 Delete the `:root { }` block (lines 4–12 approx — all `--open00-*` custom properties)
- [x] 1.2 Delete all `color:` declarations throughout the file
- [x] 1.3 Delete all `background:` and `background-color:` declarations (including gradient values)
- [x] 1.4 Delete all `font-family:` declarations
- [x] 1.5 Delete all `text-shadow:` and `box-shadow:` declarations
- [x] 1.6 Delete custom focus outline styles (`outline: 2px solid var(--open00-red)` in :focus-visible rules)

## Phase 2: Rewrite Borders

- [x] 2.1 Rewrite border shorthands: drop color token, keep width+style (e.g. `border: 3px double var(--open00-ink)` → `border: 3px double`)
- [x] 2.2 Delete standalone `border-color:` declarations
- [x] 2.3 Preserve `!important` on surviving border properties, remove it where it only decorated color

## Phase 3: Cleanup

- [x] 3.1 Remove empty rulesets (selectors whose only declarations were stripped)
- [x] 3.2 Remove orphaned comments that referenced deleted variables or colors

## Phase 4: Verification

- [x] 4.1 Run `tsc --noEmit` — confirm zero type errors
- [x] 4.2 Run grep verification: `grep -cE 'color:|background:|background-color:|font-family:|text-shadow:|box-shadow:' src/styles/open00-system.css` must return 0
- [x] 4.3 Confirm no `:root` block remains
- [x] 4.4 Confirm layout properties preserved (spot-check grid/flex/gap/padding declarations still present)
- [x] 4.5 Confirm border-radius declarations preserved (not stripped with border rewrites)
