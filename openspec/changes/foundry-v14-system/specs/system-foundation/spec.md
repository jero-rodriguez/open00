# System Foundation Specification

## Purpose

Establish the first implementable slice for a private Foundry VTT system: a reproducible Node-testable harness, a generated package, and guarded delivery evidence.

## Requirements

### Requirement: Strict-TDD project harness

The project MUST establish `src/` for authored source, `test/` for tests, and generated `dist/` for installable output. The first slice MUST demonstrate RED, GREEN, and REFACTOR evidence with a runnable Node-based test command before product mechanics are added.

#### Scenario: Greenfield foundation is created
- GIVEN the repository has no application or test tooling
- WHEN the foundation slice is implemented
- THEN the test command, build command, and package generation command are runnable
- AND generated output is reproducible without treating `dist/` as authored source

### Requirement: Foundry 14.367 compatibility evidence

The generated system manifest MUST set both `compatibility.minimum` and `compatibility.verified` to exactly `"14.367"`. Compatibility and first-slice completion MUST require a generated-package load smoke on exactly Foundry `14.367`; Node tests and runtime evidence MUST remain separate proof layers.

#### Scenario: Runtime baseline is checked
- GIVEN the PR1 generated package is built
- WHEN its package-load smoke runs
- THEN it MUST record PASS only on exactly Foundry `14.367`
- AND any other build MUST be `NOT VERIFIED`, MUST never be PASS, and MUST block completion

### Requirement: Fail-closed private delivery

GitHub Actions MUST run tests, build, package, and privacy checks. A tagged automatic private release MUST abort before upload when repository visibility, release visibility, package contents, or authorization is unknown or public.

#### Scenario: Exposure uncertainty blocks release
- GIVEN a tagged release has been requested
- WHEN any privacy check returns unknown or public exposure is possible
- THEN the workflow MUST fail before uploading artifacts
- AND no release asset is published

### Requirement: Conventional change history

Contributions MUST use Conventional Commits so release automation can classify changes without inferring intent from free-form messages.

#### Scenario: Invalid commit message is rejected
- GIVEN a proposed commit does not follow the configured Conventional Commits grammar
- WHEN CI validates the contribution
- THEN CI MUST reject it with an actionable failure
