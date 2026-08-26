---
inclusion: manual
---

# VsD Magic Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 magic system.
Use this when implementing spell casting, magic points, spell lores, resonance, or overcasting.

## Spell Lores

Spell Lores are special Skills representing schools of magic. Each is developed separately.
- Organized into 10 Weaves (1st = weakest, 10th = most powerful)
- Each rank in a Spell Lore grants knowledge of one Weave (rank 1 = 1st Weave, etc.)
- Developed like normal skills using DPs from the Spells category

### Spell Lore Categories

**Common Spell Lores** (available to ALL vocations, max 5th Weave casting):
- Detections, Eldritch Visions, Eldritch Wards, Movements of Nature
- Nature's Path, Chanting, Eldritch Might, Sounds & Lights
- Cleansing, Lore of Nature

**Vocational Spell Lores** (restricted to specific vocations, no Weave cap):

| Wizard | Animist | Champion | Dabbler |
|---|---|---|---|
| Detections | Aspects of Nature | Aspects of Nature | Detections |
| Earth Mould | Channeling | Chanting | Eldritch Secrets |
| Eldritch Fire | Chanting | Commanding Presence | Illusions |
| Eldritch Frost | Cleansing | Eldritch Hand | Mind Control |
| Eldritch Hand | Communion | Eldritch Might | Movements of Nature |
| Eldritch Might | Earth Mould | Heroic Defense | Skirmishing Mastery |
| Eldritch Movements | Healing | Nature's Path | Sounds & Lights |
| Eldritch Storm | Lore of Nature | Weapon Mastery | Trickery |
| Eldritch Tide | Master of Animals | | |
| Eldritch Visions | Master of Plants | | |
| Eldritch Wards | Miracles | | |
| Enchantment | Movements of Nature | | |
| Illusions | Nature's Path | | |
| Mind Control | Soul Soothing | | |
| Sounds & Lights | Sounds & Lights | | |

**Kin Spell Lores** (tied to kin, no Weave cap, can use DPs from ANY category at 1:1):
- Silver Elf / Star Elf: Elven Lore, Spell Songs (gain 2 free ranks)
- Other kins: via Background Options (e.g., Rogue Mage, Elven Training)

**Dark Spell Lores** (NPC only, causes Taint):
- Dark Sorcery (WIT)
- Necromancy (WSD)

### Spell Lore Stat Bonuses

Each Spell Lore is governed by a specific stat:
- WIT: Earth Mould, Eldritch Fire, Eldritch Frost, Eldritch Hand, Eldritch Movements, Eldritch Storm, Eldritch Tide, Eldritch Wards, Enchantment, Illusions, Sounds & Lights, Eldritch Secrets, Dark Sorcery
- WSD: Detections, Chanting, Cleansing, Communion, Healing, Lore of Nature, Master of Animals, Master of Plants, Miracles, Movements of Nature, Nature's Path, Soul Soothing, Aspects of Nature, Necromancy
- BEA: Channeling, Commanding Presence, Eldritch Might, Eldritch Visions, Heroic Defense, Mind Control, Skirmishing Mastery, Spell Songs, Trickery, Weapon Mastery, Elven Lore

### Learning Restrictions

- Common Lores: anyone can develop, but cannot CAST above 5th Weave (can buy ranks for bonus)
- Vocational Lores: cast without restriction
- Kin Lores: cast without restriction, develop from any category at 1:1
- At level-up: can only develop Lores already known (rank >= 1) unless found a teacher/grimoire

## Magic Points (MPs)

### MP Calculation

Total MPs = (Stat MP gain + Vocation MP gain) × Level + Kin MP bonus

- **Stat MP gain**: 1 MP per 10 full points of governing stat (Wizard=WIT, Animist=WSD, others=BEA)
- **Vocation MP gain**: Warrior/Rogue=0, Dabbler/Champion=1, Animist=2, Wizard=3
- **Kin MP bonus**: one-time flat bonus (see Kin Modifiers table)

### MP Cost

Cost = Weave of the spell (1st Weave = 1 MP, 5th Weave = 5 MP, etc.)
Cannot cast if insufficient MPs remaining.

### MP Recovery

Full night's rest (8 hours) = complete recovery to total.
Partial rest: proportional recovery (e.g., 4 hours = 50%).

## Casting Spells

### Requirements

1. Know the spell (ranks in Lore >= Weave)
2. Character Level >= Spell Weave
3. Have enough MPs
4. Can speak (verbal component required)
5. Can see target
6. Max one spell per Round

### Casting Time

- Standard: Full Action
- **Instantaneous spells** (marked with *): Half Action, no concentration bonus, no -10 improvised penalty
- **Concentration**: Spend Full Action(s) before casting, +10/round to Spell Casting Roll (max +40)
- **Improvised** (no concentration): -10 penalty to Spell Casting Roll

### Spell Casting Roll Modifiers

| Modifier | Value |
|---|---|
| Improvised (no prep) | -10 |
| Preparation (per round, max 4) | +10/round |
| Target is static | +10 |
| Touching target | +30 |
| Up to 3m | +10 |
| 4-15m | +0 |
| 16-30m | -10 |
| 31-90m | -20 |
| More than 90m | -30 |
| Armor Move Penalty | applies (reduced by Armor skill) |

### Spell Casting Table (Summary)

