# Requirements Document

## Introduction

This document specifies the requirements for a FoundryVTT v14 game system implementing "Against the Darkmaster" (VsD) by Open Ended Games (Core Rules v1.5). The system provides digital character sheets, automated dice mechanics, combat tracking, magic resolution, and compendium data to facilitate online play. The implementation uses TypeScript with Vite, targets FoundryVTT v14 APIs (ApplicationV2, TypeDataModel, documentTypes), produces ES module output in a dist/ folder from src/ source files, and supports English and Spanish localization. The visual design adapts the Roll20 VsD character sheet layout to FoundryVTT V2 application styling.

## Glossary

- **VsD_System**: The FoundryVTT v14 game system module implementing Against the Darkmaster rules
- **Dice_Engine**: The module responsible for executing open-ended d100 rolls and computing final results
- **Action_Resolution_Table**: The lookup mechanism that maps a numeric result to one of five outcome bands (Critical Failure, Failure, Partial Success, Success, Outstanding Success)
- **Spell_Casting_Engine**: The module responsible for resolving spell casting rolls including Magical Resonance detection
- **Combat_Tracker**: The phase-based initiative and turn management system implementing the VsD 9-phase Tactical Round Sequence
- **Character_Sheet**: The ApplicationV2 interface for displaying and editing Player Character data
- **NPC_Sheet**: The compact single-page ApplicationV2 interface for Non-Player Character and Monster data
- **Item_Sheet**: The ApplicationV2 interface for displaying and editing Item document data
- **Character_Creation_Wizard**: The multi-step guided interface for creating new Player Characters
- **Advancement_Engine**: The module responsible for managing experience points and Development Point allocation
- **Compendium_Manager**: The set of compendium packs containing game reference data
- **Token_Integration**: The module connecting Actor data to canvas token visual representation
- **Localization_Engine**: The i18n system providing English and Spanish translations
- **Rank_Bonus_Calculator**: The pure function that computes skill rank bonus from rank value
- **Encumbrance_Calculator**: The module that determines qualitative encumbrance level from carried items and Brawn stat
- **Drive_Tracker**: The module that manages Drive Points, Passions, and Heroic Path progression
- **Travel_Engine**: The module that handles travel pace, hazard encounters, and journey tracking
- **TypeDataModel**: FoundryVTT v14 base class for defining document data schemas
- **ApplicationV2**: FoundryVTT v14 application framework for rendering UI sheets
- **Open_Ended_High**: A d100 roll result of 96 or higher that triggers additive explosion
- **Open_Ended_Low**: A d100 roll result of 05 or lower that triggers subtractive explosion
- **Magical_Resonance**: A condition triggered when the tens and units digits of the Spell Casting d100 roll are equal (11, 22, 33, 44, 55, 66, 77, 88, 99)
- **TSR**: Toughness Save Roll bonus, computed as Fortitude stat value plus Kin bonus plus 5 per character level
- **WSR**: Willpower Save Roll bonus, computed as Wisdom stat value plus Kin bonus plus 5 per character level
- **DP**: Development Points, the currency spent during advancement to increase skill ranks
- **MP**: Magic Points, the resource spent to cast spells, with cost equal to the Weave number of the spell
- **Drive_Points**: Resource representing heroic determination, spent to activate Passions and gain mechanical benefits
- **Passions**: Character motivations consisting of Nature, Allegiance, and Motivation that interact with Drive Points
- **Heroic_Path**: A narrative track representing the character's growth arc across sessions
- **Background_Options**: Character creation choices purchased with Background Points during Kin and Culture selection
- **Items_of_Power**: Special magical items with Affinity tracking that bond to characters

## Requirements

### Requirement 1: Character Data Model

**User Story:** As a player, I want my character's stats, skills, and derived values stored in a structured data model, so that the system can compute bonuses and track resources automatically.

#### Acceptance Criteria

