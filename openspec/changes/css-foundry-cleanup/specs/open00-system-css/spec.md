# Delta for open00-system-css

## REMOVED Requirements

### Requirement: Custom Color Declarations

(Reason: Foundry VTT v14 provides native CSS variables for theming; custom colors override and conflict with the native theme system.)
(Migration: Foundry's built-in `--color-*` variables handle all color needs.)

#### Scenario: All color declarations removed

- GIVEN the stylesheet `src/styles/open00-system.css`
- WHEN the file is inspected after cleanup
- THEN no `color:` declarations SHALL remain
- AND no `background:` or `background-color:` declarations SHALL remain

#### Scenario: Gradient backgrounds removed

- GIVEN any rule using `linear-gradient` or `radial-gradient` for decorative paper textures or button styling
- WHEN the file is inspected after cleanup
- THEN no gradient background declarations SHALL remain

### Requirement: Custom Font Family Declarations

(Reason: Foundry VTT v14 applies its own font stack via native variables; custom font-family overrides break theme consistency.)
(Migration: None — Foundry's `--font-*` variables apply automatically.)

#### Scenario: All font-family declarations removed

- GIVEN the stylesheet
- WHEN the file is inspected after cleanup
- THEN no `font-family:` declarations SHALL remain

### Requirement: Decorative Shadow Declarations

(Reason: Text shadows and box shadows are decorative and conflict with Foundry's native visual treatment.)
(Migration: None.)

#### Scenario: All shadow declarations removed

- GIVEN the stylesheet
- WHEN the file is inspected after cleanup
- THEN no `text-shadow:` declarations SHALL remain
- AND no `box-shadow:` declarations SHALL remain

### Requirement: Custom Root Variables Block

(Reason: The `:root` block defines 7 custom color/font properties that are no longer needed.)
(Migration: None — Foundry provides equivalent native variables.)

#### Scenario: Root custom properties block deleted

- GIVEN the `:root { }` block with custom properties (e.g. `--open00-primary`, `--open00-bg`)
- WHEN the file is inspected after cleanup
- THEN no `:root` block with custom property definitions SHALL remain

### Requirement: Custom Focus Outline Colors

(Reason: Custom focus outline colors override Foundry's accessible focus indicators.)
(Migration: Foundry's native focus styles apply automatically.)

#### Scenario: Custom focus outline colors removed

- GIVEN any rule declaring custom outline colors (e.g. referencing `--open00-focus`)
- WHEN the file is inspected after cleanup
- THEN no custom `outline-color` or focus-related color declarations SHALL remain

## ADDED Requirements

### Requirement: Layout Property Preservation

The system MUST preserve all layout and spacing declarations intact during cleanup.

#### Scenario: Grid and flex layout preserved

- GIVEN any CSS rule containing `display`, `grid-template-*`, `flex`, `gap`, `align-items`, `justify-content`, or `place-items`
- WHEN the cleanup is applied
- THEN those declarations MUST remain unchanged

#### Scenario: Spacing and sizing preserved

- GIVEN any CSS rule containing `padding`, `margin`, `width`, `height`, `min-*`, `max-*`, or `overflow`
- WHEN the cleanup is applied
- THEN those declarations MUST remain unchanged

#### Scenario: Position and responsive queries preserved

- GIVEN any CSS rule containing `position`, `top`, `left`, `right`, `bottom`, `z-index`, or `@media` / `@container` queries
- WHEN the cleanup is applied
- THEN those declarations and query blocks MUST remain unchanged

### Requirement: Typography Metrics Preservation

The system MUST preserve all typography metric declarations while removing font-family.

#### Scenario: Font metrics kept intact

- GIVEN any rule containing `font-size`, `font-weight`, `font-variant`, `font-style`, `letter-spacing`, `line-height`, or `text-align`
- WHEN the cleanup is applied
- THEN those declarations MUST remain unchanged

### Requirement: Border Structural Preservation

The system MUST keep border widths and styles but MUST NOT retain border color values.

#### Scenario: Border width and style kept, color removed

- GIVEN a rule with `border: 1px solid #hex` or separate `border-width`, `border-style`, `border-color` declarations
- WHEN the cleanup is applied
- THEN `border-width` and `border-style` values MUST remain
- AND `border-color` values MUST NOT remain
- AND shorthand borders MUST be rewritten to omit the color component

### Requirement: Type Safety Verification

The system MUST pass TypeScript compilation after CSS changes.

#### Scenario: No type regressions

- GIVEN the CSS cleanup is complete
- WHEN `tsc --noEmit` is executed
- THEN it MUST exit with zero errors
