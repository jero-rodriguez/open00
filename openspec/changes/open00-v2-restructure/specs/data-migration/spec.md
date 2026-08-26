# Data Migration Specification

## Purpose

Defines versioned forward-only migration from any 1.x Actor/Item schema to v2, stripping derived fields, preserving player-owned and seeded data, and documenting unrecoverable states.

## Requirements

### Requirement: Forward-Only Migration

The system MUST implement `static migrateData(source)` on Actor and Item document classes. Migration MUST accept any 1.x source data and produce valid v2 schema output. Migration runs transparently on document load (no user action required).

Source: proposal §Data Migration Strategy.

#### Scenario: 1.x actor loads in v2

- GIVEN a world containing Actor documents with 1.x schema (persisted derived fields present)
- WHEN the world is loaded in v2
- THEN `migrateData` MUST run synchronously on each Actor
- AND the Actor MUST be usable without manual intervention

### Requirement: Derived Fields Stripped

Migration MUST remove the following persisted fields from Actor source data: `stats.*.kin`, `hp.max`, `skills.N.vocation`, `skills.N.item`, `defense`, `mp.max`, `encumbrance`. These are now computed at runtime.

Source: proposal §Field Classification Table (all DERIVED fields).

#### Scenario: Derived stat modifiers removed

- GIVEN a 1.x Actor with `stats.BRN.kin = 5` persisted
- WHEN migration runs
- THEN `stats.BRN.kin` MUST NOT exist in the migrated source data

### Requirement: Player-Owned and Seeded Fields Preserved

Migration MUST preserve: `wealth`, `skills.N.rank`, `skills.N.spec`, `stats.*.base`, `stats.*.spec`, `hp.value`, `mp.value`, `drivePoints.value`, `experience.*`, `passions.*`, `heroicPath`.

Source: proposal §Data Migration Strategy ("wealth → preserve as-is").

#### Scenario: Wealth preserved through migration

- GIVEN a 1.x Actor with `wealth = 3`
- WHEN migration runs
- THEN `wealth` MUST remain `3`

#### Scenario: Skill ranks preserved

- GIVEN a 1.x Actor with `skills.Blades.rank = 6`
- WHEN migration runs
- THEN `skills.Blades.rank` MUST remain `6`

### Requirement: Schema Version Tracking

Migrated documents MUST carry a `schemaVersion` field. Migration logic MUST use this to determine which transforms to apply (idempotent — re-running on already-migrated data produces no change).

Source: proposal §Data Migration Strategy ("versioned by a new schemaVersion field").

#### Scenario: Idempotent migration

- GIVEN an Actor already at `schemaVersion: 2`
- WHEN `migrateData` runs again
- THEN the data MUST remain unchanged

### Requirement: Rank-30 Cap Removed

The fabricated `rank: 30` ceiling MUST be removed from the schema. Existing ranks above 20 are valid under VsD rules and MUST be preserved.

Source: vsd-character.md §Advancement (no global rank cap; limit is per-category DP and max 2 ranks/skill/level).

#### Scenario: High rank preserved

- GIVEN a 1.x Actor with `skills.Arcana.rank = 25`
- WHEN migration runs
- THEN `skills.Arcana.rank` MUST remain `25`

### Requirement: Unrecoverable Data Documented

Characters whose `skills.N.rank` was zeroed by the `clearAllIdentityEffects` bug CANNOT be recovered by migration (the original values are lost). The v2 release notes MUST document this and recommend manual re-entry.

Source: scope-decisions §DECISIONS ("release note + manual re-entry. No recovery tool").

#### Scenario: Zeroed rank not silently fixed

- GIVEN a 1.x Actor with `skills.Blades.rank = 0` (possibly bug-induced)
- WHEN migration runs
- THEN `skills.Blades.rank` MUST remain `0` (migration cannot distinguish legitimate zero from bug)
