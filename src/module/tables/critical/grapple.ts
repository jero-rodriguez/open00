/**
 * Grapple Critical Strike Table
 * Used by Unarmed/Grappling attacks. Add severity modifier.
 */
import type { CriticalTableEntry } from "../../config";

export const GRAPPLE_CRITICAL_TABLE: readonly CriticalTableEntry[] = [
  { minRoll: 1, maxRoll: 5, hpLoss: 0, conditions: [], rounds: 0, description: "Grip slips. No additional effect." },
  { minRoll: 6, maxRoll: 10, hpLoss: 1, conditions: [], rounds: 0, description: "Minor joint strain. +1 HP loss." },
  { minRoll: 11, maxRoll: 15, hpLoss: 1, conditions: ["held"], rounds: 1, description: "Arm locked briefly. +1 HP loss, Held 1 round." },
  { minRoll: 16, maxRoll: 20, hpLoss: 2, conditions: [], rounds: 0, description: "Wrist twisted painfully. +2 HP loss." },
  { minRoll: 21, maxRoll: 25, hpLoss: 2, conditions: ["held"], rounds: 1, description: "Headlock applied. +2 HP loss, Held 1 round." },
  { minRoll: 26, maxRoll: 30, hpLoss: 3, conditions: ["prone"], rounds: 0, description: "Tripped and thrown. +3 HP loss, Prone." },
  { minRoll: 31, maxRoll: 35, hpLoss: 3, conditions: ["held"], rounds: 2, description: "Bear hug. +3 HP loss, Held 2 rounds." },
  { minRoll: 36, maxRoll: 40, hpLoss: 4, conditions: ["prone"], rounds: 0, description: "Slammed to ground. +4 HP loss, Prone." },
  { minRoll: 41, maxRoll: 45, hpLoss: 4, conditions: ["held"], rounds: 2, description: "Full body pin. +4 HP loss, Held 2 rounds." },
  { minRoll: 46, maxRoll: 50, hpLoss: 5, conditions: ["stunned"], rounds: 1, description: "Chokehold compresses windpipe. +5 HP loss, Stunned 1 round." },
  { minRoll: 51, maxRoll: 55, hpLoss: 5, conditions: ["held"], rounds: 3, description: "Joint lock. +5 HP loss, Held 3 rounds." },
  { minRoll: 56, maxRoll: 60, hpLoss: 6, conditions: ["stunned"], rounds: 2, description: "Headbutt dazes. +6 HP loss, Stunned 2 rounds." },
  { minRoll: 61, maxRoll: 65, hpLoss: 6, conditions: ["held", "prone"], rounds: 3, description: "Mounted pin. +6 HP loss, Held 3 rounds, Prone." },
  { minRoll: 66, maxRoll: 70, hpLoss: 7, conditions: ["stunned"], rounds: 2, description: "Elbow to temple. +7 HP loss, Stunned 2 rounds." },
  { minRoll: 71, maxRoll: 75, hpLoss: 8, conditions: ["held"], rounds: 3, description: "Arm bar applied. +8 HP loss, Held 3 rounds." },
  { minRoll: 76, maxRoll: 80, hpLoss: 8, conditions: ["stunned"], rounds: 3, description: "Finger dislocated. +8 HP loss, Stunned 3 rounds." },
  { minRoll: 81, maxRoll: 85, hpLoss: 9, conditions: ["held", "stunned"], rounds: 3, description: "Shoulder dislocated. +9 HP loss, Held and Stunned 3 rounds." },
  { minRoll: 86, maxRoll: 90, hpLoss: 10, conditions: ["stunned"], rounds: 3, description: "Elbow hyperextended. +10 HP loss, Stunned 3 rounds." },
  { minRoll: 91, maxRoll: 95, hpLoss: 10, conditions: ["incapacitated"], rounds: 6, description: "Arm broken by submission hold. +10 HP loss, Incapacitated 6 rounds." },
  { minRoll: 96, maxRoll: 100, hpLoss: 12, conditions: ["incapacitated"], rounds: 6, description: "Spine compressed. +12 HP loss, Incapacitated 6 rounds." },
  { minRoll: 101, maxRoll: 110, hpLoss: 14, conditions: ["incapacitated"], rounds: 12, description: "Knee destroyed by lock. +14 HP loss, Incapacitated 12 rounds." },
  { minRoll: 111, maxRoll: 120, hpLoss: 16, conditions: ["incapacitated"], rounds: 0, description: "Neck cranked. +16 HP loss, Incapacitated until healed." },
  { minRoll: 121, maxRoll: 130, hpLoss: 18, conditions: ["dying"], rounds: 12, description: "Blood choke renders unconscious. +18 HP loss, Dying in 12 rounds." },
  { minRoll: 131, maxRoll: 140, hpLoss: 20, conditions: ["dying"], rounds: 6, description: "Neck broken. +20 HP loss, Dying in 6 rounds." },
  { minRoll: 141, maxRoll: 150, hpLoss: 25, conditions: ["dying"], rounds: 3, description: "Spine snapped. +25 HP loss, Dying in 3 rounds." },
  { minRoll: 151, maxRoll: Infinity, hpLoss: 30, conditions: ["dying"], rounds: 1, description: "Crushed to death. +30 HP loss, Dying in 1 round." },
];
