/**
 * Attack table lookup engine.
 *
 * Pure function with zero FoundryVTT imports.
 * Resolves attack roll totals against weapon-specific attack tables
 * per target armor category, returning damage and optional critical indicators.
 */

/** Armor categories as defined in VsD: No Armor, Light, Medium, Heavy */
export type ArmorCategory = 'NA' | 'LA' | 'MA' | 'HA';

/** Critical severity levels from least to most severe */
export type CriticalSeverity = 'Superficial' | 'Light' | 'Moderate' | 'Grievous' | 'Lethal';

/** Result of an attack table lookup for a valid table */
export interface AttackResult {
  damage: number;
  critical: { severity: CriticalSeverity; tableRef: string } | null;
}

/** A single entry in an attack table mapping a roll range to results per armor category */
export interface AttackTableEntry {
  minRoll: number;
  maxRoll: number;
  results: Record<ArmorCategory, { damage: number; critical: { severity: CriticalSeverity; tableRef: string } | null }>;
}

/** Structure representing a complete attack table's data */
export interface AttackTableData {
  entries: AttackTableEntry[];
}

/**
 * Look up an attack table result given a roll total, table identifier, and armor category.
 *
 * For valid tables, the roll total is clamped to the table's minimum and maximum row values.
 * Returns damage (always non-negative for valid tables) plus an optional critical indicator.
 * Returns an error object for unrecognized table identifiers.
 *
 * @param rollTotal - The attack roll total (any integer)
 * @param tableId - The attack table identifier (e.g., weapon type)
 * @param armorCategory - The target's armor category
 * @param tables - Map of all loaded attack tables keyed by table identifier
 * @returns AttackResult on success, or { error: string } for unknown tableId
 */
export function lookupAttackTable(
  rollTotal: number,
  tableId: string,
  armorCategory: ArmorCategory,
  tables: Map<string, AttackTableData>
): AttackResult | { error: string } {
  const table = tables.get(tableId);
  if (!table) {
    return { error: `Unrecognized attack table identifier: ${tableId}` };
  }

  const entries = table.entries;
  if (entries.length === 0) {
    return { damage: 0, critical: null };
  }

  // Clamp roll total to the table's min/max range
  const tableMin = entries[0].minRoll;
  const tableMax = entries[entries.length - 1].maxRoll;
  const clampedRoll = Math.max(tableMin, Math.min(tableMax, rollTotal));

  // Find the matching entry for the clamped roll
  for (const entry of entries) {
    if (clampedRoll >= entry.minRoll && clampedRoll <= entry.maxRoll) {
      const result = entry.results[armorCategory];
      return {
        damage: result.damage,
        critical: result.critical,
      };
    }
  }

  // Fallback: if no entry matched (should not happen with well-formed tables),
  // return zero damage with no critical
  return { damage: 0, critical: null };
}
