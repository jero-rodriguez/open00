# open00

`open00` is an early TypeScript Foundry VTT 14 system foundation. It currently provides a deterministic, replayable d100 roll-domain resolver, a minimal system manifest, package build tooling, and guardrails for private releases.

> **Compatibility status:** the manifest targets Foundry VTT `14.367`, but exact `14.367` runtime package-load verification is still pending. Do not treat this repository as fully runtime-compatible yet.

## Quick start

```bash
npm install
npm run typecheck
npm test
npm run build
```

The build writes the distributable manifest to `dist/system.json`. Use the generated `dist/` directory with your local Foundry system-package workflow only after runtime verification has been recorded.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Typecheck the strict TypeScript source without emitting JavaScript. |
| `npm test` | Run Node's built-in TypeScript test suite through `tsx`. |
| `npm run build` | Create `dist/` and copy the system manifest into it. |
| `npm run smoke:foundry` | Report Foundry runtime verification status from the supplied environment. It does not execute Foundry itself. |
| `npm run check:release` | Evaluate the private-release guard using release environment variables. |

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/` | TypeScript application/domain source; currently contains roll resolution. |
| `test/` | TypeScript Node test files for the foundation and roll resolver. |
| `tools/` | TypeScript build, release-guard, and runtime-smoke scripts. |
| `dist/` | Generated build output; ignored by Git. |
| `openspec/` | Change-planning artifacts for the system foundation. |
| `system.json` | Source Foundry system manifest. |

## Foundry compatibility

The source manifest declares `14.367` as both the minimum and verified Foundry compatibility version. That declaration is covered by repository tests; it is **not** evidence of an actual Foundry package-load run. The runtime-smoke command remains `NOT VERIFIED` until an external Foundry `14.367` execution records a receipt.

## Private release safety

This repository is private (`package.json` sets `"private": true`). The release guard permits a release only when the repository and release are private, explicit authorization is supplied, the tag and expected SHA match, and package contents pass its safety checks. Treat `npm run check:release` as a release-environment check rather than a general local validation command.

## Contributing

Keep changes focused and run the relevant tests. Commit messages must use Conventional Commit syntax, for example:

```text
feat(rolls): add deterministic resolver
```
