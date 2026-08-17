/**
 * Dark Magic Critical Strike Table
 * Used by dark/shadow-based spell attacks. Add severity modifier.
 */
import type { CriticalTableEntry } from "../../config";

export const DARK_MAGIC_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Shadow brushes past. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Soul chilled. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: ["frightened"], rounds: 1, description: "Terrible visions. +1 HP loss, Frightened 1 round." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: [], rounds: 0, description: "Life force drained. +2 HP loss." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: ["frightened"], rounds: 1, description: "Dread fills the mind. +2 HP loss, Frightened 1 round." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: [], rounds: 0, description: "Shadow burns the spirit. +3 HP loss." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["frightened"], rounds: 2, description: "Nightmarish hallucinations. +3 HP loss, Frightened 2 rounds." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: ["stunned"], rounds: 1, description: "Mind clouded by darkness. +4 HP loss, Stunned 1 round." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["frightened"], rounds: 2, description: "Absolute terror grips target. +4 HP loss, Frightened 2 rounds." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: ["stunned"], rounds: 2, description: "Soul partially torn. +5 HP loss, Stunned 2 rounds." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["frightened"], rounds: 3, description: "Will crumbles before the dark. +5 HP loss, Frightened 3 rounds." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: ["stunned"], rounds: 2, description: "Psychic agony. +6 HP loss, Stunned 2 rounds." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["frightened", "stunned"], rounds: 3, description: "Madness descends. +6 HP loss, Frightened and Stunned 3 rounds." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: ["stunned"], rounds: 3, description: "Life draining rapidly. +7 HP loss, Stunned 3 rounds." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: ["frightened"], rounds: 3, description: "Overwhelming despair. +8 HP loss, Frightened 3 rounds." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["incapacitated"], rounds: 3, description: "Soul ripped partially free. +8 HP loss, Incapacitated 3 rounds." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["incapacitated"], rounds: 6, description: "Mind shattered. +9 HP loss, Incapacitated 6 rounds." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Will broken by dark power. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["incapacitated"], rounds: 12, description: "Spirit consumed. +10 HP loss, Incapacitated 12 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["incapacitated"], rounds: 12, description: "Body withers. +12 HP loss, Incapacitated 12 rounds." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["incapacitated"], rounds: 0, description: "Soul nearly destroyed. +14 HP loss, Incapacitated until healed." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 0, description: "Mind permanently scarred. +16 HP loss, Incapacitated until healed." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["dying"], rounds: 12, description: "Life force ebbing. +18 HP loss, Dying in 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["dying"], rounds: 6, description: "Soul consumed by shadow. +20 HP loss, Dying in 6 rounds." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 3, description: "Existence unravels. +25 HP loss, Dying in 3 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Annihilated by darkness. +30 HP loss, Dying in 1 round." },
];
