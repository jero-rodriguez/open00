---
inclusion: manual
---

# VsD Equipment Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 equipment, wealth, weapons, and armor.
Use this when implementing item data models, wealth mechanics, or weapon/armor properties.

## Wealth System

VsD uses abstract Wealth Levels (WL) instead of tracking individual coins.

### Wealth Levels

| WL | Status | Description |
|---|---|---|
| 0 | Serf/Outcast | Struggles for basic goods, no income |
| 1 | Struggling | Low-born freeman, basic sustenance |
| 2 | Commoner | Decent job, small income, small property |
| 3 | Gentry | Upper middle-class, servants, savings |
| 4 | Lesser Noble | Large estates, dozens of servants |
| 5 | Greater Noble/Ruler | Castles, armies, thousands of gold |

### Starting WL

Starting WL = Kin WL + Culture WL + Background Options (max 4, min 0)

### Buying Goods (WL vs Fare)

| Comparison | Result |
|---|---|
| WL > Fare | Can afford freely |
| WL = Fare | Can afford, but WL drops by 1 (min 0) |
| WL < Fare | Cannot afford alone |

### Availability

- **Common**: Found almost everywhere
- **Uncommon**: Medium+ towns or specialized merchants
- **Rare**: Large cities and wealthy courts only

### Item Quality

| Quality | Fare Modifier | Item Modifier | Availability |
|---|---|---|---|
| Low Quality | -1 | -10 | Common |
| Normal | +0 | +0 | As listed |
| Superior | +1 | +5 | Uncommon |
| Masterwork | +2 | +15 | Rare |

Item Modifier applies to: Weapons → CMB, Armors → DEF or reduces penalty, Tools → Skill Bonus.
Item Modifiers do NOT stack (use best single one).

### Bulk Purchases

- Tens of same good: +1 Fare
- Hundreds/thousands: +2 to +3 Fare

### Treasure Values

| TV | Examples |
|---|---|
| 1 | Pouch of silver/bronze, handful of gold, small gem, trinket |
| 2 | Bag of silver, small chest of gold, fine art, small gemstone |
| 3 | Big chest of gold, jewel with gemstones, art collection |
| 4 | Elven/Dwarven jewelry, Runesilver ore, fist-sized gemstone |
| 5 | Dragon's hoard, High King's treasure |

### WL vs Treasure Value

| Comparison | Result |
|---|---|
| WL < TV | Increase WL to TV |
| WL = TV | Increase WL by +1 |
| WL > TV | No change |

Sharing: 6 or fewer = base TV. Several = TV-1. Tens = TV-2.

## Weapons

### Weapon Properties

| Property | Description |
|---|---|
| Hands | 1H or 2H |
| Skill | Combat skill used (may have secondary at penalty) |
| Clumsy Range | Fumble if Unmodified Roll falls in this range |
| Length | Longest / Long / Short / Hand (determines strike order) |
| Attack Table | Edged, Blunt, Missile, Unarmed, Beast |
| Max Result | Cap on Attack Table result |
| Primary Critical | Main critical type dealt |
| Alternate Critical | Optional second critical type (attacker chooses) |
| Base Range | For ranged weapons only (meters) |
| Qualities | Special properties |

### Weapon Qualities

