/**
 * Edged Attack Table (Table 7.1)
 * Source: https://gitlab.com/jbhuddleston/vsd/-/raw/main/data-toolbox/tables/attacks/edged.html
 */
import type { AttackTableRow } from "../../config";

export const EDGED_ATTACK_TABLE: readonly AttackTableRow[] = [
  { minRoll: -Infinity, maxRoll: 10, NA: null, LA: null, MA: null, HA: null },
  { minRoll: 11, maxRoll: 35, NA: null, LA: null, MA: null, HA: null },
  { minRoll: 36, maxRoll: 40, NA: null, LA: null, MA: null, HA: { hits: 0, crit: "" } },
  { minRoll: 41, maxRoll: 45, NA: null, LA: null, MA: { hits: 0, crit: "" }, HA: { hits: 0, crit: "" } },
  { minRoll: 46, maxRoll: 50, NA: null, LA: { hits: 0, crit: "" }, MA: { hits: 0, crit: "" }, HA: { hits: 1, crit: "" } },
  { minRoll: 51, maxRoll: 55, NA: { hits: 0, crit: "" }, LA: { hits: 0, crit: "" }, MA: { hits: 0, crit: "" }, HA: { hits: 1, crit: "" } },
  { minRoll: 56, maxRoll: 60, NA: { hits: 0, crit: "" }, LA: { hits: 0, crit: "" }, MA: { hits: 1, crit: "" }, HA: { hits: 2, crit: "" } },
  { minRoll: 61, maxRoll: 65, NA: { hits: 0, crit: "" }, LA: { hits: 0, crit: "" }, MA: { hits: 2, crit: "" }, HA: { hits: 2, crit: "" } },
  { minRoll: 66, maxRoll: 70, NA: { hits: 0, crit: "" }, LA: { hits: 2, crit: "" }, MA: { hits: 3, crit: "" }, HA: { hits: 3, crit: "" } },
  { minRoll: 71, maxRoll: 75, NA: { hits: 0, crit: "" }, LA: { hits: 3, crit: "" }, MA: { hits: 4, crit: "" }, HA: { hits: 3, crit: "" } },
  { minRoll: 76, maxRoll: 80, NA: { hits: 7, crit: "Sup" }, LA: { hits: 5, crit: "" }, MA: { hits: 5, crit: "" }, HA: { hits: 4, crit: "" } },
  { minRoll: 81, maxRoll: 85, NA: { hits: 9, crit: "Sup" }, LA: { hits: 6, crit: "" }, MA: { hits: 6, crit: "" }, HA: { hits: 5, crit: "" } },
  { minRoll: 86, maxRoll: 90, NA: { hits: 10, crit: "Lig" }, LA: { hits: 7, crit: "" }, MA: { hits: 7, crit: "" }, HA: { hits: 5, crit: "" } },
  { minRoll: 91, maxRoll: 95, NA: { hits: 11, crit: "Lig" }, LA: { hits: 9, crit: "Sup" }, MA: { hits: 8, crit: "" }, HA: { hits: 6, crit: "" } },
  { minRoll: 96, maxRoll: 100, NA: { hits: 13, crit: "Mod" }, LA: { hits: 10, crit: "Sup" }, MA: { hits: 9, crit: "" }, HA: { hits: 6, crit: "" } },
  { minRoll: 101, maxRoll: 105, NA: { hits: 15, crit: "Mod" }, LA: { hits: 11, crit: "Sup" }, MA: { hits: 10, crit: "Sup" }, HA: { hits: 7, crit: "" } },
  { minRoll: 106, maxRoll: 110, NA: { hits: 17, crit: "Gri" }, LA: { hits: 12, crit: "Lig" }, MA: { hits: 11, crit: "Sup" }, HA: { hits: 8, crit: "" } },
  { minRoll: 111, maxRoll: 115, NA: { hits: 19, crit: "Gri" }, LA: { hits: 13, crit: "Lig" }, MA: { hits: 12, crit: "Lig" }, HA: { hits: 8, crit: "Sup" } },
  { minRoll: 116, maxRoll: 120, NA: { hits: 20, crit: "Gri" }, LA: { hits: 15, crit: "Mod" }, MA: { hits: 13, crit: "Lig" }, HA: { hits: 9, crit: "Sup" } },
  { minRoll: 121, maxRoll: 125, NA: { hits: 21, crit: "Let" }, LA: { hits: 16, crit: "Mod" }, MA: { hits: 13, crit: "Mod" }, HA: { hits: 10, crit: "Sup" } },
  { minRoll: 126, maxRoll: 130, NA: { hits: 23, crit: "Let" }, LA: { hits: 17, crit: "Gri" }, MA: { hits: 14, crit: "Mod" }, HA: { hits: 10, crit: "Lig" } },
  { minRoll: 131, maxRoll: 135, NA: { hits: 25, crit: "Let" }, LA: { hits: 18, crit: "Gri" }, MA: { hits: 15, crit: "Mod" }, HA: { hits: 10, crit: "Lig" } },
  { minRoll: 136, maxRoll: 140, NA: { hits: 27, crit: "Let" }, LA: { hits: 20, crit: "Gri" }, MA: { hits: 16, crit: "Gri" }, HA: { hits: 11, crit: "Mod" } },
  { minRoll: 141, maxRoll: 145, NA: { hits: 28, crit: "Let" }, LA: { hits: 21, crit: "Let" }, MA: { hits: 17, crit: "Gri" }, HA: { hits: 11, crit: "Gri" } },
  { minRoll: 146, maxRoll: 150, NA: { hits: 30, crit: "Let" }, LA: { hits: 22, crit: "Let" }, MA: { hits: 18, crit: "Let" }, HA: { hits: 12, crit: "Gri" } },
  { minRoll: 151, maxRoll: 155, NA: { hits: 34, crit: "Let" }, LA: { hits: 26, crit: "Let" }, MA: { hits: 21, crit: "Let" }, HA: { hits: 14, crit: "Gri" } },
  { minRoll: 156, maxRoll: 160, NA: { hits: 38, crit: "Let" }, LA: { hits: 30, crit: "Let" }, MA: { hits: 24, crit: "Let" }, HA: { hits: 16, crit: "Let" } },
  { minRoll: 161, maxRoll: 165, NA: { hits: 42, crit: "Let" }, LA: { hits: 34, crit: "Let" }, MA: { hits: 27, crit: "Let" }, HA: { hits: 18, crit: "Let" } },
  { minRoll: 166, maxRoll: 170, NA: { hits: 46, crit: "Let" }, LA: { hits: 37, crit: "Let" }, MA: { hits: 30, crit: "Let" }, HA: { hits: 20, crit: "Let" } },
  { minRoll: 171, maxRoll: 175, NA: { hits: 50, crit: "Let" }, LA: { hits: 40, crit: "Let" }, MA: { hits: 33, crit: "Let" }, HA: { hits: 22, crit: "Let" } },
];
