/**
 * VsD System Constants and Configuration
 *
 * All game mechanic constants from Against the Darkmaster Core Rules v1.5.
 * This module is a pure-data export with no Foundry dependencies.
 */

// ─── Stat Keys ──────────────────────────────────────────────────────────────

/** The six primary stats and their abbreviations. */
export const VSD_STATS = {
  brn: "brn",
  swi: "swi",
  for: "for",
  wit: "wit",
  wsd: "wsd",
  bea: "bea",
} as const;

export type StatKey = keyof typeof VSD_STATS;

export const STAT_LABELS: Record<StatKey, string> = {
  brn: "VSD.Stats.Brawn",
  swi: "VSD.Stats.Swiftness",
  for: "VSD.Stats.Fortitude",
  wit: "VSD.Stats.Wits",
  wsd: "VSD.Stats.Wisdom",
  bea: "VSD.Stats.Bearing",
};

export const STAT_ABBREVIATIONS: Record<StatKey, string> = {
  brn: "BRN",
  swi: "SWI",
  for: "FOR",
  wit: "WIT",
  wsd: "WSD",
  bea: "BEA",
};

// ─── Skill Categories and Skills ────────────────────────────────────────────

export type SkillCategoryKey =
  | "armor"
  | "combat"
  | "adventuring"
  | "roguery"
  | "lore"
  | "spells"
  | "body";

export interface SkillDefinition {
  key: string;
  label: string;
  governingStat: StatKey | null;
}

export interface SkillCategoryDefinition {
  key: SkillCategoryKey;
  label: string;
  skills: SkillDefinition[];
}

/**
 * Skill Categories per Core Rules table [1.5].
 * Governing stats per table [1.19].
 */
export const VSD_SKILL_CATEGORIES: SkillCategoryDefinition[] = [
  {
    key: "armor",
    label: "VSD.SkillCategories.Armor",
    skills: [
      { key: "armor", label: "VSD.Skills.Armor", governingStat: null },
    ],
  },
  {
    key: "combat",
    label: "VSD.SkillCategories.Combat",
    skills: [
      { key: "blades", label: "VSD.Skills.Blades", governingStat: "brn" },
      { key: "blunt", label: "VSD.Skills.Blunt", governingStat: "brn" },
      { key: "ranged", label: "VSD.Skills.Ranged", governingStat: "swi" },
      { key: "polearms", label: "VSD.Skills.Polearms", governingStat: "brn" },
      { key: "brawl", label: "VSD.Skills.Brawl", governingStat: "brn" },
    ],
  },
  {
    key: "adventuring",
    label: "VSD.SkillCategories.Adventuring",
    skills: [
      { key: "athletics", label: "VSD.Skills.Athletics", governingStat: "brn" },
      { key: "ride", label: "VSD.Skills.Ride", governingStat: "swi" },
      { key: "hunting", label: "VSD.Skills.Hunting", governingStat: "wit" },
      { key: "nature", label: "VSD.Skills.Nature", governingStat: "wsd" },
      { key: "wandering", label: "VSD.Skills.Wandering", governingStat: "wsd" },
    ],
  },
  {
    key: "roguery",
    label: "VSD.SkillCategories.Roguery",
    skills: [
      { key: "acrobatics", label: "VSD.Skills.Acrobatics", governingStat: "swi" },
      { key: "stealth", label: "VSD.Skills.Stealth", governingStat: "swi" },
      { key: "locksTraps", label: "VSD.Skills.LocksTraps", governingStat: "wit" },
      { key: "perception", label: "VSD.Skills.Perception", governingStat: "wsd" },
      { key: "deceive", label: "VSD.Skills.Deceive", governingStat: "wit" },
    ],
  },
  {
    key: "lore",
    label: "VSD.SkillCategories.Lore",
    skills: [
      { key: "arcana", label: "VSD.Skills.Arcana", governingStat: "wit" },
      { key: "charisma", label: "VSD.Skills.Charisma", governingStat: "bea" },
      { key: "cultures", label: "VSD.Skills.Cultures", governingStat: "wit" },
      { key: "healer", label: "VSD.Skills.Healer", governingStat: "wsd" },
      { key: "songsTales", label: "VSD.Skills.SongsTales", governingStat: "bea" },
    ],
  },
  {
    key: "spells",
    label: "VSD.SkillCategories.Spells",
    skills: [],
  },
  {
    key: "body",
    label: "VSD.SkillCategories.Body",
    skills: [
      { key: "body", label: "VSD.Skills.Body", governingStat: "for" },
    ],
  },
];

