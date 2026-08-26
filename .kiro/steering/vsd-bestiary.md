---
inclusion: manual
---

# VsD Bestiary Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 creature stats and abilities.
Use this when implementing creature data models, encounter generation, or NPC stat blocks.

## Creature Stat Block Structure

Each creature entry contains:

| Field | Description |
|---|---|
| Level | Numeric level + type (Common/Elite/Antagonist) |
| MR | Move Rate in meters/round. Format: `#L` (land), `#F` (flight), `#S` (swim) |
| AT | Armor Type: NA, LA, MA, HA. Suffix `s` = has shield |
| DEF | Defense bonus (includes SWI, shield, magic, specials) |
| TSR | Toughness Save Roll bonus |
| WSR | Willpower Save Roll bonus |
| HPs | Average Total Hit Points |
| Attacks | 1st/2nd/3rd attacks. Format: `+CMB Size Type` (e.g., +90 Large Claw) |
| Special | Key special abilities summary |
| CT | Creature Type: 2 letters. 1st = tier (N/H/E), 2nd = type (H/B) |
| Skills | Rog/Adv/Lor average bonuses per category |

### Creature Type Codes

**First letter (Critical Strike reduction):**
- N = Normal (no reduction)
- H = Heroic (-1 severity to all Critical Strikes received)
- E = Epic (-2 severity to all Critical Strikes received)

**Second letter (creature category):**
- H = Humanoid
- B = Beast

### Attack Notation

- `+CMB` = Combat Bonus
- Size: Small, Medium, Large, Huge, Colossal
- Type: Weapon, Claw, Bite, Beak, Horn, Trample, Grapple, Stinger
- `(x2)` = can make that attack twice in same action
- `*` prefix on 2nd/3rd attack = Free Action if 1st scores Critical Strike

### Beast Attack Table Max Results by Size

| Size | Bite/Beak | Claw/Talon | Horn/Stinger | Grapple/Bash | Trample |
|---|---|---|---|---|---|
| Small | 90/80 | 90 | 80 | 80/90 | 80 |
| Medium | 120/110 | 120 | 120 | 110/120 | 120 |
| Large | 140/130 | 140 | 140 | 130/140 | 140 |
| Huge | 150 | 150 | 150 | 150 | 150 |
| Colossal | 175 | 175 | 175 | 175 | 175 |

Large+ creatures with secondary Critical: also inflict secondary Critical Strike two severities lower than primary.

## All Creatures

### Awakened Tree

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Awakened Tree | 10 Elite | 18L | LA | +40 | +80 | +60 | 250 | EB |
| Ænth | 20 Antagonist | 18L | MA | +50 | +100 | +90 | 350 | EB |

**Attacks**: +90/+150 Large Grapple, +90/+150 Large Trample
**Skills**: Rog +50/+75, Adv +90/+120, Lor +0/+90
**Abilities**: Resilience (immune to Pierce: half damage, -2 extra severity), Crush (+30 to next Grapple after crit), Flammable (fire = Slayer + double damage), Overwhelming (Medium or smaller = half CMB to Parry)
**Ænth only**: Boulder (ranged +Adv bonus, Beast Table, 150 max, 30m range, 1.5m area)

### Boggart

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Boggart | 1 Common | 15L | NA | +20 | +30 | +0 | 40 | NH |
| Boggle | 3 Elite | 15L | NA | +20 | +30 | +0 | 50 | NH |

**Attacks**: +30/+40 Weapon or Small Bite
**Skills**: Rog +50/+70, Adv +20/+30, Lor +0
**Boggle**: Sadistic Impulse (+10 CMB vs Bruised/Injured opponents)

### Demon

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Faceless | 8 Elite | 18L | MA | +40 | +40 | +50 | 120 | HH |
| Werewolf | 10 Antagonist | 40L | LA | +40 | +65 | +75 | 250 | HH |
| Vampire | 15 Antagonist | 18L/50F | NA | +65 | +70 | +80 | 150 | HH |
| Shadowflame | 30 Antagonist | 25L/30F | HA | +90 | +150 | +150 | 400 | EH |

**Common abilities (all demons)**: Otherworldly (no age/sleep/eat, immune poison/disease, no Bleed, no Stun, "death" = banished 1000 years), Darkvision

**Faceless**: +110 Huge Unarmed. Commandeer (control up to 10 lower-level servants), Eyeless Gaze (Half Action, WSR or Held), Darkspawn (+20 Stealth/DEF in Dim/Dark), Martial Arts (full Parry unarmed vs armed/ranged)

