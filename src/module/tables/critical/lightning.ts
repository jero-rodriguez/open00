/**
 * Lightning Critical Strike Table
 * Used by lightning-based spell attacks. Add severity modifier.
 */
import type { CriticalTableEntry } from "../../config";

export const LIGHTNING_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Static shock. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Minor electrical burn. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: ["stunned"], rounds: 1, description: "Muscles spasm. +1 HP loss, Stunned 1 round." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: ["stunned"], rounds: 1, description: "Arm jerks involuntarily. +2 HP loss, Stunned 1 round." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: ["stunned"], rounds: 1, description: "Electricity courses through limb. +2 HP loss, Stunned 1 round." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: ["stunned"], rounds: 1, description: "Bolt sears across chest. +3 HP loss, Stunned 1 round." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["stunned"], rounds: 2, description: "Heart rhythm disrupted. +3 HP loss, Stunned 2 rounds." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: ["stunned"], rounds: 2, description: "Vision whites out. +4 HP loss, Stunned 2 rounds." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["stunned", "prone"], rounds: 2, description: "Convulsions knock target down. +4 HP loss, Stunned 2 rounds, Prone." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: ["stunned"], rounds: 2, description: "Severe electrical burns. +5 HP loss, Stunned 2 rounds." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["stunned"], rounds: 3, description: "Nervous system overwhelmed. +5 HP loss, Stunned 3 rounds." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: ["stunned"], rounds: 3, description: "Hearing destroyed by thunder. +6 HP loss, Stunned 3 rounds." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["stunned", "prone"], rounds: 3, description: "Full-body convulsions. +6 HP loss, Stunned 3 rounds, Prone." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: ["stunned"], rounds: 3, description: "Limb paralysed. +7 HP loss, Stunned 3 rounds." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: ["incapacitated"], rounds: 3, description: "Cardiac arrest momentarily. +8 HP loss, Incapacitated 3 rounds." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["incapacitated"], rounds: 6, description: "Total muscle lock. +8 HP loss, Incapacitated 6 rounds." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["incapacitated"], rounds: 6, description: "Spine shocked. +9 HP loss, Incapacitated 6 rounds." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Internal burns from current. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["incapacitated"], rounds: 12, description: "Brain scrambled. +10 HP loss, Incapacitated 12 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["incapacitated"], rounds: 12, description: "Heart stops. +12 HP loss, Incapacitated 12 rounds." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["incapacitated"], rounds: 0, description: "Permanent nerve damage. +14 HP loss, Incapacitated until healed." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 0, description: "Limb destroyed by current. +16 HP loss, Incapacitated until healed." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["dying"], rounds: 12, description: "Organs fried. +18 HP loss, Dying in 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["dying"], rounds: 6, description: "Electrocuted. +20 HP loss, Dying in 6 rounds." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 3, description: "Brain destroyed. +25 HP loss, Dying in 3 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Struck dead by lightning. +30 HP loss, Dying in 1 round." },
];