1. THE VsD_System SHALL define a Character Actor type using TypeDataModel with six stats: Brawn (BRN), Swiftness (SWI), Fortitude (FOR), Wits (WIT), Wisdom (WSD), and Bearing (BEA), each stored as a signed integer in the range -50 to +100 inclusive, where the stat value itself is the stat bonus (no lookup table required)
2. THE VsD_System SHALL use each stat value directly as the stat bonus when computing skill totals, save rolls, and other derived values, since VsD stat values represent the modifier itself (e.g., a BRN of +10 adds +10 to BRN-based rolls)
3. WHEN a Character is created, THE VsD_System SHALL initialize Hit Points current and maximum to 0, Magic Points current and maximum to 0, Drive Points current and maximum to 0, Defense to 0, encumbrance level to Unencumbered, and wealth level to 0
4. THE VsD_System SHALL store skills organized in seven categories: Armor, Combat, Adventuring, Roguery, Lore, Spells, and Body
5. THE VsD_System SHALL store each skill with a name, associated stat, rank value (integer with minimum 0), and computed total bonus
6. WHEN a skill rank value changes, THE Rank_Bonus_Calculator SHALL compute the rank bonus as: rank 0 yields +0; ranks 1-10 yield rank multiplied by 5; ranks 11-20 yield 50 plus (rank minus 10) multiplied by 2; ranks 21 and above yield 70 plus (rank minus 20) multiplied by 1
7. THE VsD_System SHALL store Passions as three fields: Nature, Allegiance, and Motivation, each containing descriptive text with a maximum length of 500 characters
8. THE VsD_System SHALL store Drive Points as a current and maximum value pair, where current is an integer from 0 to maximum inclusive and maximum is an integer of 0 or greater
9. THE VsD_System SHALL store Heroic Path as a text field with a maximum length of 200 characters, and an ordered list of milestone entries where each milestone has a text description and a boolean completion status
10. THE VsD_System SHALL store encumbrance as one of five qualitative levels: Unencumbered, Lightly Encumbered, Encumbered, Heavily Encumbered, Over Encumbered
11. THE VsD_System SHALL store wealth as an integer level from 0 to 5 inclusive
12. THE VsD_System SHALL compute total skill bonus as the stat value (used directly as the stat bonus) plus rank bonus plus the sum of all signed integer modifier values from Item effects attached to the Character that target that skill
13. THE VsD_System SHALL register the Character type in the documentTypes section of system.json without using template.json

### Requirement 2: NPC and Monster Data Model

**User Story:** As a game master, I want a compact NPC/Monster stat block, so that I can run encounters efficiently without full character sheet overhead.

#### Acceptance Criteria

1. THE VsD_System SHALL define an NPC Actor type using TypeDataModel with fields for level (integer from 1 to 50 inclusive), hit points (current and maximum integer values, minimum 1), defense (integer), initiative modifier (integer), movement rate (integer in meters per round), attacks, skill bonuses, special abilities, and resistances
2. THE VsD_System SHALL store NPC attacks as an ordered collection of up to 10 entries where each attack has a name (up to 80 characters), attack bonus (integer), attack table reference, critical table reference, and damage value expressed as a dice formula string (up to 40 characters)
3. THE VsD_System SHALL store NPC skill bonuses as a flat collection of up to 30 skill name and integer bonus value pairs
4. THE VsD_System SHALL store NPC special abilities as a collection of up to 20 entries with name (up to 80 characters) and description (up to 500 characters) fields
5. THE VsD_System SHALL store NPC resistances as a collection containing one integer bonus value for each of the three resistance categories: Stamina, Will, and Magic
6. THE VsD_System SHALL register the NPC type in the documentTypes section of system.json without using template.json

### Requirement 3: Item Data Models

**User Story:** As a player, I want distinct item types for weapons, armor, spells, equipment, kin, culture, vocation, traits, and items of power, so that the system can apply type-specific rules and display appropriate fields.

#### Acceptance Criteria

1. THE VsD_System SHALL define a Weapon Item type using TypeDataModel with fields for attack bonus (integer), attack table reference (string identifier), damage (integer), weapon group (string), reach (string), encumbrance value (non-negative integer), and fumble range (integer threshold at or below which a fumble occurs on d100)
2. THE VsD_System SHALL define an Armor Item type using TypeDataModel with fields for armor category (one of: NA, LA, MA, HA), defense penalty (non-positive integer), maneuver penalty (non-positive integer), and encumbrance value (non-negative integer)
3. THE VsD_System SHALL define a Spell Item type using TypeDataModel with fields for weave number (integer from 1 to 10 inclusive), spell lore (string identifier), description (string), range (string), duration (string), area of effect (string), and casting time (string)
4. THE VsD_System SHALL define an Equipment Item type using TypeDataModel with fields for description (string), quantity (non-negative integer with maximum of 999), weight (non-negative number), encumbrance contribution (non-negative integer), and wealth level requirement (integer from 0 to 5 inclusive)
5. THE VsD_System SHALL define a Kin Item type using TypeDataModel with fields for stat modifiers (a collection of stat identifier and integer modifier pairs, one per stat), special abilities (collection of name and description pairs), background option points (non-negative integer), resistances (collection of resistance type and integer bonus pairs), and base hit points modifier (integer)
6. THE VsD_System SHALL define a Culture Item type using TypeDataModel with fields for skill rank allocations (collection of skill identifier and integer rank pairs), equipment options (collection of equipment descriptions), background option points (non-negative integer), and language proficiencies (collection of language names)
7. THE VsD_System SHALL define a Vocation Item type using TypeDataModel with fields for key stats (collection of one to three stat identifiers), favored skills (collection of skill identifiers), professional abilities (collection of name and description pairs), DP cost modifiers (collection of skill category and integer cost modifier pairs), and base spell lores (collection of spell lore identifiers)
8. THE VsD_System SHALL define a Trait Item type using TypeDataModel with fields for trait category (one of: Physical, Mental, Social, Special), description (string), mechanical effects (string describing the rule modification), prerequisites (string, empty if none), and cost in Background Points (integer from 1 to 10 inclusive)
9. THE VsD_System SHALL define an Item_of_Power type using TypeDataModel with fields for power description (string), affinity level (integer from 0 to 5 inclusive), attunement requirements (string), and mechanical bonuses (string describing the active bonuses)
10. THE VsD_System SHALL register all Item types (Weapon, Armor, Spell, Equipment, Kin, Culture, Vocation, Trait, Item_of_Power) in the documentTypes section of system.json without using template.json
11. WHEN the Spell Item type stores MP cost, THE VsD_System SHALL set the cost equal to the weave number field value
12. IF a required field on any Item type is left empty or set to an invalid value, THEN THE VsD_System SHALL retain the Item document with a default value for that field rather than rejecting the save

