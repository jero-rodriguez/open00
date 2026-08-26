---
name: vsd-equipment
description: "Trigger: VsD equipment, wealth, weapon, armor, shield, gear, item property, attack table. Apply the open00 equipment reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for wealth levels, purchases, weapons, attack profiles, armor, shields, gear, qualities, availability, and equipment item models.

## Hard Rules

- Read the local equipment reference before implementing or reviewing matching data or mechanics.
- Preserve item categories, modifiers, restrictions, and table values exactly.
- Separate static data and pure calculations from Foundry Item integration.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Item data or equipment calculation | Use this skill |
| Attack resolution using equipment | Also load `vsd-combat` |

## Execution Steps

1. Read the reference.
2. Map the relevant table or property to existing data structures.
3. Implement exact values and focused tests where pure.
4. Verify according to affected layers.

## Output Contract

Report the equipment rule or data changed, source table, files, and verification performed.

## References

- [VsD equipment reference](../../../.kiro/steering/vsd-equipment.md)
