---
name: vsd-combat
description: "Trigger: VsD combat, tactical round, initiative, attack, parry, defense, critical, damage, condition. Apply the open00 combat reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for tactical-round sequencing, action declarations, attacks, defense, parry, critical strikes, damage, bleeding, dying, and combat conditions.

## Hard Rules

- Read the local combat reference before implementing or reviewing matching mechanics.
- Keep combat calculations pure and testable; isolate Foundry state updates.
- Preserve phase order, caps, and severity rules exactly.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Combat calculation or sequence | Use this reference |
| Weapon or armor data | Also use `vsd-equipment` |
| Spell attack | Also use `vsd-magic` or `vsd-grimoire` |

## Execution Steps

1. Read the reference.
2. Identify inputs, outputs, caps, and failure cases.
3. Implement with focused tests where pure.
4. Verify according to affected layers.

## Output Contract

Report the combat rule, covered edge cases, changed files, and verification performed.

## References

- [VsD combat reference](../../../.kiro/steering/vsd-combat.md)
