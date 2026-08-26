---
name: vsd-gm-darkmaster
description: "Trigger: VsD GM tools, opponent creation, Darkmaster, battle, war, reward, experience, campaign. Apply the open00 GM reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for GM procedures, opponent generation, the Darkmaster, campaign tools, battles and war, rewards, experience, Drive, and advancement rewards.

## Hard Rules

- Read the local GM reference before implementing or reviewing matching tools or mechanics.
- Distinguish campaign guidance from deterministic rules and data.
- Do not turn optional guidance into mandatory automation without explicit direction.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| GM procedure, reward, or generated opponent | Use this skill |
| Published creature data | Also load `vsd-bestiary` |

## Execution Steps

1. Read the reference.
2. Classify the material as rule, table, or guidance.
3. Implement only the requested behavior.
4. Verify according to affected layers.

## Output Contract

Report the applied GM rule or guidance, changed files, assumptions, and verification performed.

## References

- [VsD GM and Darkmaster reference](../../../.kiro/steering/vsd-gm-darkmaster.md)
