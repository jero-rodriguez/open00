/**
 * Cut Critical Strike Table
 * Used by Edged weapons. Add severity modifier: Sup +0, Lig +10, Mod +20, Gri +30, Let +50.
 */
import type { CriticalTableEntry } from "../../config";

export const CUT_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Superficial nick. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Shallow cut to arm. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: [], rounds: 0, description: "Blade grazes cheek. +1 HP loss." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: [], rounds: 0, description: "Cut to forearm. +2 HP loss." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: [], rounds: 0, description: "Slice across thigh. +2 HP loss." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: [], rounds: 0, description: "Gash to shoulder. +3 HP loss." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["stunned"], rounds: 1, description: "Cut to hand. +3 HP loss, Stunned 1 round." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: [], rounds: 0, description: "Deep slash to torso. +4 HP loss." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["stunned"], rounds: 1, description: "Blade bites into calf. +4 HP loss, Stunned 1 round." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: [], rounds: 0, description: "Muscle severed in arm. +5 HP loss." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["stunned"], rounds: 1, description: "Face slashed. +5 HP loss, Stunned 1 round." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: [], rounds: 0, description: "Chest wound bleeds freely. +6 HP loss." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["stunned"], rounds: 2, description: "Tendon partially severed. +6 HP loss, Stunned 2 rounds." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: [], rounds: 0, description: "Deep abdominal cut. +7 HP loss." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: ["stunned"], rounds: 2, description: "Wrist nearly severed. +8 HP loss, Stunned 2 rounds." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["stunned"], rounds: 3, description: "Hamstring cut. +8 HP loss, Stunned 3 rounds." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["stunned"], rounds: 3, description: "Eye slashed. +9 HP loss, Stunned 3 rounds." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["stunned"], rounds: 3, description: "Fingers severed. +10 HP loss, Stunned 3 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Hand severed. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["incapacitated"], rounds: 6, description: "Throat slashed. +12 HP loss, Incapacitated 6 rounds." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["incapacitated"], rounds: 12, description: "Arm severed at elbow. +14 HP loss, Incapacitated 12 rounds." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 0, description: "Leg severed below knee. +16 HP loss, Incapacitated until healed." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["dying"], rounds: 12, description: "Abdomen split open. +18 HP loss, Dying in 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["dying"], rounds: 6, description: "Spine severed. +20 HP loss, Dying in 6 rounds." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 3, description: "Neck nearly severed. +25 HP loss, Dying in 3 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Decapitation. +30 HP loss, Dying in 1 round." },
];
