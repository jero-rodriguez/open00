# Foundry Document and UI Specification

## Purpose

Expose completed mechanics through Foundry VTT v14 public data-model and ApplicationV2 boundaries without coupling pure rules to private APIs.

## Requirements

### Requirement: Public TypeDataModel registration

Type-specific system data MUST extend the public `foundry.abstract.TypeDataModel` boundary and MUST be registered through the corresponding public `CONFIG.<Document>.dataModels` registry. Private Foundry APIs MUST NOT be required.

#### Scenario: Document type loads
- GIVEN the system is running on Foundry `14.367`
- WHEN the document type is registered
- THEN Foundry MUST construct it through the public data-model registry
- AND the runtime smoke evidence MUST identify the target build

### Requirement: ApplicationV2 interaction boundary

System sheets and interactive views MUST use the public ApplicationV2 boundary. User actions MUST update only the intended data and MUST preserve deterministic domain results supplied by pure contracts.

#### Scenario: User submits a supported interaction
- GIVEN an ApplicationV2 view displays a valid document
- WHEN the user changes a supported field or invokes a supported action
- THEN the view MUST persist the intended update through the public boundary
- AND unrelated document data MUST remain unchanged

### Requirement: Runtime-only integration evidence

Node tests MAY validate adapter contracts, but document registration, rendering, permissions, migration, and lifecycle behavior MUST be proven by explicit runtime evidence from exactly Foundry `14.367`. That evidence is a completion gate; missing or unavailable evidence MUST be `NOT VERIFIED` and MUST leave the Foundry-facing slice incomplete. Node evidence MUST NOT substitute for it.

#### Scenario: Runtime behavior is absent
- GIVEN a Node test suite passes
- WHEN exact Foundry `14.367` runtime evidence is missing or unavailable
- THEN the integration claim MUST be `NOT VERIFIED` and the slice MUST remain incomplete
- AND the Node result MUST NOT be accepted as substitute runtime proof
