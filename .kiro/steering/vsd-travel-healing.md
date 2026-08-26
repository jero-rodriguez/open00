---
inclusion: manual
---

# VsD Travel & Healing Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 travel, encumbrance, hazards, health, and healing.
Use this when implementing travel mechanics, encumbrance calculations, injury tracking, or healing systems.

## Encumbrance

Five levels based on common sense (not precise weight tracking):

| Level | Description | Effects |
|---|---|---|
| Unencumbered | Clothes, belt, pouch, single weapon, light gear (5kg bag) | No penalties |
| Lightly Encumbered | + scabbard, heavy weapon or two light, small quiver, 10kg bag | No penalties (some traits disabled) |
| Encumbered | + heavy backpack, 1 week rations, bedroll, travel equipment | Move Rate -1/3, slowed travel |
| Heavily Encumbered | + multiple weapons, 25kg+ backpack, 2 weeks rations, tent, heavy gear | Move Rate halved, -20 all actions, greatly slowed travel |
| Over Encumbered | Dragging sled, carrying wounded companion | Move Rate 1/4, no Sprint/Attack/Travel, no SWI to DEF |

### Special Rules
- Characters with BRN 30+ AND FOR 30+, or Large size: reduce EL by one
- Armor is NEVER factored into EL (armor has its own separate penalties)
- Armor penalties always stack with Encumbrance penalties

## Travel

### Overland Movement (km/day)

| Encumbrance | Normal (foot) | Normal (mount) | Rough (foot) | Rough (mount) | Arduous (foot) | Arduous (mount) |
|---|---|---|---|---|---|---|
| Up to Lightly | 50 | 95 | 30 | 40 | 15 | 8 |
| Encumbered | 30 | 65 | 15 | 25 | 8 | 8 |
| Heavily | 15 | 30 | 8 | 15 | 3 | 0 |
| Over | 0 | 0 | 0 | 0 | 0 | 0 |

### Terrain Types
- **Normal**: Roads, open plains, light forests
- **Rough**: Woods, forested areas, deserts, hills
- **Arduous**: Mountains, bogs, swamps, jungles, thick forests, underground

### Travel Procedure

1. Set destination and choose path
2. Calculate travel time (distance / daily rate)
3. Determine Hazards (1 per week + 1 per notable location)
4. Resolve each Hazard as a scene
5. Regroup between Hazards

### Pathfinding
- Required when destination is uncertain or characters are lost
- Move at half speed while Pathfinding
- Wandering Skill Roll each time entering new terrain type
- Failure = lost, may end up in dangerous location

### Waterborne Movement (km/day)

| Vessel | Base Speed |
|---|---|
| Raft/Canoe | 30 |
| Boat | 40 |
| Small Ship | 110 |
| Large Ship | 90 |
| Warship | 180 |

Wind modifiers: Unfavorable ×0.75 | Normal +0 | Favorable ×1.25
Rivers: upstream = 1/4 speed, downstream = normal.
Undermanned ships: -20 to piloting rolls, half crew or less = half speed, quarter crew or less = adrift.

## Hazards

### Hazard Categories

1. **Weather** - storms, fog, heat waves, blizzards
2. **Natural Obstacles** - cliffs, thick forests, swamps, deserts
3. **Perils from the Ancient World** - haunted ruins, enchanted streams, curses
4. **Wild Beasts** - wolf packs, snakes, stampeding herds, insects
5. **Minions of Darkness** - patrols, ambushes, traps
6. **Free People** - hostile locals, tolls, refugees needing help

### Random Hazard Chance
- 20% base per day (up to 30-40% in dangerous areas, lower in safe territory)
- Roll d100 on Random Hazards Table by area population density (Populated/Wilderness/Wasteland)

### Hazard Resolution
- **Success**: forge ahead to next hazard
- **Partial Success**: proceed with complication (Condition, Minor Injury, time/resource loss)
- **Failure**: face new immediate Hazard (ambush, dead end, forced detour)

## Chases

Abstract distance system for pursuit:
- **Distance**: 1-6 (1 = almost caught, 5+ = good head start)
- **Escape Value**: 3 + starting Distance
- Both sides describe actions + Conflicting Skill Rolls each round
- Pursuer wins: Distance -1. Escapee wins: Distance +1
- Distance = 0: caught. Distance = Escape Value: escaped.

## Foraging

- Characters can hunt/forage instead of consuming rations
- Successful Hunting or Nature Roll = enough food for party for 1 day
- Foraging halves daily movement speed
- Cannot forage AND Pathfind simultaneously (choose one, at 1/4 speed)

## Weariness & Starvation

- No rest/food/water for 1 day = Weary
- Weary + continued deprivation: TSR each day (Attack Level = 2 × days without)
- Failure: cumulative -20 Exhaustion penalty to all actions
- Exhaustion reaches -100: death
- Recovery: 20 points per day of complete rest and proper nourishment