/** Flat map of skill key → governing stat for quick lookup. */
export const SKILL_GOVERNING_STATS: Record<string, StatKey | null> = Object.fromEntries(
  VSD_SKILL_CATEGORIES.flatMap((cat) =>
    cat.skills.map((skill) => [skill.key, skill.governingStat])
  )
);

// ─── Rank Bonus Breakpoints ─────────────────────────────────────────────────

/**
 * Rank Bonus Table [1.19]:
 * - 0 ranks: +0
 * - 1–10 ranks: ranks × 5
 * - 11–20 ranks: 50 + (ranks - 10) × 2
 * - 21+ ranks: 70 + (ranks - 20) × 1
 */
export interface RankBonusBreakpoint {
  minRank: number;
  maxRank: number;
  base: number;
  perRank: number;
  offset: number;
}

export const RANK_BONUS_BREAKPOINTS: RankBonusBreakpoint[] = [
  { minRank: 0, maxRank: 0, base: 0, perRank: 0, offset: 0 },
  { minRank: 1, maxRank: 10, base: 0, perRank: 5, offset: 0 },
  { minRank: 11, maxRank: 20, base: 50, perRank: 2, offset: 10 },
  { minRank: 21, maxRank: Infinity, base: 70, perRank: 1, offset: 20 },
];

// ─── Action Resolution Table ────────────────────────────────────────────────

export type ActionOutcome =
  | "criticalFailure"
  | "failure"
  | "partialSuccess"
  | "success"
  | "outstandingSuccess";

export interface ActionResolutionBand {
  min: number;
  max: number;
  outcome: ActionOutcome;
  label: string;
}

export const ACTION_RESOLUTION_TABLE: ActionResolutionBand[] = [
  { min: -Infinity, max: 4, outcome: "criticalFailure", label: "VSD.Outcomes.CriticalFailure" },
  { min: 5, max: 74, outcome: "failure", label: "VSD.Outcomes.Failure" },
  { min: 75, max: 99, outcome: "partialSuccess", label: "VSD.Outcomes.PartialSuccess" },
  { min: 100, max: 174, outcome: "success", label: "VSD.Outcomes.Success" },
  { min: 175, max: Infinity, outcome: "outstandingSuccess", label: "VSD.Outcomes.OutstandingSuccess" },
];

// ─── Spell Casting Table Thresholds ─────────────────────────────────────────

export type SpellOutcome =
  | "spellFailure"
  | "partialSuccess"
  | "success"
  | "outstandingSuccess";

export interface SpellCastingBand {
  min: number;
  max: number;
  outcome: SpellOutcome;
  label: string;
  srDifficulty: number | null;
}

export const SPELL_CASTING_TABLE: SpellCastingBand[] = [
  { min: -Infinity, max: 25, outcome: "spellFailure", label: "VSD.Spell.Failure", srDifficulty: null },
  { min: 26, max: 50, outcome: "partialSuccess", label: "VSD.Spell.PartialSuccess", srDifficulty: null },
  { min: 51, max: 80, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 50 },
  { min: 81, max: 95, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 60 },
  { min: 96, max: 105, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 65 },
  { min: 106, max: 115, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 70 },
  { min: 116, max: 125, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 75 },
  { min: 126, max: 135, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 80 },
  { min: 136, max: 150, outcome: "success", label: "VSD.Spell.Success", srDifficulty: 90 },
  { min: 151, max: Infinity, outcome: "outstandingSuccess", label: "VSD.Spell.OutstandingSuccess", srDifficulty: 105 },
];

// ─── Encumbrance Levels ─────────────────────────────────────────────────────

export type EncumbranceLevel =
  | "unencumbered"
  | "lightly"
  | "encumbered"
  | "heavily"
  | "over";

export interface EncumbranceLevelDefinition {
  key: EncumbranceLevel;
  value: number;
  label: string;
}

