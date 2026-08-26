---
inclusion: manual
---

# VsD Character Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 character creation and progression.
Use this when implementing character data models, kin/culture/vocation logic, or skill systems.

## Character Creation Steps

1. Generate Stats
2. Choose Kin and Culture
3. Choose Vocation
4. Background Options and Equipment
5. Calculate Derived Attributes
6. Choose Passions
7. Name Character

## Stats

Six stats define innate capabilities. Each has a Stat Value (can be negative).

| Stat | Abbr | Governs |
|---|---|---|
| Brawn | BRN | Melee combat, athletics, strength tasks |
| Swiftness | SWI | Ranged combat, DEF, agility, coordination |
| Fortitude | FOR | Resistance, endurance, Body skill, TSR |
| Wits | WIT | Reasoning, cleverness, Wizard MP gain |
| Wisdom | WSD | Empathy, intuition, perception, Animist MP gain, WSR |
| Bearing | BEA | Charisma, social influence, other vocations MP gain |

### Stat Generation Methods

**Point Buy**: Distribute 50 points in slots of 5 (min 0, max 25).
Example arrays: 20/15/10/5/0/0 | 25/20/5/0/0/0 | 10/10/10/10/5/5

**Random Roll**: Roll d100 six times on table:

| Roll | Value | Roll | Value |
|---|---|---|---|
| 01 | -20 | 60-68 | +10 |
| 02-05 | -15 | 69-77 | +15 |
| 06-14 | -10 | 78-86 | +20 |
| 15-23 | -5 | 87-95 | +25 |
| 24-50 | +0 | 96-99 | +30 |
| 51-59 | +5 | 100 | +35 |

## Kins

### Kin Modifiers Table

| Kin | BRN | SWI | FOR | WIT | WSD | BEA | HP | Max HP | MP | TSR | WSR | BPs | WL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Dwarf | +5 | -5 | +15 | +0 | +5 | -5 | 40 | 150 | +0 | +20 | +20 | 4 | +1 |
| Halfling | -20 | +15 | +10 | +0 | +5 | +0 | 20 | 100 | +0 | +10 | +35 | 5 | +1 |
| Man | +5 | +0 | +0 | +0 | +0 | +0 | 30 | 120 | +0 | +0 | +0 | 6 | +0 |
| Wildfolk | +5 | +5 | +10 | +0 | +10 | -5 | 30 | 150 | +1 | +0 | +0 | 4 | +0 |
| High Man | +10 | +0 | +10 | +0 | +0 | +5 | 35 | 150 | +1 | +5 | +0 | 4 | +1 |
| Half-Elf | +5 | +5 | +5 | +0 | +0 | +5 | 25 | 120 | +2 | +5 | +0 | 4 | +1 |
| Dusk Elf | +0 | +10 | +0 | +5 | +0 | +5 | 25 | 120 | +3 | +10 | +0 | 3 | +1 |
| Silver Elf | +0 | +10 | +5 | +5 | +5 | +10 | 20 | 120 | +4 | +10 | +0 | 3 | +1 |
| Star Elf | +0 | +15 | +10 | +5 | +10 | +15 | 20 | 120 | +5 | +10 | +0 | 2 | +1 |
| Half-Orc | +5 | +0 | +10 | +0 | +0 | -5 | 30 | 120 | +0 | +5 | +0 | 5 | +0 |
| Orc | +5 | +0 | +15 | +0 | -5 | -10 | 35 | 120 | +0 | +10 | +0 | 4 | +0 |
| Stone Troll | +20 | -10 | +15 | -15 | -10 | -10 | 60 | 250 | +0 | +30 | +0 | 3 | +0 |
| Firbolg | +15 | -5 | +5 | +0 | -10 | +5 | 50 | 200 | +1 | +0 | +10 | 1 | +1 |

Columns:
- HP: added to starting Hit Points
- Max HP: maximum Hit Points cap for this kin
- MP: one-time bonus to starting Magic Points
- TSR/WSR: bonus to Toughness/Willpower Save Rolls
- BPs: Background Points available
- WL: starting Wealth Level contribution

### Size

- Small: Halfling
- Medium: Man, High Man, Half-Elf, Dusk Elf, Silver Elf, Star Elf, Dwarf, Half-Orc, Orc, Wildfolk
- Large: Stone Troll, Firbolg

### Key Kin Traits (Implementation Notes)

- **Superstitious** (Dwarf, Halfling, Orc, Stone Troll): Cannot be Wizard, Champion, or Dabbler
- **Immortal** (Elves): No aging, immune to disease, +10 vs cold, 3hr rest = full night
- **Dark Sight** (Dwarf, Wildfolk, Half-Orc): 30m in Dim Light, 3m in Total Darkness
- **Night Sight** (Orc, Stone Troll): Moonlight/starlight as day, 30m in Dim, 3m in Total Darkness
- **Sun Cursed** (Stone Troll): -30 in daylight, turn to stone in direct sunlight
- **Sun Sensitivity** (Orc): -60 in full daylight, -20 in cloudy/dusk/dawn
- **Light-Footed** (Elves): Rough Terrain doesn't affect if unencumbered + light/no armor
- **Diminutive** (Halfling): Small size, counts as half group member for Camping

