# Character Sheet Bugfixes Design

## Overview

This document addresses two critical bugs in the vsd-system character sheet:

1. **Kin Modifiers Not Propagated**: When a player selects a kin item, the stat modifiers defined in the kin are not automatically applied to the character's stat values.

2. **Stats Resetting to Zero on Edit**: When manually editing a stat base value (e.g., changing BRN base from 3 to 5), the value resets to zero after the update completes.

Both bugs stem from incomplete data flow in the character sheet's item handling and auto-save mechanisms. The fixes ensure identity effects are properly applied and stat edits persist through the data preparation lifecycle.

## Glossary

- **Bug_Condition (C)**: The condition that triggers each bug
  - Bug 1: A kin item is selected/dropped onto the character actor
  - Bug 2: A stat base value is edited via the sheet form and the field loses focus or Enter is pressed
- **Property (P)**: The desired correct behavior
  - Bug 1: The kin's stat modifiers are read and applied to `character.system.stats.*.kin` fields
  - Bug 2: The edited stat value persists in the actor after the auto-save completes
- **Preservation**: Existing behavior that must remain unchanged
  - Bug 1: Non-kin items (weapons, armor, equipment) continue to function; manually-set kin modifiers are preserved
  - Bug 2: Non-stat edits continue to work; existing validation and coercion remain in place
- **CharacterDataModel**: The TypeDataModel in `src/module/models/actor/character.ts` that defines the character schema and computes derived data
- **Open00CharacterSheet**: The ApplicationV2 sheet in `src/module/sheets/character-sheet.ts` that handles rendering, user input, and item drops
- **deriveKinCultureVocationEffects**: Function in `src/module/sheets/kin-culture-vocation-effects.ts` that derives identity effects and returns actor update paths
- **Auto-save Handler**: The debounced form field persistence created in `src/module/sheets/auto-save.ts`
- **prepareDerivedData()**: Method called after all form updates, recalculates skill totals using stat modifiers

## Bug Details

### Bug 1: Kin Modifiers Not Propagated

#### Bug Condition

When a player selects a kin item (via drag-drop or item selection UI), the character's stat modifiers for that kin are not applied to `character.system.stats.*.kin` fields.

**Formal Specification:**
```
FUNCTION isBugCondition_KinModifiers(event)
  INPUT: event is a drop or selection event for a kin item
  OUTPUT: boolean
  
  LET kin = the selected kin item with statModifiers field populated
  LET character = the owning actor
  
  RETURN kin != null 
         AND kin.system.statModifiers != null 
         AND NOT ALL stat IN ['brn', 'swi', 'for', 'wit', 'wsd', 'bea']:
           character.system.stats[stat].kin == kin.system.statModifiers[stat]
END FUNCTION
```

#### Examples

**Example 1: Dwarf Kin Selection**
- User drags a "Dwarf" kin item onto the character sheet
- Dwarf defines: brn +5, swi -5, for +5, wit 0, wsd 0, bea 0
- **Expected**: character.system.stats.brn.kin = 5, character.system.stats.swi.kin = -5, etc.
- **Actual**: character.system.stats.*.kin remain 0; no update occurs

**Example 2: Kin Replacement**
- Character has "Halfling" kin applied (swi +5, kin TSR +10)
- User replaces with "Stone Troll" kin (for +5, brn +10, but wsd -10)
- **Expected**: Old kin modifiers cleared; new modifiers applied (for +5, brn +10, wsd -10, others 0)
- **Actual**: New kin modifiers not applied; old modifiers remain

**Example 3: Stat Propagation Through Skills**
- Dwarf kin is applied (brn +5)
- Combat skill depends on Brawn and has base rank 2
- **Expected**: Combat skill total = 5 (brn) + 15 (rank bonus) + other bonuses
- **Actual**: Combat skill total = 0 (brn) + 15 (rank bonus) + other bonuses (stat modifier missing)

**Edge Case: No Kin Selected**
- User starts character creation with no kin selected
- **Expected**: All character.system.stats.*.kin = 0
- **Actual**: Correct behavior (no changes needed)

### Bug 2: Stats Resetting to Zero on Edit

#### Bug Condition

When a player manually edits a stat base value and saves it (via blur or Enter key), the value is calculated and persisted correctly initially, but after the actor update completes and auto-save handlers fire, the stat reverts to zero.