**Werewolf**: +120 Large Bite. Formless (incorporeal, immune non-magic, move through shadows MR 50, can't cross running water/light), Possession (WSR or possessed), Howl (Half Action, 20m, WSR or Stunned)

**Vampire**: +100 Large Claw(x2), *+100 Medium Bite. Vampiric Embrace (crit Bite = Held, 1d10+1 Soul Damage/rnd), Shapeshifting (consume life force → beautiful humanoid 1 week), Hypnotic Gaze (WSR or Incapacitated)

**Shadowflame**: +240 Weapon(x2). Terrifying Presence (WSR or Frightened), Immolation (Half Action, Moderate Fire Crit/rnd to engaged), Spell Casting (Eldritch Fire, Detections, Mind Control, Eldritch Wards to 10th, use Lor bonus), Demon of Might (no Flanking/Rear from Medium-, double weapon damage, Parry vs all Medium- engaged), Fiery Arms (two Large 2H weapons, Edged+Blunt tables max 175, Immolated = extra Fire crit one severity lower)

### Dragon

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Lindworm | 18 Antagonist | 50L | HA | +50 | +115 | +95 | 380 | EB |
| Fire Drake | 25 Antagonist | 55F/18L | HA | +40 | +125 | +125 | 450 | EB |
| Sea Drake | 20 Antagonist | 30S/18L | HA | +40 | +120 | +120 | 400 | EB |

**Attacks**: +160-175 Colossal Bite, +125-150 Huge Claw/Horn, *Colossal Trample (Lindworm)
**Skills**: Rog +90-120, Adv +110, Lor +90-100
**Common abilities**: Terrifying Presence (Large or smaller, WSR or Frightened), Elemental Resistance (immune non-magic elemental, halve magic elemental), Draconic Might (no Stun from Large-, no Flanking/Rear from Medium-), Heightened Senses (perfect vision all conditions, detect invisible), Ferocity (primary + secondary as single Full Action), Overwhelming (Medium- half CMB Parry), Unique Ability (roll on table)

**Lindworm**: Burrowing (MR 18 through earth/stone)
**Fire Drake**: Dragon's Breath (20m×20m cone, Area Spells Table, +Adv CMB, Fire, no max)
**Sea Drake**: Amphibious, Dragon's Breath (15m×15m cone, +90 CMB, Fire, no max)

**Dragon Special Abilities (d100)**: Soft Spot, Death Curse, Acidic Blood, Eldritch Power (1d5 Spell Lores), Transfixing Gaze, Unusual Movement, Invulnerable (needs Special Herb), Many-Headed, 81-90: choose two, 91-00: choose three

### Dragonspawn

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Dragonspawn | 6 Elite | 15L | MA | +30 | +50 | +35 | 90 | NH |
| Dragonspawn Priest | 9 Elite | 15L | HA | +50 | +65 | +55 | 120 | NH |

**Attacks**: +95/+120 Weapon, +70 Ranged
**Skills**: Rog +40, Adv +60/+70, Lor +25/+60
**Abilities**: Night Sight, Dragon's Blood (roll on special table: Turn to Stone, Dragon's Breath 3m cone, Acidic Blood, Draconic Magic, Death Throes, Winged Flight MR 15, Shapechanger, Venomous AL8, Death Frenzy, or choose two)
**Priest**: Dragon's Breath always, Spellcasting (up to 5 Wizard/Animist lores to 5th Weave, no MPs)

### Dwergar

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Dwergar Warrior | 5 Common | 14L | MA | +45 | +60 | +40 | 85 | NH |
| Dwergar Berserker | 8 Elite | 15L | MA | +20 | +75 | +55 | 150 | NH |

**Attacks**: +90/+120 Weapon, +60 Ranged
**Skills**: Rog +40, Adv +30/+40, Lor +15/+0
**Abilities**: Night Sight, Forgekin (+30 SR/DEF vs heat/cold)
**Berserker**: Berserkersgang (20 ranks Battle Frenzy)
**Contraptions**: Arbalest (heavy crossbow, shoot every round), Earthshaker Orb (Area +Ranged CMB, 140 max, Impact, 3m radius), Flamespitter (3m cone, 130 max, Fire, +Ranged CMB, single use)

### Evil Man

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Bandit | 4 Common | 15L | LAs | +25 | +25 | +20 | 70 | NH |
| Dark Knight | 7 Elite | 15L | HAs | +40 | +40 | +35 | 115 | NH |
| Dark Mage | 10 Antagonist | 15L | LA | +10 | +65 | +70 | 65 | NH |