| Roll | SR Difficulty | Outcome |
|---|---|---|
| up to 25 | - | Spell Failure (roll on Spell Failures table) |
| 26-50 | - | Partial Success (half duration/area, or auto-pass SR for targets, or no effect but retain MPs) |
| 51-80 | 50 | Success |
| 81-95 | 60 | Success |
| 96-105 | 65 | Success |
| 106-110 | 70 | Success |
| 111-120 | 75 | Success |
| 121-130 | 80 | Success |
| 131-135 | 85 | Success |
| 136-140 | 90 | Success |
| 141-145 | 95 | Success |
| 146-150 | 100 | Success |
| 151-155 | 105 | Outstanding Success |
| 156-160 | 110 | Outstanding Success |
| 161-165 | 120 | Outstanding Success |
| 166-170 | 130 | Outstanding Success |
| 171-175 | 140 | Outstanding Success |
| 176+ | 150 | Outstanding Success |

Outstanding Success bonus: half MP cost OR free Warping option (cost <= half spell cost).

### Bolt & Area Attack Spells

- Use Bolt Spells Attack Table or Area Spells Attack Table (not Spell Casting Table)
- Resolved as Attack Rolls: Spell Lore Skill Bonus as CMB, subtract target DEF
- Failure (up to 10 on table): Spell Failure roll

### Spells Requiring Save Rolls

- SR Difficulty = value from Spell Casting Table based on caster's roll
- Targets use WSR (unless spell specifies TSR)
- Spell stacking: same-name spells don't stack; latest replaces previous

## Warping

Some spells have Warping Options that increase their Weave for enhanced effects.
- Final Weave = Base Weave + Warping Option Weave cost
- Cannot Warp above caster's Level
- MP cost changes to match new Weave
- Options can be selected multiple times unless stated otherwise

## Concentration on Active Spells

- Multi-Round Action (declare in Action Declaration Phase)
- Cannot perform Full or Half Actions while Concentrating
- Stunned/Incapacitated = immediately stops Concentrating

## Magical Resonance

Triggered when caster rolls DOUBLES (11, 22, 33, etc.) on Spell Casting Roll.

### Resonance Roll Modifiers

| Condition | Modifier |
|---|---|
| In a Safe Haven | -20 |
| In Blighted/Darkland | +20 |
| Healing/Spirit/Light Spell | -20 |
| Natural/Elven/Illusory Spell | -10 |
| Attack Spell | +20 |
| Dark Spell | +30 |
| Add Weave of spell cast | + Weave |

### Resonance Results

| Roll | Effect |
|---|---|
| 40 or less | Nothing |
| 41-60 | Awareness (next spell within 1hr auto-triggers resonance) |
| 61-80 | Attention (located generally, or Stunned by vision) |
| 81-90 | Pursuit (servants sent, or nightmarish visions) |
| 91-100 | Assault (capable servants sent, or mind scorched) |
| 101+ | Lieutenant (overwhelmingly powerful servant arrives) |

Max result for Weave 4 or lower spells: 90.

## Spell Failure

Triggered by rolling 25 or less on Spell Casting Table, or on Bolt/Area table miss.

### Spell Failure Modifiers

| Spell Type | Modifier |
|---|---|
| Healing, information, divination | +0 |
| Utility, personal, defensive, Nature | +10 |
| Enchantment | +20 |
| Alteration | +30 |
| Dark and Elemental | +50 |

### Spell Failure Results (d100 + modifier)

| Roll | Effect |
|---|---|
| 01-75 | Stunned |
| 76-100 | Stunned + choose: lose half MPs OR spell goes off 2 rounds later |
| 101-125 | Stunned + choose: lose MPs OR spell targets different creature |
| 126-150 | Stunned + choose two: lose MPs / wrong target / Resonance Roll (+20) |
| 151+ | Stunned + choose two: lose MPs+Weary / wrong target / Resonance (+50) / knocked out 6hr |

## Overcasting

Animists and Wizards only. Cast spells of Weave HIGHER than current Level.

### Requirements

- Ranks in Lore >= Spell Weave
- Sufficient MPs
- Must fulfill one condition: Magic Ritual, Sacrifice, or Celestial Alignment

### Methods

**Magic Ritual**: Multiple casters cooperate. Overcasting limit = +number of participants. All must know the spell and Concentrate. Lead makes roll, all share failure consequences.

**Sacrifice**: Spend 1 Drive. Take 1d10+1 Soul Damage per Weave over Level. Body reduced to 0 = consumed.

**Celestial Alignment** (optional): Benefic (+3 Weaves), Auspicious (+1 Weave), Neutral (normal), Malefic (+1 MP cost), Disastrous (-10 penalty + 1 MP cost).

### Overcasting Penalties

- -10 to Spell Casting Roll per Weave over Level
- Always triggers Magical Resonance (modifier: -30, +10 per Weave over Level)
- Must pass TSR (Attack Level = Spell Weave) or become Weary / take Bruised Value damage if already Weary

## Spell Parameters Reference

| Parameter | Meaning |
|---|---|
| Range | Max distance to target. "0 (self)" = caster only. "0 (touch)" = must touch. |
| Area of Effect | What/who is affected. Can be radius, cone, single target, etc. |
| Duration | How long. "-" = instant. "C" = Concentration. "P" = Permanent. "X/lvl" = scales with level. |
| Save | Whether targets get a SR. "Y" = yes (usually WSR). "N" = no. |
| Stat Bonus | Which stat governs this Spell Lore's Skill Bonus. |

## Taint (Dark Magic)

Characters gain Taint when:
- Learning a Dark Spell Lore
- First using a Tainted Magic Item
- Increasing Affinity with Tainted Item of Power
- Making pact with demon/Darkmaster

Effects: Must change one Passion to Dark Passion per Taint gained.
- 1st Taint: Motivation → Obsession
- 2nd Taint: Allegiance → Dark Oath
- 3rd Taint: Nature → Perversion (character becomes NPC)

Redemption possible once (forgo source + heroic deed + spend Milestone).
