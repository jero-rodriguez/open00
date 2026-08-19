/**
 * Compute rank bonus from rank value.
 *
 * Piecewise formula:
 * - rank = 0  → 0
 * - rank 1–10 → rank × 5
 * - rank 11–20 → 50 + (rank − 10) × 2
 * - rank ≥ 21 → 70 + (rank − 20) × 1
 *
 * Rank must be >= 0.
 */
export function computeRankBonus(rank: number): number {
  if (rank <= 0) return 0;
  if (rank <= 10) return rank * 5;
  if (rank <= 20) return 50 + (rank - 10) * 2;
  return 70 + (rank - 20) * 1;
}