**Attacks**: +70/+100/+65 Weapon, +50/+70 Ranged
**Skills**: Rog +20/+40/+50, Adv +30/+70/+40, Lor +0/+25/+100
**Dark Knight**: Dark Blessing (roll d100: Unearthly Strength, Dark Steed, Darkvision, Demonic Visage, Power of Dark Side, Magic Resistance, Dark Armor, Regeneration, Pale Horseman, choose two, choose three)
**Dark Mage**: Necromancy or Dark Sorcery + 1d5+3 other lores to 10th Weave, no MPs, use Lor bonus

### Fellwing

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 12 Elite | 50F/10L | MA | +40 | +75 | +50 | 200 | HB |

**Attacks**: +100 Large Bite, +70 Large Claw
**Abilities**: Night Sight, Swoop Attack (charge from air with Claw, move 10m after as same action)

### Fomorian

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 6 Common | 18L | LA | +40 | +55 | +40 | 100 | NH |

**Attacks**: +100 Weapon, +80 Medium Claw, *+90 Medium Bite
**Skills**: Rog +40, Adv +60, Lor +0
**Abilities**: Night Sight, Beastial Trait (roll: Blazing Speed, Keen Senses, Vicious Bite, Mighty Leap, Amphibious, Winged Flight, Horns, Blind Sight, Clinging, Blood Frenzy, or choose two)

### Ghoul

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Ghoul | 4 Common | 17L | NA | +35 | +40 | +10 | 60 | NH |
| Draugr | 7 Elite | 15L | MA | +40 | +50 | +35 | 95 | HH |

**Attacks**: Ghoul +80 Medium Claw; Draugr +90 Weapon, +80 Large Claw
**Abilities**: Unliving (no breathe/rest/eat, immune Stun/poison/disease, no Bleed), Darkvision
**Ghoul**: Infected (crit from Claw → AL4 TSR or Barrow Rot)
**Draugr**: Stench of Decay (3m, TSR or -20 for 1hr/10 fail), Tremendous Strength (unarmed = Large, weapon damage ×1.5)

### Ghost

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Corpse Candle | 2 Common | 18F | NA | +30 | +10 | +15 | 40 | NH |
| Ghost | 5 Elite | 15F | NA | +50 | +30 | +45 | 70 | HH |
| Specter | 8 Elite | 15F | NA | +60 | +50 | +70 | 100 | HH |

**Attacks**: All Special (Unholy Drain)
**Common**: Unliving, Darkvision, Incorporeal (immune non-magic/elemental, pass through obstacles), Mindless (immune fear/mind effects)
**Corpse Candle**: Unholy Drain (6m, TSR or 1d5 Soul Damage), Siren (20m, WSR or fascinated)
**Ghost**: Unholy Drain (6m, TSR or 1d10+1 Soul Damage), The Haunting (bound to place/object, Telekinesis or wield weapon), Unseen Presence (invisible at will), Undying (reform 2d10 days, must break curse to destroy)
**Specter**: Unholy Drain (6m, TSR or 2d10+2 Soul Damage), The Haunting + The Grudge (possess living creature touching object/in location, WSR), Unseen Presence, Undying (reform 1d10 days)

### Giant

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Lesser Giant | 9 Elite | 20L | LA | +30 | +70 | +30 | 190 | HH |
| Greater Giant | 18 Antagonist | 25L | LA | +40 | +95 | +60 | 350 | EH |

**Attacks**: Lesser +120 Large Trample, +100 Ranged; Greater +180 Huge Trample, +140 Weapon(x2), +150 Ranged
**Skills**: Rog +0/+20, Adv +60/+80, Lor +15/+40
**Abilities**: Boulder (30m range, +Ranged CMB, Beast Table 150 max, 1.5m area), Overwhelming, Unique Ability (roll: Misshapen, Fear-Inducing, Fee-fi-fo-fum, Bestial, Two-Headed, Pantagruel, Stealthy, Old One, Baleful Eye, choose two)

### Giant Eagle

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Giant Eagle | 15 Antagonist | 60F/10L | NA | +40 | +100 | +80 | 180 | EB |
| Wind Lord | 25 Antagonist | 90F/20L | LA | +75 | +125 | +110 | 300 | EB |

**Attacks**: +110/+170 Huge Claw, +70/+120 Huge Beak
**Abilities**: Swoop Attack (charge from air, move 15m after), Overwhelming
**Wind Lord**: Terrifying Screech (WSR or Frightened, -10 for Darkmaster servants), Wind Mastery (Breeze, Stormwall, Becalm, Wind Armor from Eldritch Storm, no MPs)