export const ENCUMBRANCE_LEVELS: EncumbranceLevelDefinition[] = [
  { key: "unencumbered", value: 0, label: "VSD.Encumbrance.Unencumbered" },
  { key: "lightly", value: 1, label: "VSD.Encumbrance.Lightly" },
  { key: "encumbered", value: 2, label: "VSD.Encumbrance.Encumbered" },
  { key: "heavily", value: 3, label: "VSD.Encumbrance.Heavily" },
  { key: "over", value: 4, label: "VSD.Encumbrance.Over" },
];

// ─── XP Thresholds ──────────────────────────────────────────────────────────

/** Cumulative XP required to reach each level. Index = level. */
export const XP_THRESHOLDS: readonly number[] = [
  0,   // Level 0 (not used, placeholder)
  10,  // Level 1
  20,  // Level 2
  30,  // Level 3
  40,  // Level 4
  50,  // Level 5
  70,  // Level 6
  90,  // Level 7
  110, // Level 8
  130, // Level 9
  150, // Level 10
];

// ─── Weapon Lengths ─────────────────────────────────────────────────────────

export type WeaponLength = "hand" | "short" | "long" | "longest";

export const WEAPON_LENGTHS: readonly WeaponLength[] = ["hand", "short", "long", "longest"];

export const WEAPON_LENGTH_LABELS: Record<WeaponLength, string> = {
  hand: "VSD.WeaponLength.Hand",
  short: "VSD.WeaponLength.Short",
  long: "VSD.WeaponLength.Long",
  longest: "VSD.WeaponLength.Longest",
};

// ─── Armor Types ────────────────────────────────────────────────────────────

export type ArmorType = "NA" | "LA" | "MA" | "HA";

export const ARMOR_TYPES: readonly ArmorType[] = ["NA", "LA", "MA", "HA"];

export const ARMOR_TYPE_LABELS: Record<ArmorType, string> = {
  NA: "VSD.ArmorType.NA",
  LA: "VSD.ArmorType.LA",
  MA: "VSD.ArmorType.MA",
  HA: "VSD.ArmorType.HA",
};

// ─── Critical Severities ────────────────────────────────────────────────────

export type CriticalSeverity = "Sup" | "Lig" | "Mod" | "Gri" | "Let";

export const CRITICAL_SEVERITIES: readonly CriticalSeverity[] = [
  "Sup", "Lig", "Mod", "Gri", "Let",
];

export const CRITICAL_SEVERITY_LABELS: Record<CriticalSeverity, string> = {
  Sup: "VSD.Critical.Superficial",
  Lig: "VSD.Critical.Light",
  Mod: "VSD.Critical.Moderate",
  Gri: "VSD.Critical.Grievous",
  Let: "VSD.Critical.Lethal",
};

/** Roll modifier added when rolling on a Critical Strike Table. */
export const CRITICAL_SEVERITY_MODIFIERS: Record<CriticalSeverity, number> = {
  Sup: 0,
  Lig: 10,
  Mod: 20,
  Gri: 30,
  Let: 50,
};

// ─── Critical Table Types ───────────────────────────────────────────────────

export type CriticalTableType =
  | "beast"
  | "impact"
  | "cut"
  | "pierce"
  | "grapple"
  | "fire"
  | "lightning"
  | "frost"
  | "darkMagic";

export const CRITICAL_TABLE_TYPES: readonly CriticalTableType[] = [
  "beast", "impact", "cut", "pierce", "grapple",
  "fire", "lightning", "frost", "darkMagic",
];

export const CRITICAL_TABLE_LABELS: Record<CriticalTableType, string> = {
  beast: "VSD.CriticalTable.Beast",
  impact: "VSD.CriticalTable.Impact",
  cut: "VSD.CriticalTable.Cut",
  pierce: "VSD.CriticalTable.Pierce",
  grapple: "VSD.CriticalTable.Grapple",
  fire: "VSD.CriticalTable.Fire",
  lightning: "VSD.CriticalTable.Lightning",
  frost: "VSD.CriticalTable.Frost",
  darkMagic: "VSD.CriticalTable.DarkMagic",
};

// ─── Combat Phases ──────────────────────────────────────────────────────────

