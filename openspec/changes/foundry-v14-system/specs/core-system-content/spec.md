# Core System Content Specification

## Purpose

Deliver the complete open00 v1.5 core system as bounded, testable vertical slices while excluding the bundled adventure.

## Requirements

### Requirement: Complete private core scope

The system MUST incrementally cover character options, rules, tables, equipment, Bestiary, and Grimoire, including character creation, advancement, skills, saves, combat, conditions, tactical rounds, travel, and wealth. The bundled adventure MUST remain out of scope.

#### Scenario: A core slice is delivered
- GIVEN a planned bounded subsystem such as saves, combat, or equipment
- WHEN its slice is accepted
- THEN its rules contract, validated source records, Foundry interaction, and package output MUST be independently testable
- AND it MUST NOT require unrelated unfinished subsystems

#### Scenario: Adventure material is encountered
- GIVEN source or extracted content includes the bundled adventure
- WHEN content scope is checked
- THEN the material MUST be excluded from source, tests, packages, and releases

### Requirement: Canonical skill and magic progression

Character progression MUST expose seven Skill Categories and a separate Magic Points development bucket, consistent with the approved canonicalization.

#### Scenario: Character advancement is evaluated
- GIVEN a character advances a skill or magical capability
- WHEN development choices are presented
- THEN the seven categories and Magic Points MUST be represented as distinct buckets
- AND no eighth Skill Category MAY be generated from extraction wording

### Requirement: Per-slice proof and regression safety

Each later content slice MUST add Node-testable rules contracts and, where it crosses Foundry boundaries, separate runtime evidence from exactly Foundry `14.367`. Missing or unavailable required runtime evidence MUST be `NOT VERIFIED` and MUST block acceptance of that Foundry-facing slice. Existing accepted slices MUST remain regression-tested as new content is added.

#### Scenario: New slice does not regress prior rules
- GIVEN previously accepted fixtures and a new content slice
- WHEN the complete test and smoke evidence runs
- THEN prior deterministic fixtures MUST still pass
- AND any missing required runtime evidence MUST make the Foundry-facing slice `NOT VERIFIED` and block its acceptance
