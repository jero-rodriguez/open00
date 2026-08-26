import {
  ARMOR_CATEGORIES,
  CRITICAL_SEVERITIES,
  type AttackTableData,
  type AttackTableRow,
  type CriticalSeverity,
} from '../engine/combat/attack-tables.js';
import type {
  CriticalTableData,
  CriticalTableRow,
} from '../engine/combat/critical-tables.js';

export const ATTACK_TABLE_FILES = [
  'edged.json',
  'blunt.json',
  'missile.json',
  'unarmed-grappling.json',
  'beast.json',
  'bolt-area-spells.json',
] as const;

export const CRITICAL_TABLE_FILES = [
  'impact.json',
  'cut.json',
  'pierce.json',
  'grapple.json',
  'fire.json',
  'lightning.json',
  'frost.json',
  'dark-magic.json',
  'beast.json',
] as const;

export interface LoadedCombatTables {
  attackTables: Map<string, AttackTableData>;
  criticalTables: Map<string, CriticalTableData>;
}

export interface CombatLoaderOptions {
  basePath?: string;
  attackTableFiles?: readonly string[];
  criticalTableFiles?: readonly string[];
  fetchJson?: (path: string) => Promise<unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidRange(row: Record<string, unknown>): boolean {
  return (
    Number.isInteger(row['min']) &&
    Number.isInteger(row['max']) &&
    (row['min'] as number) <= (row['max'] as number)
  );
}

function isCriticalSeverity(value: unknown): value is CriticalSeverity {
  return typeof value === 'string' && (CRITICAL_SEVERITIES as readonly string[]).includes(value);
}

function malformed(file: string, reason: string): never {
  throw new Error(`Malformed combat table "${file}": ${reason}`);
}

export function validateAttackTable(value: unknown, file: string): AttackTableData {
  if (!isRecord(value) || typeof value['name'] !== 'string' || value['name'].length === 0) {
    malformed(file, 'invalid name');
  }

  const columns = value['columns'];
  if (
    !Array.isArray(columns) ||
    columns.length !== ARMOR_CATEGORIES.length ||
    !ARMOR_CATEGORIES.every((column, index) => columns[index] === column)
  ) {
    malformed(file, 'invalid columns');
  }

  const rows = value['rows'];
  if (!Array.isArray(rows)) malformed(file, 'invalid rows');
  const validatedRows: AttackTableRow[] = rows.map((row, index) => {
    if (
      !isRecord(row) ||
      !isValidRange(row) ||
      !Array.isArray(row['results']) ||
      row['results'].length !== ARMOR_CATEGORIES.length ||
      !row['results'].every((result) => typeof result === 'string')
    ) {
      malformed(file, `invalid attack row ${index}`);
    }
    return row as unknown as AttackTableRow;
  });

  return {
    name: value['name'] as string,
    columns: ['NA', 'LA', 'MA', 'HA'],
    rows: validatedRows,
  };
}

export function validateCriticalTable(value: unknown, file: string): CriticalTableData {
  if (!isRecord(value) || typeof value['name'] !== 'string' || value['name'].length === 0) {
    malformed(file, 'invalid name');
  }

  const rows = value['rows'];
  if (!Array.isArray(rows)) malformed(file, 'invalid rows');
  const validatedRows: CriticalTableRow[] = rows.map((row, index) => {
    if (
      !isRecord(row) ||
      !isValidRange(row) ||
      !isCriticalSeverity(row['severity']) ||
      typeof row['effect'] !== 'string'
    ) {
      malformed(file, `invalid critical row ${index}`);
    }
    return row as unknown as CriticalTableRow;
  });

  return { name: value['name'] as string, rows: validatedRows };
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load combat table "${path}": HTTP ${response.status}`);
  }
  return response.json();
}

function tableId(file: string): string {
  return file.replace(/\.json$/i, '');
}

function tablePath(basePath: string, kind: 'attack-tables' | 'critical-tables', file: string): string {
  return `${basePath.replace(/\/$/, '')}/${kind}/${file}`;
}

/**
 * Load the externally supplied combat JSON at system initialization.
 * The file lists are explicit because a browser cannot enumerate shipped directories.
 */
export async function loadCombatTables(
  options: CombatLoaderOptions = {},
): Promise<LoadedCombatTables> {
  const basePath = options.basePath ?? '/systems/open00/data';
  const attackFiles = options.attackTableFiles ?? ATTACK_TABLE_FILES;
  const criticalFiles = options.criticalTableFiles ?? CRITICAL_TABLE_FILES;
  const readJson = options.fetchJson ?? fetchJson;
  const attackTables = new Map<string, AttackTableData>();
  const criticalTables = new Map<string, CriticalTableData>();

  await Promise.all([
    ...attackFiles.map(async (file) => {
      const value = await readJson(tablePath(basePath, 'attack-tables', file));
      attackTables.set(tableId(file), validateAttackTable(value, file));
    }),
    ...criticalFiles.map(async (file) => {
      const value = await readJson(tablePath(basePath, 'critical-tables', file));
      criticalTables.set(tableId(file), validateCriticalTable(value, file));
    }),
  ]);

  return { attackTables, criticalTables };
}
