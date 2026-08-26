/**
 * Drive Points — VsD v1.5 Rules
 *
 * Source: vsd-core-rules.md §Drive
 * - Range: 0-5. Starts at 1.
 * - Spending: +10 per Drive Point spent (various options).
 * - NO +30 invokePassion mechanic.
 */
import { describe, it, expect } from 'vitest';
import {
  DRIVE_INITIAL,
  DRIVE_MAX,
  DRIVE_BONUS_PER_POINT,
  spendDrive,
  awardDrive,
  computeDriveBonus,
} from '../../src/module/engine/drive-points';

describe('Drive Points Constants', () => {
  it('initial Drive is 1', () => {
    expect(DRIVE_INITIAL).toBe(1);
  });

  it('maximum Drive is 5', () => {
    expect(DRIVE_MAX).toBe(5);
  });

  it('bonus per point spent is +10', () => {
    expect(DRIVE_BONUS_PER_POINT).toBe(10);
  });
});

describe('spendDrive', () => {
  it('spending 1 from 3 returns remaining=2', () => {
    const result = spendDrive(3, 1);
    expect(result).toEqual({ remaining: 2, bonus: 10 });
  });

  it('spending 2 from 3 returns remaining=1, bonus=+20', () => {
    const result = spendDrive(3, 2);
    expect(result).toEqual({ remaining: 1, bonus: 20 });
  });

  it('spending 5 from 5 returns remaining=0, bonus=+50', () => {
    const result = spendDrive(5, 5);
    expect(result).toEqual({ remaining: 0, bonus: 50 });
  });

  it('spending 0 returns unchanged current with bonus=0', () => {
    const result = spendDrive(3, 0);
    expect(result).toEqual({ remaining: 3, bonus: 0 });
  });

  it('rejects spending more than current', () => {
    const result = spendDrive(2, 3);
    expect(result).toEqual({ error: 'insufficient drive points' });
  });

  it('rejects spending from 0', () => {
    const result = spendDrive(0, 1);
    expect(result).toEqual({ error: 'insufficient drive points' });
  });

  it('rejects negative spend amount', () => {
    const result = spendDrive(3, -1);
    expect(result).toEqual({ error: 'invalid spend amount' });
  });

  it('rejects non-integer spend amount', () => {
    const result = spendDrive(3, 1.5);
    expect(result).toEqual({ error: 'invalid spend amount' });
  });
});

describe('awardDrive', () => {
  it('awarding 1 to 2 returns 3', () => {
    expect(awardDrive(2, 1)).toBe(3);
  });

  it('awarding clamps to DRIVE_MAX (5)', () => {
    expect(awardDrive(4, 3)).toBe(5);
  });

  it('awarding 0 returns unchanged', () => {
    expect(awardDrive(3, 0)).toBe(3);
  });

  it('awarding to already-max returns max', () => {
    expect(awardDrive(5, 1)).toBe(5);
  });

  it('awarding negative clamps to 0', () => {
    expect(awardDrive(2, -5)).toBe(0);
  });
});

describe('computeDriveBonus', () => {
  it('0 points = +0', () => {
    expect(computeDriveBonus(0)).toBe(0);
  });

  it('1 point = +10', () => {
    expect(computeDriveBonus(1)).toBe(10);
  });

  it('3 points = +30', () => {
    expect(computeDriveBonus(3)).toBe(30);
  });

  it('5 points = +50', () => {
    expect(computeDriveBonus(5)).toBe(50);
  });
});
