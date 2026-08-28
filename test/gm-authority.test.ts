import assert from 'node:assert/strict';
import test from 'node:test';
import { createGMConfirmationGateway } from '../src/domain/gm-confirmation.js';
import { createOptionalRuleRegistry, registerOptionalRuleSettings, settingsRegistrationReceipt } from '../src/foundry/optional-rules.js';

const source = { document: 'open00 v1.5 PDF', page: 1, anchor: 'optional-rule', hash: 'a'.repeat(64), verifiedBy: 'maintainer', verifiedAt: '2026-08-28' } as const;
const options = [
  { id: 'open00.optional.alpha', name: 'Alpha', hint: 'Test-only registry fixture.', source },
  { id: 'open00.optional.beta', name: 'Beta', hint: 'Test-only registry fixture.', source: { ...source, anchor: 'other-optional-rule' } },
] as const;

test('a pending GM decision never writes state before explicit confirmation', () => {
  const writes: unknown[] = [];
  const gateway = createGMConfirmationGateway({
    isAuthorizedGM: (userId) => userId === 'gm-1',
    apply: (change, confirmation) => { writes.push({ change, confirmation }); return { applied: change }; },
  });
  const pending = gateway.present({ id: 'damage-1', revision: 3, inputs: { roll: 92, difficulty: 80 }, change: { hp: -5 } });

  assert.deepEqual(pending, { status: 'pending', id: 'damage-1', revision: 3, inputs: { roll: 92, difficulty: 80 } });
  assert.deepEqual(writes, []);
});

test('an authorized GM confirmation applies only the immutable pending change and retains bound inputs', () => {
  const writes: unknown[] = [];
  const gateway = createGMConfirmationGateway({
    isAuthorizedGM: (userId) => userId === 'gm-1',
    apply: (change, confirmation) => { writes.push({ change, confirmation }); return { applied: change }; },
  });
  gateway.present({ id: 'damage-1', revision: 3, inputs: { roll: 92, difficulty: 80 }, change: { hp: -5 } });

  const confirmed = gateway.confirm({ id: 'damage-1', revision: 3, userId: 'gm-1' });
  assert.deepEqual(confirmed, { status: 'confirmed', id: 'damage-1', revision: 3, inputs: { roll: 92, difficulty: 80 }, result: { applied: { hp: -5 } } });
  assert.deepEqual(writes, [{ change: { hp: -5 }, confirmation: { id: 'damage-1', revision: 3, inputs: { roll: 92, difficulty: 80 }, userId: 'gm-1' } }]);
});

test('malformed, unauthorized, cancelled, and stale confirmations cannot write state', () => {
  const writes: unknown[] = [];
  const gateway = createGMConfirmationGateway({
    isAuthorizedGM: (userId) => userId === 'gm-1',
    apply: (change) => { writes.push(change); return change; },
  });
  gateway.present({ id: 'damage-1', revision: 3, inputs: { roll: 92 }, change: { hp: -5 } });

  assert.deepEqual(gateway.confirm({ id: 'damage-1', revision: 3, userId: 'player-1' }), { status: 'rejected', reason: 'unauthorized GM confirmation' });
  assert.deepEqual(gateway.confirm({ id: 'damage-1', revision: 2, userId: 'gm-1' }), { status: 'rejected', reason: 'stale GM confirmation' });
  assert.deepEqual(gateway.confirm({ id: '', revision: 3, userId: 'gm-1' }), { status: 'rejected', reason: 'malformed GM confirmation' });
  assert.deepEqual(gateway.cancel({ id: 'damage-1', revision: 3 }), { status: 'cancelled', id: 'damage-1', revision: 3 });
  assert.deepEqual(gateway.confirm({ id: 'damage-1', revision: 3, userId: 'gm-1' }), { status: 'rejected', reason: 'stale GM confirmation' });
  assert.deepEqual(writes, []);
});

test('optional-rule registry admits only verified PDF entries and initializes every option independently disabled', () => {
  assert.throws(() => createOptionalRuleRegistry([{ ...options[0], source: { ...source, hash: 'unverified' } }]), /verified PDF source/);
  const registry = createOptionalRuleRegistry(options);

  assert.deepEqual(registry.defaults(), { 'open00.optional.alpha': false, 'open00.optional.beta': false });
  assert.equal(registry.isEnabled({ 'open00.optional.alpha': true, 'open00.optional.beta': false }, 'open00.optional.alpha'), true);
  assert.equal(registry.isEnabled({ 'open00.optional.alpha': true, 'open00.optional.beta': false }, 'open00.optional.beta'), false);
});

test('Foundry world-setting adapter registers each verified option as an independent Boolean false default and does not fabricate a 14.367 receipt', () => {
  const registrations: Array<{ namespace: string; key: string; data: unknown }> = [];
  registerOptionalRuleSettings({ register: (namespace, key, data) => registrations.push({ namespace, key, data }) }, createOptionalRuleRegistry(options));

  assert.deepEqual(registrations, [
    { namespace: 'open00', key: 'optional.alpha', data: { name: 'Alpha', hint: 'Test-only registry fixture.', scope: 'world', config: true, type: Boolean, default: false } },
    { namespace: 'open00', key: 'optional.beta', data: { name: 'Beta', hint: 'Test-only registry fixture.', scope: 'world', config: true, type: Boolean, default: false } },
  ]);
  assert.deepEqual(settingsRegistrationReceipt({ version: '14.367', runtimeAvailable: false }), { status: 'NOT VERIFIED', reason: 'Foundry runtime registration evidence is unavailable' });
  assert.deepEqual(settingsRegistrationReceipt({ version: '14.366', runtimeAvailable: true }), { status: 'NOT VERIFIED', reason: 'Foundry build must be exactly 14.367' });
});