**Formal Specification:**
```
FUNCTION isBugCondition_StatReset(editEvent)
  INPUT: editEvent is a blur or Enter-key event on a stat base input
  OUTPUT: boolean
  
  LET statFieldName = "system.stats.*.base" (e.g., "system.stats.brn.base")
  LET previousValue = the actor's current stat base value
  LET newValue = the HTML input field value typed by user
  
  RETURN editEvent.target.name == statFieldName 
         AND newValue != "" 
         AND previousValue != newValue
         AND AFTER auto-save update completes, actor.system.stats.*.base == 0
END FUNCTION
```

#### Examples

**Example 1: Simple BRN Base Edit**
- Player edits BRN base field from 3 to 5 (field updates to "5")
- Presses Tab or clicks away (blur event fires)
- **Expected**: character.system.stats.brn.base = 5 (persists after update completes)
- **Actual**: After update completes, reverts to 0

**Example 2: Negative Stat Base**
- Player edits WSD base from 2 to -2 (deliberately lowering wisdom)
- Presses Enter
- **Expected**: character.system.stats.wsd.base = -2 (persists)
- **Actual**: Reverts to 0

**Example 3: Multiple Stats Edited in Sequence**
- Player edits BRN base 3 → 5 (blur fires, saves correctly)
- Then edits FOR base 4 → 6 (blur fires)
- **Expected**: Both persist (BRN 5, FOR 6)
- **Actual**: First edit may persist, but second edit reverts to 0 (or both revert)

**Edge Case: Stat to Zero**
- Player edits SWI base from 3 to 0 (intentionally zeroing it)
- **Expected**: character.system.stats.swi.base = 0 (persists as valid value)
- **Actual**: Reverts to 0, making it indistinguishable from no-change

## Expected Behavior

### Preservation Requirements

#### Bug 1 Preservation (Kin Modifiers)
**Unchanged Behaviors:**
- Drop and selection of non-kin items (weapons, armor, equipment) continue to work as before
- Skill bonuses for non-kin sources (vocation, spec, item modifiers) remain unaffected
- Character.system.stats remain editable via the base/spec fields
- HP and wealth calculations that do not involve kin continue working
- Other identity items (culture, vocation) continue to work independently

**Scope:**
All inputs that do NOT involve kin selection should be completely unaffected by the fix. This includes:
- Selecting culture or vocation items
- Dropping weapons, armor, or other equipment
- Editing stat base or spec values directly
- Editing skill ranks

#### Bug 2 Preservation (Stat Persistence)
**Unchanged Behaviors:**
- Non-stat field edits (skill ranks, HP, MP, wealth) continue to persist correctly
- Blur and Enter key triggers continue to work
- Auto-save debounce timing (500ms) remains unchanged
- Form value coercion (number, string, boolean) remains unchanged
- Error handling and revert-on-failure behavior remain unchanged

**Scope:**
All inputs that do NOT involve editing stat base values should be completely unaffected by the fix. This includes:
- Editing skill rank, vocation bonus, kin bonus, spec bonus, item bonus
- Editing HP, MP, wealth, defense values
- Editing passion, background, or biography text
- Selecting items or tab navigation

## Hypothesized Root Cause

### Bug 1: Kin Modifiers Not Propagated

Based on code analysis, the root cause is a missing reactive update trigger when a kin item is selected:

1. **Item Drop Handler Exists But Is Incomplete**: The `_onDropItem` method in `Open00CharacterSheet` (line 229) detects kin drops and calls `#applyIdentityEffects()` (line 251), which should apply the kin's effects.

2. **`#applyIdentityEffects()` Is Called But Ineffective**: The method calls `deriveKinCultureVocationEffects()` (line 263) which correctly derives the updates (line 264: `const updates = deriveKinCultureVocationEffects(...)`).

3. **The Updates Are Applied Correctly Initially**: The actor.update() call (line 267: `await this.actor.update(updates)`) should send the updates to the server.

4. **But `deriveKinCultureVocationEffects()` May Be Missing the Kin in the Identity Object**: In `kin-culture-vocation-effects.ts` line 62, the function reads `identities.kin['statModifiers']`. If the kin object passed to this function is not properly serialized or is missing the statModifiers field, the function will silently skip applying the kin modifiers (line 63: `for (const stat of ['brn', 'swi', ...])` will execute but `asNumber(statModifiers?.[stat])` returns 0).

5. **Root Cause**: The `toPlain()` transformation (line 255-257 in character-sheet.ts) may not correctly serialize the kin item's system data. If `kin.system.toObject()` returns undefined or an incomplete object, `statModifiers` will not be present.

Additionally, there may be a race condition: if `prepareDerivedData()` is called on the character BEFORE the actor update completes, derived data (like skill totals) will be computed using stale stat modifiers (all zeros).

