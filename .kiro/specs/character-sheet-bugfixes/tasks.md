# Character Sheet Bugfixes — Implementation Tasks

## Overview

This task list implements fixes for two critical bugs in the character sheet using the bug condition methodology:
1. **Bug 1**: Kin Modifiers Not Propagated
2. **Bug 2**: Stats Resetting to Zero on Edit

The workflow follows:
1. Write exploratory bug condition tests (run on UNFIXED code to surface counterexamples)
2. Write preservation property tests (verify non-buggy behavior on UNFIXED code)
3. Implement fixes
4. Verify exploration tests now pass (bug is fixed)
5. Verify preservation tests still pass (no regressions)

---

## Phase 1: Bug Condition Exploration & Preservation Validation

### Bug Condition Exploration Test

- [ ] 1. Write bug condition exploration test for Kin Modifiers propagation
  - **Property 1: Bug Condition** - Kin modifiers not applied to character stat fields
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or code when it fails**
  - **GOAL**: Surface counterexamples that demonstrate kin modifiers are not propagated
  - **Test Approach**: Property-based test scoped to concrete failing cases (any kin dropped onto character)
  - Test implementation details:
    - Create a character with no kin
    - Load a kin item (e.g., Dwarf with brn +5, swi -5, for +5, wit 0, wsd 0, bea 0)
    - Simulate drop event: `sheet._onDropItem(createDropEvent(kinItem))`
    - Assert that `character.system.stats.brn.kin === 5`
    - Assert that `character.system.stats.swi.kin === -5`
    - Assert that `character.system.stats.for.kin === 5`
    - Assert that all other stat.kin fields are set (wit 0, wsd 0, bea 0)
  - Test property: For ANY kin item with statModifiers, after drop, all stat.kin fields match kin.system.statModifiers
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS — stat.kin fields remain 0 instead of matching kin modifiers
  - Document counterexamples found:
    - `character.system.stats.brn.kin = 0` (expected 5)
    - `character.system.stats.swi.kin = 0` (expected -5)
    - Kin object may be missing statModifiers field when passed to `deriveKinCultureVocationEffects()`
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-kin edits continue to work unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-kin-related actions
  - Test implementation details:
    - Test Case A: Drop non-kin item (weapon) — should not trigger kin logic
    - Test Case B: Edit stat base directly (BRN base 3 → 5) — should persist without kin involvement
    - Test Case C: Edit skill rank — should persist without kin effects
    - Test Case D: Select culture item — should not interfere with kin logic
    - Test Case E: Manually set kin modifier (edit stat.kin field directly) — should be preserved
  - Write property-based test: For ALL non-kin-selection actions, the result is identical to pre-fix behavior
  - Property scope:
    - Skill bonuses for non-kin sources (vocation, item) remain unchanged
    - Stat values remain editable via base/spec fields
    - HP and wealth calculations unaffected
    - Other identity items (culture, vocation) work independently
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS — non-kin operations work correctly on unfixed code
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2_

- [ ] 3. Write bug condition exploration test for Stat Persistence
  - **Property 1: Bug Condition** - Stat base edits revert to zero after auto-save
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **GOAL**: Surface counterexamples that demonstrate stat edits revert
  - **Test Approach**: Property-based test scoped to concrete failing cases (any stat base edit + blur)
  - Test implementation details:
    - Create a character with initial stats: brn base = 3, wsd base = 2, swi base = 1
    - Simulate edit on stat base input: set `system.stats.brn.base` to 5
    - Trigger blur event (auto-save handler)
    - Await auto-save completion
    - Assert that `character.system.stats.brn.base === 5`
    - Assert that value persists after actor.update() completes
  - Test property: For ANY stat base value edited via form (blur or Enter), after auto-save completes, actor.system.stats[stat].base equals the edited value
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS — stat.base reverts to 0 after auto-save
  - Document counterexamples found:
    - Edit BRN base 3 → 5, after update: BRN base = 0 (expected 5)
    - Edit WSD base 2 → -2, after update: WSD base = 0 (expected -2)
    - Issue likely in auto-save buildDocumentUpdate() or array field replacement logic
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.3, 2.4_

