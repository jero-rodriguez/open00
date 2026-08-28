import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveRoll, type SuccessfulRollResolution } from '../src/domain/roll-resolution.js';

const assertSuccessful = (result: ReturnType<typeof resolveRoll>): SuccessfulRollResolution => {
  if (!result.ok) throw new Error(result.error);
  return result;
};

test('rejects missing or malformed GM-owned inputs without an outcome', () => {
  for (const input of [
    { rolls: [50], modifiers: [1] },
    { rolls: [50], difficulty: 'hard', modifiers: [1] },
    { rolls: [50], difficulty: 50, modifiers: [1, 'advantage'] },
    { rolls: [50], difficulty: 50 },
  ]) {
    const result = resolveRoll(input);
    assert.equal(result.ok, false);
    assert.equal('outcome' in result, false);
  }
});

test('preserves exact GM inputs and resolves a standard result deterministically', () => {
  const supplied = { rolls: [60], difficulty: 65, modifiers: [3, 2] };
  const result = assertSuccessful(resolveRoll(supplied));
  assert.deepEqual(result, {
    ok: true,
    outcome: 'success',
    trace: {
      supplied,
      resolved: { rollTotal: 60, modifierTotal: 5, total: 65, difficulty: 65, consumedRolls: [60] },
    },
  });
  assert.deepEqual(assertSuccessful(resolveRoll(supplied)), result);
});

test('consumes high and low open-ended continuations in supplied order and replays them', () => {
  const high = assertSuccessful(resolveRoll({ rolls: [96, 4], difficulty: 100, modifiers: [] }));
  assert.equal(high.outcome, 'success');
  assert.deepEqual(high.trace.resolved, { rollTotal: 100, modifierTotal: 0, total: 100, difficulty: 100, consumedRolls: [96, 4] });
  const low = assertSuccessful(resolveRoll({ rolls: [5, 12], difficulty: -7, modifiers: [] }));
  assert.equal(low.outcome, 'success');
  assert.deepEqual(low.trace.resolved.consumedRolls, [5, 12]);
  assert.equal(low.trace.resolved.rollTotal, -7);
  assert.deepEqual(assertSuccessful(resolveRoll({ rolls: [96, 4], difficulty: 100, modifiers: [] })), high);
});