### Bug 2: Stats Resetting to Zero on Edit

Based on auto-save code analysis, the root cause is a data race in the array field update pipeline:

1. **Array Field Updates Require Full Replacement**: In `auto-save.ts` lines 121-145, when editing a field inside an array (e.g., `system.stats.brn.base`), the auto-save handler cannot update just `system.stats.brn.base` directly. Instead, it must replace the entire `system.stats` object.

2. **The Replacement Logic Reads from Actor Source Data**: Line 130 reads from `getActorSourceValue(arrayPath)` to get the persisted plain data. However, if the auto-save handler calls `getActorSourceValue()` and the actor's `_source` has not yet been updated by the previous change, it may read stale or incomplete data.

3. **The Stat Structure Is a Schema Field, Not an Array**: While `system.stats` is technically an object (SchemaField with nested NumberFields), the auto-save logic treats objects with dotted paths as if they might contain arrays. The condition at line 113 (`if (Array.isArray(value) && index < parts.length - 1)`) evaluates to FALSE for SchemaField objects, so the code bypasses the array logic.

4. **But Then Line 162 Returns Incomplete Updates**: If array logic is skipped, line 162 returns `{ [fieldName]: coerceFormValue(getActorValue(fieldName), newValue) }`. This returns only the leaf value (e.g., `{ "system.stats.brn.base": 5 }`), which is correct.

5. **However, coerceFormValue() May Be Returning the Wrong Value**: In line 73-80, `coerceFormValue(currentValue, newValue)` returns `newValue` coerced to match the type of `currentValue`. If `currentValue` is 0 (an integer), `coerceFormValue(0, "5")` should return 5. But if `currentValue` is undefined or null (due to a race condition where `getActorValue()` reads stale data), the function might return the newValue as-is or apply wrong coercion.

6. **Root Cause - Data Race**: The real issue is that `getActorValue()` (line 97) reads from the live actor object, which may not have been re-prepared after the previous update. Specifically:
   - User edits stat base: `system.stats.brn.base` = 5
   - Auto-save calls `actor.update()` with `{ "system.stats.brn.base": 5 }`
   - Actor update fires, but before `prepareDerivedData()` recalculates, another partial render or data sync completes
   - A subsequent operation (partial render, another field change) calls `getActorValue("system.stats.brn.base")` which reads the HTML value (5)
   - But then the actor's data model recomputes derived data and may reset fields due to schema validation

Actually, re-examining the code more carefully: **The real root cause is that `buildDocumentUpdate()` on a SchemaField object returns only the leaf path**, not the full object. When updating `system.stats.brn.base`, Foundry's update system expects a full object replacement for nested objects in some cases, OR the field needs to be properly dotted. The issue is that `actor.update({ "system.stats.brn.base": 5 })` may be interpreted as attempting to set a primitive value on a SchemaField, which Foundry rejects or coerces back.

**Alternative Root Cause**: The form HTML is using incorrect field name structure. If the stat base input has `name="stats.brn.base"` instead of `name="system.stats.brn.base"`, the auto-save handler will construct the wrong update path.

## Correctness Properties

Property 1: Kin Modifiers Applied

_For any_ actor where a kin item is selected (via drop or item replacement), and that kin has statModifiers defined, the fixed code SHALL apply those modifiers to the character's stat.kin fields and trigger skill total recalculation so that all skills dependent on those stats reflect the kin modifier bonus.

**Validates: Requirements 2.1, 2.2**

Property 2: Kin Modifiers Preserve Non-Kin Sources

_For any_ stat edit that does NOT involve kin selection (manually editing base or spec values, selecting other identity items), the fixed code SHALL produce the same result as the original code, preserving all non-kin stat modifications and skill bonuses.

**Validates: Requirements 3.1, 3.2**

Property 3: Stat Base Edits Persist

_For any_ stat base value edited via the form (blur or Enter key), and that value is valid (a finite number within the schema constraints), the fixed auto-save code SHALL persist the value to the actor and that value SHALL remain in the actor's system.stats after all subsequent data preparation cycles.

**Validates: Requirements 2.3, 2.4**

Property 4: Non-Stat Edits Preserved

_For any_ form field edited that is NOT a stat base value (skill ranks, HP, wealth, text fields), the fixed code SHALL produce the same persistence and validation behavior as before the fix, preserving all existing auto-save functionality.

**Validates: Requirements 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

#### File: `src/module/sheets/kin-culture-vocation-effects.ts`