export type CombatPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface CombatPhaseDefinition {
  phase: CombatPhase;
  key: string;
  label: string;
}

export const COMBAT_PHASES: CombatPhaseDefinition[] = [
  { phase: 1, key: "assessment", label: "VSD.Combat.Phase.Assessment" },
  { phase: 2, key: "actionDeclaration", label: "VSD.Combat.Phase.ActionDeclaration" },
  { phase: 3, key: "move", label: "VSD.Combat.Phase.Move" },
  { phase: 4, key: "spellA", label: "VSD.Combat.Phase.SpellA" },
  { phase: 5, key: "rangedA", label: "VSD.Combat.Phase.RangedA" },
  { phase: 6, key: "melee", label: "VSD.Combat.Phase.Melee" },
  { phase: 7, key: "rangedB", label: "VSD.Combat.Phase.RangedB" },
  { phase: 8, key: "spellB", label: "VSD.Combat.Phase.SpellB" },
  { phase: 9, key: "otherActions", label: "VSD.Combat.Phase.OtherActions" },
];

// ─── Conditions ─────────────────────────────────────────────────────────────

export type ConditionKey =
  | "dying"
  | "engaged"
  | "frightened"
  | "held"
  | "incapacitated"
  | "prone"
  | "stunned"
  | "surprised"
  | "weary";

export interface ConditionDefinition {
  key: ConditionKey;
  label: string;
  icon: string;
}

export const VSD_CONDITIONS: ConditionDefinition[] = [
  { key: "dying", label: "VSD.Conditions.Dying", icon: "systems/vsd/assets/icons/conditions/dying.svg" },
  { key: "engaged", label: "VSD.Conditions.Engaged", icon: "systems/vsd/assets/icons/conditions/engaged.svg" },
  { key: "frightened", label: "VSD.Conditions.Frightened", icon: "systems/vsd/assets/icons/conditions/frightened.svg" },
  { key: "held", label: "VSD.Conditions.Held", icon: "systems/vsd/assets/icons/conditions/held.svg" },
  { key: "incapacitated", label: "VSD.Conditions.Incapacitated", icon: "systems/vsd/assets/icons/conditions/incapacitated.svg" },
  { key: "prone", label: "VSD.Conditions.Prone", icon: "systems/vsd/assets/icons/conditions/prone.svg" },
  { key: "stunned", label: "VSD.Conditions.Stunned", icon: "systems/vsd/assets/icons/conditions/stunned.svg" },
  { key: "surprised", label: "VSD.Conditions.Surprised", icon: "systems/vsd/assets/icons/conditions/surprised.svg" },
  { key: "weary", label: "VSD.Conditions.Weary", icon: "systems/vsd/assets/icons/conditions/weary.svg" },
];

// ─── Attack Table Keys ──────────────────────────────────────────────────────

export type AttackTableKey =
  | "edged"
  | "blunt"
  | "missile"
  | "unarmed"
  | "areaSpells"
  | "boltSpells"
  | "beast";

export const ATTACK_TABLE_KEYS: readonly AttackTableKey[] = [
  "edged", "blunt", "missile", "unarmed", "areaSpells", "boltSpells", "beast",
];

export const ATTACK_TABLE_LABELS: Record<AttackTableKey, string> = {
  edged: "VSD.AttackTable.Edged",
  blunt: "VSD.AttackTable.Blunt",
  missile: "VSD.AttackTable.Missile",
  unarmed: "VSD.AttackTable.Unarmed",
  areaSpells: "VSD.AttackTable.AreaSpells",
  boltSpells: "VSD.AttackTable.BoltSpells",
  beast: "VSD.AttackTable.Beast",
};

// ─── Attack Table Row Interface ─────────────────────────────────────────────

export interface AttackTableCell {
  /** HP damage dealt */
  hits: number;
  /** Critical severity (empty string = no critical) */
  crit: CriticalSeverity | "";
}

export interface AttackTableRow {
  /** Lower bound of the roll range (inclusive) */
  minRoll: number;
  /** Upper bound of the roll range (inclusive) */
  maxRoll: number;
  /** Results per armor type; null = miss/no result */
  NA: AttackTableCell | null;
  LA: AttackTableCell | null;
  MA: AttackTableCell | null;
  HA: AttackTableCell | null;
}

