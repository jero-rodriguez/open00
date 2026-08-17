/**
 * Bolt Spells Attack Table (Table 7.6)
 * Source: https://gitlab.com/jbhuddleston/vsd/-/raw/main/data-toolbox/tables/attacks/bolt-spells.html
 */
import type { AttackTableRow } from "../../config";

export const BOLT_SPELLS_ATTACK_TABLE: readonly AttackTableRow[] = [
  { minRoll: -Infinity, maxRoll: 10, NA: null, LA: null, MA: null, HA: null },
  { minRoll: 11, maxRoll: 35, NA: null, LA: null, MA: null, HA: null },
  { minRoll: 36, maxRoll: 40, NA: null, LA: null, MA: null, HA: null },
  { minRoll: 41, maxRoll: 45, NA: null, LA: null, MA: null, HA: null },
  { minRoll: 46, maxRoll: 50, NA: null, LA: null, MA: null, HA: { hits: 0, crit: "" } },
  { minRoll: 51, maxRoll: 55, NA: null, LA: null, MA: null, HA: { hits: 0, crit: "" } },
  { minRoll: 56, maxRoll: 60, NA: null, LA: null, MA: { hits: 0, crit: "" }, HA: { hits: 0, crit: "" } },
  { minRoll: 61, maxRoll: 65, NA: null, LA: null, MA: { hits: 0, crit: "" }, HA: { hits: 0, crit: "" } },
  { minRoll: 66, maxRoll: 70, NA: null, LA: { hits: 0, crit: "" }, MA: { hits: 1, crit: "" }, HA: { hits: 1, crit: "" } },
  { minRoll: 71, maxRoll: 75, NA: null, LA: { hits: 0, crit: "" }, MA: { hits: 3, crit: "" }, HA: { hits: 1, crit: "" } },
  { minRoll: 76, maxRoll: 80, NA: { hits: 0, crit: "" }, LA: { hits: 0, crit: "" }, MA: { hits: 3, crit: "" }, HA: { hits: 2, crit: "" } },
  { minRoll: 81, maxRoll: 85, NA: { hits: 0, crit: "" }, LA: { hits: 1, crit: "" }, MA: { hits: 2, crit: "" }, HA: { hits: 2, crit: "" } },
  { minRoll: 86, maxRoll: 90, NA: { hits: 0, crit: "" }, LA: { hits: 2, crit: "" }, MA: { hits: 3, crit: "" }, HA: { hits: 3, crit: "" } },
  { minRoll: 91, maxRoll: 95, NA: { hits: 8, crit: "Sup" }, LA: { hits: 3, crit: "" }, MA: { hits: 4, crit: "" }, HA: { hits: 3, crit: "" } },
  { minRoll: 96, maxRoll: 100, NA: { hits: 10, crit: "Sup" }, LA: { hits: 4, crit: "" }, MA: { hits: 5, crit: "Sup" }, HA: { hits: 4, crit: "Sup" } },
  { minRoll: 101, maxRoll: 105, NA: { hits: 11, crit: "Sup" }, LA: { hits: 5, crit: "Sup" }, MA: { hits: 6, crit: "Sup" }, HA: { hits: 5, crit: "Sup" } },
  { minRoll: 106, maxRoll: 110, NA: { hits: 12, crit: "Lig" }, LA: { hits: 6, crit: "Sup" }, MA: { hits: 7, crit: "Sup" }, HA: { hits: 6, crit: "Sup" } },
  { minRoll: 111, maxRoll: 115, NA: { hits: 14, crit: "Lig" }, LA: { hits: 8, crit: "Sup" }, MA: { hits: 8, crit: "Sup" }, HA: { hits: 7, crit: "Sup" } },
  { minRoll: 116, maxRoll: 120, NA: { hits: 16, crit: "Lig" }, LA: { hits: 10, crit: "Lig" }, MA: { hits: 10, crit: "Lig" }, HA: { hits: 8, crit: "Sup" } },
  { minRoll: 121, maxRoll: 125, NA: { hits: 18, crit: "Mod" }, LA: { hits: 12, crit: "Lig" }, MA: { hits: 12, crit: "Lig" }, HA: { hits: 12, crit: "Lig" } },
  { minRoll: 126, maxRoll: 130, NA: { hits: 21, crit: "Mod" }, LA: { hits: 14, crit: "Lig" }, MA: { hits: 14, crit: "Lig" }, HA: { hits: 13, crit: "Lig" } },
  { minRoll: 131, maxRoll: 135, NA: { hits: 24, crit: "Mod" }, LA: { hits: 16, crit: "Mod" }, MA: { hits: 15, crit: "Lig" }, HA: { hits: 14, crit: "Lig" } },
  { minRoll: 136, maxRoll: 140, NA: { hits: 27, crit: "Gri" }, LA: { hits: 17, crit: "Mod" }, MA: { hits: 16, crit: "Mod" }, HA: { hits: 15, crit: "Lig" } },
  { minRoll: 141, maxRoll: 145, NA: { hits: 30, crit: "Gri" }, LA: { hits: 18, crit: "Mod" }, MA: { hits: 17, crit: "Mod" }, HA: { hits: 16, crit: "Mod" } },
  { minRoll: 146, maxRoll: 150, NA: { hits: 32, crit: "Gri" }, LA: { hits: 19, crit: "Gri" }, MA: { hits: 18, crit: "Mod" }, HA: { hits: 17, crit: "Mod" } },
  { minRoll: 151, maxRoll: 155, NA: { hits: 34, crit: "Let" }, LA: { hits: 20, crit: "Gri" }, MA: { hits: 20, crit: "Mod" }, HA: { hits: 20, crit: "Mod" } },
  { minRoll: 156, maxRoll: 160, NA: { hits: 36, crit: "Let" }, LA: { hits: 22, crit: "Gri" }, MA: { hits: 22, crit: "Gri" }, HA: { hits: 22, crit: "Gri" } },
  { minRoll: 161, maxRoll: 165, NA: { hits: 38, crit: "Let" }, LA: { hits: 25, crit: "Let" }, MA: { hits: 24, crit: "Gri" }, HA: { hits: 24, crit: "Gri" } },
  { minRoll: 166, maxRoll: 170, NA: { hits: 40, crit: "Let" }, LA: { hits: 28, crit: "Let" }, MA: { hits: 26, crit: "Let" }, HA: { hits: 26, crit: "Gri" } },
  { minRoll: 171, maxRoll: 175, NA: { hits: 42, crit: "Let" }, LA: { hits: 31, crit: "Let" }, MA: { hits: 28, crit: "Let" }, HA: { hits: 26, crit: "Let" } },
];