### Requirement 4: Open-Ended Dice Engine

**User Story:** As a player, I want the dice engine to handle VsD open-ended rolls correctly, so that high rolls explode upward and fumbles explode downward per the core rules.

#### Acceptance Criteria

1. WHEN a d100 roll (range 01 to 100 inclusive) produces a result of 96 or higher, THE Dice_Engine SHALL add the result to a cumulative total and roll again, continuing to add while subsequent rolls are also 96 or higher, terminating when a roll produces a result of 95 or lower
2. WHEN a d100 roll produces a result of 05 or lower, THE Dice_Engine SHALL roll again and subtract that second roll from the original result, then continue subtracting only while subsequent rolls produce 96 or higher, terminating when a subsequent roll produces 95 or lower
3. WHEN an open-ended roll sequence terminates because the most recent d100 result is between 06 and 95 inclusive (for an initial roll) or between 01 and 95 inclusive (for a subsequent explosion roll), THE Dice_Engine SHALL add that final roll to the cumulative total and return the final numeric result
4. THE Dice_Engine SHALL implement roll logic as a pure function accepting a random number source parameter, enabling deterministic testing
5. WHEN a roll is executed, THE Dice_Engine SHALL display each individual die result in the FoundryVTT chat message with an upward arrow symbol preceding each high open-ended explosion roll and a downward arrow symbol preceding each low open-ended explosion roll
6. THE Dice_Engine SHALL ensure that parsing the chat output and extracting the displayed numeric total produces the same value as the computed roll result for any sequence of d100 values (round-trip property)
7. THE Dice_Engine SHALL format chat messages using FoundryVTT Roll class integration for tooltip display of individual dice
8. THE Dice_Engine SHALL cap any single open-ended roll sequence at a maximum of 10 consecutive explosion rolls, treating the 10th roll as the final result regardless of its value

### Requirement 5: Action Resolution Table

**User Story:** As a player, I want my skill checks resolved against the Action Resolution Table, so that I get clear success/failure outcomes matching the VsD rules.

#### Acceptance Criteria

1. WHEN a skill check total is 4 or lower, THE Action_Resolution_Table SHALL return a Critical Failure outcome
2. WHEN a skill check total is between 5 and 74 inclusive, THE Action_Resolution_Table SHALL return a Failure outcome
3. WHEN a skill check total is between 75 and 99 inclusive, THE Action_Resolution_Table SHALL return a Partial Success outcome
4. WHEN a skill check total is between 100 and 174 inclusive, THE Action_Resolution_Table SHALL return a Success outcome
5. WHEN a skill check total is 175 or higher, THE Action_Resolution_Table SHALL return an Outstanding Success outcome
6. THE Action_Resolution_Table SHALL implement outcome lookup as a pure function accepting a numeric total (integer, including negative values) and returning one of five outcome band identifiers: CriticalFailure, Failure, PartialSuccess, Success, OutstandingSuccess
7. FOR ALL integer inputs, THE Action_Resolution_Table SHALL return exactly one of the five defined outcome bands

### Requirement 6: Spell Casting and Magical Resonance

**User Story:** As a spell caster, I want the system to resolve spell casting rolls and detect Magical Resonance, so that I experience the risk and reward of VsD magic.

#### Acceptance Criteria

1. WHEN a spell is cast, THE Spell_Casting_Engine SHALL compute the total spell roll as: spell casting skill bonus plus open-ended d100 result plus (5 multiplied by caster level)
2. WHEN the initial d100 roll of a Spell Casting Roll produces doubles (11, 22, 33, 44, 55, 66, 77, 88, or 99), THE Spell_Casting_Engine SHALL flag the result as Magical Resonance triggered, evaluating only the first d100 value before any open-ended explosion rolls
3. WHEN a spell is cast, THE Spell_Casting_Engine SHALL deduct MP equal to the spell weave number from the caster Magic Points total before resolving the spell outcome
4. WHEN the total spell roll is computed, THE Spell_Casting_Engine SHALL resolve the spell casting total against the Action_Resolution_Table to determine spell success
5. WHEN Magical Resonance is triggered, THE Spell_Casting_Engine SHALL display a visually distinct indicator in the chat message and present a clickable button that, when activated, executes a roll on the Magical Resonance table and displays the result in chat
6. IF a caster current MP is less than the spell weave number, THEN THE Spell_Casting_Engine SHALL prevent the cast and display a warning message indicating insufficient MP
7. THE Spell_Casting_Engine SHALL implement Magical Resonance detection as a pure function accepting an integer d100 value in the range 11 to 99 and returning a boolean result of true when the tens digit equals the units digit

