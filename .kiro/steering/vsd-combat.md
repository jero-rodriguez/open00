---
inclusion: manual
---

# VsD Combat Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 combat system.
Use this when implementing combat resolution, tactical round sequence, attacks, criticals, and conditions.

## Tactical Round (TRS)

A Round lasts ~10 seconds of game time. The Tactical Round Sequence defines phase order:

1. **Assessment Phase** - Track durations, Bleeding, Dying. Confused/ambushed characters roll Perception (Assessment Roll). Failure = cannot declare new actions this round.
2. **Action Declaration Phase** - GM declares NPC actions first, then players declare (any order).
3. **Move Phase** - Movement resolved (simultaneous unless conflict).
4. **Spell Phase A** - Prepared spells (held from previous rounds) and Instantaneous spells resolve.
5. **Ranged Phase A** - Pre-loaded missiles and readied thrown weapons fire.
6. **Melee Phase** - Melee attacks resolve by weapon Length (longest first).
7. **Ranged Phase B** - Missiles loaded this round fire.
8. **Spell Phase B** - Unprepared spells resolve.
9. **Other Actions Phase** - Remaining skill uses resolve. Stunned condition ends here (unless re-stunned this round).

## Actions in Combat

### Action Types

| Type | Examples | Limit |
|---|---|---|
| Full Action | Attack, cast non-instant spell, full movement | 1 per round |
| Half Action | Draw weapon, cast instant spell, half movement | See combining |
| Free Action | Talk, assessment roll, drop weapon | 1 per round (extras become Half) |

### Combining Actions

- 1 Full + 1 Free (no penalty)
- 1 Full + 1 Half + 1 Free (both Full and Half at -20)
- 2 Half + 1 Free (no penalty)

## Movement

- **Full Movement**: Move up to Move Rate (15m base) or Sprint up to 2x Move Rate
- **Half Movement**: Move up to half Move Rate at walking pace
- **Sprinting**: Cannot Parry, cannot add Shield bonus to DEF
- **Arduous Terrain**: Each meter costs 2 meters of Move Rate

## Attack Resolution

### Attack Roll Formula

`d100 (open-ended) + CMB + modifiers - target DEF = Result`

Result is looked up on the appropriate Attack Table for weapon type and target Armor Type.

### Combat Bonus (CMB)

CMB = relevant Combat Skill Bonus (Blades, Blunt, Ranged, Polearms, or Brawl).
Characters need CMB >= 0 for attacks to be effective.

### Attack Tables

Six tables based on weapon/attack type:
1. **Edged** - swords, scimitars
2. **Blunt** - maces, axes, hammers
3. **Missile** - bows, crossbows, thrown
4. **Unarmed/Grappling** - fists, kicks, wrestling
5. **Beast** - animal natural attacks
6. **Bolt Spells** / **Area Spells** - magical attacks

Each table has columns for armor types: NA (No Armor), LA (Light), MA (Medium), HA (Heavy).

### Reading Attack Table Results