**Issue**: The `deriveKinCultureVocationEffects()` function may receive incomplete kin data due to improper serialization in the sheet's `toPlain()` helper.

**Change 1: Add Defensive Null Checks and Type Safety**
- Line 62: Add explicit null-coalescing for `statModifiers`
- Ensure that when `identities.kin` is present, we always populate all six stat keys (even if 0)
- Return an explicit object structure that cannot be undefined

**Change 2: Validate Kin Data Structure Before Using**
- Check that kin has required fields (`statModifiers`, `hpBonus`)
- Add console warnings if kin data is malformed

#### File: `src/module/sheets/character-sheet.ts`

**Issue 1**: The `toPlain()` helper (line 255-257) may not correctly serialize the kin item's system data

**Change 3: Improve toPlain() Serialization**
- Ensure `toPlain()` returns a deep clone of kin.system, not a shallow reference
- Explicitly serialize `kin.system.statModifiers`, `kin.system.hpBonus`, `kin.system.tsr`, `kin.system.wsr`
- Add fallback for missing `toObject()` method

**Issue 2**: After `actor.update()` completes, the sheet doesn't wait for data preparation before continuing

**Change 4: Ensure deriveDerivedData() Completes Before Sheet Re-renders**
- After `await this.actor.update(updates)` in `#applyIdentityEffects()`, call `this.actor.updateSource()` or explicitly trigger `prepareDerivedData()` to ensure skill totals are recalculated
- Alternatively, re-render the sheet to pick up the new derived data

#### File: `src/module/sheets/auto-save.ts`

**Issue**: Form field values for nested SchemaFields may not be persisted correctly by `actor.update()`

**Change 5: Improve Array/SchemaField Detection**
- The existing array detection logic (line 113) correctly identifies arrays, but SchemaFields are objects
- For object fields with dotted paths like `system.stats.brn.base`, ensure we're not accidentally treating them as arrays that need full replacement
- Verify that the update path is correctly formatted as a dot-path string

**Change 6: Fix buildDocumentUpdate() for Stats Fields**
- When the path is `system.stats.brn.base`, the update should be constructed as `{ "system.stats.brn.base": 5 }`, NOT as a full object replacement
- Verify that `coerceFormValue()` is called with the correct current value (not zero)
- Add a check: if the path contains `system.stats` and is a leaf node, use dot-path directly without object replacement

**Change 7: Ensure Form Input name Attributes Match Expected Paths**
- The form should render stat base inputs with names like `system.stats.brn.base` (not shortened paths)
- Verify in the template that all stat inputs are correctly named

### Summary of Changes

| File | Function/Location | Change | Reason |
|------|-------------------|--------|--------|
| `kin-culture-vocation-effects.ts` | `deriveKinCultureVocationEffects()` line 62 | Add null-coalescing and validation for kin.statModifiers | Ensure kin modifiers are always applied when kin is present |
| `character-sheet.ts` | `toPlain()` line 255-257 | Improve serialization to ensure complete kin system data | Ensure kin data is not lost during transformation |
| `character-sheet.ts` | `#applyIdentityEffects()` line 267 | Add explicit re-render or prepareDerivedData() trigger | Ensure skill totals reflect new kin modifiers |
| `auto-save.ts` | `buildDocumentUpdate()` line 113-145 | Fix SchemaField handling to use dot-paths directly | Prevent incorrect array replacement logic on stat fields |
| `auto-save.ts` | `persistField()` line 82-86 | Verify the update path construction | Ensure stat edits create correct update documents |
| Templates | `character-overview.hbs` | Verify stat input names are `system.stats.*.base` | Ensure auto-save receives correct field paths |

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each bug on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

#### Bug 1: Kin Modifiers

