// Feature: open00-system — Travel Distance Computation (VsD v1.5)
// Source: vsd-travel-healing.md §Overland Movement table
import { describe, it, expect } from 'vitest';
import {
  computeDailyTravel,
  type TravelEncumbranceLevel,
  type TerrainType,
  type TravelMode,
} from '../../src/module/engine/travel';

/**
 * VsD v1.5 Overland Movement Table (km/day):
 *
 * | Encumbrance       | Normal foot | Normal mount | Rough foot | Rough mount | Arduous foot | Arduous mount |
 * |-------------------|-------------|--------------|------------|-------------|--------------|---------------|
 * | Up to Lightly     |     50      |      95      |     30     |      40     |      15      |       8       |
 * | Encumbered        |     30      |      65      |     15     |      25     |       8      |       8       |
 * | Heavily           |     15      |      30      |      8     |      15     |       3      |       0       |
 * | Over              |      0      |       0      |      0     |       0     |       0      |       0       |
 */

describe('computeDailyTravel – VsD v1.5 Overland Movement Table', () => {
  describe('Up to Lightly Encumbered', () => {
    const encumbrance: TravelEncumbranceLevel = 'UpToLightly';

    it('Normal terrain, foot = 50 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'foot')).toBe(50);
    });

    it('Normal terrain, mount = 95 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'mount')).toBe(95);
    });

    it('Rough terrain, foot = 30 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'foot')).toBe(30);
    });

    it('Rough terrain, mount = 40 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'mount')).toBe(40);
    });

    it('Arduous terrain, foot = 15 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'foot')).toBe(15);
    });

    it('Arduous terrain, mount = 8 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'mount')).toBe(8);
    });
  });

  describe('Encumbered', () => {
    const encumbrance: TravelEncumbranceLevel = 'Encumbered';

    it('Normal terrain, foot = 30 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'foot')).toBe(30);
    });

    it('Normal terrain, mount = 65 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'mount')).toBe(65);
    });

    it('Rough terrain, foot = 15 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'foot')).toBe(15);
    });

    it('Rough terrain, mount = 25 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'mount')).toBe(25);
    });

    it('Arduous terrain, foot = 8 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'foot')).toBe(8);
    });

    it('Arduous terrain, mount = 8 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'mount')).toBe(8);
    });
  });

  describe('Heavily Encumbered', () => {
    const encumbrance: TravelEncumbranceLevel = 'Heavily';

    it('Normal terrain, foot = 15 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'foot')).toBe(15);
    });

    it('Normal terrain, mount = 30 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'mount')).toBe(30);
    });

    it('Rough terrain, foot = 8 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'foot')).toBe(8);
    });

    it('Rough terrain, mount = 15 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'mount')).toBe(15);
    });

    it('Arduous terrain, foot = 3 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'foot')).toBe(3);
    });

    it('Arduous terrain, mount = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'mount')).toBe(0);
    });
  });

  describe('Over Encumbered', () => {
    const encumbrance: TravelEncumbranceLevel = 'Over';

    it('Normal terrain, foot = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'foot')).toBe(0);
    });

    it('Normal terrain, mount = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Normal', 'mount')).toBe(0);
    });

    it('Rough terrain, foot = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'foot')).toBe(0);
    });

    it('Rough terrain, mount = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Rough', 'mount')).toBe(0);
    });

    it('Arduous terrain, foot = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'foot')).toBe(0);
    });

    it('Arduous terrain, mount = 0 km/day', () => {
      expect(computeDailyTravel(encumbrance, 'Arduous', 'mount')).toBe(0);
    });
  });

  describe('Exhaustive table coverage', () => {
    const EXPECTED_TABLE: Record<TravelEncumbranceLevel, Record<TerrainType, Record<TravelMode, number>>> = {
      UpToLightly: {
        Normal: { foot: 50, mount: 95 },
        Rough: { foot: 30, mount: 40 },
        Arduous: { foot: 15, mount: 8 },
      },
      Encumbered: {
        Normal: { foot: 30, mount: 65 },
        Rough: { foot: 15, mount: 25 },
        Arduous: { foot: 8, mount: 8 },
      },
      Heavily: {
        Normal: { foot: 15, mount: 30 },
        Rough: { foot: 8, mount: 15 },
        Arduous: { foot: 3, mount: 0 },
      },
      Over: {
        Normal: { foot: 0, mount: 0 },
        Rough: { foot: 0, mount: 0 },
        Arduous: { foot: 0, mount: 0 },
      },
    };

    it('all 24 cells match the VsD v1.5 table', () => {
      for (const [enc, terrains] of Object.entries(EXPECTED_TABLE)) {
        for (const [terrain, modes] of Object.entries(terrains)) {
          for (const [mode, expected] of Object.entries(modes)) {
            const result = computeDailyTravel(
              enc as TravelEncumbranceLevel,
              terrain as TerrainType,
              mode as TravelMode,
            );
            expect(result, `${enc}/${terrain}/${mode}`).toBe(expected);
          }
        }
      }
    });
  });
});
