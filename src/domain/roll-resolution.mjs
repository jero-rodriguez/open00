const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const invalid = (error) => ({ ok: false, error });

export function resolveRoll(input = {}) {
  const { rolls, difficulty, modifiers } = input;
  if (!isNumber(difficulty)) return invalid('difficulty must be a finite GM-supplied number');
  if (!Array.isArray(modifiers) || !modifiers.every(isNumber)) return invalid('modifiers must be GM-supplied finite numbers');
  if (!Array.isArray(rolls) || !rolls.length || !rolls.every((roll) => Number.isInteger(roll) && roll >= 1 && roll <= 100)) return invalid('rolls must be supplied d100 values');
  let index = 1;
  let rollTotal = rolls[0];
  let direction = rolls[0] >= 96 ? 1 : rolls[0] <= 5 ? -1 : 0;
  while (direction) {
    const next = rolls[index++];
    if (!isNumber(next)) return invalid('open-ended continuation roll is required');
    rollTotal += direction * next;
    direction = direction === 1 && next >= 96 ? 1 : direction === -1 && next <= 5 ? -1 : 0;
  }
  const modifierTotal = modifiers.reduce((total, modifier) => total + modifier, 0);
  const total = rollTotal + modifierTotal;
  const supplied = { rolls: [...rolls], difficulty, modifiers: [...modifiers] };
  return {
    ok: true,
    outcome: total >= difficulty ? 'success' : 'failure',
    trace: { supplied, resolved: { rollTotal, modifierTotal, total, difficulty, consumedRolls: rolls.slice(0, index) } },
  };
}
