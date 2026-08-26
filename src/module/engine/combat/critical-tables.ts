import {
  CRITICAL_SEVERITIES,
  type CriticalSeverity,
} from './attack-tables.js';

export interface CriticalTableRow {
  min: number;
  max: number;
  severity: CriticalSeverity;
  effect: string;
}

export interface CriticalTableData {
  name: string;
  rows: readonly CriticalTableRow[];
}

export type CriticalLookupResult =
  | { negated: true; severity: null }
  | {
      negated: false;
      severity: CriticalSeverity;
      modifier: number;
      result: number;
      tableSeverity: CriticalSeverity;
      effect: string;
    };

const SEVERITY_MODIFIERS: Readonly<Record<CriticalSeverity, number>> = {
  Superficial: 0,
  Light: 10,
  Moderate: 20,
  Grievous: 30,
  Lethal: 50,
};

export function criticalSeverityModifier(severity: CriticalSeverity): number {
  return SEVERITY_MODIFIERS[severity];
}

/** Apply the Heroic (-1) or Epic (-2) creature critical reduction. */
export function reduceCriticalSeverity(
  severity: CriticalSeverity,
  creatureType: string,
): CriticalSeverity | null {
  const reduction = creatureType.startsWith('E') ? 2 : creatureType.startsWith('H') ? 1 : 0;
  const reducedIndex = CRITICAL_SEVERITIES.indexOf(severity) - reduction;
  return reducedIndex >= 0 ? CRITICAL_SEVERITIES[reducedIndex] : null;
}

/** Resolve one non-open-ended critical roll against supplied critical-table data. */
export function lookupCriticalTable(
  table: CriticalTableData,
  d100: number,
  severity: CriticalSeverity,
  creatureType: string,
): CriticalLookupResult {
  if (table.rows.length === 0) {
    throw new Error(`Table data not available: critical table "${table.name}"`);
  }

  const reducedSeverity = reduceCriticalSeverity(severity, creatureType);
  if (reducedSeverity === null) {
    return { negated: true, severity: null };
  }

  const modifier = criticalSeverityModifier(reducedSeverity);
  const result = d100 + modifier;
  const row = table.rows.find((candidate) => result >= candidate.min && result <= candidate.max);
  if (!row) {
    throw new Error(`Critical table "${table.name}" has no row for result ${result}`);
  }

  return {
    negated: false,
    severity: reducedSeverity,
    modifier,
    result,
    tableSeverity: row.severity,
    effect: row.effect,
  };
}