**Goal**: Surface counterexamples that demonstrate the kin modifiers bug BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Write tests that simulate dropping a kin item onto a character and assert that the character's stat.kin fields are updated correctly. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Drop Dwarf Kin**: Simulate dropping a Dwarf kin (brn +5, swi -5, for +5) and verify stat.kin fields are updated (will fail on unfixed code)
2. **Replace Halfling with Stone Troll**: Start with Halfling kin, then replace with Stone Troll, verify stat.kin fields reflect new kin (will fail on unfixed code)
3. **Skill Bonus Reflects Kin Stat**: After applying Dwarf kin (brn +5), verify a Brawn-dependent skill total includes the +5 kin modifier (will fail on unfixed code)
4. **No Kin Selected**: Character with no kin selected should have all stat.kin = 0 (may pass on unfixed code, since there's nothing to apply)

**Expected Counterexamples**:
- Kin stat modifiers are not reflected in character.system.stats.*.kin fields
- Skill totals do not include the kin stat modifier bonus
- Possible causes: kin data lost during serialization, deriveKinCultureVocationEffects() not receiving kin parameter, actor.update() failing silently

#### Bug 2: Stat Persistence

**Goal**: Surface counterexamples that demonstrate the stat reset bug BEFORE implementing the fix. Confirm whether the issue is in auto-save, coercion, or data preparation.

**Test Plan**: Write tests that simulate editing a stat base field, triggering blur, and verifying the value persists after the actor update completes. Run these tests on the UNFIXED code to observe whether the value resets to zero.

**Test Cases**:
1. **Edit BRN Base 3 → 5**: Simulate blur event on stat base input, verify character.system.stats.brn.base = 5 after update (will fail on unfixed code)
2. **Edit WSD Base 2 → -2**: Test negative stat values, verify they persist (will fail on unfixed code)
3. **Edit Multiple Stats Sequentially**: Edit BRN, then FOR, verify both persist (will fail on unfixed code for at least one)
4. **Edit Stat to Zero**: Edit SWI base from 3 to 0, verify it stays 0 and doesn't revert (may be ambiguous on unfixed code)

**Expected Counterexamples**:
- Stat base value reverts to zero after auto-save completes
- Stat value is lost between form input and actor update
- Possible causes: array field replacement logic applied incorrectly, coerceFormValue() returning wrong value, buildDocumentUpdate() constructing wrong path

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the expected behavior.

**Pseudocode for Bug 1:**
```
FOR ALL kin IN [Dwarf, Halfling, StoneT Roll, ...] DO
  character := new character with no kin
  kinItem := load kin from database
  DROP kinItem onto character
  FOR ALL stat IN ['brn', 'swi', 'for', 'wit', 'wsd', 'bea'] DO
    ASSERT character.system.stats[stat].kin == kin.system.statModifiers[stat]
  END FOR
END FOR
```

**Pseudocode for Bug 2:**
```
FOR ALL (statKey, oldValue, newValue) IN test_cases DO
  character := new character with stats set to oldValue
  stat_input := get form input for character.system.stats[statKey].base
  stat_input.value := newValue
  TRIGGER blur event on stat_input
  AWAIT auto-save handler completes
  ASSERT character.system.stats[statKey].base == newValue
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalCode(input) = fixedCode(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

#### Bug 1 Preservation Tests

**Test Plan**: Observe behavior on UNFIXED code first for non-kin operations, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Drop Non-Kin Items**: Verify dropping weapons, armor, equipment still works after kin fix
2. **Edit Stat Base Manually**: Verify manually editing stat base/spec values still works (not affected by kin fix)
3. **Select Culture or Vocation**: Verify culture and vocation selection still works independently
4. **Skill Bonuses Without Kin**: Verify character with no kin has correct skill bonuses (all from rank, vocation, item modifiers)

#### Bug 2 Preservation Tests

**Test Plan**: Observe behavior on UNFIXED code first for non-stat edits, then write tests capturing that behavior.

**Test Cases**:
1. **Edit Skill Ranks**: Verify skill rank edits persist correctly
2. **Edit HP/MP/Wealth**: Verify HP max, MP, wealth edits persist
3. **Edit Text Fields**: Verify passion, background, biography edits persist
4. **Non-Blur Events**: Verify keyboard events and tab navigation don't trigger unexpected saves

### Unit Tests

- Test kin stat modifiers are correctly read from KinDataModel
- Test deriveKinCultureVocationEffects() with various kin/culture/vocation combinations
- Test auto-save buildDocumentUpdate() for stat fields vs skill fields vs other fields
- Test coerceFormValue() with stat values (including zero, negative, large positive)
- Test getActorValue() reads correct nested values for stat paths

### Property-Based Tests

- Generate random kin stat modifiers and verify they are applied to the character
- Generate random stat edits (old value, new value, field path) and verify persistence
- Generate sequences of mixed edits (kin selection, stat edits, skill edits) and verify all persist
- Generate random game states and verify kin modifiers don't break other calculations

### Integration Tests

- Test full character creation flow: select kin, verify stat modifiers applied, verify skills updated
- Test kin replacement: change kin and verify old modifiers cleared, new ones applied
- Test character with all identity items: kin, culture, vocation applied together, verify no conflicts
- Test auto-save with concurrent actions: drop item while editing stat, verify both persist
- Test sheet re-render after kin application: verify stat totals display correctly in UI

