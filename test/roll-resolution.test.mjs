import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveRoll } from '../src/domain/roll-resolution.mjs';

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
  const result = resolveRoll(supplied);
  assert.deepEqual(result, {
    ok: true,
    outcome: 'success',
    trace: {
      supplied,
      resolved: { rollTotal: 60, modifierTotal: 5, total: 65, difficulty: 65, consumedRolls: [60] },
    },
  });
  assert.deepEqual(resolveRoll(supplied), result);
});

test('consumes high and low open-ended continuations in supplied order and replays them', () => {
  const high = resolveRoll({ rolls: [96, 4], difficulty: 100, modifiers: [] });
  assert.equal(high.outcome, 'success');
  assert.deepEqual(high.trace.resolved, { rollTotal: 100, modifierTotal: 0, total: 100, difficulty: 100, consumedRolls: [96, 4] });
  const low = resolveRoll({ rolls: [5, 12], difficulty: -7, modifiers: [] });
  assert.equal(low.outcome, 'success');
  assert.deepEqual(low.trace.resolved.consumedRolls, [5, 12]);
  assert.equal(low.trace.resolved.rollTotal, -7);
  assert.deepEqual(resolveRoll({ rolls: [96, 4], difficulty: 100, modifiers: [] }), high);
});
