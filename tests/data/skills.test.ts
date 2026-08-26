import { describe, expect, it } from 'vitest';
import {
  SKILL_IDS,
  SKILL_ID_LIST,
  DEFAULT_SKILL_DEFINITIONS,
} from '../../src/module/data/skills.js';

describe('SKILL_IDS', () => {
  it('contains 22 canonical skill ids', () => {
    expect(Object.keys(SKILL_IDS)).toHaveLength(22);
  });

  it('keys and values are identical (self-referencing frozen record)', () => {
    for (const [key, value] of Object.entries(SKILL_IDS)) {
      expect(key).toBe(value);
    }
  });

  it('is frozen', () => {
    expect(Object.isFrozen(SKILL_IDS)).toBe(true);
  });
});

describe('SKILL_ID_LIST', () => {
  it('contains the same 22 ids as SKILL_IDS keys in printed-sheet order', () => {
    expect(SKILL_ID_LIST).toHaveLength(22);
    expect(SKILL_ID_LIST).toEqual(Object.keys(SKILL_IDS));
  });
});

describe('DEFAULT_SKILL_DEFINITIONS', () => {
  it('has an entry for every canonical id', () => {
    for (const id of SKILL_ID_LIST) {
      expect(DEFAULT_SKILL_DEFINITIONS[id]).toBeDefined();
      expect(DEFAULT_SKILL_DEFINITIONS[id].id).toBe(id);
    }
  });

  it('every skill has name, category, and statKey', () => {
    for (const id of SKILL_ID_LIST) {
      const def = DEFAULT_SKILL_DEFINITIONS[id];
      expect(def.name).toBeTruthy();
      expect(def.category).toBeTruthy();
      expect(typeof def.statKey).toBe('string');
    }
  });

  it('is frozen (immutable reference data)', () => {
    expect(Object.isFrozen(DEFAULT_SKILL_DEFINITIONS)).toBe(true);
  });
});
