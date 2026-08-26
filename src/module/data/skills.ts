/**
 * Canonical skill definitions for the Against the Darkmaster character sheet.
 *
 * Each skill has a stable kebab-case id used as the key in the persisted
 * keyed SchemaField record on CharacterDataModel.
 */

export type SkillCategory =
  | 'Armor'
  | 'Combat'
  | 'Adventuring'
  | 'Roguery'
  | 'Lore'
  | 'Spells'
  | 'Body';

export type SkillStatKey = '' | 'brn' | 'swi' | 'for' | 'wit' | 'wsd' | 'bea';

/**
 * The 22 canonical skill ids. Keyed records on CharacterDataModel use these
 * as property names. Order matches the printed character sheet.
 */
export const SKILL_IDS = Object.freeze({
  armor: 'armor',
  blades: 'blades',
  blunt: 'blunt',
  ranged: 'ranged',
  polearms: 'polearms',
  brawl: 'brawl',
  athletics: 'athletics',
  ride: 'ride',
  hunting: 'hunting',
  nature: 'nature',
  wandering: 'wandering',
  acrobatics: 'acrobatics',
  stealth: 'stealth',
  'locks-traps': 'locks-traps',
  perception: 'perception',
  deceive: 'deceive',
  arcana: 'arcana',
  charisma: 'charisma',
  cultures: 'cultures',
  healer: 'healer',
  'songs-tales': 'songs-tales',
  body: 'body',
} as const);

/** Union type of all canonical skill ids. */
export type SkillId = keyof typeof SKILL_IDS;

/** All skill ids as an ordered array (matches printed sheet order). */
export const SKILL_ID_LIST: readonly SkillId[] = Object.keys(SKILL_IDS) as SkillId[];

export interface SkillDefinition {
  id: SkillId;
  name: string;
  category: SkillCategory;
  statKey: SkillStatKey;
}

/**
 * Persisted skill data for a single skill on a character.
 * Only player-owned / seeded fields are stored; derived bonuses
 * (vocation, kin, item) are computed in prepareDerivedData.
 */
export interface SkillRecord {
  rank: number;
  spec: number;
}

/**
 * Canonical skill definitions keyed by SkillId.
 * Use this to look up display name, category, and governing stat.
 */
export const DEFAULT_SKILL_DEFINITIONS: Readonly<Record<SkillId, SkillDefinition>> = Object.freeze({
  armor: { id: 'armor', name: 'Armor', category: 'Armor', statKey: '' },
  blades: { id: 'blades', name: 'Blades', category: 'Combat', statKey: 'brn' },
  blunt: { id: 'blunt', name: 'Blunt', category: 'Combat', statKey: 'brn' },
  ranged: { id: 'ranged', name: 'Ranged', category: 'Combat', statKey: 'swi' },
  polearms: { id: 'polearms', name: 'Polearms', category: 'Combat', statKey: 'brn' },
  brawl: { id: 'brawl', name: 'Brawl', category: 'Combat', statKey: 'brn' },
  athletics: { id: 'athletics', name: 'Athletics', category: 'Adventuring', statKey: 'brn' },
  ride: { id: 'ride', name: 'Ride', category: 'Adventuring', statKey: 'swi' },
  hunting: { id: 'hunting', name: 'Hunting', category: 'Adventuring', statKey: 'wit' },
  nature: { id: 'nature', name: 'Nature', category: 'Adventuring', statKey: 'wsd' },
  wandering: { id: 'wandering', name: 'Wandering', category: 'Adventuring', statKey: 'wsd' },
  acrobatics: { id: 'acrobatics', name: 'Acrobatics', category: 'Roguery', statKey: 'swi' },
  stealth: { id: 'stealth', name: 'Stealth', category: 'Roguery', statKey: 'swi' },
  'locks-traps': { id: 'locks-traps', name: 'Locks & Traps', category: 'Roguery', statKey: 'wit' },
  perception: { id: 'perception', name: 'Perception', category: 'Roguery', statKey: 'wsd' },
  deceive: { id: 'deceive', name: 'Deceive', category: 'Roguery', statKey: 'wit' },
  arcana: { id: 'arcana', name: 'Arcana', category: 'Lore', statKey: 'wit' },
  charisma: { id: 'charisma', name: 'Charisma', category: 'Lore', statKey: 'bea' },
  cultures: { id: 'cultures', name: 'Cultures', category: 'Lore', statKey: 'wit' },
  healer: { id: 'healer', name: 'Healer', category: 'Lore', statKey: 'wsd' },
  'songs-tales': { id: 'songs-tales', name: 'Songs & Tales', category: 'Lore', statKey: 'bea' },
  body: { id: 'body', name: 'Body', category: 'Body', statKey: 'for' },
});