### Giant Spider

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Lesser Spider | 5 Common | 18L | LA | +40 | +40 | +30 | 70 | NB |
| Great Spider | 8 Elite | 18L | LA | +50 | +55 | +45 | 100 | HB |
| Mother of Spiders | 15 Antagonist | 25L | MA | +70 | +80 | +80 | 175 | HB |

**Attacks**: +90/+100/+150 Large/Huge Bite
**Common**: Darkvision, Poison (crit Bite → TSR or Held 1d10 min; 2nd dose = Incapacitated 2d10 min), Adherence (move on any surface at normal MR)
**Great Spider/Mother**: Web (3m radius if moves <half MR, Arduous Terrain, Athletics -10 or Held)
**Lesser/Mother**: Jump (as Eldritch Movement spell, Half Action, +20 if over enemy, TSR or Prone)

### Gorcrow

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Gorcrow | 1 Common | 21F/3L | NA | +50 | +0 | +0 | 15 | NB |
| Blackfeather | 3 Elite | 30F/10L | NA | +60 | +30 | +30 | 45 | NB |

**Attacks**: +25/+60 Small Beak
**Abilities**: Night Sight
**Blackfeather**: Shadowflight (Full Action, enter shadow within MR, emerge from another shadow 50m away; Perception -30 or Stunned if destination unseen)

### Kraken

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 15 Antagonist | 24S | LA | +50 | +90 | +75 | 150 | EB |

**Attacks**: +75 Large Grapple(x6)
**Abilities**: Camouflage (invisible when immersed and still), Writhing Tentacles (sacrifice up to 5 attacks for +10/attack to remaining), Coiling Arms (crit = Held, auto-release if not targeted next round, Athletics -40 to break free), Overwhelming

### Merlock

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 4 Elite | 15L | NA | +35 | +40 | +40 | 60 | NH |

**Attacks**: +75 Medium Grapple, +50 Weapon
**Abilities**: Unliving, Dark & Wet (webbed feet = mud/quicksand as Normal Terrain, perfect vision Dim/Dark, blinded by Bright Light -80), Mesmerizing Bell (Full Action, 6m, WSR or Held 1rnd/5 fail), Ambush (+Level to crit rolls vs Held/unaware), Gold Fever (toss coins = freeze 1 round)

### Nightmare

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Nightmare | 9 Elite | 50L | LA | +50 | +65 | +65 | 210 | HB |
| Kelpie | 7 Elite | 40S/40L | LA | +40 | +50 | +50 | 180 | NB |

**Nightmare attacks**: +110 Large Trample, +90 Medium Bite
**Kelpie attacks**: +100 Large Bite
**Nightmare**: Darkvision, Cold Breath (9m×3m cone, Area Spells +Adv, 130 max, Frost), Frightening (Medium-, WSR or Frightened)
**Kelpie**: Water Spirit (breathe air/water, Eldritch Tide to 7th Weave, +70 bonus, no MPs)

### Orc

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Half-Orc Scout | 2 Common | 15L | LA | +15 | +30 | +0 | 50 | NH |
| Orc Soldier | 3 Common | 15L | LAs | +30 | +40 | +5 | 60 | NH |
| Dark Orc Chieftain | 7 Elite | 15L | MAs | +40 | +65 | +35 | 100 | NH |

**Attacks**: Scout +50 Ranged/+40 Weapon; Soldier +60 Weapon/+45 Ranged; Chieftain +100 Weapon/+75 Ranged
**Common**: Night Sight
**Half-Orc**: Fire-Hardened (+15 vs heat/flame)
**Orc Soldier**: Flame-Hardened (+30 vs heat/flame), Sun Sensitivity (-60 daylight, -20 cloudy)
**Chieftain**: Flame-Hardened, Where There's a Whip (+10 SR vs fear for allies in 6m if not Bruised), Great Name (roll on Titles table: Vengeful, Ambusher, Kinkiller, Poisonfang, Lame, Hexer, Skinchanger, Flamebringer, Howler, The Great=choose two)

### Redcap

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Redcap | 1 Common | 17L | NA | +25 | +30 | -5 | 35 | NH |
| Fear Dearg | 2 Elite | 17L | NA | +25 | +30 | +10 | 35 | NH |

