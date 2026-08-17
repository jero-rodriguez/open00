/**
 * Fire Critical Strike Table
 * Used by fire-based spell attacks. Add severity modifier.
 */
import type { CriticalTableEntry } from "../../config";

export const FIRE_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Singed hair. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Minor burn to hand. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: [], rounds: 0, description: "Clothing smoulders. +1 HP loss." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: [], rounds: 0, description: "First-degree burns on arm. +2 HP loss." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: ["stunned"], rounds: 1, description: "Face scorched. +2 HP loss, Stunned 1 round." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: [], rounds: 0, description: "Blistering burns to torso. +3 HP loss." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["stunned"], rounds: 1, description: "Eyes seared shut briefly. +3 HP loss, Stunned 1 round." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: [], rounds: 0, description: "Deep burns to legs. +4 HP loss." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["stunned"], rounds: 1, description: "Hair and clothes ignite briefly. +4 HP loss, Stunned 1 round." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: ["stunned"], rounds: 1, description: "Hands blistered. +5 HP loss, Stunned 1 round." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["stunned"], rounds: 2, description: "Second-degree burns. +5 HP loss, Stunned 2 rounds." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: ["stunned"], rounds: 2, description: "Flames engulf arm. +6 HP loss, Stunned 2 rounds." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["frightened"], rounds: 3, description: "Terror of burning. +6 HP loss, Frightened 3 rounds." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: ["stunned"], rounds: 2, description: "Severe facial burns. +7 HP loss, Stunned 2 rounds." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: ["stunned"], rounds: 3, description: "Third-degree burns. +8 HP loss, Stunned 3 rounds." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["stunned", "prone"], rounds: 3, description: "Engulfed in flames. +8 HP loss, Stunned 3 rounds, Prone." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["stunned"], rounds: 3, description: "Limb charred. +9 HP loss, Stunned 3 rounds." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Body aflame. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Eyes destroyed by heat. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["incapacitated"], rounds: 12, description: "Skin melts away. +12 HP loss, Incapacitated 12 rounds." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["incapacitated"], rounds: 12, description: "Bones blackened. +14 HP loss, Incapacitated 12 rounds." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 0, description: "Limb burned away. +16 HP loss, Incapacitated until healed." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["dying"], rounds: 12, description: "Internal organs cooked. +18 HP loss, Dying in 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["dying"], rounds: 6, description: "Immolated. +20 HP loss, Dying in 6 rounds." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 3, description: "Incinerated. +25 HP loss, Dying in 3 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Reduced to ash. +30 HP loss, Dying in 1 round." },
];
