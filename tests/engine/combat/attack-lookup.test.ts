import { describe, expect, it } from 'vitest';
import {
  lookupAttackTable,
  type AttackTableData,
} from '../../../src/module/engine/combat/attack-tables';

const SYNTHETIC_ATTACK_TABLE: AttackTableData = {
  name: 'Synthetic Edged',
  columns: ['NA', 'LA', 'MA', 'HA'],
  rows: [
    { min: 1, max: 10, results: ['-', '-', '-', '-'] },
    { min: 11, max: 120, results: ['12 Lig', '9 Sup', '5', '0'] },
    { min: 121, max: 140, results: ['18 Mod', '14 Lig', '10 Sup', '6'] },
    { min: 141, max: 175, results: ['24 Gri', '20 Mod', '16 Lig', '12 Sup'] },
  ],
};

describe('combat attack-table lookup', () => {
  it('selects the matching result row and requested armor column', () => {
    expect(lookupAttackTable(SYNTHETIC_ATTACK_TABLE, 125, 'MA')).toEqual({
      result: 125,
      raw: '10 Sup',
      damage: 10,
      criticalSeverity: 'Superficial',
      automaticMiss: false,
    });

    expect(lookupAttackTable(SYNTHETIC_ATTACK_TABLE, 125, 'HA')).toEqual({
      result: 125,
      raw: '6',
      damage: 6,
      criticalSeverity: null,
      automaticMiss: false,
    });
  });

  it('applies the weapon Max Result cap after the computed result', () => {
    expect(lookupAttackTable(SYNTHETIC_ATTACK_TABLE, 155, 'NA', 130)).toEqual({
      result: 130,
      raw: '18 Mod',
      damage: 18,
      criticalSeverity: 'Moderate',
      automaticMiss: false,
    });
  });

  it('treats final results of 10 or less as automatic misses', () => {
    expect(lookupAttackTable(SYNTHETIC_ATTACK_TABLE, 10, 'LA')).toEqual({
      result: 10,
      raw: '-',
      damage: 0,
      criticalSeverity: null,
      automaticMiss: true,
    });
  });

  it('reports unavailable data rather than inventing a result', () => {
    expect(() =>
      lookupAttackTable({ ...SYNTHETIC_ATTACK_TABLE, rows: [] }, 125, 'MA'),
    ).toThrowError('Table data not available: attack table "Synthetic Edged"');

    expect(() => lookupAttackTable(SYNTHETIC_ATTACK_TABLE, 200, 'MA')).toThrowError(
      'Attack table "Synthetic Edged" has no row for result 200',
    );
  });
});
