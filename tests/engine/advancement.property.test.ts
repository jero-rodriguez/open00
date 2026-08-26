/**
 * Advancement — VsD v1.5 Rules
 *
 * Sources:
 * - vsd-character.md §Vocations (DP table), §Advancement
 * - vsd-core-rules.md §Experience & Levels (XP table)
 * - openspec character-engine spec §Advancement DP Budgets, §XP Thresholds
 *
 * Key rules:
 * - Per-category DP budgets from Vocation table
 * - Max 2 ranks purchased per skill per level
 * - DPs transfer between categories at 2:1 ratio
 * - Unspent DPs are lost at level-up
 * - Cultural ranks do NOT count toward max-developable-ranks calculation
 * - NO global rank-30 cap
 * - XP thresholds: L1-5 = 10/lvl (10,20,30,40,50), L6-10 = 20/lvl (70,90,110,130,150)
 */
import { describe, it, expect } from 'vitest';
import {
  allocateRank,
  transferDP,
  levelUp,
  checkLevelUp,
  computeXPThreshold,
  VOCATION_DP_BUDGETS,
  XP_TABLE,
  MAX_RANKS_PER_SKILL_PER_LEVEL,
  type DPBudget,
  type SkillAdvancementState,
} from '../../src/module/engine/advancement';

describe('Vocation DP Budgets', () => {
  it('Warrior has correct DP distribution', () => {
    const warrior = VOCATION_DP_BUDGETS.warrior;
    expect(warrior).toEqual({
      armor: 2,
      combat: 5,
      adventuring: 4,
      roguery: 2,
      lore: 0,
      spells: 0,
      body: 2,
    });
  });

  it('Rogue has correct DP distribution', () => {
    const rogue = VOCATION_DP_BUDGETS.rogue;
    expect(rogue).toEqual({
      armor: 1,
      combat: 3,
      adventuring: 4,
      roguery: 5,
      lore: 1,
      spells: 0,
      body: 1,
    });
  });

  it('Wizard has correct DP distribution', () => {
    const wizard = VOCATION_DP_BUDGETS.wizard;
    expect(wizard).toEqual({
      armor: 0,
      combat: 0,
      adventuring: 1,
      roguery: 1,
      lore: 5,
      spells: 5,
      body: 0,
    });
  });

  it('Animist has correct DP distribution', () => {
    const animist = VOCATION_DP_BUDGETS.animist;
    expect(animist).toEqual({
      armor: 0,
      combat: 1,
      adventuring: 2,
      roguery: 1,
      lore: 4,
      spells: 5,
      body: 0,
    });
  });

  it('Dabbler has correct DP distribution', () => {
    const dabbler = VOCATION_DP_BUDGETS.dabbler;
    expect(dabbler).toEqual({
      armor: 1,
      combat: 2,
      adventuring: 3,
      roguery: 3,
      lore: 1,
      spells: 3,
      body: 1,
    });
  });

  it('Champion has correct DP distribution', () => {
    const champion = VOCATION_DP_BUDGETS.champion;
    expect(champion).toEqual({
      armor: 2,
      combat: 3,
      adventuring: 3,
      roguery: 0,
      lore: 1,
      spells: 3,
      body: 2,
    });
  });
});

describe('allocateRank', () => {
  it('allocates 1 rank successfully when budget and limit allow', () => {
    const state: SkillAdvancementState = {
      currentRank: 5,
      ranksThisLevel: 0,
      culturalRanks: 0,
    };
    const result = allocateRank(state, 3);
    expect(result).toEqual({ newRank: 6, remainingDP: 2, ranksThisLevel: 1 });
  });

  it('allocates up to max 2 ranks per skill per level', () => {
    const state: SkillAdvancementState = {
      currentRank: 5,
      ranksThisLevel: 1,
      culturalRanks: 0,
    };
    const result = allocateRank(state, 3);
    expect(result).toEqual({ newRank: 6, remainingDP: 2, ranksThisLevel: 2 });
  });

  it('rejects 3rd rank in same level', () => {
    const state: SkillAdvancementState = {
      currentRank: 7,
      ranksThisLevel: 2,
      culturalRanks: 0,
    };
    const result = allocateRank(state, 5);
    expect(result).toEqual({ error: 'max ranks per skill per level reached' });
  });

  it('rejects when insufficient DP (cost > available)', () => {
    const state: SkillAdvancementState = {
      currentRank: 5,
      ranksThisLevel: 0,
      culturalRanks: 0,
    };
    const result = allocateRank(state, 0);
    expect(result).toEqual({ error: 'insufficient DP' });
  });

  it('NO rank-30 cap — allows rank 30 and beyond', () => {
    const state: SkillAdvancementState = {
      currentRank: 30,
      ranksThisLevel: 0,
      culturalRanks: 0,
    };
    const result = allocateRank(state, 2);
    expect(result).toEqual({ newRank: 31, remainingDP: 1, ranksThisLevel: 1 });
  });

  it('allows rank 50+ (no cap)', () => {
    const state: SkillAdvancementState = {
      currentRank: 49,
      ranksThisLevel: 1,
      culturalRanks: 0,
    };
    const result = allocateRank(state, 1);
    expect(result).toEqual({ newRank: 50, remainingDP: 0, ranksThisLevel: 2 });
  });

  it('cultural ranks do NOT count toward ranksThisLevel', () => {
    // Character has rank 10 (8 from cultural + 2 developed this level)
    const state: SkillAdvancementState = {
      currentRank: 10,
      ranksThisLevel: 2,
      culturalRanks: 8,
    };
    // Already at max 2 developed this level, should reject
    const result = allocateRank(state, 5);
    expect(result).toEqual({ error: 'max ranks per skill per level reached' });
  });

  it('cultural ranks excluded from max developable check — high rank still allocable', () => {
    // rank=12: 10 cultural + 2 developed prior levels. This level: 0 developed so far
    const state: SkillAdvancementState = {
      currentRank: 12,
      ranksThisLevel: 0,
      culturalRanks: 10,
    };
    const result = allocateRank(state, 3);
    expect(result).toEqual({ newRank: 13, remainingDP: 2, ranksThisLevel: 1 });
  });
});

