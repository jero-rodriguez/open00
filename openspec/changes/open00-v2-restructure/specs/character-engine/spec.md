# Character Engine Specification (Modified)

## Purpose

Specifies the rewrite of four fabricated rules modules (travel, encumbrance, drive-points, advancement) and the SR Level Bonus / TSR / WSR computations to match VsD v1.5. Each requirement cites its steering source.

## Requirements

### Requirement: Travel Distance Computation

The system MUST compute daily overland travel distance in km/day using the encumbrance level × terrain type table from vsd-travel-healing.md §Overland Movement. There is NO pace system, NO miles, NO pace-multiplier formula.

Source: vsd-travel-healing.md §Overland Movement table.

| Encumbrance | Normal (foot) | Normal (mount) | Rough (foot) | Rough (mount) | Arduous (foot) | Arduous (mount) |
|---|---|---|---|---|---|---|
| Up to Lightly | 50 | 95 | 30 | 40 | 15 | 8 |
| Encumbered | 30 | 65 | 15 | 25 | 8 | 8 |
| Heavily | 15 | 30 | 8 | 15 | 3 | 0 |
| Over | 0 | 0 | 0 | 0 | 0 | 0 |

#### Scenario: Normal terrain on foot, lightly encumbered

- GIVEN a character with encumbrance level "Lightly Encumbered", traveling on foot
- WHEN daily travel distance is computed for Normal terrain
- THEN the result MUST be `50` km/day

#### Scenario: Arduous terrain mounted, heavily encumbered

- GIVEN a character Heavily Encumbered, traveling mounted
- WHEN daily travel distance is computed for Arduous terrain
- THEN the result MUST be `0` km/day

### Requirement: Encumbrance Five Qualitative Levels

The system MUST determine encumbrance as one of five qualitative levels: Unencumbered, Lightly Encumbered, Encumbered, Heavily Encumbered, Over Encumbered. Lightly Encumbered has NO penalties. Armor is NEVER factored into encumbrance level (armor has its own separate penalties). Characters with BRN ≥ 30 AND FOR ≥ 30, OR Large size, reduce their effective encumbrance level by one.

Source: vsd-travel-healing.md §Encumbrance table and §Special Rules.

#### Scenario: Lightly encumbered no penalties

- GIVEN a character assessed as Lightly Encumbered
- WHEN penalties are applied
- THEN no encumbrance penalties MUST apply (move rate unaffected, no action penalties)

#### Scenario: BRN/FOR reduction

- GIVEN a character with BRN=30, FOR=35, assessed as Encumbered
- WHEN the effective encumbrance level is computed
- THEN it MUST be reduced to Lightly Encumbered (one level reduction)

### Requirement: Drive Points Spending

Each Drive Point spent grants `+10` per point to applicable rolls. The system MUST implement the full spending options from vsd-core-rules.md §Drive. There is NO `+30` bonus and NO `invokePassion` function.

Source: vsd-core-rules.md §Drive (spending options list: "+10/point").

#### Scenario: Spend 2 Drive for skill bonus

- GIVEN a character with 3 Drive Points
- WHEN the character spends 2 Drive Points for a scene bonus
- THEN all Skill/Attack/Save Rolls for the scene MUST gain `+20`
- AND remaining Drive MUST be `1`

### Requirement: Advancement DP Budgets

The system MUST enforce per-category Development Point (DP) budgets from the Vocation table. Maximum 2 ranks purchased per skill per level. DPs transfer between categories at 2:1 ratio. Unspent DPs are lost at next level-up. Cultural ranks do NOT count toward the max-developable-ranks calculation. There is NO global rank-30 cap.

Source: vsd-character.md §Vocations (DP table), §Advancement ("Max 2 ranks per skill per level", "Unspent DPs are lost", "Cultural ranks don't count toward max developable ranks").

#### Scenario: DP transfer at 2:1

- GIVEN a Warrior with 5 Combat DPs and 0 Lore DPs
- WHEN 4 Combat DPs are transferred to Lore
- THEN Combat DPs remaining MUST be `1`
- AND Lore DPs gained MUST be `2`

#### Scenario: Max 2 ranks per skill per level

- GIVEN a character at level 3 with skills.Blades.rank = 6 (all from prior levels)
- WHEN the character attempts to purchase 3 ranks in Blades this level
- THEN the system MUST reject the third rank (max 2 per skill per level)

#### Scenario: Unspent DPs lost

- GIVEN a character with 2 unspent Combat DPs at level-up
- WHEN the new level begins
- THEN those 2 DPs MUST be forfeited (not carried over)

### Requirement: XP Thresholds

The system MUST use the real XP progression: Levels 1-5 require 10 XPs per level (10, 20, 30, 40, 50). Levels 6-10 require 20 XPs per level (70, 90, 110, 130, 150).

Source: vsd-core-rules.md §Experience & Levels (XP table).

#### Scenario: Level 6 threshold

- GIVEN a character at level 5 with 50 XP
- WHEN 20 more XP are earned (total 70)
- THEN the character MUST qualify for level 6

### Requirement: SR Level Bonus Progression

TSR and WSR MUST use the SR Level Bonus: +5 per level for levels 1-10, +2 per level for levels 11-20, +1 per level for levels 21+. The current code using raw `level` is incorrect.

Source: vsd-core-rules.md §SR Level Bonus table.

#### Scenario: Level 12 SR bonus

- GIVEN a character at level 12
- WHEN SR Level Bonus is computed
- THEN it MUST equal `50 + 2×2` = `54` (50 from L1-10, +4 from L11-12)

### Requirement: Wealth Seeding Formula

Starting Wealth Level = Kin WL + Culture WL + Background Options, clamped to [0, 4]. After initial seed, wealth is PLAYER-OWNED and mutated only by explicit game actions (buying/treasure).

Source: vsd-equipment.md §Starting WL ("max 4, min 0").

#### Scenario: Wealth seed with clamp

- GIVEN a Star Elf (WL +1) with Noble culture (WL +2) and +2 from Background Options
- WHEN starting wealth is seeded
- THEN `wealth` MUST be `min(1+2+2, 4)` = `4`