### Requirement 7: Combat Tracker with Tactical Round Sequence

**User Story:** As a game master, I want a combat tracker that follows the VsD 9-phase Tactical Round Sequence, so that I can manage combat rounds in the correct order.

#### Acceptance Criteria

1. THE Combat_Tracker SHALL implement nine sequential phases per round: Assessment, Action Declaration, Move, Spell A, Ranged A, Melee, Ranged B, Spell B, Other Actions
2. WHEN combat begins, THE Combat_Tracker SHALL start at the Assessment phase of round 1
3. WHEN the game master triggers phase advancement, THE Combat_Tracker SHALL advance to the next phase in sequence
4. WHEN the game master triggers phase advancement during the Other Actions phase, THE Combat_Tracker SHALL advance to the Assessment phase of the next round and increment the round counter
5. THE Combat_Tracker SHALL display the current phase name and round number to all connected players
6. WHEN a combatant is added to the tracker, THE Combat_Tracker SHALL allow the game master to assign declared actions to one or more of the nine phases for that combatant
7. THE Combat_Tracker SHALL allow the game master to advance to the next phase or revert to the previous phase manually, one phase at a time
8. IF the game master triggers phase revert while on the Assessment phase of round 1, THEN THE Combat_Tracker SHALL remain on the Assessment phase of round 1 and not revert further
9. THE Combat_Tracker SHALL track active conditions on each combatant with a remaining duration expressed as an integer from 1 to 99 rounds
10. WHEN a new round begins (Assessment phase is reached via phase advancement), THE Combat_Tracker SHALL decrement the remaining duration of all active conditions by one and remove any condition whose duration reaches zero

### Requirement 8: Character Sheet (ApplicationV2)

**User Story:** As a player, I want a character sheet with organized tabs following the VsD layout, so that I can view and edit my character information without clutter.

#### Acceptance Criteria

1. THE Character_Sheet SHALL extend ApplicationV2 and render with six tabs: Overview, Skills, Combat, Magic, Equipment, Biography
2. THE Character_Sheet SHALL display all six stats with their computed bonuses on the Overview tab
3. THE Character_Sheet SHALL display Passions (Nature, Allegiance, Motivation), Drive Points, and Heroic Path on the Overview tab
4. THE Character_Sheet SHALL display all skills grouped by category with rank value, rank bonus, stat bonus, and total bonus on the Skills tab
5. WHEN a skill roll button is clicked, THE Character_Sheet SHALL trigger a Dice_Engine roll with the skill total bonus applied and display the result in the FoundryVTT chat message identifying the skill name
6. THE Character_Sheet SHALL display Hit Points, Defense, equipped weapon details, equipped armor, and active conditions on the Combat tab
7. THE Character_Sheet SHALL display Magic Points, known spells organized by Spell Lore, and spell casting bonuses on the Magic tab
8. THE Character_Sheet SHALL display carried items, encumbrance level, and wealth level on the Equipment tab
9. THE Character_Sheet SHALL display character biography, appearance, Kin, Culture, Vocation, and background notes on the Biography tab
10. WHEN a stat or skill input field loses focus or the Enter key is pressed after modification, THE Character_Sheet SHALL persist the change to the Actor document within 500 milliseconds
11. THE Character_Sheet SHALL use FoundryVTT V2 application CSS variables and layout patterns, adapting the Roll20 VsD sheet organization without overriding Foundry core styles
12. IF persistence of a stat or skill edit fails, THEN THE Character_Sheet SHALL revert the displayed value to the last persisted state and display a notification indicating the save failed

### Requirement 9: NPC Sheet

**User Story:** As a game master, I want a compact NPC sheet on a single page, so that I can reference NPC stats quickly during play.

#### Acceptance Criteria

1. THE NPC_Sheet SHALL extend ApplicationV2 and render all NPC data on a single page without tabs
2. THE NPC_Sheet SHALL display level, hit points, defense, initiative modifier, movement rate, all attacks, skill bonuses, special abilities, and resistances in a single-page layout without scrolling sections or collapsible panels
3. WHEN an NPC attack is clicked, THE NPC_Sheet SHALL trigger an open-ended roll using the Dice_Engine with the attack bonus applied, prompt for or accept the target armor category, resolve against the attack table specified in the attack entry, and display the resulting damage and critical indicator in the chat message
4. WHEN an NPC field is edited, THE NPC_Sheet SHALL persist the change to the Actor document on field value commit without requiring an explicit save action
5. IF the attack table resolution indicates a critical hit, THEN THE NPC_Sheet SHALL automatically roll on the critical table referenced in the attack entry and display the critical effect in the chat message

