---
name: vsd-travel-healing
description: "Trigger: VsD travel, encumbrance, hazard, chase, foraging, injury, healing, poison, disease, herb. Apply the open00 travel and healing reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for travel rates, encumbrance, hazards, chases, foraging, exposure, hit-point recovery, bleeding, injuries, healing, poison, disease, and herbs.

## Hard Rules

- Read the local travel and healing reference before implementing or reviewing matching mechanics.
- Preserve thresholds, rates, penalties, treatment difficulties, and recovery times exactly.
- Keep calculations pure and isolate Foundry document updates.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Travel, hazard, health, or recovery rule | Use this skill |
| Combat-time bleeding or dying | Also load `vsd-combat` |

## Execution Steps

1. Read the reference.
2. Identify thresholds, units, modifiers, and state transitions.
3. Implement with focused tests where pure.
4. Verify according to affected layers.

## Output Contract

Report the rule implemented, covered transitions, changed files, and verification performed.

## References

- [VsD travel and healing reference](../../../.kiro/steering/vsd-travel-healing.md)
