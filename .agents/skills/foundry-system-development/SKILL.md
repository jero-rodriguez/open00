---
name: foundry-system-development
description: "Trigger: FoundryVTT TypeScript, data model, document, sheet, manifest, hook, system entry point. Apply the open00 Foundry v14 development reference."
license: Apache-2.0
metadata:
  author: "open00 contributors"
  version: "1.0"
---

## Activation Contract

Use for FoundryVTT-facing TypeScript, manifests, TypeDataModels, document classes, ApplicationV2 sheets, hooks, registration, migrations, or distribution.

## Hard Rules

- Read the local reference before changing matching Foundry behavior.
- Keep pure rules logic in `src/module/engine/`; never introduce Foundry imports there.
- Follow the verification decision tree in the repository `AGENTS.md`.
- Prefer current repository types and patterns when the reference contains generic examples.

## Decision Gates

| Task | Action |
|---|---|
| Pure game mechanic | Use the relevant VsD rules skill instead |
| Foundry integration | Load the reference below and inspect the affected implementation |

## Execution Steps

1. Read the reference.
2. Locate the closest existing project pattern.
3. Implement the smallest consistent change.
4. Run only the verification permitted by `AGENTS.md`.

## Output Contract

Report changed files, the Foundry pattern applied, and verification performed.

## References

- [FoundryVTT system development reference](../../../.kiro/steering/system-development.md)
