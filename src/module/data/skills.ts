/** The fixed skills printed on the Against the Darkmaster character sheet. */

export type SkillCategory =
  | 'Armor'
  | 'Combat'
  | 'Adventuring'
  | 'Roguery'
  | 'Lore'
  | 'Spells'
  | 'Body';

export type SkillStatKey = '' | 'brn' | 'swi' | 'for' | 'wit' | 'wsd' | 'bea';

export interface SkillData {
  name: string;
  category: SkillCategory;
  rank: number;
  statKey: SkillStatKey;
  vocation: number;
  kin: number;
  spec: number;
  item: number;
}

type SkillDefinition = Pick<SkillData, 'name' | 'category' | 'statKey'>;

/**
 * Spell Lores are not included here: each lore is a separate, character-specific
 * skill and its associated stat varies by lore.
 */
export const DEFAULT_SKILL_DEFINITIONS: readonly SkillDefinition[] = [
  { name: 'Armor', category: 'Armor', statKey: '' },

  { name: 'Blades', category: 'Combat', statKey: 'brn' },
  { name: 'Blunt', category: 'Combat', statKey: 'brn' },
  { name: 'Ranged', category: 'Combat', statKey: 'swi' },
  { name: 'Polearms', category: 'Combat', statKey: 'brn' },
  { name: 'Brawl', category: 'Combat', statKey: 'brn' },

  { name: 'Athletics', category: 'Adventuring', statKey: 'brn' },
  { name: 'Ride', category: 'Adventuring', statKey: 'swi' },
  { name: 'Hunting', category: 'Adventuring', statKey: 'wit' },
  { name: 'Nature', category: 'Adventuring', statKey: 'wsd' },
  { name: 'Wandering', category: 'Adventuring', statKey: 'wsd' },

  { name: 'Acrobatics', category: 'Roguery', statKey: 'swi' },
  { name: 'Stealth', category: 'Roguery', statKey: 'swi' },
  { name: 'Locks & Traps', category: 'Roguery', statKey: 'wit' },
  { name: 'Perception', category: 'Roguery', statKey: 'wsd' },
  { name: 'Deceive', category: 'Roguery', statKey: 'wit' },

  { name: 'Arcana', category: 'Lore', statKey: 'wit' },
  { name: 'Charisma', category: 'Lore', statKey: 'bea' },
  { name: 'Cultures', category: 'Lore', statKey: 'wit' },
  { name: 'Healer', category: 'Lore', statKey: 'wsd' },
  { name: 'Songs & Tales', category: 'Lore', statKey: 'bea' },

  { name: 'Body', category: 'Body', statKey: 'for' },
];

/** Return fresh mutable skill records suitable for persistence on an Actor. */
export function createDefaultSkills(): SkillData[] {
  return DEFAULT_SKILL_DEFINITIONS.map((skill) => ({
    ...skill,
    rank: 0,
    vocation: 0,
    kin: 0,
    spec: 0,
    item: 0,
  }));
}

/** Keep the fixed character skill list available when persisted data is missing or empty. */
export function ensureCharacterSkills(skills: SkillData[] | undefined): SkillData[] {
  return skills && skills.length > 0 ? skills : createDefaultSkills();
}
