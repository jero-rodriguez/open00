# Dice Rolling Specification (Modified)

## Purpose

Specifies migration from `Math.random()` to Foundry's Roll API, ensuring dice tooltips, roll modes (public/private/blind/self), and Dice So Nice compatibility.

## Requirements

### Requirement: All Rolls via Roll API

Every dice roll in the system MUST use Foundry's `Roll` class (or subclass). Direct `Math.random()` for game-mechanical rolls is prohibited. This enables roll history, dice tooltips in chat, GM roll modes, and module compatibility (Dice So Nice).

Source: exploration §WRONG DERIVED VALUES ("All rolls use Math.random() and bypass the Roll API").

#### Scenario: Skill roll produces Roll object

- GIVEN a character making a Blades skill roll
- WHEN the roll is executed
- THEN a `Roll` instance MUST be created and evaluated
- AND `ChatMessage.create` MUST receive the Roll object (not pre-rendered HTML)

#### Scenario: Roll mode respected

- GIVEN a GM-initiated roll with roll mode "blindroll"
- WHEN the roll is sent to chat
- THEN the ChatMessage MUST be created with `rollMode: "blindroll"`
- AND only the GM MUST see the result

### Requirement: Open-Ended Roll Implementation

The VsD open-ended d100 mechanic (96-100 explodes up, 01-05 explodes down) MUST be implemented as a custom Roll formula or modifier that the Roll API can evaluate and display with full dice breakdown in tooltips.

Source: vsd-core-rules.md §Open-Ended Rolls.

#### Scenario: Open-ended explosion shown in tooltip

- GIVEN a roll where the initial d100 is 98 and the follow-up is 45
- WHEN the roll result is displayed
- THEN the tooltip MUST show both dice (98 + 45 = 143)
- AND the Roll total MUST be 143

### Requirement: Non-Open-Ended Rolls

Critical Strike rolls are non-open-ended d100. They MUST also use the Roll API but without the open-ended explosion modifier.

Source: vsd-combat.md §Critical Strike Roll ("Non-open-ended d100").

#### Scenario: Critical roll does not explode

- GIVEN a Critical Strike roll where the d100 result is 98
- WHEN the roll evaluates
- THEN no follow-up roll MUST occur
- AND the total MUST be 98 + severity modifier only
