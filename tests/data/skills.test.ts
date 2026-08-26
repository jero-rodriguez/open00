import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SKILL_DEFINITIONS,
  createDefaultSkills,
  ensureCharacterSkills,
} from '../../src/module/data/skills.js';

describe('default character skills', () => {
  it('contains the 22 fixed core skills in the expected categories', () => {
    const skills = createDefaultSkills();

    expect(skills).toHaveLength(22);
    expect(skills.map((skill) => skill.name)).toEqual([
      'Armor',
      'Blades', 'Blunt', 'Ranged', 'Polearms', 'Brawl',
      'Athletics', 'Ride', 'Hunting', 'Nature', 'Wandering',
      'Acrobatics', 'Stealth', 'Locks & Traps', 'Perception', 'Deceive',
      'Arcana', 'Charisma', 'Cultures', 'Healer', 'Songs & Tales',
      'Body',
    ]);
  });

  it('initializes every skill with the schema-backed item modifier field', () => {
    expect(createDefaultSkills().every(
      (skill) => skill.rank === 0 && skill.item === 0,
    )).toBe(true);

    expect(createDefaultSkills().every(
      (skill) => !Object.hasOwn(skill, 'itemModifiers'),
    )).toBe(true);
  });

  it('returns fresh records so one actor cannot mutate another actor defaults', () => {
    const first = createDefaultSkills();
    const second = createDefaultSkills();

    first[0]!.rank = 3;

    expect(second[0]!.rank).toBe(0);
    // DEFAULT_SKILL_DEFINITIONS is now a frozen keyed record — verify immutability
    expect(DEFAULT_SKILL_DEFINITIONS.armor).not.toHaveProperty('rank');
  });
});

describe('ensureCharacterSkills', () => {
  it('restores the fixed skill list when persisted skills are empty', () => {
    expect(ensureCharacterSkills([])).toEqual(createDefaultSkills());
  });

  it('preserves an existing populated skill list', () => {
    const skills = createDefaultSkills();
    skills[0]!.rank = 3;
    expect(ensureCharacterSkills(skills)).toBe(skills);
  });
});
