# Design: CSS Foundry Cleanup

## Technical Approach

Single-file, mechanical strip of `src/styles/open00-system.css`. Every declaration is
classified by property name against a decision matrix, then kept, rewritten, or deleted.
Foundry v14 supplies text color, backgrounds, and fonts via its native cascade; the sheet
keeps only structural CSS. No TypeScript, template, or build changes.

## Decision Matrix (what stays vs what goes)

| Property | Action | Reason |
|----------|--------|--------|
| `color` | Delete | Inherit Foundry theme text color |
| `background`, `background-color` (incl. gradients) | Delete | Inherit Foundry surfaces |
| `font-family` (incl. `inherit`) | Delete | Inherit Foundry font stack |
| `text-shadow`, `box-shadow` | Delete | Decorative |
| `outline` on `:focus-visible` (custom color) | Delete | Foundry provides focus rings |
| `--open00-*` `:root` block | Delete | Custom palette no longer referenced |
| `display`, `grid*`, `flex*`, `gap`, `place-*` | Keep | Layout |
| `padding`, `margin`, `width`, `height`, `min/max-*`, `overflow`, `position`, `transform`, `resize`, `object-fit`, `appearance` | Keep | Layout/sizing |
| `border-radius` | Keep | Shape/layout |
| `font-size`, `font-weight`, `font-style`, `font-variant`, `letter-spacing`, `line-height`, `text-align` | Keep | Typography metrics |
| `border-width` + `border-style` | Keep (color dropped) | See border rule |

## Architecture Decisions

### Decision: Border color via `currentColor` fallback

**Choice**: Rewrite shorthand borders to keep width + style and drop the color token
(`border: 3px double var(--open00-ink)` → `border: 3px double`). Do NOT write an explicit
`currentColor`.
**Alternatives considered**: (a) explicit `border-color: currentColor`; (b) delete borders
entirely.
**Rationale**: Per CSS spec, omitting the color from a border shorthand resets `border-color`
to its initial value `currentColor`, which resolves to the Foundry-driven text color. Borders
stay visible and theme-adaptive with the least code. Deleting borders would collapse layout
lines (dividers, orbs). `border: 0` resets stay untouched — they are layout, not color.

### Decision: `!important` follows the surviving property

**Choice**: `!important` is a modifier, not a color. Keep it attached to any property that
survives (layout/typography); drop the whole declaration only when the property itself is
stripped.
**Alternatives considered**: Strip all `!important`; keep all `!important`.
**Rationale**: The resource/defense orbs use `!important` to beat Foundry's input styling.
Their shape (`border`, `border-radius`) and metrics (`font-size`, `font-style`, `font-weight`)
must keep winning, so those keep `!important`. `background`/`color` `!important` declarations
are deleted with their properties.

### Decision: Delete empty rulesets

**Choice**: After stripping, any selector left with zero declarations is removed entirely.
**Alternatives considered**: Keep as empty documentation stubs.
**Rationale**: Empty rulesets are dead CSS; git history preserves prior state (single-file
revert is the rollback plan). Selectors retaining any layout/metric declaration stay.

### Decision: Order of operations (safest sequence)

**Choice**: 1) delete `:root`; 2) delete `color`; 3) delete `background`/`background-color`;
4) delete `font-family`; 5) delete `text-shadow`/`box-shadow`; 6) delete custom focus
outlines; 7) rewrite border shorthands (drop color token, keep width/style/`!important`);
8) sweep and remove now-empty rulesets; 9) leave all layout/metrics untouched.
**Rationale**: Property-type passes are auditable and let the empty-ruleset sweep run last on
a fully stripped file.

## Worked Example (resource orb, lines ~779-787)

```css
/* before */
border: 4px double var(--open00-ink) !important;
border-radius: 50% !important;
background: #fff !important;      /* deleted */
font-size: 26px !important;
font-style: normal !important;
/* after */
border: 4px double !important;    /* color dropped → currentColor */
border-radius: 50% !important;
font-size: 26px !important;
font-style: normal !important;
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/open00-system.css` | Modify | Delete `:root`; strip color/background/font-family/shadow/focus-outline; rewrite borders to width+style; remove empty rulesets |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Type | No TS regression | `tsc --noEmit` (per project verification rule for style-adjacent changes) |
| Static | No forbidden props remain | grep for `color:`, `background`, `font-family`, `text-shadow`, `--open00-`, `outline: .*var(` returns zero matches |
| Static | Layout preserved | grep confirms `display`, `grid`, `flex`, `gap`, `padding`, `margin`, `border-radius`, `font-size` counts unchanged |
| Manual | Sheets render unbroken in Foundry v14 | Out of automated scope (no Foundry runtime locally) — noted for reviewer |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or
process-integration boundary. Pure CSS refactor.

## Migration / Rollout

No migration required. Single-file `git revert` restores prior styling.

## Open Questions

- None. All four design decisions resolved above.
