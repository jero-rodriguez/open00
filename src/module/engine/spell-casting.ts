/**
 * Spell casting engine for Open 00.
 *
 * Pure function module — zero imports from FoundryVTT.
 *
 * Implements the Against the Darkmaster spell casting rules:
 * - Spell Casting Roll = Open-Ended d100 + Spell Lore Skill Bonus + Modifiers
 * - Spell Casting Table lookup (outcome + SR Difficulty)
 * - MP cost calculation (base = Weave, with warping support)
 * - Casting validation (level cap, MP availability, overcasting)
 * - Magical Resonance detection and roll computation
 * - Overcasting penalty calculation
 * - Concentration and modifier computation
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** Range bands for spell casting roll modifiers. */
export type RangeBand = 'touch' | 'close' | 'short' | 'medium' | 'long' | 'extreme';

/** Spell casting modifiers that affect the roll. */
export interface SpellCastingModifiers {
  /** Rounds spent concentrating (0-4). Each round grants +10. */
  concentrationRounds: number;
  /** Whether the spell is cast without preparation (Improvised = -10). */
  isImprovised: boolean;
  /** Whether the spell is Instantaneous (no improvised penalty, no concentration benefit). */
  isInstantaneous: boolean;
  /** Whether the target is completely static (+10). */
  targetIsStatic: boolean;
  /** Range band to the target. */
  rangeBand: RangeBand;
  /** Armor Movement Penalty (negative number, modified by Armor Skill Bonus). */
  armorPenalty: number;
}

/** Outcome category from the Spell Casting Table. */
export type SpellOutcome = 'failure' | 'partial' | 'success' | 'outstanding';

/** Result of looking up the Spell Casting Table. */
export interface SpellCastingTableResult {
  outcome: SpellOutcome;
  /** Save Roll Difficulty the target must beat (null if no SR applies). */
  srDifficulty: number | null;
}

/** Result of a complete spell casting resolution. */
export interface SpellCastingResult {
  /** The final computed total (roll + skillBonus + modifiers). */
  total: number;
  /** The breakdown of modifiers applied. */
  totalModifier: number;
  /** Outcome from the Spell Casting Table. */
  tableResult: SpellCastingTableResult;
  /** Whether Magical Resonance was triggered (doubles on initial d100). */
  resonanceTriggered: boolean;
}

/** Overcasting context for penalty and resonance calculation. */
export interface OvercastingContext {
  /** The Weave of the spell being cast. */
  spellWeave: number;
  /** The caster's current Level. */
  casterLevel: number;
}

/** Celestial Alignment states that affect spell casting. */
export type CelestialAlignment = 'benefic' | 'auspicious' | 'neutral' | 'malefic' | 'disastrous';

/** Spell type categories for Resonance and Failure modifiers. */
export type ResonanceType =
  | 'healing'
  | 'spirit'
  | 'light'
  | 'natural'
  | 'elven'
  | 'illusory'
  | 'attack'
  | 'dark'
  | 'other';

/**
 * The Spell Failure severity is stored directly as the modifier value (0, 10, 20, 30, 50).
 * No separate type needed — the number IS the domain concept.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

/** Range band modifiers for the Spell Casting Roll. */
const RANGE_MODIFIERS: Record<RangeBand, number> = {
  touch: 30,
  close: 10,    // up to 3m
  short: 0,     // 4-15m
  medium: -10,  // 16-30m
  long: -20,    // 31-90m
  extreme: -30, // more than 90m
};

// ─── Modifier Computation ────────────────────────────────────────────────────

/**
 * Compute the total modifier for a spell casting roll.
 *
 * Modifiers:
 * - Concentration: +10 per round, max +40 (ignored for Instantaneous spells)
 * - Improvised: -10 (ignored for Instantaneous spells)
 * - Static target: +10
 * - Range: +30 (touch) to -30 (extreme)
 * - Armor penalty: negative value from armor movement penalty
 */
export function computeCastingModifier(modifiers: SpellCastingModifiers): number {
  let total = 0;

  if (modifiers.isInstantaneous) {
    // Instantaneous spells: no concentration benefit, no improvised penalty
  } else {
    // Concentration: +10 per round, clamped to 0-4 rounds
    const rounds = Math.max(0, Math.min(4, modifiers.concentrationRounds));
    total += rounds * 10;

    // Improvised penalty: -10 when cast without preparation
    if (modifiers.isImprovised) {
      total -= 10;
    }
  }

  // Static target bonus
  if (modifiers.targetIsStatic) {
    total += 10;
  }

  // Range modifier
  total += RANGE_MODIFIERS[modifiers.rangeBand];

  // Armor penalty (already negative)
  total += modifiers.armorPenalty;

  return total;
}