## Cultures

13 cultures available. Each provides:
- Cultural Skill Ranks (21 total distributed across skills)
- Starting Wealth Level (+0 to +2)
- Outfitting options (3-4 picks of equipment)
- Some grant Spell Lore ranks

### Cultural Wealth Levels

| Culture | WL |
|---|---|
| Arctic | +0 |
| City | +1 |
| Deep | +1 |
| Desert | +1 |
| Fey | +2 |
| Hill | +0 |
| Marauding | +0 |
| Noble | +2 |
| Pastoral | +1 |
| Plains | +1 |
| Seafaring | +1 |
| Weald | +1 |
| Woad | +0 |

### Cultures with Spell Lore Ranks

- **Fey** (+2 ranks): Detections, Movements of Nature, Sounds & Light, Lore of Nature, Kin Spell Lores
- **Noble** (+1 rank): Detections, Healing, Cleansing, Chanting, Kin Spell Lores

## Vocations

Six core vocations. Each defines:
- Development Points (DPs) per skill category per level
- Vocational Bonuses (fixed skill bonuses)
- Vocational Spell Lores (accessible without restriction)
- MP gain per level

### Vocation DP Summary

| Category | Warrior | Rogue | Wizard | Animist | Dabbler | Champion |
|---|---|---|---|---|---|---|
| Armor | 2 | 1 | 0 | 0 | 1 | 2 |
| Combat | 5 | 3 | 0 | 1 | 2 | 3 |
| Adventuring | 4 | 4 | 1 | 2 | 3 | 3 |
| Roguery | 2 | 5 | 1 | 1 | 3 | 0 |
| Lore | 0 | 1 | 5 | 4 | 1 | 1 |
| Spells | 0 | 0 | 5 | 5 | 3 | 3 |
| Body | 2 | 1 | 0 | 0 | 1 | 2 |
| MP/Level | 0 | 0 | 3 | 2 | 1 | 1 |

### DP Transfer Rule

DPs can transfer between categories at 2:1 ratio (spend 2 from source to gain 1 in target).
Max 2 ranks purchased per skill per level.

### MP Stat by Vocation

- Wizard: WIT
- Animist: WSD
- All others (Warrior, Rogue, Dabbler, Champion): BEA

MP per level = Vocation MP gain + floor(Stat Value / 10)

## Skills

### Skills by Category and Stat

| Skill | Stat | Category |
|---|---|---|
| Armor | - | Armor |
| Blunt | BRN | Combat |
| Blades | BRN | Combat |
| Ranged | SWI | Combat |
| Polearms | BRN | Combat |
| Brawl | BRN | Combat |
| Athletics | BRN | Adventuring |
| Ride | SWI | Adventuring |
| Hunting | WIT | Adventuring |
| Nature | WSD | Adventuring |
| Wandering | WSD | Adventuring |
| Acrobatics | SWI | Roguery |
| Stealth | SWI | Roguery |
| Locks & Traps | WIT | Roguery |
| Perception | WSD | Roguery |
| Deceive | WIT | Roguery |
| Arcana | WIT | Lore |
| Charisma | BEA | Lore |
| Cultures | WIT | Lore |
| Healer | WSD | Lore |
| Songs & Tales | BEA | Lore |
| Spell Lores | Varies | Spells |
| Body | FOR | Body |

### Armor Skill

- Never rolled. No stat association.
- Reduces Move Actions Penalty from armor (minimum 0).
- Penalty applies to: Spell Casting, Acrobatics, Athletics, Ride, Stealth.

### Body Skill

- Never rolled during game.
- Body Skill Bonus = Total Hit Points.
- Soul Damage reduces Body Skill Bonus permanently.

## Derived Attributes

| Attribute | Formula |
|---|---|
| Move Rate | 15 meters/round (base) |
| Defense (DEF) | max(SWI, 0) |
| TSR | FOR + Level Bonus + Kin Bonus + specials |
| WSR | WSD + Level Bonus + Kin Bonus + specials |
| Total HPs | Body Skill Bonus (includes Kin HP modifier) |
| Total MPs | (Stat MP gain + Vocation MP gain) × Level + Kin MP bonus |
| Size | Medium (unless kin specifies otherwise) |

## Passions

Three standard passions:
- **Nature**: How the character behaves (instincts, ethics, demeanor)
- **Allegiance**: Who/what they're loyal to, love, or sworn to destroy
- **Motivation**: Goal or driving purpose

Passions can change during play at turning points.
Drive is gained by following Passions into danger/drama.

## Background Options

- Purchased with Background Points (from Kin)
- Each has Minor (1 BP usually) and Major (3 BP usually) tiers
- Major always includes Minor benefits
- Each option purchased only once
- Some require writing a Passion about the option

## Advancement

- Same DP allocation each level
- Max 2 ranks per skill per level
- Unspent DPs are lost (no carry-over)
- Cultural ranks don't count toward max developable ranks
- New Spell Lores cannot be learned at level-up unless taught/found in play