**Attacks**: +35 Weapon
**Skills**: Rog +25, Adv +10/+5, Lor +0/+35
**Abilities**: Night Sight, Tough (+10 SR/DEF vs Fire, Frost, Poisons)
**Fear Dearg**: Spells (1d5 of: Chanting, Illusions, Mind Control, Master of Animals, Master of Plants, Movements of Nature, Trickery — to 2nd Weave, no MPs, use Lor)

### Skeleton

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Skeleton | 1 Common | 14L | NAs | +20 | +25 | -10 | 25 | NH |
| Curse-Born | 5 Elite | 14L | MAs | +30 | +40 | +25 | 80 | HH |

**Attacks**: +30/+80 Weapon
**Common**: Unliving, Darkvision, Mindless
**Curse-Born**: Fear (WSR or Frightened), Undying (reform 1d10 rounds if reduced to 0 HP, reform 2d10 days if destroyed; must break curse)

### Spirit

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Sacred Beast | 6 Elite | Special | LA | +40 | +50 | +55 | 150 | HB |
| Shield-Maiden | 8 Antagonist | 18L/18F | HAs | +60 | +75 | +75 | 165 | HH |
| Holy Guardian | 12 Antagonist | 24L/24F | MA | +50 | +90 | +90 | 220 | EH |

