# Proposal: CSS Foundry Cleanup

## Intent

Remove all custom color, font-family, and decorative background declarations from `open00-system.css`, letting Foundry VTT v14's native CSS variables and theming handle visual appearance. Preserve all layout properties (grid, flex, sizing, spacing, responsive queries) and typography metrics (font-size, font-weight, letter-spacing, line-height).

## Scope

### In Scope
- Delete `:root` custom properties block entirely
- Remove all `color`, `background`, `background-color`, `font-family`, `text-shadow`, `box-shadow` declarations
- Remove linear-gradient paper textures and button gradients
- Remove custom focus outline colors
- Keep border widths/styles, remove border color values (inherit from Foundry)
- Keep all layout: display, grid, flex, gap, padding, margin, sizing, overflow, position
- Keep typography metrics: font-size, font-weight, font-variant, font-style, letter-spacing, line-height, text-align

### Out of Scope
- Template (.hbs) changes
- TypeScript/JS changes
- New features or UI redesign
- Adding Foundry theme registration (future work)

## Capabilities

### New Capabilities
None

### Modified Capabilities
None — this is a pure CSS refactor removing custom visual styling.

## Approach

1. Delete the `:root` block (7 custom properties)
2. Strip all `color:` declarations (hardcoded hex, rgba, and var references)
3. Strip all `background:` / `background-color:` declarations (including gradients)
4. Strip all `font-family:` declarations
5. Strip all `text-shadow:`, `box-shadow: none` overrides
6. Strip custom focus outline styles (`--open00-focus` usages)
7. For borders: keep `border-width` and `border-style`, remove `border-color` values
8. Preserve every layout/spacing/sizing property untouched
9. Verify with `tsc --noEmit` (CSS changes only — no TS impact expected)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/open00-system.css` | Modified | Remove ~40% of declarations (colors/fonts/backgrounds) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Visual appearance changes significantly | High | Intentional — user wants Foundry native look |
| Some elements lose contrast (white-on-dark sections) | Medium | Foundry's vars provide built-in contrast ratios |
| Chat cards inherit different parent styles | Low | Chat cards render in sidebar — Foundry handles them |

## Rollback Plan

Single-file change — `git revert` the commit restores all previous styling instantly.

## Dependencies

- None (Foundry v14 already provides the native CSS variables)

## Success Criteria

- [ ] No `color:`, `background-color:`, `font-family:`, `text-shadow:` declarations remain in the CSS file
- [ ] All layout properties (grid, flex, gap, padding, margin, sizing) preserved intact
- [ ] Sheets render without broken layout in Foundry v14
- [ ] `tsc --noEmit` passes (no type regressions)
