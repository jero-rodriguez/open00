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

    const bodySkill = skills.find((skill) => skill.name === 'Body Development');
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