**Common**: Otherworldly (no age/sleep/eat, immune poison/disease, no Bleed, no Stun, "death" = banished 1000 years)
**Sacred Beast**: +90 Large Trample. MR = chosen animal +5. Lord of the Wild (animals won't attack, same-type obey, summon up to 15 Levels/day), Nature's Stride (no trace, Arduous=Normal)
**Shield-Maiden**: +120 Weapon. Spells (Channeling, Commanding Presence, Heroic Defense, Weapon Mastery to 8th, no MPs, use Lor). Chooser of the Slain (ignore Critical Strike reduction)
**Holy Guardian**: Spells (all Animist lores to 10th, no MPs, use Lor). Master of Nature. Blood of the Earth (bound to location, -20/500m outside, recover 5 HP/rnd + -5 Injury penalty/rnd inside). +110 Weapon.

### Stone Guardian

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 8 Elite | 12L | HA | +40 | +70 | +50 | 180 | HH |

**Attacks**: +110 Large Trample
**Abilities**: Mindless, Unliving, Hardness (half Pierce/Cut damage, -1 Pierce/Cut crit severity, non-magic weapons break on fumble), Overwhelming, Ageless Sentinel (constant Sense Life, never Surprised)

### Troll

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Wild Troll | 6 Elite | 15L | LA | +10 | +75 | +15 | 150 | HH |
| Dark Troll Overseer | 9 Elite | 15L | MA | +40 | +90 | +35 | 250 | HH |
| Maimlord | 15 Antagonist | 15L | HA | +50 | +110 | +70 | 280 | EH |

**Attacks**: Wild +90 Large Claw/+80 Weapon; Overseer +130 Weapon/+90 Large Claw; Maimlord +140 Weapon(x2)/+110 Huge Claw(x2)
**Common**: Night Sight
**Wild Troll**: Hulking Brute (immune Stun from non-magic), Feral Predator (+20 Stealth in nature), Sun Cursed (turn to stone in sunlight)
**Overseer**: Hulking Brute, Hard to Kill (never Bleed), Fearless (immune fear), Cruel Taskmaster (+20 SR vs fear for allied Common in 10m if not Bruised)
**Maimlord**: Dogs of War (immune Stun, no Bleed, no Fumble, immune mind effects), Overkill (creatures engaged suffer Light Crit at start of each Assessment Phase), Overwhelming

### Undead Thrall

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Small | 1 Common | 12L | NA | 0 | 15 | -10 | 25 | NH |
| Medium | 3 Common | 12L | NA | 0 | 40 | -10 | 55 | NH |
| Large | 8 Common | 12L | NA | 0 | 65 | -10 | 100 | NH |

**Attacks**: +30/+40/+90 Small/Medium/Large Unarmed or Claw
**Abilities**: Unliving, Darkvision, Mindless

### Unseelie

| Variant | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Dark Elf | 8 Elite | 15L | LAs | +70 | +50 | +60 | 90 | NH |
| Feyblade | 7 Elite | 15L | MA | +40 | +45 | +40 | 80 | NH |
| Banshee | 9 Antagonist | 15L | NA | +60 | +55 | +70 | 100 | NH |

**Common**: Keen Senses (+10 Perception, starlight/moonlight as day, 30m Dim Light), Immortal (no age, immune disease, +10 vs cold)
**Dark Elf**: +100 Ranged, +90 Weapon, Spells. Spells (Elven Lore, Spell Songs + 1d5+1 others to 8th, no MPs, use Lor)
**Feyblade**: +110 Weapon(x2). Combat Superiority (split attacks between 2 engaged, Parry vs all engaged), Sword Flourish (miss vs Parrying Feyblade = Light Crit to attacker), Reckless Fury (first Stun/Bruised = rage: immune Stun, extra attack, no Parry, must attack nearest)
**Banshee**: +100 Weapon, Spells. Spells (Elven Lore, Spell Songs + 1d5 others to 9th, no MPs, use Lor). Aura of Doom (engaged enemies can't spend Drive to re-roll), Keening (Half Action, 6m, WSR or Stunned), Harvest of Sorrow (crits vs Stunned = always Lethal)

### Vargr

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 8 Elite | 40L | NA | +55 | +50 | +40 | 150 | HB |

**Attacks**: +100 Large Bite
**Skills**: Rog +25, Adv +70, Lor +0
**Abilities**: Night Sight, Variant (roll d100)

**Variants**: Grey (no extra), Winter (immune Frost, 9m×3m Frost breath 130 max), Night (+30 DEF/Stealth in Dim, invisible in Dark), Hellhound (immune Fire, 9m×3m Fire breath 140 max), Blighted (Bite crit → TSR or Weary+Dying 1d10+1 rnds), Doom (200 HPs, MR 50, Bite crit → free Large Bash +90)

### Wild Beast

| Beast | Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|---|
| Dire Bear | 7 Elite | 24L | LA | +40 | +60 | +35 | 250 | HB |
| Great Cat | 4 Common | 30L | NA | +40 | +20 | +10 | 100 | NB |
| Tusked Boar | 3 Common | 24L | LA | +30 | +20 | +5 | 120 | NB |
| Wolf | 3 Common | 40L | NA | +30 | +15 | +5 | 110 | NB |
| Adder | 2 Common | 5L | NA | +0 | +10 | +0 | 20 | NB |
| Mastodon | 8 Elite | 25L | LA | +20 | +70 | +40 | 350 | HB |
| Warhorse | 5 Common | 50L | NA | +30 | +30 | +10 | 150 | NB |
| Swarm | 4 Common | 20F/20L | NA | +40 | +20 | +20 | 80 | NB |

**Key attacks**: Dire Bear +95 Large Grapple/*+100 Large Bite; Great Cat +60 Medium Claw/*Bite; Boar +50 Large Horns/*Trample; Wolf +70 Medium Bite; Adder +30 Small Bite; Mastodon +100 Huge Trample/*+90 Large Horns; Warhorse +70 Large Trample; Swarm +60 Small Stinger

**Special**: Great Cat Pounce (leap 6m + Claw as single action); Adder Poison (AL3 TSR or Weary+Dying 1d10 min); Mastodon Overwhelming; Swarm Hive Mind (no Stun, immune mind), Swarming (no Parry, immune crits, half from normal attacks, double from area, attack all engaged)

### Wight

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 10 Elite | 15L | NA | +50 | +80 | +90 | 100 | HH |

**Attacks**: +105 Weapon
**Skills**: Rog +40, Adv +30, Lor +40
**Abilities**: Unliving, Darkvision, Sun Sensitivity (-60 daylight, -20 cloudy), Corrupting Presence (area = Blighted Land, double heal time, half spell/herb efficacy), Call of the Grave (Full Action, WSR or deep sleep 1hr/10 fail, can't be awakened normally, sunlight ends it), Unholy Drain (weapon hit → TSR or 1d10+1 Soul Damage), Undying (vanish at 0 HP, reform 2d10 hours; must destroy focus item)

### Wraith

| Level | MR | AT | DEF | TSR | WSR | HPs | CT |
|---|---|---|---|---|---|---|---|
| 15 Antagonist | 15L | MA | +75 | +90 | +80 | 200 | EH |

**Attacks**: +150 Weapon, Spells
**Skills**: Rog +80, Adv +80, Lor +110
**Abilities**: Unliving, Fear (WSR or Frightened), Unholy Aura (engaged living: TSR each Assessment Phase or 1d10+1 Soul Damage; non-magic weapons shatter unless wielder passes WSR), Spells (1d10+2 lores to 10th, no MPs, use Lor), Those of the Unlight (half damage from non-magic; perfect vision in Dark; Bright Light blinds; no spells in sunlight), Undying (reform 2d10 hours; must fulfill prophecy to destroy)
