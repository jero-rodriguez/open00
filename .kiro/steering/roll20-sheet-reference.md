---
inclusion: fileMatch
fileMatchPattern: "src/sheets/**,src/templates/**,src/styles/**"
---

# Roll20 VsD Sheet Layout Reference

This file documents the layout structure from the official Roll20 "Against the Darkmaster CoreRules" character sheet, which serves as the visual design reference for the FoundryVTT implementation.

## Overall Structure

The Roll20 sheet uses a wrapper class `vsdarkmaster-wrapper` with:
- White background, dark text (#070707)
- Serif font family
- Min-width 850px

## Tabs (Navigation Bar)

Roll20 uses 5 tabs: **Skills** (personal), **Status & Combat**, **Spells**, **Equipment**, **Settings**

Our Foundry adaptation splits this into 6 tabs: **Overview**, **Skills**, **Combat**, **Magic**, **Equipment**, **Biography**

## Layout Patterns

### Two-Column Main Layout
The "Skills" tab uses `grid-template-columns: 1fr 2fr` for left/right split:
- **Left column** (~33%): Drive Points, Heroic Path, Stats table, Save Rolls, Special Abilities, Background Options, Languages
- **Right column** (~67%): Skills grid organized by category

### Stats Table
Table format with columns: Stat Name | Abbr | Base | Kin | Spec | Total
- Each stat row shows the name in small-caps, abbreviation, and numeric inputs
- In our simplified Foundry version, we store only the total value (stat value IS the bonus)

### Skills Grid
Uses `grid-template-columns: 2.1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr` (10 columns):
- Skill name (clickable roll button) | Bonus | Stat | # Ranks | Rank Bonus | Voc | Kin | Spec | Item | Total
- Category subheaders span full width with "Development Points Per Level" label

### Passions Block
Grid layout `1fr 9fr` for label + wide text input, showing Motivation, Nature, Allegiance

### Drive Points
Displayed as checkboxes (5 total) in the Roll20 version. In Foundry we use current/max number inputs.

### Heroic Path
Grid of checkboxes (10 per row, 10 rows = 100 total), with every 10th rotated 45°. In Foundry we use a text description.

## Combat Tab Layout

### Three-Column Top Section
`grid-template-columns: 1fr 1fr 2fr` for Hit Points | Movement | Defense

### Hit Points
Large round-bordered input for current HP, plus table with total hits, max hits, bleeding rate.

### Movement
Encumbrance level dropdown + base rate + effective rate

### Defense
Item bonus, special bonus, effective SWI, armor bonuses, total melee/ranged defense in square bordered boxes

### Conditions
2-column grid of checkbox conditions (dying, engaged, frightened, held, incapacitated, prone, stunned, surprised, weary)

### Penalties
Generic penalty input + automatic penalty displays (activity, CMB, movement)

### Armor & Shield (repeating section)
11-column grid: active toggle | name | type | zones | max SWI | move penalty | CMB penalty | perception penalty | DEF vs melee | DEF vs missile | qualities

### Weapons & Attacks (repeating section)
11-column grid: name | hands | length | skill | clumsy range | attack table | max result | primary critical | alt critical | base range | qualities

## Spells Tab Layout

### Two-Column Layout
`grid-template-columns: 1fr 3.5fr` for Magic Points block | Spell Lores

### Magic Points Block
Current MP in large round input, plus grid showing magic stat, stat gain/level, voc gain/level, kin, special, total

### Spell Lores (repeating section)
Same column structure as Skills: Name | Bonus | Stat | # | Rank | Voc | Kin | Spec | Item | Total | Roll button

## Equipment Tab Layout

### Two-Column Layout
`grid-template-columns: 2fr 1fr` for gear list | wealth/size/magic items

### Gear (repeating)
3-column grid: Item | Location | Description

### Notes Section
2-column grid: Notable People | Significant Places

### Companion Section
Two blocks side-by-side: Companion Animal | Riding Animal

## Visual Style

### Section Headers (h3)
- Small-caps, normal weight, centered
- White text on black background (#070707)
- 2px double white border with 7px border-radius
- Full width

### Input Fields
- No top/right/left borders, only bottom groove border in slategray
- Italic font style
- Number inputs: centered, no spin buttons
- `.hundred` class: 30px width
- `.thousand` class: 35px width
- `.total` class: bold text
- Disabled inputs: whitesmoke background, dimgray text
- Focus state: lightblue background

### Roll Buttons
- Transparent background, no borders
- Small-caps font
- Red color (#EC2127) on hover
- No `::before` content for roll-button class

### Large Round Inputs (HP, Penalties)
- 3px double border, 30px border-radius
- 60×60px, 25px font size
- Used for current hit points and generic penalty

### Medium Square Inputs (Defense totals)
- 2px double white border, 7px border-radius
- 40×40px, 18px font size
- Dark background with white text for defense values

### Colors
- Hit point inputs: white bg, dark text
- Defense inputs: dark bg (#070707), white text
- Penalty automatic fields: dark bg, white text
- Magic color: Teal background
