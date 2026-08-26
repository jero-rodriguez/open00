# Derived State Ownership Specification

## Purpose

Defines field classification (DERIVED / PLAYER-OWNED / SEEDED), derivation formulas, and protection invariants for all Actor schema fields. Eliminates persisted derived state and prevents the three confirmed live defects from recurring.

## Requirements

### Requirement: Field Classification Enforcement

The system MUST enforce the Field Classification Table: DERIVED fields are recomputed in `prepareDerivedData` and MUST NOT be persisted in Actor source data. PLAYER-OWNED fields persist and MUST NOT be overwritten by derivation logic. SEEDED fields are computed once at a defined trigger then become PLAYER-OWNED.

Source: proposal §Field Classification Table; vsd-character.md §Derived Attributes.

#### Scenario: Derived field not persisted

- GIVEN a Character Actor with `stats.BRN.base = 20` and a Kin item with `BRN: +5`
- WHEN the Actor is saved to the database
- THEN the persisted document MUST NOT contain `stats.BRN.kin`
- AND `prepareDerivedData` MUST produce `stats.BRN.kin = 5` at runtime

#### Scenario: Player-owned rank survives identity change

- GIVEN a Character Actor with `skills.Blades.rank = 8` (player-spent DP)
- WHEN the Vocation item is removed and a new Vocation item is added
- THEN `skills.Blades.rank` MUST remain `8`

#### Scenario: Seeded wealth never overwritten

- GIVEN a Character Actor with `wealth = 3` (previously seeded, then modified by play)
- WHEN the Kin item is replaced with a different Kin
- THEN `wealth` MUST remain `3`

### Requirement: Correct HP Derivation

The system MUST derive `hp.max` as the full Body Skill Bonus per vsd-character.md §Body Skill and §Derived Attributes. Body Skill Bonus = Stat Value (FOR) + Rank Bonus (from `skills.Body.rank` via Rank Bonus Table) + Vocational Bonus + Kin Bonus + Item Modifier + Special Modifiers + Kin HP modifier, capped by the Kin Max HP value. Soul Damage permanently reduces this bonus.

Source: vsd-core-rules.md §Skill Bonus Calculation; vsd-character.md §Body Skill, §Kin Modifiers Table (HP, Max HP columns).

#### Scenario: HP max derived from full Body skill bonus

- GIVEN a Man character with FOR=10, skills.Body.rank=5 (rank bonus +25), Warrior vocation bonus +0, no items
- WHEN `prepareDerivedData` runs
- THEN `hp.max` MUST equal `10 + 25 + 0 + 0 + 0 + 0 + 30` = `65`, where 30 is Man Kin HP modifier
- AND `hp.max` MUST NOT exceed Man's Max HP cap of `120`

#### Scenario: Soul damage reduces HP max

- GIVEN the above character with `soulDamage = 10`
- WHEN `prepareDerivedData` runs
- THEN `hp.max` MUST equal `65 - 10` = `55`

### Requirement: Correct Kin Bonus for Skills

The `skills.N.kin` field MUST be DERIVED from the equipped Kin item's skill-affecting traits (e.g., racial stat bonuses that flow into skill totals via the governing stat). This is the Kin Bonus term in the Skill Bonus Calculation formula.

Source: vsd-core-rules.md §Skill Bonus Calculation ("Kin Bonus" term).

#### Scenario: Kin bonus derived from Kin item

- GIVEN a Character with an equipped Kin item "Dwarf" which grants TSR +20
- WHEN `prepareDerivedData` runs
- THEN the TSR computation MUST include the Kin Bonus of `+20`

### Requirement: Cultural Skill Ranks as Player-Owned Seed

`skills.N.rank` is PLAYER-OWNED. Culture's 21 distributed Cultural Skill Ranks MUST be seeded into `skills.N.rank` once at Culture assignment. After seeding, they are indistinguishable from DP-purchased ranks and MUST NOT be overwritten. Cultural ranks do not count toward the max-2-ranks-per-skill-per-level development cap.

Source: vsd-character.md §Cultures ("21 total distributed across skills"), §Advancement ("Cultural ranks don't count toward max developable ranks").

#### Scenario: Cultural ranks seeded into rank field

- GIVEN a new Character with no skills and a City Culture assigning 3 ranks to Charisma
- WHEN the Culture is applied
- THEN `skills.Charisma.rank` MUST be `3`

#### Scenario: Cultural seed survives culture change

- GIVEN a Character with `skills.Charisma.rank = 5` (3 cultural + 2 DP-purchased)
- WHEN the Culture item is replaced
- THEN `skills.Charisma.rank` MUST remain `5` (seeded values are now player-owned)

### Requirement: Drive Points Initial Value

`drivePoints.value` MUST start at `1` for new characters. `drivePoints.max` MUST always be `5`.

Source: vsd-core-rules.md §Drive ("Range: 0-5. Starts at 1.").

#### Scenario: New character drive initialization

- GIVEN a newly created Character Actor
- WHEN the Actor is initialized
- THEN `drivePoints.value` MUST equal `1`
- AND `drivePoints.max` MUST equal `5`

### Requirement: HP Value Allows Negative

`hp.value` MUST allow negative values. Incapacitated condition applies at `hp.value <= 0`. Dying condition applies at `hp.value <= -50`.

Source: vsd-combat.md §Hit Points & Death.

#### Scenario: Damage below zero

- GIVEN a Character with `hp.value = 10` and `hp.max = 65`
- WHEN 70 damage is applied
- THEN `hp.value` MUST equal `-60`
- AND the character MUST be in Dying state

### Requirement: Identity Effects via Document Lifecycle

Identity effects (Kin, Culture, Vocation stat/skill modifiers) MUST apply through the Actor/Item document class lifecycle hooks — not sheet event handlers. This ensures effects trigger on ANY path: programmatic `createEmbeddedDocuments`, compendium import, actor duplication, and macro execution.

Source: exploration §FOUNDRY v14 GAPS ("Identity logic lives in sheet handlers, so it never runs on programmatic create").

#### Scenario: Programmatic identity application

- GIVEN a Character Actor with no Kin item
- WHEN `actor.createEmbeddedDocuments("Item", [kinItemData])` is called programmatically
- THEN `prepareDerivedData` MUST reflect the new Kin's stat modifiers in derived fields

### Requirement: Derived Attributes Currently Missing

The system MUST derive: DEF = max(SWI total, 0) + armor/shield bonuses; Total MP = (Stat MP gain + Vocation MP gain) × Level + Kin MP bonus; Move Rate = 15m base; Size from Kin; Bruised Value = floor(hp.max / 2); SR Level Bonus per the progression (+5/level L1-10, +2/level L11-20, +1/level L21+).

Source: vsd-character.md §Derived Attributes; vsd-core-rules.md §SR Level Bonus table.

#### Scenario: DEF derivation

- GIVEN a Character with SWI total = 15, no armor/shield
- WHEN `prepareDerivedData` runs
- THEN `defense` MUST equal `15`

#### Scenario: SR Level Bonus at level 7

- GIVEN a Character at level 7, FOR=10, Kin TSR bonus +20
- WHEN TSR is computed
- THEN SR Level Bonus MUST be `35` (+5×7)
- AND TSR MUST equal `10 + 35 + 20` = `65`
