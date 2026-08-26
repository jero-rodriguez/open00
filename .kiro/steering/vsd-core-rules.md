---
inclusion: manual
---

# VsD Core Rules Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 core systems.
Use this when implementing engine logic, action resolution, or dice mechanics.

## Dice System

- All rolls are d100 (percentile): two d10s, one tens, one units. Double zeroes = 100.
- d10 rolls: roll # dice, sum results.
- d5: use d10, read 1-2=1, 3-4=2, 5-6=3, 7-8=4, 9-10=5.

## Open-Ended Rolls

Most rolls in VsD are Open-Ended:
- Unmodified roll 96-100: roll again, ADD new result. If new roll is also 96+, keep rolling and adding.
- Unmodified roll 01-05: roll again, SUBTRACT new result. If new roll is 96+, keep rolling and subtracting.
- Continue until a roll lands between 06-95.

## Unmodified Roll Effects

Some rules trigger on the raw dice value before modifiers. These always resolve first.

## Types of Rolls

1. **Skill Rolls** - accomplishing tasks using skills
2. **Save Rolls** - resisting spells, poisons, perils
3. **Attack Rolls** - weapon/spell attacks
4. **Spell Casting Rolls** - channeling magic

## Action Resolution Table

| Roll Result | Outcome |
|---|---|
| 4 or less | Critical Failure |
| 5-74 | Failure |
| 75-99 | Partial Success |
| 100-174 | Success |
| 175+ | Outstanding Success |

Formula: `d100 (open-ended) + Skill Bonus + modifiers`

## Skill Bonus Calculation

Total Skill Bonus = Stat Value + Rank Bonus + Vocational Bonus + Kin Bonus + Item Modifier + Special Modifiers

- Item Modifiers do NOT stack (use best single one)
- Special Modifiers DO stack
- Conditions do not stack with themselves

## Difficulty Modifiers

| Difficulty | Modifier |
|---|---|
| Standard | +0 |
| Challenging | -10 |
| Hard | -20 |
| Very Hard | -30 |
| Extremely Hard | -40 |
| Heroic | -50 |
| Insane | -70 |

## Rank Bonus Table

| Ranks | Bonus | Ranks | Bonus |
|---|---|---|---|
| 0 | +0 | 11 | +52 |
| 1 | +5 | 12 | +54 |
| 2 | +10 | 13 | +56 |
| 3 | +15 | 14 | +58 |
| 4 | +20 | 15 | +60 |
| 5 | +25 | 16 | +62 |
| 6 | +30 | 17 | +64 |
| 7 | +35 | 18 | +66 |
| 8 | +40 | 19 | +68 |
| 9 | +45 | 20 | +70 |
| 10 | +50 | 21+ | +1/rank |

Pattern: Ranks 1-10 give +5 each. Ranks 11-20 give +2 each. Ranks 21+ give +1 each.

## Taking the Time

- +20 bonus to Skill Roll
- Takes at least 2x normal time
- Requires no hurry or stress (GM decides)

## Helping

- One lead character, others help
- Helpers roll appropriate Skill
- Success: +10 to lead's roll
- Outstanding Success: +20 to lead's roll
- Partial Success: +10 but helper faces complication
- Failure: no bonus
- Critical Failure: helper faces trouble, no bonus
- Cannot help Attack, Spell Casting, or Save Rolls

## Conflicting Actions

- All participants roll appropriate Skills on Action Resolution Table
- Compare results: higher wins
- Critical Failure = fumble regardless
- Tie = nobody wins

## Save Rolls (SR)

Two types:
- **Toughness Save Roll (TSR)**: FOR + Level Bonus + Kin Bonus + specials
- **Willpower Save Roll (WSR)**: WSD + Level Bonus + Kin Bonus + specials

### SR Level Bonus

| Level | SR Bonus | Attack Level | SR Difficulty |
|---|---|---|---|
| 1 | +5 | 1 | 55 |
| 2 | +10 | 2 | 60 |
| 3 | +15 | 3 | 65 |
| 4 | +20 | 4 | 70 |
| 5 | +25 | 5 | 75 |
| 6 | +30 | 6 | 80 |
| 7 | +35 | 7 | 85 |
| 8 | +40 | 8 | 90 |
| 9 | +45 | 9 | 95 |
| 10 | +50 | 10 | 100 |
| 11-20 | +2/level | 11-20 | +2/level |
| 21+ | +1/level | 21+ | +1/level |

Save succeeds if: `d100 (open-ended) + SR Bonus > SR Difficulty`

## Points of Failure

Some effects scale by how much the SR was missed:
`Points of Failure = SR Difficulty - Failed Roll Result`

## Drive

- Range: 0-5. Starts at 1.
- Gained by following Passions into danger/drama (group decision).
- Spending options:
  - 1+ Drive: +10/point to all Skill/Attack/Save Rolls for a scene
  - 1 Drive: Re-roll failed roll with +10 bonus (stackable)
  - 1 Drive: Re-roll suffered Critical Strike with -1 severity
  - 1+ Drive: -10/point to target's SR against caster's spell
  - 5 Drive: Treat Open-Ended roll as natural 100
  - 5 Drive: +20 to a Critical Strike Roll
  - 5 Drive: Ignore all wound/condition penalties for a scene
  - 5 Drive: Double AoE/Targets/Range/Duration/Damage of a spell

## Heroic Path & Milestones

- Track total Drive spent on Heroic Path
- Every 10 points spent = 1 Milestone
- Milestones unlock Revelations (stat increase, HP boost, MP boost, or item improvement)

## Experience & Levels

| Level | Total XPs | Level | Total XPs |
|---|---|---|---|
| 1 | 10 | 6 | 70 |
| 2 | 20 | 7 | 90 |
| 3 | 30 | 8 | 110 |
| 4 | 40 | 9 | 130 |
| 5 | 50 | 10 | 150 |

Levels 1-5: 10 XPs per level. Levels 6-10: 20 XPs per level.
XPs awarded via Achievement Lists at end of session (typically 3-4 XPs/session).
