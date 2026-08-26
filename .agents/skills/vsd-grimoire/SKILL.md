---
name: vsd-grimoire
description: "Trigger: VsD spell data, spell effect, spell parameter, spell lore, weave list, grimoire. Apply the open00 spell and lore reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for individual VsD spells, spell-lore lists, weave placement, ranges, areas, durations, saves, warping options, and spell data models.

## Hard Rules

- Read the relevant lore and spell entries in the local grimoire before changing spell data.
- Preserve spell names, parameters, weave levels, and effect constraints exactly.
- Use `vsd-magic` for shared casting-system behavior.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Individual spell or lore catalog | Use this skill |
| General casting calculation | Also load `vsd-magic` |

## Execution Steps

1. Read the parameter key and every affected lore or spell entry.
2. Compare the reference with existing static data and models.
3. Make the smallest exact update.
4. Verify according to affected layers.

## Output Contract

Report affected spells or lores, changed files, any source ambiguity, and verification performed.

## References

- [VsD grimoire reference](../../../.kiro/steering/vsd-grimoire.md)
