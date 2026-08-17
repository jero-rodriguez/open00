/**
 * Tables Module — exports all attack resolution and critical strike tables.
 *
 * Data sourced from the official VsD data-toolbox repository:
 * https://gitlab.com/jbhuddleston/vsd/-/tree/main/data-toolbox/tables
 */

export { EDGED_ATTACK_TABLE } from "./attacks/edged";
export { BLUNT_ATTACK_TABLE } from "./attacks/blunt";
export { MISSILE_ATTACK_TABLE } from "./attacks/missile";
export { UNARMED_ATTACK_TABLE } from "./attacks/unarmed";
export { AREA_SPELLS_ATTACK_TABLE } from "./attacks/area-spells";
export { BOLT_SPELLS_ATTACK_TABLE } from "./attacks/bolt-spells";
export { BEAST_ATTACK_TABLE } from "./attacks/beast";

export { BEAST_CRITICAL_TABLE } from "./critical/beast";
export { IMPACT_CRITICAL_TABLE } from "./critical/impact";
export { CUT_CRITICAL_TABLE } from "./critical/cut";
export { PIERCE_CRITICAL_TABLE } from "./critical/pierce";
export { GRAPPLE_CRITICAL_TABLE } from "./critical/grapple";
export { FIRE_CRITICAL_TABLE } from "./critical/fire";
export { LIGHTNING_CRITICAL_TABLE } from "./critical/lightning";
export { FROST_CRITICAL_TABLE } from "./critical/frost";
export { DARK_MAGIC_CRITICAL_TABLE } from "./critical/dark-magic";

export type { AttackTableRow, AttackTableCell } from "../config";
export type { CriticalTableEntry } from "../config";
