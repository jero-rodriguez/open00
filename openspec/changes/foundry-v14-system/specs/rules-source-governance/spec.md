# Rules Source Governance Specification

## Purpose

Keep imported rules and content auditable against the supplied open00 v1.5 PDF while preventing secondary-source contamination.

## Requirements

### Requirement: PDF-first provenance

Every imported rule, table, or content record MUST identify its location in the user-supplied v1.5 PDF and MUST be validated before inclusion in a package. The PDF is authoritative when sources disagree.

#### Scenario: Conflicting secondary value
- GIVEN a value differs between the PDF and a secondary reference
- WHEN the record is prepared
- THEN the PDF value MUST be selected
- AND the record MUST retain verifiable PDF provenance

### Requirement: Approved canonical corrections

The system MUST canonicalize the Spell Casting Table interval `136–140` to `SR 90` and MUST model seven Skill Categories with Magic Points as a separate development bucket.

#### Scenario: Ambiguous extracted table is normalized
- GIVEN extraction data contains the duplicated result 135 or eight-category wording
- WHEN canonical data is validated
- THEN the corrected interval and seven-plus-Magic-Points structure MUST be emitted
- AND the correction MUST be traceable to the approved local decision

### Requirement: Secondary references are non-authoritative

The VSD data-toolbox reference at commit `e04ce2023870cfea333b25f26a1ddc29d769aa22` MAY assist cross-checking but MUST NOT override PDF data or enter packages without item-level PDF verification.

#### Scenario: Unverified VSD record is encountered
- GIVEN a record exists only in the VSD reference
- WHEN content import is evaluated
- THEN it MUST be rejected or held out of generated output
- AND no silent substitution is permitted

### Requirement: Adventure exclusion

The bundled adventure MUST NOT appear in authored source, tests, generated packages, or releases.

#### Scenario: Package audit finds adventure content
- GIVEN a package is being checked
- WHEN an adventure record or asset is detected
- THEN the privacy/content gate MUST fail before publication