## Falling

Resolved as attack on Beast Attack Table (Impact Critical Strikes):
- CMB = 5 × fall distance in meters

| Fall | Max Result | Attack Bonus |
|---|---|---|
| 5m or less | 90 | +0 |
| 5-10m | 120 | +10 |
| 10-20m | 150 | +20 |
| 20m+ | No cap | +30 |

Cannot add Shield bonus to DEF against falls.

## Extreme Heat & Cold

- Natural extremes: can inflict Weary or Exhaustion (as day without food/drink)
- Intense cold exposure: Frost Critical Strikes (Superficial to Moderate)
- Live flame/searing material: Fire Critical Strike each round (Superficial to Lethal)

## Drowning & Suffocation

- Fall unconscious → Incapacitated
- If condition persists: start Dying in 10 minutes

## Visibility

| Condition | Effect |
|---|---|
| Bright Light | Normal activity |
| Dim Light | -20 Perception/Wandering, halve travel Move Rate |
| Total Darkness | Cannot see (additional Hazard while traveling) |

## Hit Points & Recovery

- Total HPs = Body Skill Bonus
- Bruised Value = half Total HPs (below this: -20 all actions)
- 0 or below: Incapacitated
- -50 or below: Dying (6 rounds to death)
- **Resting**: Recover 1/10 Total HPs per hour of rest in safe environment

## Bleeding

| Severity | HP Loss/Round | Treatment Difficulty | Equipment | Recovery |
|---|---|---|---|---|
| Light (1-4 HP/rnd) | 1-4 | Standard (+0) | Bandages | Immediate once treated |
| Severe (5-10 HP/rnd) | 5-10 | Challenging (-10) | Healer's Kit | 1 full day rest after treatment |
| Exsanguination (11+ HP/rnd) | 11+ | Very Hard (-30) | Healer's Kit | 1 full day rest after treatment |

- Exsanguination = Dying in (20 - Bleeding value) rounds (min 1)
- Bleeding from different wounds is cumulative
- Cannot recover HPs while Bleeding (until treated)
- Outside combat: bandage temporarily stops bleeding, but reopens with strenuous activity unless properly treated

### Healer Roll Results for Bleeding
- **Success**: wound treated, recovery begins
- **Partial Success**: treated but complication (extra bandage, Weary, or HPs lowered to Bruised Value)
- **Failure**: blood loss stopped temporarily, wound not healed (needs different healer)
- **Critical Failure**: not healed + one Partial Success complication

## Injuries

Three severities based on penalty imposed:

| Severity | Penalty Range | Treatment Difficulty | Recovery Time |
|---|---|---|---|
| Minor | up to -20 | Challenging (-10) | 3 days (halved with successful Healer Roll + Kit) |
| Serious | -21 to -50 | Hard (-20) | 10 days → becomes Minor (-20), then 3 more days |
| Crippling | over -50 | Extremely Hard (-40) | 20 days → becomes Serious (-50), then 10 days → Minor, then 3 days |

- Penalties from multiple Injuries stack
- Total penalties >= -100: Incapacitated (until reduced below -100)
- Each Injury tracked and healed separately
- Fighting/exertion prevents recovery for that day

### Lingering Injuries
- Caused by Partial Success or Critical Failure on Healer Rolls, or poison/infection
- Take 1.5× normal recovery time
- Can be turned normal by: Cleanse Wound spell, or Mending Herbs + Challenging (-10) Healer Roll

## Death & Dismemberment

- Dead if Dying not removed in time, or instant-death Critical Strike
- Only miracle/strongest magic can revive
- Missing eye: -20 sight Perception, -20 ranged attacks
- Missing hand/arm: no two-handed weapons, -20 tasks requiring both hands
- Missing foot/leg: half Move Rate, no SWI to DEF, -20 Movement Actions
- Both eyes or 2+ limbs: cannot adventure except extraordinary circumstances

## Soul Damage

- From dark magic or undead touch
- Permanently reduces Body Skill (and thus Total HPs)
- Body reduced to 0 by Soul Damage: body becomes hollow husk, Incapacitated, Dying in 6 rounds
- Death by Soul Damage: rise as undead in 1d10 days (unless precautions taken)
- Cannot be healed by normal means (only magic or special herbs)

## Poison & Disease

### Poison Structure
- **Attack Level**: determines SR Difficulty
- **Transmission**: Wound, Ingestion, Inhalation, Contact
- **Effects**: varies (damage, conditions, death)

### Disease Structure
- **Attack Level**: determines SR Difficulty
- **Transmission**: Direct contact, Airborne, Contamination
- **Effects**: varies (Weary, penalties, death over time)

### Curing
- Hard (-20) Healer Roll + Healer's Kit → patient gets new SR
- If new SR fails: can retry next day
- Partial Success: new SR with -10 penalty
- Antidotes/Spells/Herbs can also counteract

### Sample Poisons (for reference)