- [ ] 4. Write preservation property tests for stat persistence (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-stat edits continue to persist correctly
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-stat edits
  - Test implementation details:
    - Test Case A: Edit skill rank (combat rank 2 → 3) — should persist
    - Test Case B: Edit HP max field — should persist
    - Test Case C: Edit wealth field — should persist
    - Test Case D: Edit text field (passion text) — should persist
    - Test Case E: Edit vocation bonus (non-stat derived) — should persist
  - Write property-based test: For ALL form field edits that are NOT stat base values, persistence behavior is unchanged
  - Property scope:
    - Blur and Enter triggers continue to work
    - Auto-save debounce (500ms) remains unchanged
    - Form value coercion remains unchanged
    - Error handling and revert-on-failure remain unchanged
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS — non-stat edits persist correctly on unfixed code
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.3, 3.4, 3.5_

---

## Phase 2: Bug 1 Fix — Kin Modifiers Propagation

### Bug 1 Implementation

- [ ] 5. Fix Kin Modifiers Propagation

  - [ ] 5.1 Improve kin data serialization in character-sheet.ts
    - **File**: `src/module/sheets/character-sheet.ts`
    - **Location**: `toPlain()` method (around line 255)
    - **Change**: Ensure kin item's system data is fully serialized when passed to `deriveKinCultureVocationEffects()`
    - Implementation details:
      - Replace shallow copy with deep clone: `structuredClone(kin.system.toObject())`
      - Explicitly serialize all required kin fields: `statModifiers`, `hpBonus`, `tsr`, `wsr`
      - Add fallback if `toObject()` is unavailable
      - Verify that `statModifiers` is a proper object with all stat keys (brn, swi, for, wit, wsd, bea)
    - Validation: Kin object passed to deriveKinCultureVocationEffects() contains complete system data
    - _Bug_Condition: isBugCondition(drop_kin_event) — kin selected, statModifiers not applied_
    - _Expected_Behavior: All stat.kin fields updated to match kin.system.statModifiers_
    - _Preservation: Non-kin items (weapons, armor, equipment) continue to function unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [ ] 5.2 Add defensive null checks to deriveKinCultureVocationEffects()
    - **File**: `src/module/sheets/kin-culture-vocation-effects.ts`
    - **Location**: Main function body (around line 62)
    - **Change**: Ensure kin modifiers are always applied when kin is present; validate kin data structure
    - Implementation details:
      - Add null-coalescing for `identities.kin.system.statModifiers`
      - Ensure all six stat keys are present in the returned update object (even if 0)
      - Add validation: if kin is present but statModifiers is undefined, log warning and default to zeros
      - Ensure hpBonus is also properly serialized
      - Add TypeScript types to prevent data shape mismatches
    - Validation: All stat.kin fields always populated in update object (never undefined)
    - _Bug_Condition: isBugCondition(drop_kin_event) with missing/incomplete kin data_
    - _Expected_Behavior: Function robustly handles incomplete kin data, applies modifiers where present_
    - _Requirements: 2.1, 2.2_

  - [ ] 5.3 Ensure prepareDerivedData() recalculates skill totals after kin application
    - **File**: `src/module/sheets/character-sheet.ts`
    - **Location**: `#applyIdentityEffects()` method (around line 267)
    - **Change**: Trigger skill total recalculation after kin modifiers are applied
    - Implementation details:
      - After `await this.actor.update(updates)`, verify that `prepareDerivedData()` has been called
      - Either call `this.actor.updateSource()` to refresh prepared data, or re-render the sheet
      - Ensure skill bonuses reflect the new kin stat modifiers
      - Consider using a flag to force re-preparation if needed
    - Validation: Skill totals display correctly with kin modifiers included
    - _Bug_Condition: isBugCondition(drop_kin_event) — after drop, skills don't reflect new kin stat bonus_
    - _Expected_Behavior: After kin drop, skill totals include kin stat modifiers_
    - _Requirements: 2.1, 2.2_

  - [ ] 5.4 Verify exploration test now passes (Property 1: Expected Behavior)
    - **Property 1: Expected Behavior** - Kin modifiers are applied
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - Run the exploration test from task 1 on the FIXED code
    - **EXPECTED OUTCOME**: Test PASSES — stat.kin fields now match kin modifiers
    - Verify counterexamples from task 1 are now resolved:
      - `character.system.stats.brn.kin = 5` ✓
      - `character.system.stats.swi.kin = -5` ✓
      - All stat.kin fields are populated correctly
    - _Requirements: 2.1, 2.2_

  - [ ] 5.5 Verify preservation tests still pass (Property 2: Preservation)
    - **Property 2: Preservation** - Non-kin edits unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation tests from task 2 on the FIXED code
    - **EXPECTED OUTCOME**: Tests PASS — no regressions in non-kin operations
    - Confirm that:
      - Non-kin item drops still work
      - Stat edits still persist
      - Skill rank edits still persist
      - Culture/vocation selection still works
    - _Requirements: 3.1, 3.2_

---

## Phase 3: Bug 2 Fix — Stat Persistence in Auto-Save

### Bug 2 Implementation

- [ ] 6. Fix Stat Persistence in Auto-Save

  - [ ] 6.1 Fix SchemaField detection in auto-save.ts
    - **File**: `src/module/sheets/auto-save.ts`
    - **Location**: `buildDocumentUpdate()` function (around line 113-145)
    - **Change**: Properly handle nested SchemaField objects without applying array replacement logic
    - Implementation details:
      - Current logic treats objects as potential arrays. For SchemaFields like `system.stats.brn.base`, we should use dot-path directly
      - Verify the condition at line 113: `if (Array.isArray(value) && index < parts.length - 1)`
      - For non-array objects (SchemaFields), skip the array logic and use dot-path construction
      - Ensure stat updates use format `{ "system.stats.brn.base": 5 }` directly, not object replacement
    - Validation: Update object uses correct dot-path format for stat fields
    - _Bug_Condition: isBugCondition(stat_edit_blur_event) — stat base edit reverts after auto-save_
    - _Expected_Behavior: Auto-save constructs correct update path for stat fields, value persists_
    - _Requirements: 2.3, 2.4_

  - [ ] 6.2 Verify coerceFormValue() receives correct current value
    - **File**: `src/module/sheets/auto-save.ts`
    - **Location**: `persistField()` function (around line 73-80, called from line 162)
    - **Change**: Ensure `getActorValue()` returns the actual current value, not a stale or zero value
    - Implementation details:
      - Check that `getActorValue(fieldName)` reads from the correct actor data source (not cached/stale)
      - For stat paths like `system.stats.brn.base`, verify it reads from actor.system.stats.brn.base (not zero)
      - If data race suspected: add a small delay or use actor.updateSource() before reading
      - Verify coerceFormValue() coerces newValue to match the type of currentValue (e.g., string "5" → number 5)
    - Validation: coerceFormValue() receives non-zero current value for stat fields, returns correctly typed new value
    - _Bug_Condition: isBugCondition(stat_edit_blur_event) — coercion receives wrong current value_
    - _Expected_Behavior: coerceFormValue() receives correct current value, returns properly typed new value_
    - _Requirements: 2.3, 2.4_

  - [ ] 6.3 Verify form template stat input names are correct
    - **File**: `src/module/templates/character-overview.hbs` (or relevant template)
    - **Location**: Stat base input field definitions
    - **Change**: Ensure stat base input names are `system.stats.*.base` (full path, not shortened)
    - Implementation details:
      - Inspect the template for stat base inputs (e.g., BRN, SWI, etc.)
      - Verify input names match pattern: `name="system.stats.brn.base"` (full path)
      - If names are shortened (e.g., `name="stats.brn.base"`), update to full path
      - Ensure auto-save handler receives the correct field path
    - Validation: Form inputs have correct full-path names; auto-save receives expected field paths
    - _Bug_Condition: isBugCondition(stat_edit_blur_event) — form input name is incorrect, auto-save constructs wrong path_
    - _Requirements: 2.3, 2.4_

  - [ ] 6.4 Test that stat edits do not trigger array replacement logic
    - **File**: `src/module/sheets/auto-save.ts`
    - **Location**: `buildDocumentUpdate()` tests
    - **Change**: Add unit tests to verify stat field updates use dot-path, not array logic
    - Implementation details:
      - Test: `buildDocumentUpdate("system.stats.brn.base", 5, actor)` returns `{ "system.stats.brn.base": 5 }`
      - Test: Verify array replacement logic is NOT triggered for stat paths
      - Test: Verify result is not an object containing `system.stats` (which would be array logic)
    - _Bug_Condition: isBugCondition(stat_edit) — array logic applied to stat SchemaField_
    - _Requirements: 2.3, 2.4_

  - [ ] 6.5 Verify exploration test now passes (Property 1: Expected Behavior)
    - **Property 1: Expected Behavior** - Stat edits persist
    - **IMPORTANT**: Re-run the SAME test from task 3 — do NOT write a new test
    - Run the exploration test from task 3 on the FIXED code
    - **EXPECTED OUTCOME**: Test PASSES — stat.base value persists after auto-save
    - Verify counterexamples from task 3 are now resolved:
      - Edit BRN base 3 → 5, after update: BRN base = 5 ✓ (was 0)
      - Edit WSD base 2 → -2, after update: WSD base = -2 ✓ (was 0)
      - Value persists through prepareDerivedData() and all subsequent updates
    - _Requirements: 2.3, 2.4_

  - [ ] 6.6 Verify preservation tests still pass (Property 2: Preservation)
    - **Property 2: Preservation** - Non-stat edits unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 4 — do NOT write new tests
    - Run preservation tests from task 4 on the FIXED code
    - **EXPECTED OUTCOME**: Tests PASS — no regressions in non-stat auto-save behavior
    - Confirm that:
      - Skill rank edits still persist
      - HP/MP/Wealth edits still persist
      - Text field edits still persist
      - Auto-save debounce and timing unchanged
      - Validation and coercion behavior unchanged
    - _Requirements: 3.3, 3.4, 3.5_

---

## Phase 4: Full Integration Testing

- [ ] 7. Full integration test — Kin + Stats together
  - **Objective**: Verify both fixes work together without conflicts
  - Test scenario:
    - Create character with no kin
    - Apply Dwarf kin (brn +5)
    - Manually edit BRN base 3 → 5 (while kin is applied)
    - Verify BRN base persists as 5
    - Verify BRN total includes both base (5) and kin modifier (+5) = 10
    - Verify skill totals include BRN total (10)
  - Verification:
    - No interaction between kin fix and stat fix
    - Data flows correctly through all systems
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 8. Full integration test — Sequence of operations
  - **Objective**: Verify both fixes work through a realistic player workflow
  - Test scenario:
    - Character starts with base stats: brn 3, swi 2, for 4, wit 3, wsd 2, bea 1
    - Player selects Dwarf kin (brn +5, swi -5, for +5)
    - Verify stat.kin fields updated correctly
    - Player edits BRN base 3 → 6 (manually boosting brawn)
    - Verify BRN base persists as 6
    - Player replaces Dwarf with Halfling kin (swi +5, others adjusted)
    - Verify old kin modifiers cleared, new ones applied
    - Verify BRN base still 6 (not affected by kin change)
    - Player edits SWI base 2 → 0 (lowering it)
    - Verify SWI base persists as 0
    - Verify skill totals reflect all changes correctly
  - Verification:
    - All operations complete without error
    - Data remains consistent throughout sequence
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

---

## Phase 5: Final Verification & Checkpoint

- [ ] 9. Run full test suite
  - **Objective**: Ensure all tests pass (exploration, preservation, integration) and no regressions
  - Command: `npm test -- --run` in the character sheet test directory
  - Verification:
    - All bug condition exploration tests PASS (bugs fixed)
    - All preservation tests PASS (no regressions)
    - All integration tests PASS (no conflicts)
  - Mark complete when all tests pass
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 10. Manual verification in Foundry VTT
  - **Objective**: Verify fixes work correctly in the Foundry VTT UI
  - Test steps:
    1. Start Foundry VTT with the fixed module
    2. Create a new character
    3. Drag a kin item onto the character sheet
    4. Verify stat modifiers appear in the stat display
    5. Edit a stat base value and tab away
    6. Verify value persists (not reset to zero)
    7. Change kin item and verify modifiers update
    8. Verify no errors in browser console
  - Mark complete when manual verification succeeds
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 11. Checkpoint — Ensure all tests pass and fixes are complete
  - Ensure all tests pass (unit, integration, manual)
  - Verify no console errors
  - Confirm both bugs are fixed:
    - Bug 1: Kin modifiers now propagate and apply to stat.kin fields ✓
    - Bug 2: Stat base edits now persist after auto-save ✓
  - Verify no regressions in existing functionality
  - Ask the user if questions arise
  - Mark complete when all verification succeeds
  - _Requirements: All (2.1-2.4, 3.1-3.5)_

---

## Task Dependencies

```
1 (Bug 1 Exploration) ──→ 5.4 (Verify Bug 1 Fix)
2 (Bug 1 Preservation) ┘     └──→ 7 (Integration Kin+Stats)
                                      └──→ 8 (Sequence) ──→ 9 (Full Suite) ──→ 11 (Checkpoint)
3 (Bug 2 Exploration) ──→ 6.5 (Verify Bug 2 Fix)
4 (Bug 2 Preservation) ┘     └──→ 7 (Integration Kin+Stats)

5.1-5.3 (Bug 1 Fixes) ──→ 5.4
6.1-6.4 (Bug 2 Fixes) ──→ 6.5
10 (Manual Verification) ──→ 11
```

## Summary

**Phase 1: Exploration (Tasks 1-4)**
- Write exploration tests to surface bugs on unfixed code
- Write preservation tests to capture baseline behavior

**Phase 2: Bug 1 Fix (Tasks 5.1-5.5)**
- Improve kin data serialization
- Add defensive null checks
- Ensure skill total recalculation
- Verify exploration test passes
- Verify preservation tests still pass

**Phase 3: Bug 2 Fix (Tasks 6.1-6.6)**
- Fix SchemaField detection in auto-save
- Verify coerceFormValue receives correct values
- Check form template field names
- Test that stat edits don't trigger array logic
- Verify exploration test passes
- Verify preservation tests still pass

**Phase 4: Integration Testing (Tasks 7-8)**
- Verify both fixes work together
- Test realistic player workflows

**Phase 5: Final Verification (Tasks 9-11)**
- Run full test suite
- Manual verification in Foundry VTT
- Checkpoint to confirm all fixes are complete
