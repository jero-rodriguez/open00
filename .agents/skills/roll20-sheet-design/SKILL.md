---
name: roll20-sheet-design
description: "Trigger: character sheet UI, Handlebars template, CSS, layout, Roll20 parity, visual styling. Apply the open00 Roll20 sheet design reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use when creating or changing character-sheet structure, Handlebars templates, CSS, tabs, controls, or visual parity with the Roll20 VsD sheet.

## Hard Rules

- Read the local layout reference before changing matching UI.
- Preserve Foundry ApplicationV2 conventions and existing accessibility behavior.
- Treat the Roll20 document as a design reference, not as permission to copy unavailable assets or code.
- Follow the Foundry-only verification rules in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Visual or layout work | Load the reference below |
| Rules behavior behind a control | Also load the matching VsD rules skill |

## Execution Steps

1. Read the reference.
2. Inspect the affected sheet, template, and style files together.
3. Implement the smallest coherent UI change.
4. Run the permitted type-check verification.

## Output Contract

Report changed files, the referenced layout pattern, and verification performed.

## References

- [Roll20 sheet layout reference](../../../.kiro/steering/roll20-sheet-reference.md)