| Poison | AL | Transmission | Effect |
|---|---|---|---|
| Deathly Adder Venom | 3 | Wound | Weary + Dying in 1d10 min |
| Deepwood Mandrake | 8 | Ingestion | -50 all rolls, hallucinations for 3d10 min |
| Doomspores | 4 | Inhalation | Stunned 1 rnd, then Incapacitated 1d5 hrs |
| Giant Spider Poison | = spider level | Wound | Held 1d10 min, 2nd dose = Incapacitated 2d10 min |

### Sample Diseases

| Disease | AL | Transmission | Effect |
|---|---|---|---|
| Barrow Rot | 4 | Contact (undead) | Cannot recover HPs, 1d10 damage/day, Injuries become Lingering |
| Bog Fever | 3 | Airborne | Weary (cannot remove), daily TSR or -20 Exhaustion, -100 = death |
| Dark Plague | 7 | Contamination | Weary + no healing, daily TSR or Incapacitated + Dying in 1d10 days |

## Healing Herbs

Five categories:

| Category | Use |
|---|---|
| Clotting | Substitute bandage/Kit for Bleeding treatment, or instantly heal treated wound. Can create Healing Salve. |
| Mending | Count activity day as rest day for Injury recovery, or double rest day effect. Can attempt to turn Lingering → normal. |
| Rejuvenating | Craft Reviving Cordial, instantly heal Incapacitated, or grant +30 SR vs illness. |
| Antitoxins | Craft antidotes granting +30 SR vs specific poison. |
| Special | Unique effects, plot devices. Only grow in specific places/conditions. Finding one = adventure focus. |

### Searching for Herbs

Nature Skill Roll modified by:

| Vegetation | Modifier |
|---|---|
| Lush (jungle, rainforest) | +10 |
| Abundant (wood, forest, marsh) | +0 |
| Normal (cultivated, weald, grassland) | -10 |
| Scarce (scrubland, steppe, shoreline) | -20 |
| Barren (glacier, desert, darkland) | -40 |

Additional modifiers:
- Known Herb (in Herbarium): +10
- Area already searched (same herb type): -50
- Winter/unfavorable season: -30
- Conservable (for later use): -30

Searching halves daily movement (foraging rules apply).
Success = enough for one treatment/dose.

### Herbarium
- Record found herbs: name, type, environment, season
- Known herbs get +10 to future Nature Rolls in same environment/season
- Other seasons = "unfavorable" (-30), other environments = "barren" (-40)

## Camping

### Camping Roll

Lead character makes Wandering Skill Roll. Others Help.
No helpers = additional -20 penalty.

| Group Size | Modifier |
|---|---|
| 2 or less | +20 |
| 3-4 | +0 |
| 5-7 | -20 |
| 8+ | -40 |

| Terrain | Modifier |
|---|---|
| Normal | +0 |
| Exposed (little cover) | -20 |
| Dangerous Area | -30 |
| Darklands | -50 |

### Results
- **Success**: safe rest for 1 day (re-roll next day)
- **Partial Success**: can rest but minor complication (rotted rations, injured beast, etc.)
- **Failure**: rest interrupted (roll on Camping Failure table)

### Camping Failure Table (d100)
- 01-30: Can't sleep (insects, nightmares, etc.) - no benefit from rest
- 31-60: Accident (fire, cave-in, flood) - camp destroyed, no sleep
- 61-90: Ambushed by beasts or minions halfway through rest
- 91-100: Spot is cursed/tainted - must flee or confront evil, no rest

## Safe Havens

Rare refuges where heroes can rest safely.

### Finding a Safe Haven
Songs & Tales Skill Roll:

| Area | Difficulty |
|---|---|
| Free Lands | Hard (-20) |
| Wilderness | Very Hard (-30) |
| Borderlands | Extremely Hard (-40) |
| Blighted Lands | Heroic (-50) |
| Darklands | Insane (-70) |

Success: Haven within 1d5 days travel. Mark on map permanently.
Max 1 Safe Haven per area. Limit: 1 for short campaigns, 2-4 for long.

### Safe Haven Benefits
- Halve recovery time for Injuries/Conditions
- Double HP recovery rate
- Skilled healers available (auto-succeed mundane treatments)
- Replace/repair equipment
- Meet allies, research information

### Activities in a Safe Haven (one per pause, except Resting)
- **Resting**: auto-heal (doesn't count toward limit)
- **Training/Meditation**: 1-2 XPs awarded
- **Revelation**: spend Milestone
- **Learn Spell Lore**: gain 1 free rank in new lore
- **Learn Language**: add to known languages
- **Research**: gain Clue Token (auto-succeed related Lore roll)
- **Economic Endeavor**: increase WL by 1
- **Merriment**: describe joyful episode, gain 1 Drive if group approves
- **Solo Adventure**: separate session with GM
- **Retire**: farewell scene, character exits play
