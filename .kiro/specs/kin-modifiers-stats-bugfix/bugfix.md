# Bugfix Requirements: Kin Modifiers & Stats Editing

## Introduction

This document addresses two critical bugs in the VsD character sheet that prevent proper stat calculation and modification:

1. **Kin modifiers not propagated**: Stat modifiers from selected kin are not being applied to character stats
2. **Stats resetting on edit**: Manual stat edits revert to zero immediately when leaving the input field

These bugs prevent users from correctly building and managing characters, making the sheet unusable for character creation and modification.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a kin is selected for a character THEN the system does not apply the kin's stat modifiers to the character's base stats
1.2 WHEN a kin with stat modifiers (e.g., +2 Brawn, +1 Swiftness) is selected THEN the system displays no visual indication of modifier application
1.3 WHEN a user manually edits a stat value in the sheet (e.g., setting Brawn to 5) THEN the system immediately resets the value to 0 when the input field loses focus

### Expected Behavior (Correct)

2.1 WHEN a kin is selected for a character THEN the system SHALL apply each of the kin's stat modifiers to the character's stats as a separate "kin modifier" line item
2.2 WHEN a kin with stat modifiers is selected THEN the system SHALL show the modifier contribution alongside the base stat value (e.g., "Base: 3 + Kin: 2 = Total: 5")
2.3 WHEN a user manually edits a stat value in the sheet THEN the system SHALL persist the edited value and display it correctly after the input field loses focus

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a character has no kin selected THEN the system SHALL CONTINUE TO display base stats without kin modifiers
3.2 WHEN a character has existing stat modifiers from sources other than kin THEN the system SHALL CONTINUE TO apply those modifiers correctly
3.3 WHEN a user navigates between different stat fields THEN the system SHALL CONTINUE TO preserve previously edited values in other fields
3.4 WHEN a character sheet is saved and reloaded THEN the system SHALL CONTINUE TO restore all previously saved stat values
