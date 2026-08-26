import { describe, expect, it } from 'vitest';
import {
  criticalSeverityModifier,
  lookupCriticalTable,
  reduceCriticalSeverity,
  type CriticalTableData,
} from '../../../src/module/engine/combat/critical-tables';

const SYNTHETIC_CRITICAL_TABLE: CriticalTableData = {
  name: 'Synthetic Cut',
  rows: [
    { min: 1, max: 60, severity: 'Superficial', effect: 'Synthetic low effect.' },
    { min: 61, max: 120, severity: 'Moderate', effect: 'Synthetic middle effect.' },
    { min: 121, max: 200, severity: 'Lethal', effect: 'Synthetic high effect.' },
  ],
};

describe('combat critical-table lookup', () => {
  it('uses the exact severity modifiers from the VsD critical rules', () => {
    expect([
      criticalSeverityModifier('Superficial'),
      criticalSeverityModifier('Light'),
      criticalSeverityModifier('Moderate'),
      criticalSeverityModifier('Grievous'),
      criticalSeverityModifier('Lethal'),
    ]).toEqual([0, 10, 20, 30, 50]);
  });

  it('reduces severity once for Heroic and twice for Epic creatures', () => {
    expect(reduceCriticalSeverity('Moderate', 'HB')).toBe('Light');
    expect(reduceCriticalSeverity('Grievous', 'EB')).toBe('Light');
    expect(reduceCriticalSeverity('Moderate', 'NB')).toBe('Moderate');
  });

  it('negates a critical reduced below Superficial', () => {
    expect(reduceCriticalSeverity('Light', 'EB')).toBeNull();
    expect(lookupCriticalTable(SYNTHETIC_CRITICAL_TABLE, 50, 'Light', 'EB')).toEqual({
      negated: true,
      severity: null,
    });
  });

  it('adds the reduced severity modifier to a non-open-ended d100 and finds its row', () => {
    expect(lookupCriticalTable(SYNTHETIC_CRITICAL_TABLE, 100, 'Moderate', 'NB')).toEqual({
      negated: false,
      severity: 'Moderate',
      modifier: 20,
      result: 120,
      tableSeverity: 'Moderate',
      effect: 'Synthetic middle effect.',
    });

    expect(lookupCriticalTable(SYNTHETIC_CRITICAL_TABLE, 100, 'Moderate', 'HB')).toEqual({
      negated: false,
      severity: 'Light',
      modifier: 10,
      result: 110,
      tableSeverity: 'Moderate',
      effect: 'Synthetic middle effect.',
    });
  });
});