describe('transferDP', () => {
  it('transfers at 2:1 ratio — spend 4, gain 2', () => {
    const result = transferDP(5, 4);
    expect(result).toEqual({ sourceRemaining: 1, targetGained: 2 });
  });

  it('transfers at 2:1 ratio — spend 2, gain 1', () => {
    const result = transferDP(3, 2);
    expect(result).toEqual({ sourceRemaining: 1, targetGained: 1 });
  });

  it('rejects odd transfer amount (must be multiple of 2)', () => {
    const result = transferDP(5, 3);
    expect(result).toEqual({ error: 'transfer amount must be even (2:1 ratio)' });
  });

  it('rejects transfer exceeding source budget', () => {
    const result = transferDP(3, 4);
    expect(result).toEqual({ error: 'insufficient source DP' });
  });

  it('rejects zero transfer', () => {
    const result = transferDP(5, 0);
    expect(result).toEqual({ error: 'transfer amount must be even (2:1 ratio)' });
  });

  it('rejects negative transfer', () => {
    const result = transferDP(5, -2);
    expect(result).toEqual({ error: 'invalid transfer amount' });
  });

  it('full category transfer — spend all 6, gain 3', () => {
    const result = transferDP(6, 6);
    expect(result).toEqual({ sourceRemaining: 0, targetGained: 3 });
  });
});

describe('levelUp', () => {
  it('returns fresh DP budget from vocation (unspent are lost)', () => {
    const budget = levelUp('warrior');
    expect(budget).toEqual({
      armor: 2,
      combat: 5,
      adventuring: 4,
      roguery: 2,
      lore: 0,
      spells: 0,
      body: 2,
    });
  });

  it('Rogue gets fresh budget each level', () => {
    const budget = levelUp('rogue');
    expect(budget).toEqual({
      armor: 1,
      combat: 3,
      adventuring: 4,
      roguery: 5,
      lore: 1,
      spells: 0,
      body: 1,
    });
  });

  it('confirms unspent DPs are lost — fresh budget each time', () => {
    // Call twice: each returns the same fresh budget (no accumulation)
    const first = levelUp('wizard');
    const second = levelUp('wizard');
    expect(first).toEqual(second);
  });
});

describe('XP Thresholds', () => {
  it('XP_TABLE has correct values for levels 1-10', () => {
    expect(XP_TABLE).toEqual([
      { level: 1, xpThreshold: 10 },
      { level: 2, xpThreshold: 20 },
      { level: 3, xpThreshold: 30 },
      { level: 4, xpThreshold: 40 },
      { level: 5, xpThreshold: 50 },
      { level: 6, xpThreshold: 70 },
      { level: 7, xpThreshold: 90 },
      { level: 8, xpThreshold: 110 },
      { level: 9, xpThreshold: 130 },
      { level: 10, xpThreshold: 150 },
    ]);
  });

  it('computeXPThreshold returns correct value for level 3', () => {
    expect(computeXPThreshold(3)).toBe(30);
  });

  it('computeXPThreshold returns correct value for level 6', () => {
    expect(computeXPThreshold(6)).toBe(70);
  });

  it('computeXPThreshold returns correct value for level 10', () => {
    expect(computeXPThreshold(10)).toBe(150);
  });

  it('computeXPThreshold returns null for level beyond table', () => {
    expect(computeXPThreshold(11)).toBeNull();
  });

  it('computeXPThreshold returns null for level 0', () => {
    expect(computeXPThreshold(0)).toBeNull();
  });
});

describe('checkLevelUp', () => {
  it('qualifies for level 2 at 20 XP (at level 1)', () => {
    expect(checkLevelUp(20, 1)).toBe(true);
  });

  it('does not qualify for level 2 at 19 XP', () => {
    expect(checkLevelUp(19, 1)).toBe(false);
  });

  it('qualifies for level 6 at 70 XP (at level 5)', () => {
    expect(checkLevelUp(70, 5)).toBe(true);
  });

  it('does not qualify for level 6 at 69 XP', () => {
    expect(checkLevelUp(69, 5)).toBe(false);
  });

  it('excess XP still qualifies', () => {
    expect(checkLevelUp(200, 8)).toBe(true);
  });

  it('returns false at max level (10) since no level 11 in table', () => {
    expect(checkLevelUp(999, 10)).toBe(false);
  });
});

describe('MAX_RANKS_PER_SKILL_PER_LEVEL', () => {
  it('equals 2', () => {
    expect(MAX_RANKS_PER_SKILL_PER_LEVEL).toBe(2);
  });
});
