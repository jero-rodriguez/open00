---
inclusion: manual
---

# VsD Grimoire Reference

Mechanical reference for Against the Darkmaster (VsD) v1.5 spell lores and spells.
Use this when implementing spell data, spell effects, or spell lore item models.

## Spell Parameter Key

- **Range**: Max distance. `0(self)` = caster only. `0(touch)` = must touch target.
- **AoE**: Area of Effect. Target count, radius, cone dimensions, etc.
- **Dur**: Duration. `-` = instant. `C` = Concentration. `P` = Permanent. `X/lvl` = per caster level.
- **Save**: Y = targets get WSR (unless noted TSR). N = no save.
- **Stat**: Governing stat for the Spell Lore's Skill Bonus.
- Spells marked with `*` are Instantaneous (Half Action, no concentration bonus, no -10 improvised penalty).
- **Warp**: Warping options listed as `+N Weave: effect`. Can be selected multiple times unless noted.

---

## Aspects of Nature (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Changer of Hues | 0(self) | caster | 1min/lvl | N | +30 Stealth in vegetation |
| 2 | Aspect of the Hound | 0(self) | caster | 1min/lvl | N | +20 Hunting |
| 3 | Aspect of the Owl | 0(self) | caster | 1min/lvl | N | Dark Sight (30m Dim, 3m Dark) |
| 4 | Tree Form | 0(self) | caster | 1min/lvl | N | Illusion: appear as tree while still |
| 5 | Aspect of the Fox | 0(self) | caster | 1min/lvl | N | +20 Deceive and trap rolls |
| 6 | Claws of Fury* | 0(self) | caster | 1rnd/lvl | N | Unarmed on Beast Table, 120 max, Cut crits |
| 7 | Skinchanger | 0(self) | caster | 1min/lvl | N | Illusion: appear as Small/Medium animal |
| 8 | Aspect of the Bull | 0(self) | caster | 1min/lvl | N | Cannot be Stunned, bare skin = Light Armor |
| 9 | Aspect of the Boar | 0(self) | caster | 1min/lvl | N | +20 melee attack, double charge damage, no Parry/ranged |
| 10 | Master of Shapes | 0(self) | caster | 1min/lvl | N | Transform into S/M/L animal (gain physical stats/attacks) |

---

## Channeling (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Divine Grace | 0(self) | caster | 1min/lvl | N | +15 Charisma vs non-hostile |
| 2 | Holy Aura | 0(self) | caster | 1min/lvl | N | +10 DEF |
| 3 | Stunning Glare* | 15m | 1 target | - | Y | Target Stunned |
| 4 | Holy Terror* | 15m | 1 target | 1rnd/10fail | Y | Undead/servant Frightened of caster |
| 5 | Transferral | 0(self) | 20m radius | 1rnd/lvl | N | Next spell cast originates from willing ally |
| 6 | Weight of Conscience* | 15m | 1 target | 1rnd/10fail | Y | Target Weary |
| 7 | Spiritual Tether* | 15m | 1 target | 1rnd/10fail | Y | Target Held |
| 8 | Spirit Wrack* | 15m | 1 target | 1rnd/10fail | Y | Target Incapacitated |
| 9 | Holy Shout* | 0(self) | 6m radius | 1rnd | Y | Enemies: WSR or Stunned. Allies: +10 attacks/skills |
| 10 | Punishment Divine | 0(self) | 10m radius | 1rnd/lvl | N | Lightning strikes random enemy each round (Bolt table, no max). Outdoor only. |

---

## Chanting (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Chant of Courage | 0(self) | 3m radius | C | N | +10 SR vs fear; allies can re-roll fear SRs |
| 2 | Endure the Elements | 0(touch) | 1 target | 1min/lvl | N | Protection from weather, +20 DEF/SR vs Fire/Frost |
| 3 | Nature's Blessing | 0(touch) | 1 target | 1min/lvl | N | +10 DEF and SR |
| 4 | Suppress Curse | 3m | 1 target | 1hr/lvl | Y | Curse makes WSR or suppressed for duration |
| 5 | Repel Magic | 0(self) | 3m radius | C | Y | Spells targeting area must pass WSR or fail |
| 6 | Sanctuary | 0(self) | 3m radius | C | Y | +10 DEF/SR; evil creatures must SR to enter |
| 7 | Dispel Magic | 20m | 1 target | P | Y | Active spell/effect makes WSR or dispelled |
| 8 | Break Curse | 3m | 1 target | P | Y | Curse makes WSR or permanently broken |
| 9 | Nature's Cradle | 0(touch) | 1 camp | 1day | N | Camping area = Normal Terrain, group size halved |
| 10 | Nature's Shield* | 0(self) | caster | - | N | Automatically avoid one non-magical attack |

---

