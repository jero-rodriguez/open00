/**
 * Beast Critical Strike Table
 * Source: https://gitlab.com/jbhuddleston/vsd/-/tree/main/data-toolbox/tables/critical
 *
 * Roll on this table when a Beast attack results in a critical strike.
 * Add the severity modifier to the d100 roll: Sup +0, Lig +10, Mod +20, Gri +30, Let +50.
 */
import type { CriticalTableEntry } from "../../config";

export const BEAST_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Glancing blow. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Minor scratch. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: [], rounds: 0, description: "Light wound from claws. +1 HP loss." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: [], rounds: 0, description: "Teeth graze target. +2 HP loss." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: [], rounds: 0, description: "Paw strike lands solidly. +2 HP loss." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: [], rounds: 0, description: "Claws rake across armor gap. +3 HP loss." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["stunned"], rounds: 1, description: "Heavy blow staggers target. +3 HP loss, Stunned 1 round." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: [], rounds: 0, description: "Fangs sink into limb. +4 HP loss." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["prone"], rounds: 0, description: "Target knocked off balance. +4 HP loss, Prone." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: [], rounds: 0, description: "Deep claw wounds. +5 HP loss." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["stunned"], rounds: 1, description: "Powerful slam. +5 HP loss, Stunned 1 round." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: [], rounds: 0, description: "Savage bite tears flesh. +6 HP loss." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["prone"], rounds: 0, description: "Target bowled over. +6 HP loss, Prone." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: ["stunned"], rounds: 2, description: "Crushing blow to chest. +7 HP loss, Stunned 2 rounds." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: [], rounds: 0, description: "Massive claws rend deeply. +8 HP loss." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["stunned"], rounds: 2, description: "Jaws clamp on limb. +8 HP loss, Stunned 2 rounds." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["prone"], rounds: 0, description: "Brutal tackle. +9 HP loss, Prone." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["stunned"], rounds: 2, description: "Devastating raking attack. +10 HP loss, Stunned 2 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["held"], rounds: 3, description: "Beast grapples target in jaws. +10 HP loss, Held 3 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["stunned", "prone"], rounds: 3, description: "Massive body slam. +12 HP loss, Stunned 3 rounds, Prone." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["stunned"], rounds: 3, description: "Bones crack under pressure. +14 HP loss, Stunned 3 rounds." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 6, description: "Limb crushed in jaws. +16 HP loss, Incapacitated 6 rounds." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["incapacitated"], rounds: 12, description: "Savage mauling. +18 HP loss, Incapacitated 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["incapacitated"], rounds: 0, description: "Crushed and torn. +20 HP loss, Incapacitated until healed." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 6, description: "Massive trauma. +25 HP loss, Dying in 6 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Fatal mauling. +30 HP loss, Dying in 1 round." },
];