| Quality | Effect |
|---|---|
| Backstab | Ignore worn armor vs Surprised/Held targets (read NA column) |
| Hand and a Half | Can use 2H or 1H at -10 |
| Heavy | Cannot attack unless Half Action spent to ready |
| Load (#) | Rounds needed to reload missile weapon |
| Martial | +20 to Martial Moves |
| Mighty | +20 CMB when attacking without parrying |
| Quick Load | Reload as Half Action |
| Reach | Attack from second line at -20 |
| Unreliable | Fumble also inflicts Superficial Critical on wielder |

### Complete Weapons Table

| Weapon | Hands | Skill | CR | Length | Table | Max | Prim Crit | Alt Crit | Range | Qualities |
|---|---|---|---|---|---|---|---|---|---|---|
| Arming Sword | 1H | Blades | 3 | Long | Edged | 140 | Cut | - | - | Martial |
| Armored Fist | 1H | Brawl | 1 | Hand | Unarmed | Varies | Impact | - | - | - |
| Ball & Chain | 1H | Blunt | 8 | Short | Blunt | 150 | Impact | - | - | Unreliable |
| Bardiche | 2H | Polearm | 7 | Longest | Edged | 175 | Cut | Pierce | - | Reach, Mighty |
| Battle Axe | 1H | Blunt/Blades-20 | 5 | Long | Edged | 150 | Cut | Impact | - | Hand and Half |
| Club | 1H | Blunt | 4 | Hand | Blunt | 110 | Impact | - | - | - |
| Composite Bow | 2H | Ranged | 5 | - | Missile | 150 | Pierce | - | 25 | Load(1), Quick Load |
| Dagger | 1H | Brawl/Blades | 1 | Hand | Edged | 120 | Pierce | - | - | Backstab |
| Falchion | 1H | Blades | 5 | Short | Edged | 150 | Cut | - | - | Martial |
| Flail | 2H | Blunt | 8 | Long | Blunt | 175 | Impact | - | - | Unreliable, Heavy, Mighty |
| Footman's Mace | 2H | Blunt | 5 | Long | Blunt | 150 | Impact | - | - | Heavy, Mighty, Martial |
| Greataxe | 2H | Polearms/Blunt-10 | 6 | Long | Edged | 175 | Cut | Impact | - | Heavy, Mighty |
| Halberd | 2H | Polearm | 6 | Longest | Edged | 150 | Cut | Pierce | - | Mighty, Martial |
| Handaxe | 1H | Blunt/Blades-20 | 2 | Hand | Blunt | 130 | Cut | Impact | - | - |
| Heavy Crossbow | 2H | Ranged | 4 | - | Missile | 175 | Pierce | - | 30 | Load(2) |
| Heavy Mace | 1H | Blunt | 3 | Short | Blunt | 140 | Impact | - | - | Martial |
| Kick | 1H | Brawl | 2 | Hand | Unarmed | Varies | Impact | - | - | - |
| Lance | 1H | Polearm | 8 | Longest | Edged | 175 | Pierce | - | - | Mighty |
| Light Crossbow | 2H | Ranged | 3 | - | Missile | 150 | Pierce | - | 20 | Load(1) |
| Light Mace | 1H | Blunt | 2 | Short | Blunt | 120 | Impact | - | - | Martial |
| Long Bow | 2H | Ranged | 6 | - | Missile | 175 | Pierce | - | 35 | Load(1) |
| Long Spear | 2H | Polearm | 6 | Longest | Edged | 175 | Pierce | - | - | Reach, Mighty |
| Longsword | 1H | Blades | 4 | Long | Edged | 150 | Cut | Pierce | - | Hand and Half, Martial |
| Mattock | 2H | Blunt | 5 | Long | Blunt | 175 | Impact | Pierce | - | Heavy, Mighty |
| Punch | 1H | Brawl | 1 | Hand | Unarmed | Varies | Impact | - | - | - |
| Quarterstaff | 2H | Polearm | 6 | Long | Blunt | 130 | Impact | - | - | - |
| Rapier | 1H | Blades | 4 | Long | Edged | 130 | Pierce | Cut | - | Martial |
| Scimitar | 1H | Blades | 3 | Short | Edged | 140 | Cut | - | - | Martial |
| Short Bow | 2H | Ranged | 4 | - | Missile | 140 | Pierce | - | 20 | Load(1), Quick Load |
| Short Spear | 1H | Polearm | 5 | Long | Edged | 140 | Pierce | - | - | Hand and Half |
| Short Sword | 1H | Blades | 2 | Short | Edged | 130 | Cut | Pierce | - | Backstab |
| Sling | 1H | Ranged | 7 | - | Missile | 110/130 | Impact | - | 15 | Load(1) |
| Thrown Axe | 1H | Ranged | 4 | - | Missile | 120 | Cut | - | 3 | - |
| Thrown Dagger | 1H | Ranged | 2 | - | Missile | 110 | Pierce | - | 3 | - |
| Thrown Javelin | 1H | Ranged | 3 | - | Missile | 140 | Pierce | - | 10 | - |
| Thrown Spear | 1H | Ranged | 3 | - | Missile | 130 | Pierce | - | 5 | - |
| Two Handed Sword | 2H | Blades | 6 | Long | Edged | 175 | Cut | Pierce | - | Heavy, Mighty |
| War Hammer | 1H | Blunt | 4 | Short | Blunt | 130 | Impact | Pierce | - | Martial |
| Whip | 1H | Blunt | 8 | Longest | Blunt | 130 | Grapple | Cut | - | Heavy, Reach, Martial |

### Unarmed Attack Max Results by Size

| Size | Punch/Armored Fist | Kick | Grappling |
|---|---|---|---|
| Small | 80 | 90 | 80 |
| Medium | 110 | 120 | 120 |
| Large | 130 | 140 | 140 |
| Huge | 150 | 150 | 150 |
| Colossal | 175 | 175 | 175 |

### Weapon Fare

| Category | Fare |
|---|---|
| Hand melee (dagger, club) | 0 |
| Light melee (short sword, mace, arming sword) | 1 |
| Large melee (longsword, warhammer) | 1 |
| Heavy melee (two-handed, polearms) | 2 |
| Poor ranged (sling, short bow) | 0 |
| Light ranged (light crossbow, composite bow) | 1 |
| Heavy ranged (long bow, heavy crossbow) | 2 |

## Armor

### Armor Table

| Armor | Fare | Type | Zones | Qualities | Max SWI | Move Pen | CMB Pen | Percept Pen | Melee DEF | Ranged DEF |
|---|---|---|---|---|---|---|---|---|---|---|
| Furs/Pelts | 0 | Light | T,A,L | - | +20 | -20 | - | - | - | - |
| Leather Jerkin | 1 | Light | T | - | - | -10 | - | - | - | - |
| Leather Armor | 1 | Light | T,A,L | - | +30 | -20 | -5 | - | - | - |
| Boiled Leather | 1 | Light | T | Rigid | +30 | -25 | - | - | - | - |
| Reinforced Leather | 2 | Light | T,A,L | Metal | +20 | -30 | -5 | - | - | - |
| Chain Shirt | 2 | Medium | T | Metal | +30 | -35 | - | - | - | - |
| Chain Mail | 2 | Medium | T,A,L | Metal | +20 | -45 | - | - | - | - |
| Lamellar Armor | 2 | Medium | T,A,L | Metal | +25 | -45 | -5 | - | +5 | +5 |
| Breastplate | 2 | Medium | T | Metal,Rigid | +30 | -40 | - | - | - | - |
| Chain Hauberk | 2 | Heavy | T,A,L | Metal | +10 | -75 | -10 | - | +10 | - |
| Banded Mail | 2 | Heavy | T,L | Metal,Rigid | +20 | -40 | - | - | - | - |
| Half Plate | 2 | Heavy | T,A,L | Metal,Rigid | +20 | -60 | -5 | - | +5 | +5 |
| Full Plate | 3 | Heavy | T,A,L | Metal,Rigid | +15 | -75 | -10 | - | +15 | +15 |

Zones: T=Torso, A=Arms, L=Legs

### Helmets & Extras

| Item | Fare | Zones | Qualities | Percept Pen |
|---|---|---|---|---|
| Leather Helmet | 0 | Head | - | -5 |
| Metal Helmet | 1 | Head | Metal,Rigid | -5 |
| Full Helm | 1 | Head,Face,Neck | Metal,Rigid | -15 |
| Leather Greaves | 1 | Lower Legs | - | - |
| Metal Greaves | 1 | Lower Legs | Metal,Rigid | - |
| Leather Bracers | 0 | Forearms | - | - |
| Metal Gauntlets | 1 | Forearms,Hands | Metal,Rigid | - |

### Shields

| Shield | Fare | Zones | Qualities | Move Pen | CMB Pen | Melee DEF | Ranged DEF |
|---|---|---|---|---|---|---|---|
| Target Shield | 1 | Shield arm | Rigid | - | - | +15 | +5 |
| Full Shield | 1 | Shield arm, Torso | Rigid | -10 | -5 | +25 | +25 |
| Wall Shield | 1 | Shield arm, Torso | Rigid | -20 | -15 | +40 | +50 |
| Net | 0 | Shield arm | - | - | - | +5 | - |

Shield notes:
- Target Shield: DEF bonus vs single attacker per round
- Full Shield: DEF bonus vs all attackers from one side
- Wall Shield: DEF bonus vs all attackers from front/side
- Net: DEF vs single attacker, cannot parry ranged, +20 to disarm/lock

### Armor Qualities

- **Metal**: Use "metal armor" results for Critical Strikes
- **Rigid**: Use "rigid armor" results for Critical Strikes

### Armor Skill Interaction

Move Actions Penalty applies to: Spell Casting, Acrobatics, Athletics, Ride, Stealth.
Armor Skill Bonus reduces Move Actions Penalty (to minimum 0).
CMB Penalty and Perception Penalty cannot be offset.
Penalties from armor + shield stack.

## Enchanted Materials

| Material | Properties |
|---|---|
| Runesilver | Nearly indestructible. Weapons ignore Critical Strike reduction. Armor halves Move/CMB penalties. |
| Shadowsilk | +20 DEF and Stealth in Dim Light. Reduce Pierce Criticals by 1 severity. |
| Wyrdwood | Boats can sail spirit-world seas. Shields +20 DEF/SR vs spirits/undead. Weapons destroy mindless undead (WSR vs own Level or dust). |

## Magic Items Types

| Type | Description |
|---|---|
| Potions | Single use, drink to activate |
| Bonus Items | Passive +X to a Skill/Stat while wielded/worn |
| Magical Focuses | Grant extra MPs (requires Attunement) |
| Activated Items | Cast spells X times/day (requires Attunement) |
| Constant Items | Always-on spell/effect, usually no Attunement |
| Runes of Power | Single-use inscribed spells, crumble after use |
| Staves/Rods/Wands | Cast spells until exhausted (Attunement required) |
| Slayer Weapons | Always Lethal Critical vs designated enemy type |
| Cursed Items | Detrimental effects with trigger condition |
| Items of Power | Sentient artifacts with Purpose, Affinity score, scaling powers |

### Attunement

- ~1 hour meditation + Arcana Skill Roll
- Success: bonded, can use item
- Partial Success: partial powers, or wasted charges, or Resonance Roll
- Critical Failure: item may be Cursed or unleash harmful power

### Staves/Rods/Wands Exhaustion

| Type | Max Weave | Exhaustion Number |
|---|---|---|
| Wand | 2nd | 7 (roll d10 after each use, <= this = destroyed) |
| Rod | 5th | 5 |
| Staff | 10th | 1 |

### Items of Power - Affinity

- Starts at 1 when picked up
- Increases by 1 (max 10) at end of session if wielder followed item's Purpose
- Decreases by 1 if wielder acted against Purpose
- Below 0: item stops working, seeks new bearer
- Higher Affinity unlocks more powers (defined per item)

## Starting Equipment

All characters start with:
- Normal traveling clothes
- Belt with scabbards
- Side arm of choice
- Pouch for coins/belongings
- Small bag or rucksack
- Background Option items
- Culture Outfitting Options
