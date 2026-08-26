# Combat Tables Specification

## Purpose

Defines the lookup behaviour, data contract, and result semantics for attack tables, critical tables, and fumble tables. Numeric grid data is a BLOCKED external dependency — this spec covers structure and resolution logic only.

## Requirements

### Requirement: Attack Table Lookup Behaviour

The system MUST resolve an attack result by: (1) computing final result = d100 + CMB + modifiers - target DEF; (2) looking up the result row on the weapon's Attack Table for the target's armor column (NA/LA/MA/HA); (3) applying the weapon's Max Result cap LAST, overriding all prior modifiers. Results ≤ 10 are automatic misses.

Source: vsd-combat.md §Attack Resolution, §Reading Attack Table Results, §Max Result.

#### Scenario: Normal attack lookup

- GIVEN a weapon using the Edged table with Max Result 140, target in MA armor
- WHEN the computed result is 125
- THEN the system MUST look up row 125 in Edged table, MA column
- AND return the damage and critical severity from that cell

#### Scenario: Max Result cap applied last

- GIVEN a weapon with Max Result 130 and a computed result of 155
- WHEN the lookup occurs
- THEN the system MUST cap the result to 130 BEFORE reading the table
- AND return the cell at row 130

### Requirement: Fumble Detection

If the unmodified d100 roll falls within the weapon's Clumsy Range, the attack is a Fumble regardless of the final modified result. Fumble resolution uses d100 + weapon's fumble modifier on the Fumble Table.

Source: vsd-combat.md §Weapon Fumbles; vsd-equipment.md §Weapon Properties (Clumsy Range).

#### Scenario: Clumsy range fumble

- GIVEN a weapon with Clumsy Range 1-5 and fumble modifier +10
- WHEN the unmodified d100 roll is 4
- THEN a Fumble MUST be triggered regardless of the total modified result

### Requirement: Critical Strike Resolution

When an attack table cell includes a severity (e.g., "16 Mod"), the system MUST roll a non-open-ended d100 + severity modifier on the appropriate Critical Strike Table (determined by weapon's Primary or Alternate Critical type). Severity modifiers: Superficial +0, Light +10, Moderate +20, Grievous +30, Lethal +50.

Source: vsd-combat.md §Critical Strikes.

#### Scenario: Moderate critical resolution

- GIVEN an attack result of "14 Mod" on an Edged weapon (Primary: Cut)
- WHEN critical resolution runs
- THEN the system MUST deal 14 base damage
- AND roll d100 + 20 on the Cut Critical Table

### Requirement: Heroic/Epic Severity Reduction

Heroic creatures (CT first letter = H) reduce critical severity by 1 level. Epic creatures (CT first letter = E) reduce by 2 levels. Reduction below Superficial negates the critical entirely.

Source: vsd-combat.md §Critical Strike Reduction; vsd-bestiary.md §Creature Type Codes.

#### Scenario: Epic creature negates Light critical

- GIVEN a target creature with CT = "EB" (Epic Beast)
- WHEN a Light severity critical would apply
- THEN the critical MUST be completely negated (Light -2 = below Superficial)

### Requirement: Data Contract for Table JSON

Attack table files MUST conform to: `{ name, columns: ["NA","LA","MA","HA"], rows: [{ min, max, results: [string×4] }] }`. Critical table files MUST conform to: `{ name, rows: [{ min, max, severity, effect }] }`. The system MUST validate table structure at load time.

Source: proposal §Dependencies (Proposed data format for handoff).

#### Scenario: Malformed table rejected

- GIVEN a table JSON file missing the `columns` field
- WHEN the system loads combat tables
- THEN it MUST throw a validation error identifying the malformed file

### Requirement: Numeric Grid Data Blocked

The actual numeric values for all 6 attack tables, 9 critical tables, and fumble tables are an UNRESOLVED external dependency. The system MUST NOT generate, infer, approximate, or default any table values. Implementation proceeds with the lookup engine and data contract; population awaits user-supplied data.

Source: scope-decisions §BLOCKER.

#### Scenario: Empty table graceful handling

- GIVEN that attack table JSON files have not yet been populated
- WHEN a combat roll attempts a table lookup
- THEN the system MUST report a clear error ("Table data not available") rather than crashing or returning fabricated values
