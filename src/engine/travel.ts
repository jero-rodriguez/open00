/**
 * Travel duration computation engine.
 *
 * Computes travel duration in hours based on distance, pace, terrain, and party movement rate.
 * Pure function with zero FoundryVTT imports.
 *
 * Formula: duration = (distanceMiles * terrainModifier) / (partyMovementRate * paceMultiplier)
 *
 * Pace multipliers:
 * - Careful: 0.5× speed (slowest)
 * - Normal: 1.0× speed
 * - Fast: 1.5× speed
 * - ForcedMarch: 2.0× speed (fastest)
 */

export type TravelPace = 'Careful' | 'Normal' | 'Fast' | 'ForcedMarch';

const PACE_MULTIPLIERS: Record<TravelPace, number> = {
  Careful: 0.5,
  Normal: 1.0,
  Fast: 1.5,
  ForcedMarch: 2.0,
};

/**
 * Compute travel duration in hours.
 *
 * @param distanceMiles - Distance to travel in miles (positive)
 * @param pace - Travel pace affecting speed
 * @param terrainModifier - Terrain difficulty modifier (positive; higher = slower travel)
 * @param partyMovementRate - Party movement rate (positive; higher = faster travel)
 * @returns Duration in hours (positive for positive inputs)
 */
export function computeTravelDuration(
  distanceMiles: number,
  pace: TravelPace,
  terrainModifier: number,
  partyMovementRate: number
): number {
  const paceMultiplier = PACE_MULTIPLIERS[pace];
  return (distanceMiles * terrainModifier) / (partyMovementRate * paceMultiplier);
}
