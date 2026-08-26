import { describe, expect, it } from 'vitest';
import {
  calculateFumbleResult,
  isWeaponFumble,
} from '../../../src/module/engine/combat/fumble-tables';

describe('combat fumble resolution', () => {
  it('detects a raw d100 inside the weapon Clumsy Range regardless of attack total', () => {
    expect(isWeaponFumble(4, 5)).toBe(true);
    expect(isWeaponFumble(5, 5)).toBe(true);
    expect(isWeaponFumble(6, 5)).toBe(false);
  });

  it('adds the weapon fumble modifier to the non-open-ended d100 result', () => {
    expect(calculateFumbleResult(37, 10)).toBe(47);
    expect(calculateFumbleResult(92, 0)).toBe(92);
  });
});