// ─── Spell Casting Table ─────────────────────────────────────────────────────

/**
 * Look up the Spell Casting Table result for a given total.
 *
 * | Roll       | SR Difficulty | Outcome             |
 * |------------|---------------|---------------------|
 * | ≤ 25       | -             | Spell Failure       |
 * | 26–50      | -             | Partial Success     |
 * | 51–80      | 50            | Success             |
 * | 81–95      | 60            | Success             |
 * | 96–105     | 65            | Success             |
 * | 106–110    | 70            | Success             |
 * | 111–120    | 75            | Success             |
 * | 121–130    | 80            | Success             |
 * | 131–135    | 85            | Success             |
 * | 136–140    | 90            | Success             |
 * | 141–145    | 95            | Success             |
 * | 146–150    | 100           | Success             |
 * | 151–155    | 105           | Outstanding Success |
 * | 156–160    | 110           | Outstanding Success |
 * | 161–165    | 120           | Outstanding Success |
 * | 166–170    | 130           | Outstanding Success |
 * | 171–175    | 140           | Outstanding Success |
 * | 176+       | 150           | Outstanding Success |
 */
export function lookupSpellCastingTable(total: number): SpellCastingTableResult {
  if (total <= 25) return { outcome: 'failure', srDifficulty: null };
  if (total <= 50) return { outcome: 'partial', srDifficulty: null };
  if (total <= 80) return { outcome: 'success', srDifficulty: 50 };
  if (total <= 95) return { outcome: 'success', srDifficulty: 60 };
  if (total <= 105) return { outcome: 'success', srDifficulty: 65 };
  if (total <= 110) return { outcome: 'success', srDifficulty: 70 };
  if (total <= 120) return { outcome: 'success', srDifficulty: 75 };
  if (total <= 130) return { outcome: 'success', srDifficulty: 80 };
  if (total <= 135) return { outcome: 'success', srDifficulty: 85 };
  if (total <= 140) return { outcome: 'success', srDifficulty: 90 };
  if (total <= 145) return { outcome: 'success', srDifficulty: 95 };
  if (total <= 150) return { outcome: 'success', srDifficulty: 100 };
  if (total <= 155) return { outcome: 'outstanding', srDifficulty: 105 };
  if (total <= 160) return { outcome: 'outstanding', srDifficulty: 110 };
  if (total <= 165) return { outcome: 'outstanding', srDifficulty: 120 };
  if (total <= 170) return { outcome: 'outstanding', srDifficulty: 130 };
  if (total <= 175) return { outcome: 'outstanding', srDifficulty: 140 };
  return { outcome: 'outstanding', srDifficulty: 150 };
}

// ─── Spell Casting Roll ──────────────────────────────────────────────────────

/**
 * Compute the spell casting total.
 *
 * Formula: rollResult + skillBonus + modifiers
 *
 * This is the core formula per the rules: an Open-Ended d100 Roll plus the
 * caster's Spell Lore Skill Bonus plus situational modifiers.
 *
 * @param rollResult - The open-ended d100 roll result
 * @param skillBonus - The caster's total Spell Lore Skill Bonus
 * @param modifier - The total situational modifier (from computeCastingModifier)
 * @returns The spell casting total to look up on the Spell Casting Table
 */
export function computeSpellTotal(
  rollResult: number,
  skillBonus: number,
  modifier: number,
): number {
  return rollResult + skillBonus + modifier;
}

// ─── Magical Resonance ───────────────────────────────────────────────────────

/**
 * Detect Magical Resonance from an initial d100 value.
 *
 * Magical Resonance occurs when the caster rolls doubles on their Spell Casting Roll
 * (i.e., 11, 22, 33, 44, 55, 66, 77, 88, 99).
 *
 * @param d100Value - The initial d100 roll (before open-ending), integer 11–99
 * @returns true if Magical Resonance is triggered
 */
export function detectMagicalResonance(d100Value: number): boolean {
  const tens = Math.floor(d100Value / 10);
  const units = d100Value % 10;
  return tens === units;
}

