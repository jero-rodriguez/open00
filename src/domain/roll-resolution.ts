export type RollOutcome = 'success' | 'failure';

export interface RollInput {
  readonly rolls: readonly number[];
  readonly difficulty: number;
  readonly modifiers: readonly number[];
}

export interface ResolvedRoll {
  readonly rollTotal: number;
  readonly modifierTotal: number;
  readonly total: number;
  readonly difficulty: number;
  readonly consumedRolls: readonly number[];
}

export interface SuccessfulRollResolution {
  readonly ok: true;
  readonly outcome: RollOutcome;
  readonly trace: {
    readonly supplied: RollInput;
    readonly resolved: ResolvedRoll;
  };
}

export interface InvalidRollResolution {
  readonly ok: false;
  readonly error: string;
}

export type RollResolution = SuccessfulRollResolution | InvalidRollResolution;

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isD100Roll = (value: unknown): value is number => isFiniteNumber(value) && Number.isInteger(value) && value >= 1 && value <= 100;
const isNumberArray = (value: unknown): value is readonly number[] => Array.isArray(value) && value.every(isFiniteNumber);
const isD100RollArray = (value: unknown): value is readonly number[] => Array.isArray(value) && value.length > 0 && value.every(isD100Roll);
const invalid = (error: string): InvalidRollResolution => ({ ok: false, error });

export function resolveRoll(input: unknown = {}): RollResolution {
  if (input === null || typeof input !== 'object') return invalid('input must be an object');

  const { rolls, difficulty, modifiers } = input as Record<string, unknown>;
  if (!isFiniteNumber(difficulty)) return invalid('difficulty must be a finite GM-supplied number');
  if (!isNumberArray(modifiers)) return invalid('modifiers must be GM-supplied finite numbers');
  if (!isD100RollArray(rolls)) return invalid('rolls must be supplied d100 values');

  const firstRoll = rolls[0];
  if (firstRoll === undefined) return invalid('rolls must be supplied d100 values');

  let index = 1;
  let rollTotal = firstRoll;
  let direction: -1 | 0 | 1 = firstRoll >= 96 ? 1 : firstRoll <= 5 ? -1 : 0;
  while (direction !== 0) {
    const next = rolls[index++];
    if (!isFiniteNumber(next)) return invalid('open-ended continuation roll is required');
    rollTotal += direction * next;
    direction = direction === 1 && next >= 96 ? 1 : direction === -1 && next <= 5 ? -1 : 0;
  }

  const modifierTotal = modifiers.reduce((total, modifier) => total + modifier, 0);
  const total = rollTotal + modifierTotal;
  const supplied: RollInput = { rolls: [...rolls], difficulty, modifiers: [...modifiers] };
  return {
    ok: true,
    outcome: total >= difficulty ? 'success' : 'failure',
    trace: { supplied, resolved: { rollTotal, modifierTotal, total, difficulty, consumedRolls: rolls.slice(0, index) } },
  };
}