### Requirement 10: Item Sheets

**User Story:** As a player, I want type-specific item sheets, so that each item type displays only its relevant fields.

#### Acceptance Criteria

1. THE Item_Sheet SHALL extend ApplicationV2 and render a common header showing item name and description, followed by type-specific fields for the Item type (Weapon, Armor, Spell, Equipment, Kin, Culture, Vocation, Trait, Item_of_Power)
2. WHEN a Weapon Item is opened, THE Item_Sheet SHALL display attack bonus, attack table, damage, weapon group, reach, encumbrance value, and fumble range
3. WHEN an Armor Item is opened, THE Item_Sheet SHALL display armor category (NA, LA, MA, HA), defense penalty, maneuver penalty, and encumbrance value
4. WHEN a Spell Item is opened, THE Item_Sheet SHALL display weave number, spell lore, range, duration, area of effect, and casting time
5. WHEN an Item_of_Power is opened, THE Item_Sheet SHALL display power description, affinity level, attunement requirements, and mechanical bonuses
6. WHEN an Item field is edited, THE Item_Sheet SHALL persist the change to the Item document on field commit without requiring a separate save action
7. WHEN an Equipment Item is opened, THE Item_Sheet SHALL display description, quantity, weight, encumbrance contribution, and wealth level requirement
8. WHEN a Kin Item is opened, THE Item_Sheet SHALL display stat modifiers, special abilities, background option points, resistances, and base hit points modifier
9. WHEN a character-building Item (Culture, Vocation, or Trait) is opened, THE Item_Sheet SHALL display all fields defined in the corresponding Item data model

### Requirement 11: Character Creation Wizard

**User Story:** As a player, I want a step-by-step character creation wizard, so that I can build a valid character following VsD rules without consulting the book at every step.

#### Acceptance Criteria

1. THE Character_Creation_Wizard SHALL guide the player through eight sequential steps: Concept, Kin selection, Culture selection, Stat generation, Vocation selection, Background Options, Skill allocation, Equipment selection
2. WHEN a Kin is selected, THE Character_Creation_Wizard SHALL display and apply the corresponding stat modifiers, special abilities, and available Background Option points from the Kin Item data
3. WHEN a Culture is selected, THE Character_Creation_Wizard SHALL display and apply the corresponding skill rank allocations and available Background Option points from the Culture Item data
4. WHEN Background Options are selected, THE Character_Creation_Wizard SHALL enforce the point-buy limit from combined Kin and Culture Background Points by preventing selection of options whose cost would exceed remaining points
5. WHEN a Vocation is selected, THE Character_Creation_Wizard SHALL apply the corresponding favored skills, DP cost modifiers, and base spell lores from the Vocation Item data
6. WHEN the Stat generation step is reached, THE Character_Creation_Wizard SHALL present the VsD stat generation method (point-buy from a fixed budget or dice roll), allow the player to assign values across the six stats (BRN, SWI, FOR, WIT, WSD, BEA), and enforce that all six stats receive a value before progression
7. WHEN the Skill allocation step is reached, THE Character_Creation_Wizard SHALL display available DP for a first-level character, show per-skill DP costs modified by Vocation, and prevent the player from spending more DP than available or exceeding the maximum rank of 3 per skill at first level
8. WHEN the final step is confirmed, THE Character_Creation_Wizard SHALL create a Character Actor with all selected Kin, Culture, Vocation, stats, skills, Background Options, and equipment applied, and all derived values (Hit Points, Defense, stat bonuses, rank bonuses, skill totals) computed
9. IF the player attempts to advance to the next step without completing required selections for the current step, THEN THE Character_Creation_Wizard SHALL remain on the current step and display a message indicating which selections are missing
10. WHEN the player navigates back to a previous step and modifies a selection, THE Character_Creation_Wizard SHALL update all dependent values in subsequent steps and preserve independent selections that are unaffected by the change
11. WHEN the player navigates back to a previous step and modifies a selection that invalidates a later selection, THE Character_Creation_Wizard SHALL clear the invalidated selections and indicate which steps require re-selection

### Requirement 12: Experience and Advancement

**User Story:** As a player, I want to spend experience points to advance my character, so that my character grows according to VsD advancement rules.

#### Acceptance Criteria

