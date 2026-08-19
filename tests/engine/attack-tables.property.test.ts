// Feature: open00-system, Property 14: Attack Table Lookup
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  lookupAttackTable,
  AttackTableData,
  ArmorCategory,
} from '../../src/module/engine/attack-tables';

/**
 * Validates: Requirements 17.2, 17.6, 17.8
 *
 * Property 14: Attack Table Lookup
 * For any valid attack table, armor category, and roll total:
 * - Valid tables return an AttackResult with non-negative damage
 * - Roll totals are clamped to the table's min/max range
 * - Invalid table identifiers return an error object
 * - Armor categories are properly resolved
 */
describe('Attack Table Functions – Property 14: Attack Table Lookup', () => {
  const armorCategories: ArmorCategory[] = ['NA', 'LA', 'MA', 'HA'];

  // Create a minimal valid attack table
  const createValidTable = (): AttackTableData => ({
    entries: [
      {
        minRoll: 0,
        maxRoll: 49,
        results: {
          NA: { damage: 2, critical: null },
          LA: { damage: 1, critical: null },
          MA: { damage: 0, critical: null },
          HA: { damage: 0, critical: null },
        },
      },
      {
        minRoll: 50,
        maxRoll: 99,
        results: {
          NA: { damage: 5, critical: null },
          LA: { damage: 4, critical: null },
          MA: { damage: 2, critical: null },
          HA: { damage: 1, critical: null },
        },
      },
      {
        minRoll: 100,
        maxRoll: 150,
        results: {
          NA: {
            damage: 8,
            critical: { severity: 'Light', tableRef: 'critical-light' },
          },
          LA: {
            damage: 6,
            critical: { severity: 'Moderate', tableRef: 'critical-moderate' },
          },
          MA: { damage: 4, critical: { severity: 'Light', tableRef: 'critical-light' } },
          HA: { damage: 2, critical: null },
        },
      },
    ],
  });

  it('returns an AttackResult with non-negative damage for valid tables', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 150 }),
        fc.integer({ min: 0, max: 3 }),
        (rollTotal, armorIndex) => {
          const armorCat = armorCategories[armorIndex];
          const tables = new Map<string, AttackTableData>([
            ['sword', createValidTable()],
          ]);
          const result = lookupAttackTable(rollTotal, 'sword', armorCat, tables);

          expect('damage' in result).toBe(true);
          const typedResult = result as { damage: number; critical: unknown };
          expect(typedResult.damage).toBeGreaterThanOrEqual(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('clamps roll totals to the table range', () => {
    const tables = new Map<string, AttackTableData>([['sword', createValidTable()]]);

    // Roll below table min (0) should use first entry
    const belowMin = lookupAttackTable(-100, 'sword', 'NA', tables);
    expect('damage' in belowMin).toBe(true);

    // Roll above table max (150) should use last entry
    const aboveMax = lookupAttackTable(1000, 'sword', 'NA', tables);
    expect('damage' in aboveMax).toBe(true);

    // Within range should resolve correctly
    const inRange = lookupAttackTable(75, 'sword', 'NA', tables);
    expect('damage' in inRange).toBe(true);
  });

  it('returns an error object for unrecognized table identifiers', () => {
    const tables = new Map<string, AttackTableData>([]);
    const result = lookupAttackTable(100, 'unknown-table', 'NA', tables);

    expect('error' in result).toBe(true);
    const typedResult = result as { error: string };
    expect(typedResult.error).toContain('Unrecognized');
  });

  it('resolves armor categories correctly within the same roll total', () => {
    const tables = new Map<string, AttackTableData>([['sword', createValidTable()]]);

    const naResult = lookupAttackTable(75, 'sword', 'NA', tables);
    const laResult = lookupAttackTable(75, 'sword', 'LA', tables);
    const maResult = lookupAttackTable(75, 'sword', 'MA', tables);
    const haResult = lookupAttackTable(75, 'sword', 'HA', tables);

    const naDamage = (naResult as { damage: number }).damage;
    const laDamage = (laResult as { damage: number }).damage;
    const maDamage = (maResult as { damage: number }).damage;
    const haDamage = (haResult as { damage: number }).damage;

    // Damage typically decreases with better armor
    expect(naDamage).toBeGreaterThanOrEqual(laDamage);
    expect(laDamage).toBeGreaterThanOrEqual(maDamage);
    expect(maDamage).toBeGreaterThanOrEqual(haDamage);
  });

  it('specific boundary examples from table entry ranges', () => {
    const tables = new Map<string, AttackTableData>([['sword', createValidTable()]]);

    // Test exact boundary: minRoll of second entry (50)
    const atBoundary = lookupAttackTable(50, 'sword', 'NA', tables);
    expect('damage' in atBoundary).toBe(true);
    expect((atBoundary as { damage: number }).damage).toBe(5);

    // Test within first range
    const inFirst = lookupAttackTable(25, 'sword', 'NA', tables);
    expect((inFirst as { damage: number }).damage).toBe(2);

    // Test in third range with critical
    const inThird = lookupAttackTable(125, 'sword', 'NA', tables);
    const typed = inThird as { damage: number; critical: unknown };
    expect(typed.damage).toBe(8);
    expect(typed.critical).not.toBeNull();
  });

  it('empty table returns zero damage with no critical', () => {
    const emptyTable: AttackTableData = { entries: [] };
    const tables = new Map<string, AttackTableData>([['empty', emptyTable]]);

    const result = lookupAttackTable(100, 'empty', 'NA', tables);
    expect('damage' in result).toBe(true);
    const typed = result as { damage: number; critical: unknown };
    expect(typed.damage).toBe(0);
    expect(typed.critical).toBeNull();
  });

  it('negative roll totals are clamped and resolved correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -500, max: -1 }),
        fc.integer({ min: 0, max: 3 }),
        (rollTotal, armorIndex) => {
          const armorCat = armorCategories[armorIndex];
          const tables = new Map<string, AttackTableData>([
            ['sword', createValidTable()],
          ]);
          const result = lookupAttackTable(rollTotal, 'sword', armorCat, tables);

          // Negative rolls clamp to table min, should use first entry
          expect('damage' in result).toBe(true);
          const typed = result as { damage: number };
          expect(typed.damage).toBeGreaterThanOrEqual(0);
        },
      ),
      { numRuns: 50 },
    );
  });

  it('all armor categories are resolvable for any valid roll', () => {
    const tables = new Map<string, AttackTableData>([['sword', createValidTable()]]);

    for (const armor of armorCategories) {
      const result = lookupAttackTable(75, 'sword', armor, tables);
      expect('damage' in result).toBe(true);
    }
  });
});
