# AGENTS.md — AI Agent Instructions

This file provides instructions for any AI agent (Codex, Claude Code, Cursor, Kiro, etc.) working on this repository. It is the single source of truth for development conventions and verification rules.

## Project Overview

**open00** is a FoundryVTT v14 game system implementing the VsD (Versus the Darkmaster) tabletop RPG rules. It is written in TypeScript and built with Vite.

- **Runtime**: Node.js >= 24
- **Build**: `npm run build` (Vite)
- **Tests**: `npm test` (Vitest, single run)
- **Type check**: `npm run typecheck` (`tsc --noEmit`)

## Architecture

```
src/
  module/
    engine/       # Pure game logic — zero FoundryVTT dependencies
    models/       # Foundry TypeDataModels (extend foundry.abstract.TypeDataModel)
    sheets/       # Foundry ApplicationV2 sheets (UI)
    documents/    # Custom Actor/Item document classes
    data/         # Static data (skill lists, etc.)
  open00-system.ts  # System entry point (Foundry hooks)
  types/
    foundry.d.ts  # Ambient type declarations for Foundry globals
  lang/           # i18n JSON files
  data/           # Static game data (attack/critical tables)
tests/
  engine/         # Unit tests for engine modules
```

## Verification Rules (CRITICAL)

### Pure Engine Code (`src/module/engine/`)

- Fully testable with `npm test`
- Zero FoundryVTT imports — pure TypeScript functions
- Tests live in `tests/engine/`

### FoundryVTT-Dependent Code (`src/module/models/`, `src/module/sheets/`, `src/open00-system.ts`)

- **Verify ONLY with `npm run typecheck`** — this confirms type correctness
- **Do NOT run `npm test`, `npm run build`, or `vite build`** for these files — they will fail because Foundry runtime globals (`foundry.abstract.TypeDataModel`, `ApplicationV2`, etc.) are not available locally
- **Do NOT install FoundryVTT packages** to fix runtime errors
- If `tsc --noEmit` passes, the code is correct

### Decision Tree

1. Changed files only in `src/module/engine/` or `tests/engine/`? → Run `npm test`
2. Changed files in models/sheets/entry point? → Run `npm run typecheck`
3. Changed both? → Run both commands

## Testing Conventions

- Always use `vitest --run` (single execution). Never use watch mode.
- Tests use pure imports from engine modules — no mocking of Foundry required.
- Property-based tests use `fast-check`.

## Type Stubs

If a type error references a missing Foundry global type, check `src/types/foundry.d.ts` for ambient declarations. Add minimal type stubs there rather than trying to install Foundry packages.

The project uses `fvtt-types` for comprehensive Foundry type definitions, with `src/types/foundry.d.ts` for any supplementary ambient declarations.

## Code Style

- TypeScript strict mode
- ES modules (`"type": "module"` in package.json)
- Engine code must remain pure (no Foundry imports) to stay testable
- Keep game logic in `engine/`, Foundry integration in `models/` and `sheets/`

## What NOT to Do

- Do not run `npm run build` or `vite build` as verification — the Foundry plugin requires runtime context
- Do not install additional packages to resolve Foundry runtime errors
- Do not add Foundry global imports to engine modules
- Do not run vitest in watch mode