## Cleansing (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Cleanse Food & Water | 3m | 1m radius | - | N | Remove poison/disease from food/drink |
| 2 | Detect Poison | 0(self) | 1m radius | C | N | Sense poison presence |
| 3 | Resist Disease | 0(touch) | 1 target | 10min/lvl | N | +20 SR vs disease |
| 4 | Resist Poison | 0(touch) | 1 target | 10min/lvl | N | +20 SR vs poison |
| 5 | Cleanse Wound | 0(touch) | 1 target | - | N | Turn Lingering Injury into normal |
| 6 | Cure Disease | 0(touch) | 1 target | - | N | Remove one disease (doesn't heal prior damage) |
| 7 | Cure Poison | 0(touch) | 1 target | - | N | Remove one poison (doesn't heal prior damage) |
| 8 | Purge Evil | 20m | 1 target | - | Y | Corporeal undead: WSR or destroyed |
| 9 | Cleanse the Soil | 0(self) | 10m radius/lvl | - | N | Remove poison/disease/blight from area |
| 10 | Cleanse the Mind | 0(touch) | 1 target | - | N | Heal one mental disease/affliction |

---

## Commanding Presence (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Commander's Authority | 0(self) | caster | 1min/lvl | N | +10 Charisma |
| 2 | Rallying Warcry* | 0(self) | 6m radius | - | N | Allies can re-roll fear SRs immediately |
| 3 | Formation Fighting* | 0(self) | 6m radius | 1rnd/lvl | N | +5 DEF/Attack if adjacent to ally |
| 4 | Taunt* | 20m | 1 target | 1rnd/5fail | Y | -50 to attacks not targeting caster |
| 5 | Intimidating Stance* | 0(self) | 1.5m radius | 1rnd/5fail | Y | Engaged enemies must Parry caster with half CMB |
| 6 | Rapid Deployment* | 6m | 1 target | - | N | Ally moves half MR as Free Action |
| 7 | Invigorating Warcry* | 0(self) | 6m radius | 1rnd/lvl | N | Allies ignore Weary and Exhaustion |
| 8 | Order* | 6m | 1 target | C | Y | Target follows single order (ends if harmful/alien) |
| 9 | Call to Arms* | 6m | 1 target | - | N | Ally makes free attack using caster's Commanding Presence bonus |
| 10 | Roaring Warcry* | 0(self) | 6m radius | 1rnd/lvl | N | Allies immune to fear and harmful mind effects |

---

## Communion (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Question Animal | 0(self) | 6m radius | C | N | Summon animal, ask one question about past events in area |
| 2 | Anticipate* | 15m | 1 target | 1rnd/lvl | N | +20 DEF vs one enemy's attacks |
| 3 | Intuition | 0(self) | 15m radius | - | N | Learn one fact about subject (vague or misleading) |
| 4 | Augury | 0(self) | caster | - | N | Reveal type of hidden travel Hazard on chosen path |
| 5 | Divine Vision | 0(self) | caster | 4hrs | N | Trance; vision of present location/events of named subject |
| 6 | Speak with the Dead | 3m | 1 target | - | N | Shade answers one question (what killed, last saw, identity, actions before death) |
| 7 | Omen | 15m | 1 target | 1min/lvl | N | Good Omen: first Success → Outstanding. Bad Omen: first Failure → Critical Failure |
| 8 | Divination | 0(self) | caster | 4hrs | N | Trance; vision of future (clue location, greatest danger, most precious ally) |
| 9 | Doom | 20m | 1 target | 1rnd/lvl | Y | First critical suffered = automatically Lethal |
| 10 | Commune with Spirits | 0(self) | caster | - | N | One yes/no question, GM answers truthfully. Always causes Resonance. |

---

## Detections (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Detect Magic | 0(self) | 15m radius | C | N | Sense magic presence in area |
| 2 | Comprehend Languages | 0(self) | caster | C | N | Understand basic meaning of foreign text |
| 3 | Sense Darkness | 20m | 1 target | - | N | Learn if target is servant of Darkmaster/cursed/evil-spelled |
| 4 | Sense Invisible | 0(self) | 15m radius | C | N | Detect invisible creatures (attacks at -50 unless warped) |
| 5 | Detect Traps | 0(self) | 15m radius | C | N | Sense trap presence and position |
| 6 | Aura Reading | 20m | 1 target | - | N | Learn one of target's Passions |
| 7 | Locate | 30m | 1 target | C | N | Know exact position/route to familiar item/location |
| 8 | Pierce the Veil | 0(self) | 15m radius | C | N | See through illusions, disguises, darkness, concealment |
| 9 | Precognition | 0(self) | caster | 1min/lvl | N | Auto-pass Assessment, can't be Surprised, always act first |
| 10 | Legendary Tales | 0(self) | caster | - | N | Learn significant legends about any item/place/creature/person |

---

## Earth Mould (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Weaken | 3m | 1 target | 1rnd/lvl | N | Metal/stone item (<3kg) becomes brittle (10%/min break chance) |
| 2 | Harrow | 30m | 3m×3m | P | N | Loosen earth; Acrobatics +0 or Prone |
| 3 | Power Crystal | 0(self) | 1 crystal | 24hr | N | Create crystal containing 1 MP |
| 4 | Earthwall | 30m | 3m×3m×15cm | 1rnd/lvl | N | Wall of packed earth |
| 5 | Rock Shards | 0(self) | 3m cone | - | N | Area Attack, Pierce, 130 max |
| 6 | Fissure | 30m | 3m×3m×3m | 1min/lvl | N | Create pit; Acrobatics +0 or fall in |
| 7 | Pulverize | 30m | 3m³ | P | Y | Reduce stone/earth to dust |
| 8 | The Riven Earth | 30m | 3m radius | - | N | Area Attack, Impact, no max. Acrobatics -10 or Prone |
| 9 | Stone to Mud | 30m | 3m×3m×3m | P | N | Transform stone to mud; Athletics -10 or sink (Held) |
| 10 | Earthquake | 30m | 10m radius | 1rnd/lvl | N | Acrobatics -20/rnd or Prone. Structures collapse (Grievous Impact). |

---

## Eldritch Fire (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Ignite | 0(touch) | 1 target | - | N | Light flammable object or Superficial Fire Crit to living |
| 2 | Cauterization | 0(touch) | 1 wound | P | N | Stop Light Bleeding (2 damage per Bleed point healed) |
| 3 | Incandescence | 3m | 30cm cube/lvl | C | N | Heat inorganic object; Superficial Fire Crit/rnd to holder |
| 4 | Wall of Fire | 30m | 3m×3m×15cm | 1rnd/lvl | N | Opaque fire wall; Superficial Fire Crit to pass through |
| 5 | Flameshield | 3m | 1 target | 1min/lvl | N | Halve fire damage, -1 Fire Crit severity |
| 6 | Fire Bolt | 30m | 1 target | - | N | Bolt Attack, Fire, 150 max |
| 7 | Flaming Weapon | 0(touch) | 1 weapon | 1rnd/lvl | N | Weapon deals extra Moderate Fire Crit |
| 8 | Fireball | 30m | 3m radius | - | N | Area Attack, Fire, no max |
| 9 | Immolation | 0(self) | caster | 1rnd/lvl | N | Immune to fire; Light Fire Crit/rnd to all engaged |
| 10 | Firestorm | 30m | 6m radius | 1rnd/lvl | N | 3m high flames; escalating Fire Crit/rnd (Sup→Lethal); -30 Perception; Assessment or Stunned |

---

## Eldritch Frost (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Freezing Touch | 0(touch) | 1 target | - | N | Freeze liquid (30cc/lvl), chill objects, Superficial Frost Crit to living |
| 2 | Frostbite | 30m | 1 target | 1rnd/5fail | Y | -20 attacks/skills (warpable to -100 = Incapacitated) |
| 3 | Winter's Chill | 30m | 3m radius | 1min/lvl | N | Extinguish flames, rime = Arduous Terrain, -20 Fire attacks |
| 4 | Frostwall | 30m | 3m×3m×15cm | 1rnd/lvl | N | Cold wall; Superficial Frost Crit to pass through |
| 5 | Winterheart | 3m | 1 target | 1min/lvl | N | Ignore natural cold, halve frost damage, -1 Frost Crit severity |
| 6 | Frost Bolt | 30m | 1 target | - | N | Bolt Attack, Frost, 140 max |
| 7 | Cold Ball | 30m | 6m radius | - | N | Area Attack, Frost, 130 max |
| 8 | Ice Wall | 30m | 3m×3m×15cm | P | N | Permanent ice wall; destroyed by 100+ fire damage |
| 9 | Cone of Cold | 0(self) | 15m×3m cone | - | N | Area Attack, Frost, 140 max |
| 10 | Rage of the Winter | 0(self) | 6m radius | 1rnd/lvl | N | Moderate Frost Crit/rnd; TSR or Held; moves with caster |

---

## Eldritch Hand (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Poltergeist | 30m | 1 target | 1min/lvl | Y | Shake item (<2kg); WSR or drop |
| 2 | Magic Shield* | 0(self) | caster | 1min/lvl | N | +25 DEF from chosen side (no hand needed) |
| 3 | Burden | 30m | 1 target | 1min/lvl | Y | Increase Encumbrance Level by 1 |
| 4 | Telekinesis | 30m | 1 target | C | Y | Move item/creature (<5kg) in any direction |
| 5 | Deflect* | 30m | 1 attack | - | N | -100 to non-magic missile Attack Roll |
| 6 | True Aim* | 0(touch) | 1 attack | - | N | +50 to next ranged Attack Roll this round |
| 7 | Blade Ward* | 30m | 1 attack | - | N | -100 to one visible melee Attack Roll |
| 8 | Eldritch Push | 20m | 1 target | - | Y | Light Impact Crit, push 5m, Prone |
| 9 | Shatter | 30m | 1 target | - | Y | Inorganic item (<5kg) explodes; Moderate Impact to wielder, Superficial to 3m |
| 10 | Crushing Force | 30m | 1 target | 1rnd/lvl | Y | Held + Prone + Light Impact Crit/rnd; WSR each round to end |

---

## Eldritch Might (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Sharp Ears | 3m | 1 target | 10min/lvl | N | +30 hearing Perception |
| 2 | Adroitness | 3m | 1 target | 10min/lvl | N | +30 Acrobatics |
| 3 | Dark Sight | 3m | 1 target | 10min/lvl | N | 30m Dim Light, 3m Total Darkness |
| 4 | Haste | 3m | 1 target | 1rnd | N | Full Actions as Half, Half as Free. -30 after expiry. |
| 5 | Resist Pain* | 3m | 1 target | 1min/lvl | N | Gain temp HPs = 25% Total HPs. Lost when spell ends. |
| 6 | Mystical Breath | 3m | 1 target | 10min/lvl | N | Don't need to breathe |
| 7 | Resist Poison | 3m | 1 target | 10min/lvl | N | Immune to poison effects (doesn't purge existing) |
| 8 | Strength Within* | 3m | 1 target | 1rnd | N | +30 BRN, double melee Base Damage |
| 9 | Eldritch Armor | 3m | 1 target | 1rnd/lvl | N | Bare skin = Light Armor (Rigid) |
| 10 | Heart of Steel* | 3m | 1 target | 1min/lvl | N | Delay first Critical Strike effects until spell ends |

---

## Eldritch Movements (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Jump* | 30m | 1 target | 1rnd | N | Jump 15m horizontal or 6m vertical as Full Action |
| 2 | Slow Fall* | 30m | 1 target | - | N | Negate fall up to 6m/lvl |
| 3 | Clinging | 30m | 1 target | 1min/lvl | N | Climb any surface at half MR, no roll |
| 4 | Levitate | 3m | 1 target | 1min/lvl | N | Move vertically 3m/rnd |
| 5 | Blink | 3m | 1 target | - | Y | Teleport to visible unoccupied space within 10m (no barriers) |
| 6 | Swim | 3m | 1 target | 10min/lvl | N | Swim at normal MR, ignore currents, water = Normal Terrain |
| 7 | Ride the Sky | 3m | 1 target | 1min/lvl | N | Fly at MR 20 |
| 8 | Eldritch Portal | 0(touch) | 1 surface | 1rnd/lvl | N | Create passage through solid surface <=1m thick |
| 9 | Mystical Step | 0(self) | 30m | - | N | Teleport anywhere within 30m (Perception -30 or Stunned if blind destination) |
| 10 | Journey Through Dark | 0(self) | 10m radius | Special | N | Transport self + companions through Annwn to destination within 10km/lvl. Roll on Dark Travel table. |

---

## Eldritch Secrets (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Sense Secrets | 0(self) | 6m radius | C | N | Know if something/someone is hidden in area |
| 2 | Secret Sign | 0(touch) | 1 target | 1hr/lvl | N | Write invisible word/symbol (visible to chosen person/kin) |
| 3 | Forgery* | 20m | 1 target | 10min/lvl | N | Target believes caster carries identifying item (badge, letter) |
| 4 | Hand of Glory | 0(self) | 6m radius | C | N | -30 to find hidden things; mind-reading spells fail in area |
| 5 | Magehunter* | 20m | 1 target | C | N | Know direction/distance of spell's caster |
| 6 | Secrets of the Runes | 0(touch) | 1 target | - | N | Learn purpose of magic text; +20 to cast from scroll |
| 7 | Reveal Secret | 30m | 1 target | C | N | Know exact position/route to hidden creature/object/location |
| 8 | Secret Self | 0(self) | caster | 10min/lvl | N | Undetectable by magic. Ends if cast another spell. |
| 9 | Past and Future Secrets | 0(touch) | 1 target | - | Y | Learn one fact: what's hidden, a Passion, how subject helps caster, main weakness |
| 10 | Thousand Faces | 0(self) | caster | P | N | Permanently change appearance (±20% size, different kin; no stats change) |

---

## Eldritch Storm (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Breeze | 0(self) | 6m cone | C | N | 30km/h wind; -30 ranged through area |
| 2 | Thunderbolt | 30m | 1 target | - | N | Bolt Attack, Lightning, 110 max |
| 3 | Stormwall | 30m | 3m×3m×15cm | 1rnd/lvl | N | Wind wall; -50 attacks through; Athletics -20 or pushed back |
| 4 | Thundercloud | 30m | 1.5m radius | C | N | Light Lightning Crit/rnd to creatures ending round in area |
| 5 | Becalm | 30m | 3m radius | C | N | Stop wind <=50km/h or reduce stronger by 50 |
| 6 | Wind Armor | 3m | 1 target | 1min/lvl | N | +20 DEF and Acrobatics |
| 7 | Stormbringer | 0(touch) | 1 weapon | 1rnd/lvl | N | Weapon deals extra Moderate Lightning Crit |
| 8 | Lightning Ball | 30m | 3m radius | - | N | Area Attack, Lightning, 150 max. Double vs metal armor. |
| 9 | Hurricane | 0(self) | 6m radius | 1rnd/lvl | N | Wall of wind: -100 attacks through; Moderate Impact + Athletics -30 or pushed back + Prone |
| 10 | Lightning Bolt | 30m | 1 target | - | N | Bolt Attack, Lightning, no max. Moderate+ adds Impact Crit. Lethal adds Superficial Fire. Double vs metal. |

---

## Eldritch Tide (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Conjure Water | 0(touch) | 10lt/lvl | P | N | Spring of clean water (10lt/min) |
| 2 | Fog | 30m | 3m/lvl radius | P | N | -50 ranged and vision-Perception in area |
| 3 | Waterwall | 30m | 3m×3m×15cm | 1rnd/lvl | N | -80 attacks through; Full Action to pass; blocks incorporeal undead |
| 4 | Water Blast | 30m | 1 target | - | N | Bolt Attack, Impact, 120 max |
| 5 | Downpour | 30m | 6m radius | 1rnd/lvl | N | Extinguish fires, earth→mud (Arduous), -20 ranged/fire attacks |
| 6 | Part Waters | 3m | 30m³ | C | N | Create dry corridor through water |
| 7 | Rushing Wave | 30m | 3m×3m×6m | - | Y | TSR or Prone + pushed out of area |
| 8 | Whirlpool | 30m | 6m radius | - | N | Area Attack, Impact, 130 max. Crit in water: Athletics -20 or Stunned + pulled 1.5m to center + Prone |
| 9 | Control Waters | 0(self) | 10m radius | C | N | Control flow direction, raise/lower level by 30cm/lvl |
| 10 | Tidal Wave | 30m | 10m×10m×10m | - | N | Area Attack, Impact, no max. Crit: Prone + Athletics -20 or pushed out |

---

## Eldritch Visions (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Beast Sight | 30m | 1 target | C | N | See through animal's eyes |
| 2 | Sense Thoughts* | 0(self) | 6m radius | C | N | Know number and rough position of sentient beings |
| 3 | Clairaudience | 10m | 1 target | C | N | Hear from chosen point |
| 4 | Prescience* | 30m | 1 attack | - | N | +50 DEF vs one sentient being's attack |
| 5 | Far Sight | 10m | 1 target | C | N | See from chosen point |
| 6 | Mind Speech | 30m | 1 target | C | N | Silent telepathic conversation (no language barrier) |
| 7 | Scrying | 0(self) | caster | C | N | Vision of known person/item/place (Arcana roll; range 1km/lvl) |
| 8 | Mind Link | 0(touch) | 1 target | P | Y | Attune mind; ignore Range limits for this lore's 1-target spells on linked creature |
| 9 | Mindtraveller | 0(self) | caster | 1min/lvl | N | Consciousness leaves body (invisible, intangible, MR 30, passes through matter) |
| 10 | Mind Reading | 3m | 1 target | 1rnd/10fail | Y | Read thoughts; each round learn one Passion or ask one yes/no question |

---

## Eldritch Wards (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Alarm Ward | 0(touch) | 3m radius | 1hr/lvl | N | Glyph glows when sentient creature enters; caster knows |
| 2 | Magic Lock | 0(touch) | 1 target | 1min/lvl | N | Lock door/container magically |
| 3 | Suppress Magic* | 20m | 1 spell | 1rnd | Y | Active spell WSR or suppressed 1 round |
| 4 | Counterspell* | 20m | 1 spell | - | Y | Neutralize spell cast same Phase before it resolves |
| 5 | Dispel Magic | 20m | 1 target | - | Y | Active spell WSR or permanently dispelled |
| 6 | Spell Ward | 3m | 1 target | 1min/lvl | N | +20 SR vs magic and DEF vs Bolt/Area spells |
| 7 | Suppress Curse | 3m | 1 target | 1hr/lvl | Y | Curse WSR or suppressed for duration |
| 8 | Eldritch Wall | 30m | 3m×3m×15cm | 1rnd/lvl | N | Light wall; blocks undead/summoned; spells must SR (Weave as Level) or cancelled. 20 Weaves capacity. |
| 9 | Glyph of Warding | 0(touch) | 6m radius | varies | N | Warding glyph; trigger condition → Light Impact Crit to all in area |
| 10 | Reverse Spell* | 20m | 1 spell | - | Y | Deflect 1-target spell back to its caster |

---

## Enchantment (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Wizard's Staff | 0(touch) | 1 target | P | N | Staff becomes magical weapon; +5 Spell Casting while held |
| 2 | Rune of Warning | 0(touch) | 10m radius | 10min/lvl | N | Glow if creature of Darkness enters area |
| 3 | Spell Storing | 0(self) | 1 spell | varies | N | Store next spell in Staff; release later as Instantaneous Half Action |
| 4 | Rune of Good Luck | 0(touch) | 1 target | 10min/lvl | N | Item grants +10 to one selected Skill |
| 5 | Runes of Power | 0(touch) | 1 target | varies | N | Inscribe 1st/2nd Weave spell on material (single-use Rune of Power) |
| 6 | Rune of Archery | 0(touch) | 1 target | 1rnd/lvl | N | Bow reloads as Free Action |
| 7 | Rune of Parrying | 0(touch) | 1 target | 1rnd/lvl | N | Parry applies to all melee attacks regardless of facing |
| 8 | Rune of Awe | 0(touch) | 1 target | 1rnd/lvl | N | +15 DEF/Charisma; Level 3 or lower can't attack wearer |
| 9 | Thaumaturgy | 0(touch) | 1 target | 1min/lvl | N | Embed 4th Weave or lower self-range spell in item (affects carrier) |
| 10 | Rune of Victory | 0(touch) | 1 target | 1rnd/lvl | N | Weapon: +1 Length, never Fumbles, ignore all Crit reduction |

---

## Healing (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Heal | 0(touch) | 1 target | - | N | Recover 10% Total HPs over 1 minute |
| 2 | Clotting | 0(touch) | 1 wound | - | N | Reduce Bleeding by 1 HP/rnd (0 = healed) |
| 3 | Unstun* | 6m | 1 target | - | N | Remove Stunned immediately |
| 4 | Mend Injuries | 0(touch) | 1 injury | - | N | Each rest day counts as 2 for Minor Injury recovery |
| 5 | Recover* | 0(touch) | 1 target | C | N | Recover 1 HP/rnd. Incapacitated can self-cast + Concentrate. |
| 6 | Clarity* | 0(touch) | 1 target | - | N | Wake from sleep/Stunned/Incapacitated (not 0 HP). Self-castable. |
| 7 | Rejoining | 0(touch) | 1 injury | - | N | Reattach severed limb (becomes Crippling Injury, heals normally) |
| 8 | Heal Injuries | 0(touch) | 1 injury | - | N | Reduce Injury severity by one step immediately |
| 9 | Suspended Animation | 0(touch) | 1 target | 1day/lvl | N | Trance: recover 5 HP/rnd, halve Injury time, stop Bleeding/Dying/poison/disease |
| 10 | Regenerate | 0(touch) | 1 injury | - | N | Replace lost limb/organ (becomes Crippling Injury) |

---

## Heroic Defense (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Battle Awareness* | 0(self) | caster | 1rnd/lvl | N | +20 Assessment Rolls |
| 2 | Mystical Poise | 0(self) | caster | 1min/lvl | N | +10 Armor Skill |
| 3 | Stoneskin* | 0(self) | caster | 1rnd/lvl | N | Chosen body area treated as armored for Crits |
| 4 | Impenetrable Defense* | 0(self) | caster | 1rnd/lvl | N | +25 DEF if Parrying >=50% CMB |
| 5 | Defender* | 5m | 1 attack | - | N | Intercept attack on ally; attack targets caster instead |
| 6 | Unshakable* | 0(self) | caster | 1rnd/lvl | N | Cannot be Stunned |
| 7 | Shield Block* | 0(self) | caster | 1rnd | N | Redirect first Crit to shield arm; may ignore Injury (shield destroyed) |
| 8 | Unassailable* | 0(self) | caster | 1rnd/lvl | N | No positional bonuses against caster; Parry vs all engaged |
| 9 | Riposte* | 0(self) | caster | 1rnd | N | Each melee miss vs caster → free shield bash (Blunt table, 140 max, use Heroic Defense bonus) |
| 10 | Defiance* | 0(self) | caster | 1rnd/lvl | N | No Bleed, no Stun, no Held, no Prone; ignore Weary/Exhaustion. Ends if move >half MR in round. |

---

## Illusions (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Phantom Sound | 30m | 3m radius | 10min/lvl | N | Illusory sound (whisper to conversation volume) |
| 2 | Chameleon | 3m | 1 target | 24hrs | N | Static creature/object very hard to see (WSR if actively searching) |
| 3 | Mirage | 30m | 3m radius | 10min/lvl | N | Static visual-only illusion |
| 4 | Invisibility | 3m | 1 target | 24hrs | N | Invisible. Ends if attack/cast/struck. |
| 5 | Decoy* | 0(self) | caster | 1rnd/lvl | N | Create decoy; attacks have equal chance hitting real vs decoy |
| 6 | Disguise | 3m | 1 target | 1hr/lvl | N | Change appearance (±20% size, different kin; sight+hearing only) |
| 7 | Illusion | 30m | 3m radius | 10min/lvl | N | Sight+hearing+smell illusion. Can move with Concentration. Intangible. |
| 8 | Maddening Wail | 0(self) | 15m radius | 1rnd/lvl | Y | WSR each Assessment or Stunned; animals flee |
| 9 | Crippling Gaze | 20m | 1 target | 1rnd/5fail | Y | Target believes Grievous Crit happened (effects for duration; "death" = unconscious) |
| 10 | Cloud Scrying | 30m | 6m radius | 10min/lvl | N | Area immune to divination/sense-enhancing magic |

---

## Lore of Nature (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Sense Darkness | 20m | 1 target | - | N | Detect if target is Darkmaster servant/cursed/evil-spelled |
| 2 | Sense Life | 0(self) | 30m radius | C | N | Sense living beings (count, proximity, plant vs creature) |
| 3 | Read the Wind | 0(self) | caster | 10min/lvl | N | +25 vs weather Hazards |
| 4 | Detect Magic | 0(self) | 15m radius | C | N | Sense magic presence |
| 5 | Herb Lore | 0(self) | caster | 1hr/lvl | N | No halved movement when searching herbs; +20 Nature for herbs |
| 6 | Spirit Guide | 3m | 1 spirit | 24hrs | N | Summon guide spirit to lead to known location (avoids natural hazards) |
| 7 | Hunter's Lore | 20m | 1 target | - | N | Identify creature type, capabilities, weaknesses |
| 8 | Rumors of the Earth | 30m | 1 target | C | N | Know exact position of familiar/tracked creature |
| 9 | Spirit Watcher | 10m | 30m radius | 1hr/lvl | N | Summon spirit to watch area; warns of movement/spirits/undead/Darkness |
| 10 | Wisdom of Yore | 0(self) | caster | - | N | Learn legends about natural location/spirit/curse/blessed object |

---

## Master of Animals (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Animal Sleep | 30m | 1 animal | 1min/lvl | Y | Animal sleeps (wakes if harmed/shaken) |
| 2 | Speak with Animals | 0(self) | caster | 1min/lvl | N | Communicate with animals |
| 3 | Animal Companion | 3m | 1 target | P | N | Bond with animal (follows, obeys, basic communication) |
| 4 | Summon Animals | 30m | 1 animal | 1min | N | Summon random animal <=Level 3 from area |
| 5 | Beast Mastery | 30m | 1 animal | C | Y | Control animal's actions |
| 6 | Hold Beasts | 30m | 1 animal | 1rnd/5fail | Y | Animal Held |
| 7 | Eyes of the Forest | 0(self) | caster | 1hr/lvl | N | +20 Wandering (Pathfinding), +30 evasion rolls |
| 8 | Nature's Friend | 0(self) | 15m radius | C | N | Animals in area friendly (ends if attacked) |
| 9 | Animal Healing | 0(touch) | 1 animal | - | N | Animal recovers from all disease/wound/injury in 1d10 days |
| 10 | Plague of Insects | 30m | 6m radius | 1rnd/lvl | N | 2d10 damage/rnd (unless Full Action swatting); -30 all actions in area |

---

## Master of Plants (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Hinder | 30m | 10m radius | 1rnd/lvl | N | Vegetation = Arduous Terrain for enemies |
| 2 | Speak with Plants | 0(self) | caster | 1min/lvl | N | Communicate with plants/trees |
| 3 | Herbal Remedy | 0(touch) | 1 herb | P | N | Double one herb dose's effects |
| 4 | Safe Passage | 0(self) | 30m radius | 1hr/lvl | N | Thick forest/bog/jungle = Rough; woods = Normal |
| 5 | Locate Plant | 0(self) | 1.5km radius | - | N | Know exact position/route to specific plant/herb |
| 6 | Purify Plant | 3m | 1 plant | - | N | Remove poison/disease/side effects from plant |
| 7 | Nature's Bounty | 0(touch) | 1.5km radius | 1day | N | +50 foraging; double food gathered |
| 8 | Miraculous Growth | 0(touch) | 1 target | - | N | Restore dead plant or grow from seed in 1d10 rounds |
| 9 | Defoliate | 30m | 6m radius | - | Y | Destroy all vegetation (sentient plants get TSR) |
| 10 | Awaken Tree | 3m | 1 tree | 1min/lvl | N | Animate tree as Awakened Tree (obeys caster) |

---

## Mind Control (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Sleep | 30m | 3m radius | 1min/lvl | Y | Up to 4 Levels of humanoids fall asleep |
| 2 | Charm | 30m | 1 target | 1hr/lvl | Y | Target sees caster as friend (ends if harmed) |
| 3 | Fear | 20m | 1 target | 1rnd/lvl | Y | Target Frightened of caster |
| 4 | Daze | 30m | 1 target | 1rnd/5fail | Y | Cannot initiate new actions; auto-fail Assessment |
| 5 | Hostility | 30m | 1 target | C | Y | Target attacks nearest living being in rage (no Parry) |
| 6 | Suggestion | 3m | 1 target | 1hr/lvl | Y | Target follows suggested action (not harmful) |
| 7 | Hold Kin | 30m | 1 target | C | Y | Humanoid Held |
| 8 | Domination | 20m | 1 target | 10min/lvl | Y | Humanoid obeys caster (ends if harmful command) |
| 9 | Charm Monsters | 30m | 1 target | 1hr/lvl | Y | Any creature sees caster as friend |
| 10 | Geas | 3m | 1 target | 1day/lvl | Y | Target must complete task or suffer Weary + 10% HPs/day |

---

## Miracles (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Fasting | 0(self) | caster | 1day | N | No Exhaustion from not eating/drinking (doesn't remove existing) |
| 2 | Sacred Branch | 0(touch) | 1 target | P | N | Branch grants +5 DEF and SR while held |
| 3 | Conjure Water | 0(touch) | 10lt/lvl | P | N | Spring of clean water |
| 4 | Mending | 0(touch) | 1 target | - | N | Repair one break in non-magic item (<=5kg) |
| 5 | Multiplication | 0(touch) | 1 target | 10min/lvl | N | Create wooden duplicate of item (<=5kg, no magic properties) |
| 6 | Spirit Feast | 0(self) | caster | - | N | Spirits bring food for caster + 3 companions |
| 7 | Sacred Steel* | 0(touch) | 1 target | 1rnd/lvl | N | Sacred Branch → weapon (Fire or Lightning damage) |
| 8 | Shield-Maiden | 3m | 1 spirit | 1hr/lvl | N | Summon Shield-Maiden spirit to carry out task |
| 9 | Control Weather | 0(self) | 10km radius | 1hr/lvl | N | Remove or create weather phenomenon (1hr transition). Outdoor only. |
| 10 | True Believer | 0(self) | caster | 1rnd | N | Immune to damage and Critical Strikes this round |

---

## Movements of Nature (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Wanderer's Stride | 0(self) | caster | 10min/lvl | N | Rough/Arduous natural terrain = Normal |
| 2 | Squirrel's Step | 0(self) | caster | 1min/lvl | N | Walk on tree branches as Normal Terrain |
| 3 | Wolf's Speed | 0(self) | caster | 10min/lvl | N | Double MR, Sprint without tiring |
| 4 | Otter's Breath | 0(self) | caster | 1min/lvl | N | Breathe underwater |
| 5 | Water Walk | 0(self) | caster | 1min/lvl | N | Walk on calm water; rough water = Arduous |
| 6 | Burrowing | 0(self) | caster | 1min/lvl | N | Burrow through soft earth at half MR |
| 7 | Spider Climb | 0(self) | caster | 1min/lvl | N | Walk on vertical/horizontal surfaces |
| 8 | One with Nature | 0(touch) | caster | 1rnd/lvl | N | Body absorbed into organic material; perceive surroundings; emerge within 50cm |
| 9 | Hawk Flight | 0(self) | caster | 1min/lvl | N | Fly at normal MR |
| 10 | Ghostwalk | 0(self) | caster | 1min/lvl | N | Pass through wood/earth/stone at normal MR. Ejected if spell ends inside. |

---

## Nature's Path (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Pathsight | 0(touch) | 1 path | - | N | Vision of path's origin and destination |
| 2 | Sense Traps | 0(self) | 3m radius | C | N | Sense trap presence (not position/nature) |
| 3 | Huntsmanship | 0(self) | caster | 1min/lvl | N | +20 Hunting and ranged attacks vs beasts |
| 4 | Find the Path | 0(self) | caster | 1hr/lvl | N | No halved movement when Pathfinding; +20 Wandering |
| 5 | Blessed Path | 0(self) | caster | 1hr/lvl | N | No halved movement when Foraging; double food gathered |
| 6 | Find Shelter | 0(self) | caster | 1hr/lvl | N | +20 Camping Rolls and weather shelter rolls |
| 7 | Pass Without Trace | 3m | 1 target | 1min/lvl | N | No tracks; -100 to Hunting rolls to follow |
| 8 | Sense Ambush | 0(self) | caster | 1min/lvl | N | Cannot be Surprised |
| 9 | Eyes of the Hunter | 0(touch) | 15m radius | - | N | Mental image of every creature that passed through in 1hr/lvl |
| 10 | The Hidden Path | 0(self) | caster | 1day | N | Auto-evade encounters; double daily movement (solo or with others under same spell) |

---

## Skirmishing Mastery (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Swing* | 0(self) | caster | 1rnd | N | Jump 3m, grab object, swing, land within 6m |
| 2 | Marksmanship* | 0(self) | caster | 1rnd | N | +30 next ranged Attack Roll |
| 3 | Dead Eye | 0(self) | caster | 1rnd/lvl | N | Treat Medium as Base Range, Long as Medium, Extreme as Long |
| 4 | Pinning Shot* | 0(self) | caster | 1rnd | Y | Next ranged hit: target WSR or can't move next Move Phase |
| 5 | Evasive Maneuver* | 30m | 1 attack | 1rnd | N | +50 DEF vs one non-magic attack; then jump 3m free |
| 6 | Ricochet* | 0(self) | caster | 1rnd | N | Next ranged attack can't be Parried; ignores shield/Partial Cover |
| 7 | Caltrops | 0(touch) | 1.5m radius | P | N | Hidden trap (Very Hard to detect); Light Impact/Cut/Pierce Crit to first creature entering |
| 8 | Blinding Shot* | 0(self) | caster | 1rnd | Y | Next ranged hit: target TSR or blinded until next Assessment |
| 9 | Sharpshooting* | 0(self) | caster | 1rnd | N | +5 to all ranged Crit Rolls this round |
| 10 | Rain of Arrows | 30m | 6m radius | - | N | Area Attack, Pierce, 150 max |

---

## Soul Soothing (WSD)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Sustain Life | 3m | 1 target | 1min/lvl | N | Stop Dying condition temporarily |
| 2 | Tranquillity | 30m | 1 target | 1min/lvl | Y | Target peaceful, won't attack (can Parry; ends if attacked) |
| 3 | Dispel Fear | 20m | 1 target | 1rnd/lvl | N | Immune to fear |
| 4 | Banish Fatigue | 20m | 1 target | 1min/lvl | N | Ignore Weary effects |
| 5 | Restoration | 0(touch) | 1 target | - | N | Heal up to 25 Soul Damage (won't revive dead; prevents undead rising) |
| 6 | Inspire* | 0(self) | 6m radius | 1rnd/lvl | N | Allies: +15 all Attack/Skill Rolls |
| 7 | Peace of Mind | 3m | 1 target | - | Y | Caster makes SR vs strongest mind effect on target; success = all mind effects dispelled |
| 8 | Break Curse | 3m | 1 target | - | Y | Curse WSR or permanently broken |
| 9 | Exorcism | 20m | 1 target | 1day/10fail | Y | Demonic/incorporeal entity: WSR or banished to Dark |
| 10 | The Secret Flame | 0(self) | caster | 1rnd/lvl | N | Immune Soul Damage/fear/mind effects; ignore Weary; +15 Attack/SR. Darkmaster servants: WSR or flee. |

---

## Sounds & Lights (WIT)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Magic Light | 0(touch) | 3m radius | 1hr/lvl | N | Faint illumination |
| 2 | Tongues | 20m | 1 target | C | N | Speak (not understand) target's language |
| 3 | Control Sound | 5m | 5m radius | C | N | Silence or amplify (×3) sounds; ±25 Stealth |
| 4 | Shroud of Darkness | 3m | 1 target | 10min/lvl | N | Target invisible in Dark; +50 Stealth, +20 DEF in Dim |
| 5 | Enthralling Lights | 30m | 6m radius | 1rnd/lvl | Y | WSR or fascinated (can't act until attacked or new SR) |
| 6 | Darkness | 0(touch) | 5m radius | 10min/lvl | N | Total Darkness; snuffs mundane/lower-Weave magic light |
| 7 | Deafening Sound | 30m | 1 target | 1hr | Y | TSR or deaf |
| 8 | Blinding Light | 30m | 3m radius | - | Y | Blinded 1rnd/10fail |
| 9 | Silent Voice | 0(self) | caster | 1rnd/lvl | N | Cast spells without speaking |
| 10 | Starlight | 10m | 6m radius | 10min/lvl | N | Bright silver light; counts as daylight vs Darkmaster servants; dispels magical darkness |

---

## Spell Songs (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Song of Tranquillity | 15m | 1 target | C | Y | Target peaceful while hearing (can Parry; SR if attacked) |
| 2 | Song of Courage | 15m | 1 target | C | N | Target immune to fear |
| 3 | Haunting Melody | 15m | 1 target | C | Y | Target Frightened of caster |
| 4 | Enchanted Lullaby | 15m | 1 target | C | Y | Target falls asleep (SR if harmed/loud noise) |
| 5 | Enthralling Song | 15m | 1 target | C | Y | Target sees caster as friend (lasts 10min after; ends if harmed) |
| 6 | Resounding Rhyme | 0(self) | 3m radius | 1rnd/lvl | N | This lore's 1-target spells become 3m radius while active |
| 7 | Fettering Song | 15m | 1 target | C | Y | Target Held |
| 8 | Echoing Voice | 0(self) | caster | 1rnd/lvl | N | Concentrate on this lore's spells as Free Action (1/rnd) |
| 9 | Beguiling Song | 15m | 1 target | C | Y | Target believes everything caster sings (ends with hard evidence) |
| 10 | Memory's Dirge | 15m | 1 target | P | Y | Target forgets specific event (within 1day/lvl). Concentration time = erased time. |

---

## Trickery (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Distraction | 15m | 1 target | C | Y | -20 all Attack/Skill Rolls (WSR each Assessment to end) |
| 2 | Prestidigitation | 0(touch) | 1 target | 1min/lvl | N | Item (<3kg) appears as part of caster's body (sight/smell/touch) |
| 3 | Phantom Theft | 15m | 1 target | - | N | Item (<3kg) teleports to caster's hands (WSR if held by creature) |
| 4 | Face Shifting | 0(self) | caster | 1hr/lvl | N | Appear as different humanoid (±20%, sight+hearing only; not specific individual unless warped) |
| 5 | Escape* | 0(touch) | 1 target | - | N | Open non-magic lock or unbind non-magic rope |
| 6 | Fumble | 30m | 1 target | - | Y | Target fumbles wielded weapon |
| 7 | Ghostly Foes | 30m | 1 target | C | Y | Target sees phantom attacker; must Parry all its attacks (WSR each Assessment) |
| 8 | Tongue of Honey | 15m | 1 target | varies | Y | Target believes everything caster says (until shown evidence) |
| 9 | Disappearance | 0(self) | caster | - | N | Vanish in smoke; reappear within 10m (visible spot, no barriers) |
| 10 | Last Surprise* | 10m | 1 target | - | Y | Next melee attack treats target as Surprised; add Arcana ranks to Crit Rolls vs Surprised with Short/Hand weapons |

---

## Weapon Mastery (BEA)

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Weapon Bond | 0(touch) | 1 target | P | N | Mark weapon as Personal Weapon; halve Clumsy Range |
| 2 | Bladelight | 0(touch) | 1 target | 1hr/lvl | N | Personal Weapon illuminates 3m |
| 3 | Dance of Steel | 0(self) | caster | 1rnd/lvl | N | +10 Attack Rolls with Personal Weapon |
| 4 | Throw* | 0(self) | caster | - | N | Throw Personal Weapon 10m + Attack Roll |
| 5 | Cleaving Strike | 0(touch) | 1 target | - | N | Cut non-magic item (<=5kg) cleanly with Personal Weapon |
| 6 | Lunging Attacks* | 0(self) | caster | 1rnd/lvl | N | Personal Weapon Length +1 step (max Longest) |
| 7 | Rending Strikes | 0(self) | caster | 1rnd/lvl | N | Crits that cause Bleeding: +2 HP/rnd Bleed |
| 8 | Multi-Attack* | 0(self) | caster | 1rnd | N | Attack 2 different engaged enemies at half CMB each |
| 9 | Savage Strike* | 0(self) | caster | 1rnd | N | +5 to all Crit Rolls with Personal Weapon |
| 10 | Whirlwind of Steel | 0(self) | 1.5m radius | - | N | Area Attack (same damage type as weapon), no max, hits all in area |

---

## Dark Sorcery (WIT) — NPC Only

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Agony | 20m | 1 target | - | Y | 10% Total HPs damage |
| 2 | Dark Tongue | 0(self) | caster | 1min/lvl | N | Speak with Darkmaster servants/Tainted |
| 3 | Dark Contact | 0(self) | caster | - | N | Ask Darkmaster one question about a subject |
| 4 | Hand of Doom | 0(touch) | 1 target | - | N | Light Dark Magic Critical Strike |
| 5 | Summoning | 3m | 1 demon | 1hr/lvl | Y | Summon Faceless Demon (WSR or obeys) |
| 6 | Dark Bolt | 30m | 1 target | - | N | Bolt Attack, Dark Magic, 150 max |
| 7 | Venom | 15m | 1 target | - | Y | -50 all actions, OR deaf+mute, OR random limb paralyzed |
| 8 | Demon's Breath | 0(self) | 15m×6m cone | - | N | Area Attack, Dark Magic, 140 max |
| 9 | Bestow Curse | 15m | 1 target | P | Y | Cannot spend Drive to re-roll failures/crits |
| 10 | Endless Torment | 15m | 1 target | C | N | Held; each round: answer question OR Grievous Dark Magic Crit + WSR to end |

---

## Necromancy (WSD) — NPC Only

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Séance | 10m | 1 target | C | N | Communicate with spirit/sentient undead |
| 2 | Danse Macabre | 20m | 1 target | 1min/lvl | N | Animate corpse as weak Undead Thrall (Concentrate for actions) |
| 3 | Dominate Undead | 10m | 1 target | P | Y | Undead WSR or obeys (max = Level dominated at once) |
| 4 | Speak with the Dead | 3m | 1 target | - | N | Shade answers one question |
| 5 | Animate Thrall | 3m | 1 target | P | N | Raise corpse as Undead Thrall (no control) |
| 6 | Drain Life | 20m | 1 target | C | Y | WSR/rnd or Stunned + 10% HPs damage; caster heals half |
| 7 | Soulreaper | 0(touch) | 1 weapon | 1rnd/lvl | N | Weapon: living touched must TSR or 1d10+Level Soul Damage |
| 8 | Gravelord's Call | 10m | 1 target | 1hr/lvl | Y | Summon undead spirit from area (WSR or controlled) |
| 9 | Spirit Possession | 20m | 1 target | Special | Y | Transfer soul into target's body (WSR every 10min; failure: caster dies OR target dies based on TSR) |
| 10 | Banishing | 20m | 1 target | 1wk/10fail | Y | Exile soul from body; coma for weeks (only magic/soul return can awaken) |

---

## Elven Lore (BEA) — Kin Spell Lore

| W | Spell | Range | AoE | Dur | Save | Summary |
|---|---|---|---|---|---|---|
| 1 | Memory Palace | 0(self) | caster | - | N | Perfectly recall event within 10days/lvl |
| 2 | Artificer's Lore | 0(touch) | 1 target | - | N | Assess gem/jewel/item value (TV) |
| 3 | Lore of Words | 0(touch) | 1 target | - | N | Identify text language, hidden meaning, author (if noteworthy) |
| 4 | Mind's Knowledge | 15m | 1 target | - | Y | Learn if target knows about topic; read surface thoughts on it |
| 5 | Dreams of Lore | 0(self) | caster | 4hrs | N | Trance; vision of past event of visible item/place |
| 6 | Secrets of the Runes | 0(touch) | 1 target | - | N | Learn magic text purpose; +20 Arcana to cast from scroll |
| 7 | Dark Lore | 20m | 1 target | - | N | Know if cursed/Darkmaster-connected; learn curse origins; +10 SR vs curse |
| 8 | Hunter's Lore | 20m | 1 target | - | N | Identify creature type, capabilities, weaknesses |
| 9 | Mystical Lore* | 20m | 1 target | - | N | Identify spell/ritual/effect: name, origin, Weave, effects |
| 10 | Lore of the Ancients | 0(self) | caster | 4hrs | N | Trance; commune with spirits; ask one yes/no (GM answers truthfully) |
