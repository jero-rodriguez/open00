---
inclusion: always
---

# Verification Rules for This Project

## Pure Engine Code (src/engine/)

For files in `src/engine/` and their tests in `tests/engine/`:
- Run `npm test` (vitest --run) to verify correctness
- These modules have zero FoundryVTT imports and are fully testable

## FoundryVTT-Dependent Code (src/models/, src/sheets/, src/vsd-system.ts)

For TypeDataModels, Sheets, and the system entry point:
- **Only verify with `tsc --noEmit`** — this confirms type correctness
- **Do NOT run `npm test`, `npm run build`, or `vite build`** — these will fail or hang because the Foundry runtime (global classes like `foundry.abstract.TypeDataModel`, `ApplicationV2`, etc.) is not available in the local dev environment
- **Do NOT attempt to install FoundryVTT packages** to fix runtime errors
- If `tsc --noEmit` passes, the task is complete

## General Rules

- Never run vitest in watch mode. Always use `--run` flag.
- Keep tasks focused. Implement what the task describes, verify with the appropriate method above, and stop.
- If a type error references a missing Foundry type, check `src/types/foundry.d.ts` for the ambient declaration. Add minimal type stubs there if needed rather than trying to install Foundry packages.

## Terminal Exit Code Warning

- **The `execute_bash` tool in this environment always reports `Exit Code: -1`** due to a shell integration issue (TTY not available). This is a false negative — it does NOT mean the command failed.
- **NEVER retry a command just because the exit code is -1.** Instead, determine success or failure by reading the actual command output:
  - For `npm test`: look for "Tests X passed" or "FAIL" in the output
  - For `tsc --noEmit`: look for type errors in the output, or absence of errors means success
  - For any command: read the stdout/stderr content to determine the real result
- **Do NOT waste credits retrying commands that already succeeded.**
