---
name: vsd-core-rules
description: "Trigger: VsD dice, d100, action roll, difficulty, save roll, skill roll, resistance, general engine mechanics. Apply the open00 core-rules reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for general Against the Darkmaster mechanics: dice, open-ended rolls, difficulties, action resolution, save rolls, resistance, and shared skill logic.

## Hard Rules

- Read the local rules reference before implementing or reviewing matching mechanics.
- Keep mechanics deterministic and pure inside `src/module/engine/`.
- Do not invent a rule when the reference is silent; surface the missing decision.
- Follow the engine test requirements in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| General resolution mechanic | Use this skill |
| Specialized combat, magic, character, equipment, or travel rule | Load that domain skill as well |

## Execution Steps

1. Read the reference.
2. Identify the exact rule and edge cases.
3. Implement with focused tests.
4. Run `npm test` when required by `AGENTS.md`.

## Output Contract

Report the rule implemented, edge cases covered, changed files, and test result.

## References

- [VsD core rules reference](../../../.kiro/steering/vsd-core-rules.md)