1. WHEN a character gains experience, THE Advancement_Engine SHALL add the experience points as a positive integer to the character total and persist the updated value to the Actor document
2. WHEN a character total experience reaches a level threshold defined by the VsD level progression table, THE Advancement_Engine SHALL display a level-up eligibility notification on the Character_Sheet and enable the level-up action
3. WHEN a character levels up, THE Advancement_Engine SHALL grant Development Points based on the VsD level advancement rules as defined by the character Vocation Item data
4. WHEN DP is allocated to a skill, THE Advancement_Engine SHALL increase the skill rank by one (up to a maximum rank of 30) and deduct the DP cost as determined by the skill category and the character Vocation cost modifiers
5. IF a player attempts to spend more DP than the character has available, THEN THE Advancement_Engine SHALL reject the allocation, leave the skill rank unchanged, and display an insufficient DP message
6. WHEN a character levels up, THE Advancement_Engine SHALL increase Hit Points by the amount defined in the character Vocation Item data, recalculate per-level bonuses (+5 per level to TSR and WSR), and grant new professional abilities as listed in the Vocation Item for the new level
7. THE Advancement_Engine SHALL display remaining DP, per-skill DP costs adjusted for Vocation modifiers, current level, total experience, and experience required for next level on the advancement interface
8. IF a player attempts to increase a skill that is already at rank 30, THEN THE Advancement_Engine SHALL reject the allocation and display a maximum rank reached message

### Requirement 13: Compendium Packs

**User Story:** As a game master, I want pre-built compendium packs, so that I can drag-and-drop official game data onto characters and into scenes.

#### Acceptance Criteria

1. THE Compendium_Manager SHALL provide a pack for all 13 Kins: Man, High Man, Dwarf, Halfling, Half Elf, Silver Elf, Dusk Elf, Star Elf, Wildfolk, Orc, Half Orc, Stone Troll, Firbolg
2. THE Compendium_Manager SHALL provide a pack for all 13 Cultures: Arctic, City, Deep, Desert, Fey, Hill, Marauding, Noble, Pastoral, Plains, Seafaring, Weald, Woad
3. THE Compendium_Manager SHALL provide a pack for all 7 Vocations: Warrior, Rogue, Wizard, Animist, Champion, Dabbler, Sage
4. THE Compendium_Manager SHALL provide separate packs for weapons, armor, and equipment, where each entry contains all fields defined by its corresponding TypeDataModel schema
5. THE Compendium_Manager SHALL provide packs for spells organized by Spell Lore, where each spell entry contains all fields defined by the Spell Item TypeDataModel schema
6. THE Compendium_Manager SHALL provide packs for traits (Background Options) with their point costs
7. THE Compendium_Manager SHALL provide attack tables and critical tables sourced from the VsD data toolbox
8. THE Compendium_Manager SHALL provide a bestiary pack with NPC/Monster stat blocks from the core rules, where each entry contains all fields defined by the NPC Actor TypeDataModel schema
9. WHEN a compendium item is dragged onto a Character Actor or NPC Actor, THE VsD_System SHALL create a copy of the item on that Actor
10. IF a compendium item of type Kin, Culture, or Vocation is dragged onto a Character Actor that already has an item of that same type, THEN THE VsD_System SHALL display a replacement confirmation prompt and replace the existing item only upon confirmation
11. THE Compendium_Manager SHALL use icons exclusively from game-icons.net SVG library
12. THE Compendium_Manager SHALL provide compendium item names and descriptions in both English and Spanish using the Localization_Engine translation keys

### Requirement 14: Token Integration

**User Story:** As a game master, I want tokens on the canvas to reflect character status, so that I can visually track HP and conditions during encounters.

#### Acceptance Criteria

1. WHEN a Character or NPC Actor is placed on the canvas, THE Token_Integration SHALL display an HP bar as a proportional fill bar representing current Hit Points relative to maximum Hit Points
2. WHEN a character Hit Points value changes, THE Token_Integration SHALL update the token HP bar for all connected clients without requiring a page refresh
3. THE Token_Integration SHALL display active condition icons on the token using game-icons.net SVG assets, showing up to 10 condition icons simultaneously
4. WHEN a condition is applied or removed from an Actor, THE Token_Integration SHALL update the token condition icons for all connected clients without requiring a page refresh
5. THE Token_Integration SHALL visually differentiate VsD condition severity levels (Superficial, Light, Moderate, Grievous, Lethal) by displaying a distinct icon tint or border color per severity level
6. THE Token_Integration SHALL display the HP bar to the token owner and to users with GM role, while hiding it from other players by default

### Requirement 15: Drive and Passions System

**User Story:** As a player, I want to track my Drive Points and invoke my Passions, so that I can use heroic determination at dramatic moments per VsD rules.

#### Acceptance Criteria

1. THE Drive_Tracker SHALL store current and maximum Drive Points on the Character Actor as integer values, where current Drive Points range from 0 to the maximum value inclusive and the initial maximum is 3
2. WHEN a Passion is invoked during a roll, THE Drive_Tracker SHALL deduct one Drive Point, prompt the player to select which Passion (Nature, Allegiance, or Motivation) applies, and add a +30 bonus to the roll result
3. IF a character has zero Drive Points, THEN THE Drive_Tracker SHALL prevent Passion invocation and display an insufficient Drive Points message
4. THE Drive_Tracker SHALL allow the game master to award or remove Drive Points from any Character Actor, clamping the resulting current value between 0 and the character maximum Drive Points inclusive
5. THE Drive_Tracker SHALL store Heroic Path milestones as a list of up to 10 narrative checkpoints, each with a text description and a boolean completion status
6. WHEN a Heroic Path milestone is marked as completed, THE Drive_Tracker SHALL increase maximum Drive Points by one
7. IF the game master attempts to award Drive Points that would exceed the character maximum, THEN THE Drive_Tracker SHALL set current Drive Points to the maximum value without exceeding it

