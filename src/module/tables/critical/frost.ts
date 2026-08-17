/**
 * Frost Critical Strike Table
 * Used by cold/ice-based spell attacks. Add severity modifier.
 */
import type { CriticalTableEntry } from "../../config";

export const FROST_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Light chill. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Fingers numb. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: [], rounds: 0, description: "Skin whitens from frostbite. +1 HP loss." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: [], rounds: 0, description: "Ice forms on armor. +2 HP loss." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: ["stunned"], rounds: 1, description: "Joints stiffen with cold. +2 HP loss, Stunned 1 round." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: [], rounds: 0, description: "Tissue damaged by cold. +3 HP loss." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["stunned"], rounds: 1, description: "Lungs burn from icy air. +3 HP loss, Stunned 1 round." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: ["stunned"], rounds: 1, description: "Extremities turn blue. +4 HP loss, Stunned 1 round." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["stunned"], rounds: 2, description: "Ice encases weapon hand. +4 HP loss, Stunned 2 rounds." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: ["stunned"], rounds: 2, description: "Severe frostbite to face. +5 HP loss, Stunned 2 rounds." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["stunned"], rounds: 2, description: "Blood vessels burst from cold. +5 HP loss, Stunned 2 rounds." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: ["stunned"], rounds: 2, description: "Feet frozen to ground. +6 HP loss, Stunned 2 rounds." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["stunned"], rounds: 3, description: "Core temperature dropping. +6 HP loss, Stunned 3 rounds." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: ["stunned"], rounds: 3, description: "Ice crystals in blood. +7 HP loss, Stunned 3 rounds." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: ["stunned"], rounds: 3, description: "Limb encased in ice. +8 HP loss, Stunned 3 rounds." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["held"], rounds: 3, description: "Lower body frozen. +8 HP loss, Held 3 rounds." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["incapacitated"], rounds: 3, description: "Body nearly frozen solid. +9 HP loss, Incapacitated 3 rounds." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Hypothermia sets in. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Fingers shatter from cold. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["incapacitated"], rounds: 12, description: "Limb frozen solid. +12 HP loss, Incapacitated 12 rounds." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["incapacitated"], rounds: 12, description: "Internal organs freezing. +14 HP loss, Incapacitated 12 rounds." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 0, description: "Frozen limb shatters. +16 HP loss, Incapacitated until healed." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["dying"], rounds: 12, description: "Heart slowing to a stop. +18 HP loss, Dying in 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["dying"], rounds: 6, description: "Frozen solid. +20 HP loss, Dying in 6 rounds." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 3, description: "Shattered by ice. +25 HP loss, Dying in 3 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Flash frozen and shattered. +30 HP loss, Dying in 1 round." },
];
