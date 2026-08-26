# Document Test Shim Specification

## Purpose

Defines a Foundry mock/shim layer enabling vitest to instantiate TypeDataModels, Actor, and Item documents and validate derived state without a running Foundry server.

## Requirements

### Requirement: DataModel Instantiation in Vitest

The shim MUST allow `new CharacterDataModel(data)` (and equivalent NPC/Item models) to execute in a vitest environment, providing enough of the Foundry API surface for `prepareDerivedData` to run and produce correct results.

Source: proposal §Testing Strategy Shift ("mock TypeDataModel/Actor/Item for vitest").

#### Scenario: Character model derivation in test

- GIVEN the test shim is loaded via vitest setup
- WHEN a CharacterDataModel is instantiated with valid source data
- THEN `prepareDerivedData` MUST execute without throwing
- AND derived fields (hp.max, defense, etc.) MUST be computed correctly

### Requirement: Embedded Document Support

The shim MUST support creating embedded Item documents on an Actor (simulating `createEmbeddedDocuments`) so that identity-effect derivation paths can be tested.

Source: proposal §Testing Strategy Shift ("validate derived state end-to-end").

#### Scenario: Identity item triggers re-derivation in test

- GIVEN a shim Actor with no Kin item
- WHEN an Item of type "kin" is embedded via the shim's `createEmbeddedDocuments`
- THEN `prepareDerivedData` MUST re-run
- AND derived kin modifiers MUST appear in the Actor's derived data

### Requirement: No Runtime Foundry Dependency

Test files using the shim MUST NOT import or require actual FoundryVTT packages. The shim provides stubs for: `foundry.abstract.TypeDataModel`, `foundry.abstract.Document`, `Actor`, `Item`, `Roll`, and collection classes needed by the system code.

Source: exploration §ROOT CAUSE ("models/* has ZERO tests; importing them throws").

#### Scenario: Test runs without Foundry

- GIVEN `npm test` is executed
- WHEN model tests import the shim
- THEN no "Cannot find module 'foundry'" or global reference errors MUST occur