### Requirement 16: Encumbrance System

**User Story:** As a player, I want encumbrance calculated automatically from my equipment, so that I know when my character is overloaded without manual bookkeeping.

#### Acceptance Criteria

1. WHEN items are added to or removed from a Character, THE Encumbrance_Calculator SHALL recalculate total encumbrance points by summing each carried item's encumbrance value multiplied by its quantity
2. THE Encumbrance_Calculator SHALL determine the encumbrance level by comparing total encumbrance points to thresholds derived from the character Brawn stat: Unencumbered (total is at or below Brawn value), Lightly Encumbered (total exceeds Brawn by 1 to Brawn multiplied by 1.5), Encumbered (total exceeds Brawn multiplied by 1.5 up to Brawn multiplied by 2), Heavily Encumbered (total exceeds Brawn multiplied by 2 up to Brawn multiplied by 3), Over Encumbered (total exceeds Brawn multiplied by 3)
3. THE Encumbrance_Calculator SHALL implement level determination as a pure function accepting total encumbrance points and Brawn value, returning one of the five encumbrance levels
4. WHEN the encumbrance level changes, THE VsD_System SHALL apply penalties per level: Unencumbered (no penalty), Lightly Encumbered (minus 10 to maneuver rolls), Encumbered (minus 20 to maneuver rolls and minus 10 to movement rate), Heavily Encumbered (minus 30 to maneuver rolls, minus 20 to movement rate, and minus 10 to all skill rolls), Over Encumbered (minus 50 to maneuver rolls, minus 30 to movement rate, and minus 20 to all skill rolls)
5. THE Character_Sheet SHALL display the current encumbrance level with a progress bar indicating the ratio of current total encumbrance points to the next threshold value
6. IF a Character has no items with an encumbrance value, THEN THE Encumbrance_Calculator SHALL set total encumbrance points to zero and the level to Unencumbered

### Requirement 17: Attack and Critical Tables

**User Story:** As a game master, I want attack and critical results resolved automatically, so that combat flows without manual table lookups.

#### Acceptance Criteria

1. THE VsD_System SHALL load attack table data mapping roll results to damage and critical indicators by armor category (NA, LA, MA, HA)
2. WHEN an attack roll is resolved, THE VsD_System SHALL look up the result in the appropriate attack table using the weapon attack table identifier, the target armor category column, and the roll total clamped to the table minimum and maximum row values
3. WHEN an attack table result indicates a critical hit, THE VsD_System SHALL determine the critical severity (Superficial, Light, Moderate, Grievous, Lethal) and roll on the critical table identified by the weapon critical table reference
4. THE VsD_System SHALL load critical table data from the external VsD data toolbox source
5. WHEN a critical result is determined, THE VsD_System SHALL display the critical effect description in the chat message including any mechanical effects (stun rounds, bleeding, penalties)
6. THE VsD_System SHALL implement attack table lookup as a pure function accepting roll total, attack table identifier, and armor category, returning a damage value and either a critical severity indicator or a no-critical indicator when the result does not trigger a critical hit
7. WHEN an attack roll is resolved and does not indicate a critical hit, THE VsD_System SHALL display the damage result in the chat message with the weapon name and target armor category
8. IF the provided attack table identifier does not match any loaded attack table, THEN THE VsD_System SHALL return a lookup error indicating an unrecognized table identifier without interrupting the chat workflow

### Requirement 18: Travel and Hazards System

**User Story:** As a game master, I want to track party travel with pace and hazard encounters, so that overland journeys have mechanical weight per VsD rules.

#### Acceptance Criteria

1. THE Travel_Engine SHALL track current travel pace as one of: Careful, Normal, Fast, Forced March
2. WHEN the game master initiates a travel segment, THE Travel_Engine SHALL prompt for terrain type, weather conditions, distance in miles, and travel pace selection
3. THE Travel_Engine SHALL compute travel duration in hours based on the selected pace modifier, terrain modifier, and party movement rate
4. WHEN the game master completes a travel segment, THE Travel_Engine SHALL trigger a hazard check by rolling against the hazard table corresponding to the selected terrain type and weather conditions
5. WHEN a hazard check produces a result, THE Travel_Engine SHALL display the hazard type and effect description in the chat message
6. IF the current travel pace is Forced March, THEN THE Travel_Engine SHALL indicate that exhaustion penalties apply to the party at the end of the segment
7. THE Travel_Engine SHALL display a travel log listing each completed segment with its terrain type, distance, duration, pace, hazards encountered, and provisions consumed
8. THE Travel_Engine SHALL track provisions consumed per segment as one unit per party member per full day of travel

