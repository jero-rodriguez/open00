import { computeRankBonus } from '../engine/rank-bonus.js';

interface SkillData {
  name: string;
  rank: number;
}

export interface KinCultureVocation {
  kin?: Record<string, unknown>;
  culture?: Record<string, unknown>;
  vocation?: Record<string, unknown>;
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string' || value.trim() === '') return 0;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

/**
 * Returns actor update paths that zero out ALL identity-derived fields
 * (stats.*.kin, hp.max, wealth, skills.*.vocation, skills.*.rank).
 * Intended to be applied first, then `deriveKinCultureVocationEffects`
 * re-applies the effects of whichever identities remain on the actor.
 */
export function clearAllIdentityEffects(
  actorSystem: Record<string, unknown>,
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  const skills = (actorSystem['skills'] as SkillData[] | undefined) ?? [];

  // Zero kin stat modifiers
  for (const stat of ['brn', 'swi', 'for', 'wit', 'wsd', 'bea']) {
    updates[`system.stats.${stat}.kin`] = 0;
  }

  // Reset HP max to just body rank bonus (no kin contribution)
  const bodySkill = skills.find((skill) => skill.name === 'Body');
  const bodyRankBonus = bodySkill ? computeRankBonus(asNumber(bodySkill.rank)) : 0;
  updates['system.hp.max'] = bodyRankBonus;

  // Zero wealth (kin + culture contribution)
  updates['system.wealth'] = 0;

  // Zero vocation bonuses and cultural rank allocations on each skill
  for (let index = 0; index < skills.length; index++) {
    updates[`system.skills.${index}.vocation`] = 0;
    updates[`system.skills.${index}.rank`] = 0;
  }

  return updates;
}

export function deriveKinCultureVocationEffects(
  actorSystem: Record<string, unknown>,
  identities: KinCultureVocation,
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  const skills = (actorSystem['skills'] as SkillData[] | undefined) ?? [];

  if (identities.kin) {
    const statModifiers = identities.kin['statModifiers'] as Record<string, unknown> | undefined;
    for (const stat of ['brn', 'swi', 'for', 'wit', 'wsd', 'bea']) {
      updates[`system.stats.${stat}.kin`] = asNumber(statModifiers?.[stat]);
    }

    const bodySkill = skills.find((skill) => skill.name === 'Body');
    const bodyRankBonus = bodySkill ? computeRankBonus(asNumber(bodySkill.rank)) : 0;
    updates['system.hp.max'] = asNumber(identities.kin['hpBonus']) + bodyRankBonus;
  }

  if (identities.vocation) {
    const bonuses = (identities.vocation['vocationalBonuses'] as Array<{ skillName: string; bonus: number }> | undefined) ?? [];
    for (let index = 0; index < skills.length; index++) {
      const match = bonuses.find((bonus) => bonus.skillName === skills[index].name);
      updates[`system.skills.${index}.vocation`] = match ? asNumber(match.bonus) : 0;
    }
  }

  if (identities.culture) {
    const allocations = (identities.culture['skillRankAllocations'] as Array<{ skillName: string; ranks: number }> | undefined) ?? [];
    for (let index = 0; index < skills.length; index++) {
      const match = allocations.find((allocation) => allocation.skillName === skills[index].name);
      if (match) updates[`system.skills.${index}.rank`] = Math.max(asNumber(skills[index].rank), asNumber(match.ranks));
    }
  }

  if (identities.kin || identities.culture) {
    updates['system.wealth'] = asNumber(identities.kin?.['startingWealth'])
      + asNumber(identities.culture?.['startingWealth']);
  }

  return updates;
}
