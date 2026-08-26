/**
 * Overland travel distance computation engine (VsD v1.5).
 *
 * Pure table lookup — no pace system, no miles, no formula.
 * Returns km/day based on encumbrance level × terrain type × travel mode.
 *
 * Source: vsd-travel-healing.md §Overland Movement table.
 */

/** Encumbrance bands for travel distance lookup. */
export type TravelEncumbranceLevel = 'UpToLightly' | 'Encumbered' | 'Heavily' | 'Over';

/** Terrain types affecting overland travel. */
export type TerrainType = 'Normal' | 'Rough' | 'Arduous';

/** Travel mode: on foot or mounted. */
export type TravelMode = 'foot' | 'mount';

/**
 * VsD v1.5 Overland Movement Table (km/day).
 *
 * Structure: [encumbrance][terrain][mode] → km/day
 */
const OVERLAND_TABLE: Record<TravelEncumbranceLevel, Record<TerrainType, Record<TravelMode, number>>> = {
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

/**
 * Compute daily overland travel distance in km/day.
 *
 * @param encumbrance - The character's travel encumbrance band
 * @param terrain - Terrain type traversed
 * @param mode - Whether traveling on foot or mounted
 * @returns Distance in km/day (non-negative integer)
 */
export function computeDailyTravel(
  encumbrance: TravelEncumbranceLevel,
  terrain: TerrainType,
  mode: TravelMode,
): number {
  return OVERLAND_TABLE[encumbrance][terrain][mode];
}