### Requirement 19: Localization

**User Story:** As a Spanish-speaking player, I want the system available in Spanish, so that I can play VsD in my native language.

#### Acceptance Criteria

1. THE Localization_Engine SHALL provide English (en) and Spanish (es) translation entries for every localization key used in UI labels, sheet fields, system messages, chat output, and dialog text
2. THE VsD_System SHALL use localization keys following the pattern VSD.{Section}.{Label} for all displayed text, with no hardcoded user-visible strings in sheet templates or system code
3. THE VsD_System SHALL store translations as JSON files registered in the languages array of system.json, with one file per supported language (en.json, es.json)
4. WHEN a new UI element or data model field is added, THE VsD_System SHALL add corresponding localization keys to both en and es language files before the element is rendered
5. WHEN FoundryVTT language preference is set to a supported language, THE Localization_Engine SHALL render all VsD_System text in that language
6. IF a localization key has no translation in the active language file, THEN THE Localization_Engine SHALL fall back to the English (en) translation for that key

### Requirement 20: Build and CI/CD Pipeline

**User Story:** As a developer, I want automated builds and releases, so that I can ship updates confidently with proper versioning.

#### Acceptance Criteria

1. THE VsD_System SHALL compile TypeScript source from src/ directory to dist/ directory using Vite as the build tool
2. THE VsD_System SHALL produce ES module output compatible with FoundryVTT v14 module loading
3. WHEN a commit is pushed to the main branch, THE VsD_System SHALL run a GitHub Actions workflow that compiles the TypeScript source, executes Vitest tests, and fails the workflow if compilation errors or any test failure occurs
4. THE VsD_System SHALL use conventional commit messages to determine SemVer version bumps via release-please, where feat: triggers a minor version bump, fix: triggers a patch version bump, and a BREAKING CHANGE footer triggers a major version bump
5. WHEN a version bump is triggered by release-please, THE VsD_System SHALL produce a GitHub release with the built dist/ directory contents attached as a zip archive
6. WHEN the build process executes, THE VsD_System SHALL copy static assets (templates, styles, language files, system.json) from src/ to dist/ preserving directory structure
7. IF the TypeScript compilation produces errors, THEN THE VsD_System SHALL fail the build and report the compilation errors without producing output in the dist/ directory

### Requirement 21: Architecture and Code Organization

**User Story:** As a developer, I want clean separation between pure logic and Foundry-dependent code, so that I can test business rules without mocking the FoundryVTT API.

#### Acceptance Criteria

1. THE VsD_System SHALL separate pure computation functions (dice math, rank bonus, table lookups, encumbrance calculation, resonance detection) into modules that contain no import statements referencing FoundryVTT globals, classes, or module paths
2. THE VsD_System SHALL place Foundry-dependent code (document classes, sheet classes, hooks, combat tracker) in separate modules from pure logic, where pure logic resides in src/engine/ and Foundry-dependent code resides in src/models/ and src/sheets/
3. THE VsD_System SHALL export pure functions for: rank bonus calculation, open-ended roll computation, Action Resolution Table lookup, attack table lookup, encumbrance level determination, and Magical Resonance detection, where each function accepts all dependencies as parameters and produces the same output for the same input with no side effects
4. THE VsD_System SHALL use Vitest with fast-check for property-based testing of all pure function modules, with at least one property test per exported pure function
5. THE VsD_System SHALL structure the source as ES modules importable by FoundryVTT v14 module loader via the esmodules field in system.json
6. THE VsD_System SHALL organize source files in src/ with subdirectories for: models/, sheets/, engine/, data/, styles/, and lang/
7. WHEN a pure function module in src/engine/ is analyzed for imports, THE VsD_System SHALL contain zero transitive dependencies on modules in src/models/ or src/sheets/

### Requirement 22: Items of Power and Affinity

**User Story:** As a player, I want to track my Items of Power with Affinity progression, so that my bonded items grow stronger as our connection deepens.

#### Acceptance Criteria

1. THE VsD_System SHALL store Affinity as an integer level with a minimum of 0 and a maximum of 5 on each Item_of_Power embedded in a Character Actor
2. WHEN an Item_of_Power Affinity level increases, THE VsD_System SHALL activate the mechanical bonuses whose level threshold is equal to or lower than the new Affinity level from the Item_of_Power bonus collection
3. THE VsD_System SHALL display Item_of_Power Affinity level and the list of currently active bonuses with their associated level thresholds on the Character_Sheet Equipment tab
4. THE VsD_System SHALL store attunement requirements as a text description of up to 500 characters and a boolean attunement status on the Item_of_Power
5. IF an Item_of_Power attunement status is false, THEN THE VsD_System SHALL not apply any Affinity bonuses from that item to the Character Actor