/**
 * Compute the Magical Resonance Roll modifier.
 *
 * Base modifier = Weave of the Spell cast, plus:
 * - Safe Haven: -20
 * - Blighted Land or Darkland: +20
 * - Healing, Spirit-Related, or Light Spell: -20
 * - Natural, Elven, or Illusory Spell: -10
 * - Attack Spell: +20
 * - Dark Spell: +30
 *
 * Additional overcasting modifier: -30 + 10 per Weave over caster's Level.
 *
 * @param spellWeave - The Weave of the spell cast (1-10+)
 * @param resonanceType - The resonance type of the spell
 * @param inSafeHaven - Whether the caster is in a Safe Haven
 * @param inBlightedLand - Whether the caster is in a Blighted Land or Darkland
 * @param overcasting - If overcasting, the context with spell weave and caster level
 * @returns The total modifier for the Magical Resonance Roll
 */
export function computeResonanceModifier(
  spellWeave: number,
  resonanceType: ResonanceType,
  inSafeHaven: boolean,
  inBlightedLand: boolean,
  overcasting: OvercastingContext | null,
): number {
  let modifier = spellWeave;

  // Location modifiers
  if (inSafeHaven) modifier -= 20;
  if (inBlightedLand) modifier += 20;

  // Spell nature modifiers
  switch (resonanceType) {
    case 'healing':
    case 'spirit':
    case 'light':
      modifier -= 20;
      break;
    case 'natural':
    case 'elven':
    case 'illusory':
      modifier -= 10;
      break;
    case 'attack':
      modifier += 20;
      break;
    case 'dark':
      modifier += 30;
      break;
    case 'other':
      break;
  }

  // Overcasting resonance modifier: -30 + 10 per Weave over Level
  if (overcasting) {
    const weavesOver = overcasting.spellWeave - overcasting.casterLevel;
    if (weavesOver > 0) {
      modifier += -30 + 10 * weavesOver;
    }
  }

  return modifier;
}

// ─── MP Cost ─────────────────────────────────────────────────────────────────

/**
 * Compute the MP cost for casting a spell, including warping.
 *
 * Base cost = Weave of the spell.
 * Warped cost = base Weave + sum of all selected warping option Weave costs.
 *
 * Celestial Alignment may add +1 MP (Malefic or Disastrous).
 *
 * @param baseWeave - The base Weave of the spell (1-10)
 * @param warpingCosts - Array of additional Weave costs from selected warping options
 * @param celestialAlignment - Current celestial alignment (optional)
 * @returns Total MP cost
 */
export function computeMpCost(
  baseWeave: number,
  warpingCosts: number[] = [],
  celestialAlignment: CelestialAlignment = 'neutral',
): number {
  const warpingTotal = warpingCosts.reduce((sum, cost) => sum + cost, 0);
  let totalCost = baseWeave + warpingTotal;

  // Malefic and Disastrous alignments add +1 MP
  if (celestialAlignment === 'malefic' || celestialAlignment === 'disastrous') {
    totalCost += 1;
  }

  return totalCost;
}

/**
 * Compute the effective Weave of a warped spell.
 *
 * Effective Weave = base Weave + sum of warping option Weave costs.
 * This determines what Level the caster needs to cast the warped version.
 *
 * @param baseWeave - The base Weave of the spell (1-10)
 * @param warpingCosts - Array of additional Weave costs from selected warping options
 * @returns Effective Weave after warping
 */
export function computeWarpedWeave(baseWeave: number, warpingCosts: number[]): number {
  return baseWeave + warpingCosts.reduce((sum, cost) => sum + cost, 0);
}

// ─── Casting Validation ──────────────────────────────────────────────────────

/** Reasons a spell cannot be cast. */
export type CastingBlockReason =
  | 'insufficient_mp'
  | 'weave_exceeds_level'
  | 'weave_exceeds_ranks';

/**
 * Validate whether a character can cast a spell.
 *
 * Rules:
 * - Effective Weave cannot exceed caster's Level (unless overcasting)
 * - Caster must have enough MP
 * - Caster must have at least as many ranks in the Spell Lore as the Spell's Weave
 *
 * @param effectiveWeave - The Weave of the spell (after warping if applicable)
 * @param casterLevel - The caster's current Level
 * @param currentMp - The caster's current MP
 * @param mpCost - The MP cost of the spell
 * @param spellLoreRanks - The caster's ranks in the relevant Spell Lore
 * @param allowOvercasting - Whether overcasting is permitted (Wizards/Animists only)
 * @returns null if casting is valid, or an array of blocking reasons
 */
