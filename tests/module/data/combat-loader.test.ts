import { describe, expect, it } from 'vitest';
import {
  loadCombatTables,
  validateAttackTable,
  validateCriticalTable,
} from '../../../src/module/data/combat-loader';

const validAttackTable = {
  name: 'Synthetic Edged',
  columns: ['NA', 'LA', 'MA', 'HA'],
  rows: [{ min: 1, max: 10, results: ['-', '-', '-', '-'] }],
};

const validCriticalTable = {
  name: 'Synthetic Cut',
  rows: [{ min: 1, max: 100, severity: 'Superficial', effect: 'Synthetic effect.' }],
};

describe('combat table data loader', () => {
  it('rejects an attack table missing the required armor columns and identifies the file', () => {
    expect(() =>
      validateAttackTable(
        { name: 'Malformed', rows: [{ min: 1, max: 10, results: ['-'] }] },
        'malformed.json',
      ),
    ).toThrowError('Malformed combat table "malformed.json": invalid columns');
  });

  it('rejects malformed critical rows and identifies the file', () => {
    expect(() =>
      validateCriticalTable(
        { name: 'Malformed', rows: [{ min: 10, max: 1, severity: 'Unknown', effect: 3 }] },
        'bad-critical.json',
      ),
    ).toThrowError('Malformed combat table "bad-critical.json": invalid critical row 0');
  });

  it('loads validated attack and critical JSON into maps keyed by file id', async () => {
    const fixtures: Record<string, unknown> = {
      '/systems/open00/data/attack-tables/edged.json': validAttackTable,
      '/systems/open00/data/critical-tables/cut.json': validCriticalTable,
    };

    const loaded = await loadCombatTables({
      basePath: '/systems/open00/data',
      attackTableFiles: ['edged.json'],
      criticalTableFiles: ['cut.json'],
      fetchJson: async (path) => fixtures[path],
    });

    expect(loaded.attackTables.get('edged')).toEqual(validAttackTable);
    expect(loaded.criticalTables.get('cut')).toEqual(validCriticalTable);
    expect([...loaded.attackTables.keys()]).toEqual(['edged']);
    expect([...loaded.criticalTables.keys()]).toEqual(['cut']);
  });
});
