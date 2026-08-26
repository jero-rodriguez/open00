---
name: vsd-magic
description: "Trigger: VsD casting, magic points, spell lore, weave, warping, resonance, spell failure, overcasting. Apply the open00 magic-system reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for the VsD magic system: spell-lore access, magic points, casting rolls, warping, concentration, resonance, failures, taint, and overcasting.

## Hard Rules

- Read the local magic reference before implementing or reviewing matching mechanics.
- Use `vsd-grimoire` for the text and parameters of individual spells.
- Keep calculations pure and isolate Foundry document mutations.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Casting-system behavior | Use this skill |
| Individual spell or lore data | Also load `vsd-grimoire` |

## Execution Steps

1. Read the reference.
2. Identify the formula, restriction, and exceptional cases.
3. Implement with focused tests where pure.
4. Verify according to affected layers.

## Output Contract

Report the magic rule, changed files, covered edge cases, and verification performed.

## References

- [VsD magic-system reference](../../../.kiro/steering/vsd-magic.md)