export function validateCasting(
  effectiveWeave: number,
  casterLevel: number,
  currentMp: number,
  mpCost: number,
  spellLoreRanks: number,
  allowOvercasting: boolean = false,
): CastingBlockReason[] | null {
  const blocks: CastingBlockReason[] = [];

  // MP check
  if (currentMp < mpCost) {
    blocks.push('insufficient_mp');
  }

  // Level cap check (unless overcasting is allowed)
  if (effectiveWeave > casterLevel && !allowOvercasting) {
    blocks.push('weave_exceeds_level');
  }

  // Rank check: must have ranks >= spell Weave (even for overcasting)
  if (spellLoreRanks < effectiveWeave) {
    blocks.push('weave_exceeds_ranks');
  }

  return blocks.length > 0 ? blocks : null;
}

// ─── Overcasting ─────────────────────────────────────────────────────────────

/**
 * Compute the overcasting penalty applied to the Spell Casting Roll.
 *
 * Penalty = -10 for each Weave of the Spell over the caster's Level.
 *
 * @param spellWeave - The effective Weave of the spell
 * @param casterLevel - The caster's Level
 * @returns The penalty (negative number, or 0 if not overcasting)
 */
export function computeOvercastingPenalty(spellWeave: number, casterLevel: number): number {
  const weavesOver = Math.max(0, spellWeave - casterLevel);
  if (weavesOver === 0) return 0;
  return -10 * weavesOver;
}

/**
 * Compute the maximum overcasting Weaves allowed by celestial alignment.
 *
 * - Benefic: up to 3 Weaves higher
 * - Auspicious: up to 1 Weave higher
 * - Other alignments: 0 (no celestial overcasting allowed)
 *
 * @param alignment - Current celestial alignment
 * @returns Maximum number of Weaves above Level allowed by alignment
 */
export function computeCelestialOvercastLimit(alignment: CelestialAlignment): number {
  switch (alignment) {
    case 'benefic': return 3;
    case 'auspicious': return 1;
    default: return 0;
  }
}

// ─── Celestial Alignment Penalty ─────────────────────────────────────────────

/**
 * Compute the Spell Casting Roll penalty from Disastrous celestial alignment.
 *
 * Disastrous: -10 to all Spell Casting Rolls.
 *
 * @param alignment - Current celestial alignment
 * @returns The penalty (0 or -10)
 */
export function computeCelestialCastingPenalty(alignment: CelestialAlignment): number {
  return alignment === 'disastrous' ? -10 : 0;
}

// ─── Spell Failure Modifier ──────────────────────────────────────────────────

/**
 * Get the Spell Failure modifier for a spell.
 *
 * When a Spell Failure occurs (roll ≤ 25 on the SC Table), the caster rolls
 * another d100 and adds this modifier to determine severity.
 *
 * The value is stored directly on the spell as `failureSeverity`:
 *   0  — Healing, Information, Divination (safest)
 *   10 — Utility, Personal, Defensive, Nature Magic
 *   20 — Enchantment Magic
 *   30 — Alteration Magic
 *   50 — Dark and Elemental Magic (most dangerous)
 *
 * @param failureSeverity - The spell's stored failure severity value
 * @returns The modifier to add to the Spell Failure roll
 */
export function computeSpellFailureModifier(failureSeverity: number): number {
  return failureSeverity;
}

// ─── Magic Points Calculation ────────────────────────────────────────────────

/**
 * Compute total Magic Points for a character.
 *
 * Formula: (statMpGain + vocationMpGain) × Level + kinBaseMpBonus
 *
 * Where statMpGain = floor(statValue / 10), minimum 0.
 * - Wizards use WIT
 * - Animists use WSD
 * - All other Vocations use BEA
 *
 * @param statValue - The relevant Stat Value (WIT, WSD, or BEA depending on Vocation)
 * @param vocationMpPerLevel - The MP per Level from the Vocation table
 * @param level - The character's current Level
 * @param kinMpBonus - The one-time Kin base MP bonus
 * @returns Total Magic Points
 */
export function computeTotalMagicPoints(
  statValue: number,
  vocationMpPerLevel: number,
  level: number,
  kinMpBonus: number,
): number {
  const statMpGain = statValue >= 10 ? Math.floor(statValue / 10) : 0;
  return (statMpGain + vocationMpPerLevel) * level + kinMpBonus;
}

// ─── Ritual Overcasting ──────────────────────────────────────────────────────

/**
 * Compute the maximum Weave allowed through a magic ritual.
 *
 * A ritual permits the lead caster to cast a Spell of a number of Weaves higher
 * than their Level equal to the number of participants (including the lead).
 *
 * @param casterLevel - The lead caster's Level
 * @param participantCount - Total number of ritual participants (including the lead)
 * @returns Maximum Weave castable through the ritual
 */
export function computeRitualMaxWeave(casterLevel: number, participantCount: number): number {
  return casterLevel + participantCount;
}
