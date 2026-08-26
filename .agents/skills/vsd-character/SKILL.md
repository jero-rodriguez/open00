---
name: vsd-character
description: "Trigger: VsD character creation, kin, culture, vocation, stats, skills, background options, advancement. Apply the open00 character reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for character creation and progression, including kin, culture, vocation, stats, passions, background options, skills, development points, and advancement.

## Hard Rules

- Read the local character reference before implementing or reviewing matching behavior.
- Separate pure calculations from Foundry document and sheet integration.
- Do not infer missing progression values or eligibility rules.
- Follow the verification decision tree in the repository `AGENTS.md`.

## Decision Gates

| Task | Action |
|---|---|
| Character rule or calculation | Use this reference and focused engine tests |
| Character model or sheet binding | Also use `foundry-system-development` |

## Execution Steps

1. Read the reference.
2. Map the rule to existing data and engine boundaries.
3. Implement the smallest complete behavior.
4. Verify according to affected layers.

## Output Contract

Report the rule source, changed files, assumptions or gaps, and verification performed.

## References

- [VsD character reference](../../../.kiro/steering/vsd-character.md)
