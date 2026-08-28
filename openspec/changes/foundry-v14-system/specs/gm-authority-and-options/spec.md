# GM Authority and Options Specification

## Purpose

Automate deterministic consequences while preserving every rule-assigned or fiction-dependent decision for explicit GM control.

## Requirements

### Requirement: Explicit GM authority gates

The system MUST automate calculations and table lookups only when their inputs are explicit. Whether a roll is needed, its difficulty, situational rulings, complications, phase exceptions, and fiction-dependent outcomes MUST require an explicit GM input or confirmation before state changes.

#### Scenario: Deterministic result awaits confirmation
- GIVEN automation has calculated a consequence that affects game state
- WHEN the consequence includes a GM-owned decision
- THEN the system MUST present the decision for explicit GM confirmation
- AND it MUST NOT mutate state before confirmation

#### Scenario: GM confirms an outcome
- GIVEN a pending consequence and an authorized GM
- WHEN the GM explicitly confirms it
- THEN the system MAY apply the confirmed state change
- AND the applied change MUST retain the confirmed inputs

### Requirement: Independent optional settings

Each optional rule MUST be represented by an independent Foundry world setting and MUST default to disabled. Enabling one option MUST NOT implicitly enable another.

#### Scenario: Default world creation
- GIVEN a new world is created
- WHEN optional settings are initialized
- THEN every optional rule MUST be disabled
- AND no optional behavior MAY affect play by default

#### Scenario: One option is enabled
- GIVEN one optional setting is enabled by the GM
- WHEN the system evaluates optional behavior
- THEN only that setting's behavior MAY apply
- AND all other options MUST remain disabled
