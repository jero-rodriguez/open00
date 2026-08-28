# Deterministic Roll Resolution Specification

## Purpose

Provide a pure, deterministic open-ended d100 resolution contract whose required difficulty and modifiers are supplied by the GM.

## Requirements

### Requirement: Deterministic open-ended d100 resolver

The resolver MUST accept an explicit d100 result sequence, GM-supplied difficulty, and GM-supplied modifiers, then apply the approved open-ended d100 and outcome rules without hidden randomness. Identical inputs MUST produce identical outputs.

#### Scenario: Standard resolution
- GIVEN a valid die sequence, difficulty, and modifiers supplied by the GM
- WHEN the resolver is called
- THEN it MUST return the calculated total and rule outcome
- AND it MUST preserve an inspectable input/result trace

#### Scenario: Open-ended continuation
- GIVEN the supplied sequence contains the additional rolls required by the open-ended rule
- WHEN the resolver processes the sequence
- THEN it MUST consume rolls in rule order
- AND it MUST return the same outcome on repeated calls with the same sequence

### Requirement: GM-owned inputs remain explicit

The resolver MUST reject missing or malformed difficulty/modifier inputs and MUST NOT infer whether a roll is needed, choose a difficulty, or invent situational modifiers.

#### Scenario: Missing difficulty
- GIVEN no difficulty was supplied
- WHEN resolution is requested
- THEN the resolver MUST return a validation error
- AND no game state or outcome MAY be committed

### Requirement: Separate proof layers

The resolver contract MUST be testable in Node without Foundry. A Foundry-facing slice MAY expose it, but runtime behavior on Foundry `14.367` MUST be evidenced separately.

#### Scenario: Node-only contract test
- GIVEN the test runner has no Foundry runtime
- WHEN resolver fixtures execute
- THEN deterministic results and validation errors MUST be testable
- AND the absence of runtime smoke evidence MUST NOT be represented as a passing runtime check
