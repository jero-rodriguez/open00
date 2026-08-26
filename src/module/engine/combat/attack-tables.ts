/** Pure VsD attack-table lookup over externally supplied table data. */

export const ARMOR_CATEGORIES = ['NA', 'LA', 'MA', 'HA'] as const;
export type ArmorCategory = (typeof ARMOR_CATEGORIES)[number];

export const CRITICAL_SEVERITIES = [
  'Superficial',
  'Light',
  'Moderate',
  'Grievous',
  'Lethal',
] as const;
export type CriticalSeverity = (typeof CRITICAL_SEVERITIES)[number];

export interface AttackTableRow {
  min: number;
  max: number;
  results: readonly [string, string, string, string];
}

export interface AttackTableData {
  name: string;
  columns: readonly ['NA', 'LA', 'MA', 'HA'];
  rows: readonly AttackTableRow[];
}

export interface AttackLookupResult {
  /** Final result after the weapon's Max Result cap. */
  result: number;
  /** Unmodified cell text supplied by the table data. */
  raw: string;
  damage: number;
  criticalSeverity: CriticalSeverity | null;
  automaticMiss: boolean;
}

const SEVERITY_ABBREVIATIONS: Readonly<Record<string, CriticalSeverity>> = {
  Sup: 'Superficial',
  Lig: 'Light',
  Mod: 'Moderate',
  Gri: 'Grievous',
  Let: 'Lethal',
};

function parseAttackCell(raw: string): Pick<AttackLookupResult, 'damage' | 'criticalSeverity'> {
  if (raw === '-' || raw === '0') {
    return { damage: 0, criticalSeverity: null };
  }

  const match = /^(\d+)(?:\s+(Sup|Lig|Mod|Gri|Let))?$/.exec(raw);
  if (!match) {
    throw new Error(`Malformed attack table result: "${raw}"`);
  }

  return {
    damage: Number(match[1]),
    criticalSeverity: match[2] ? SEVERITY_ABBREVIATIONS[match[2]] : null,
  };
}

/**
 * Resolve a computed attack result against one supplied attack table.
 * Numeric table rows are data inputs; this function never supplies defaults.
 */
export function lookupAttackTable(
  table: AttackTableData,
  computedResult: number,
  armorCategory: ArmorCategory,
  maxResult = Number.POSITIVE_INFINITY,
): AttackLookupResult {
  if (table.rows.length === 0) {
    throw new Error(`Table data not available: attack table "${table.name}"`);
  }

  const result = Math.min(computedResult, maxResult);
  if (result <= 10) {
    return {
      result,
      raw: '-',
      damage: 0,
      criticalSeverity: null,
      automaticMiss: true,
    };
  }

  const row = table.rows.find((candidate) => result >= candidate.min && result <= candidate.max);
  if (!row) {
    throw new Error(`Attack table "${table.name}" has no row for result ${result}`);
  }

  const columnIndex = table.columns.indexOf(armorCategory);
  const raw = row.results[columnIndex];
  const parsed = parseAttackCell(raw);
  return { result, raw, ...parsed, automaticMiss: false };
}
