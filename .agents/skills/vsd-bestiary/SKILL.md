---
name: vsd-bestiary
description: "Trigger: VsD creature, bestiary, monster, NPC stat block, creature attack, creature ability. Apply the open00 bestiary reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for creature data models, bestiary entries, NPC stat blocks, creature tiers and types, attack notation, beast-table caps, and special abilities.

## Hard Rules

- Read every affected creature entry and the shared notation in the local bestiary.
- Preserve stat values, attack formats, tiers, and ability constraints exactly.
- Do not generalize a creature-specific ability without explicit evidence.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Published creature or creature mechanic | Use this skill |
| Procedural opponent or campaign tool | Also load `vsd-gm-darkmaster` |

## Execution Steps

1. Read the shared bestiary keys and affected entries.
2. Compare them with existing models and static data.
3. Make the smallest exact update.
4. Verify according to affected layers.

## Output Contract

Report affected creatures or mechanics, changed files, ambiguities, and verification performed.

## References

- [VsD bestiary reference](../../../.kiro/steering/vsd-bestiary.md)