- Result in "up to 10" range: automatic miss. If Unmodified Roll falls in Clumsy Range: Fumble.
- "-": miss, no damage
- "0": hit but no damage (armor absorbed)
- Number (e.g. "7"): Base Damage (subtract from target's current HPs)
- Number + severity (e.g. "16 Mod"): Base Damage + Critical Strike of that severity

### Max Result

Each weapon has a cap on the Attack Table result. Applied last, overrides all modifiers.

## Weapon Length & Strike Order (Melee Phase)

| Length | Examples |
|---|---|
| Longest | Spears, polearms |
| Long | Longswords, two-handed weapons |
| Short | Maces, hammers, short swords |
| Hand | Daggers, improvised, brawling |

Longer weapons strike first. Ties: higher CMB first. Equal CMB: simultaneous.

### Positional Bonus

Attackers with positional advantage count as one weapon length longer:
- Higher Ground / mounted
- Flanking
- On Rear

### Dashing Attack

- -30 CMB penalty
- Weapon counts as one step longer
- Cannot Parry in same round

## Critical Strikes

Five severity levels (each adds to the Critical Strike Roll):

| Severity | Abbr | Roll Modifier |
|---|---|---|
| Superficial | Sup | +0 |
| Light | Lig | +10 |
| Moderate | Mod | +20 |
| Grievous | Gri | +30 |
| Lethal | Let | +50 |

### Critical Strike Roll

Non-open-ended d100 + severity modifier, read on appropriate Critical Strike Table.

### Critical Strike Types (Tables)

- Impact
- Cut
- Pierce
- Grapple
- Fire
- Lightning
- Frost
- Dark Magic
- Beast

Each weapon specifies Primary Critical type and optional Alternate Critical type.

### Critical Strike Reduction

- Heroic creatures: reduce by 1 severity
- Epic creatures: reduce by 2 severities
- Below Superficial = completely negated

## Parrying

- Subtract any amount from CMB, add same to DEF for current round
- Only against attacks from ONE opponent (front) unless using shield
- Shield: can Parry all attacks from shield's side
- Two-handed weapons: only half CMB can Parry (optional rule)
- Cannot Parry ranged attacks unless wielding shield
- Stunned: only half CMB to Parry
- Incapacitated/Held/Surprised: cannot Parry at all

## Defense (DEF)

Base DEF = max(SWI, 0)

Modified by:
- Armor (Max SWI to DEF cap)
- Shield bonus (Melee and/or Ranged)
- Parry amount
- Spell/special bonuses
- Conditions

## Cover

- **Partial Cover**: +20 DEF (half body behind hard object, or Dim Light)
- **Full Cover**: +50 DEF (almost completely covered by hard object)
- Cover doesn't stack; use best. Can differ by direction.
- Behind Cover: can Parry ranged and two-handed attacks as if wielding shield.

## Ranged Attacks

### Range Penalties

| Range | Modifier |
|---|---|
| Within Base Range | +0 |
| Base to 2x Base (Medium) | -25 |
| 2x to 3x Base (Long) | -50 |
| 3x to 4x Base (Extreme) | -75 |
| Beyond 4x Base | Cannot attack |

### Reloading

- Standard: Full Action or Multi-Round (Load # in weapon table)
- Quick Load weapons: Half Action to reload

### Shooting into Melee

- Engaged targets have Partial Cover
- Miss against engaged target: re-roll at +0 CMB against random adjacent combatant

## Weapon Fumbles

Triggered when Unmodified Attack Roll falls within weapon's Clumsy Range.
Roll d100 + Fumble Modifier on Fumble Table.

Fumble modifiers range from +0 (brawl, hand weapons) to +50 (polearms, whip).

## Conditions

| Condition | Key Effects |
|---|---|
| **Dying** | Dies in # rounds if not removed. HP-based: bring above -50 to save. |
| **Engaged** | Cannot take Movement Actions without Disengage or Run Away. |
| **Frightened** | Cannot attack source; must flee. Duration per spell/ability. |
| **Held** | Cannot move. -30 CMB and DEF. +30 to melee attacks against. Hand/Short weapons only. No ranged. |
| **Incapacitated** | No actions, no Parry. Melee = max damage + attacker chooses critical. |
| **Prone** | -20 CMB. +20 DEF vs ranged. Attacker gets Higher Ground + 20 bonus if engaged. Stand up = Full Action. |
| **Stunned** | No Full Actions. Half CMB to Parry. +20 to attacks against. Ends at Other Actions Phase (unless re-stunned). |
| **Surprised** | No Attack. Half/Free actions only. No Parry, no Shield DEF. +20 to attacks against. +10 to critical if Hand weapon. |
| **Flanking** | Attacker: +15. Target: Shield DEF only on shield side. |
| **On Rear** | Attacker: +30. Target: No Shield DEF. |
| **Weary** | Half Move Rate. 1 action/round max. No HP recovery or Bleeding/Injury healing. Removed by 8hr rest. |

## Disengaging & Running Away

### Disengage
- Full Action. Can Parry but cannot attack. Stops being Engaged at end of Other Actions Phase.

### Running Away
- Conflicting Athletics Roll.
- Escaping wins: move away freely.
- Attacker wins: attacker strikes (On Rear bonus), then escapee moves.
- Tie: attacker strikes at half CMB, then escapee moves.
- Critical Failure: fall Prone.

## Combat Options (All Optional)

### Charge
- Full Action: move half Move Rate + attack with +20 bonus
- Cannot be Engaged. Cannot Parry same round.

### Mounted Fighting
- Ride Skill Roll required first round of mounted combat
- Only Long/Longest 1H melee and ranged weapons usable
- Mounted charge: additional +20 (total +40 with charge)

### Fighting With Two Weapons
- Second weapon attack as Free Action
- Both attacks at -20 penalty
- Clumsy Range doubled (max 1-10)
- Weapon Length reduced by one step each
- Can split Parry pools between two opponents

### Martial Moves
- **Disarm**: Conflicting CMB vs opponent CMB. Winner disarms loser.
- **Feint**: Conflicting Deceive vs Perception. Winner gets bonus = margin to attacks.
- **Knock Down**: Conflicting Brawl. Winner knocks opponent Prone.
- **Lock**: Conflicting CMB. Winner locks both parties (no move/attack/parry until broken).
- **Shield Bash**: Full Action, Blunt or Brawl at -20. Shield DEF not applied this round.

## Hit Points & Death

- Total HPs = Body Skill Bonus
- Current HPs 0 or less: Incapacitated
- Current HPs -50 or less: Dying (dies in 6 rounds)
- Bruised Value = half Total HPs. Below this: -20 to all actions.