// ─── Critical Table Entry Interface ─────────────────────────────────────────

export interface CriticalTableEntry {
  /** Lower bound of the roll range (inclusive) */
  minRoll: number;
  /** Upper bound of the roll range (inclusive) */
  maxRoll: number;
  /** HP loss from the critical */
  hpLoss: number;
  /** Conditions applied */
  conditions: ConditionKey[];
  /** Duration in rounds (0 = permanent/until healed) */
  rounds: number;
  /** Description of the critical effect */
  description: string;
}

// ─── Kin Names ──────────────────────────────────────────────────────────────

export const VSD_KIN_NAMES = [
  "Man", "High Man", "Dwarf", "Halfling", "Half Elf",
  "Silver Elf", "Dusk Elf", "Star Elf", "Wildfolk",
  "Orc", "Half Orc", "Stone Troll", "Firbolg",
] as const;

export type KinName = (typeof VSD_KIN_NAMES)[number];

// ─── Culture Names ──────────────────────────────────────────────────────────

export const VSD_CULTURE_NAMES = [
  "Arctic", "City", "Deep", "Desert", "Fey", "Hill",
  "Marauding", "Noble", "Pastoral", "Plains",
  "Seafaring", "Weald", "Woad",
] as const;

export type CultureName = (typeof VSD_CULTURE_NAMES)[number];

// ─── Vocation Names ─────────────────────────────────────────────────────────

export const VSD_VOCATION_NAMES = [
  "Warrior", "Rogue", "Wizard", "Animist", "Champion", "Dabbler", "Sage",
] as const;

export type VocationName = (typeof VSD_VOCATION_NAMES)[number];

// ─── Wealth Levels ──────────────────────────────────────────────────────────

/** Wealth Levels: 0–5 (6 tiers). */
export const WEALTH_LEVEL_MIN = 0;
export const WEALTH_LEVEL_MAX = 5;

export const WEALTH_LEVEL_LABELS: Record<number, string> = {
  0: "VSD.WealthLevel.0",
  1: "VSD.WealthLevel.1",
  2: "VSD.WealthLevel.2",
  3: "VSD.WealthLevel.3",
  4: "VSD.WealthLevel.4",
  5: "VSD.WealthLevel.5",
};

// ─── Level Bonus (TSR/WSR) ──────────────────────────────────────────────────

/** TSR/WSR level-based bonus = level × 5. */
export const LEVEL_BONUS_PER_LEVEL = 5;

// ─── Open-Ended Roll Thresholds ─────────────────────────────────────────────

/** Open-ended high: roll result >= this triggers re-roll and add. */
export const OPEN_ENDED_HIGH_THRESHOLD = 96;

/** Open-ended low: roll result <= this triggers re-roll and subtract. */
export const OPEN_ENDED_LOW_THRESHOLD = 5;

/**
 * Continuation threshold for subtraction:
 * After the first subtract, continue subtracting ONLY while subsequent rolls are >= 96.
 */
export const OPEN_ENDED_LOW_CONTINUE_THRESHOLD = 96;

// ─── Difficulty Modifiers ───────────────────────────────────────────────────

export interface DifficultyDefinition {
  key: string;
  modifier: number;
  label: string;
}

export const DIFFICULTY_MODIFIERS: DifficultyDefinition[] = [
  { key: "standard", modifier: 0, label: "VSD.Difficulty.Standard" },
  { key: "challenging", modifier: -10, label: "VSD.Difficulty.Challenging" },
  { key: "hard", modifier: -20, label: "VSD.Difficulty.Hard" },
  { key: "veryHard", modifier: -30, label: "VSD.Difficulty.VeryHard" },
  { key: "extremelyHard", modifier: -40, label: "VSD.Difficulty.ExtremelyHard" },
  { key: "heroic", modifier: -50, label: "VSD.Difficulty.Heroic" },
  { key: "insane", modifier: -70, label: "VSD.Difficulty.Insane" },
];

// ─── Size Categories ────────────────────────────────────────────────────────

export type SizeCategory = "small" | "medium" | "large";

export const SIZE_CATEGORIES: readonly SizeCategory[] = ["small", "medium", "large"];
