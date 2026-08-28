import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildPackage } from '../tools/build.js';
import { auditPackageContents, evaluateRelease, validateBuildInput, validateCommitState, validateConventionalCommit, validateRepositorySelector } from '../tools/release-guard.js';
import { runtimeSmoke } from '../tools/runtime-smoke.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const tsxCli = fileURLToPath(new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url));

test('builds an installable manifest with exact Foundry 14.367 compatibility', () => {
  rmSync(join(root, 'dist'), { recursive: true, force: true });
  buildPackage(root);
  const manifest = JSON.parse(readFileSync(join(root, 'dist/system.json'), 'utf8')) as { id: string; title: string; description: string; compatibility: unknown };
  const packageManifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { name: string };
  assert.equal(existsSync(join(root, 'dist/system.json')), true);
  assert.deepEqual(
    { id: manifest.id, title: manifest.title, description: manifest.description, packageName: packageManifest.name },
    { id: 'open00', title: 'open00', description: 'Private-use open00 system.', packageName: 'open00-foundry-v14' },
  );
  assert.deepEqual(manifest.compatibility, { minimum: '14.367', verified: '14.367' });
});

test('release guard rejects unsafe package inputs and any non-private release state', () => {
  for (const path of ['requirements.txt', 'CMakeLists.txt', 'guide.mdx', 'README.sh']) assert.equal(validateBuildInput(path), false, path);
  assert.equal(validateBuildInput('src/domain/roll-resolution.ts'), true);
  for (const state of [
    {},
    { repository: 'private', release: 'public', authorization: true, tag: 'v1', sha: 'a', expectedSha: 'a', contentsPrivate: true },
    { repository: 'private', release: 'private', authorization: false, tag: 'v1', sha: 'a', expectedSha: 'a', contentsPrivate: true },
    { repository: 'private', release: 'private', authorization: true, tag: 'v1', sha: 'a', expectedSha: 'b', contentsPrivate: true },
  ]) assert.equal(evaluateRelease(state).allowed, false);
});

test('release guard accepts only an exact private authorized release and conventional commits', () => {
  assert.deepEqual(evaluateRelease({ repository: 'private', release: 'private', authorization: true, tag: 'v1.0.0', sha: 'abc', expectedSha: 'abc', contentsPrivate: true }), { allowed: true });
  assert.equal(validateConventionalCommit('feat(rolls): add deterministic resolver'), true);
  assert.equal(validateConventionalCommit('Add resolver'), false);
});

test('PR title validator CLI preserves conventional commit validation semantics', () => {
  const run = (title: string) => spawnSync(process.execPath, [tsxCli, 'tools/validate-pr-title.ts'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PR_TITLE: title },
  });

  assert.equal(run('feat(rolls): add deterministic resolver').status, 0);
  assert.equal(run('Add resolver').status, 1);
});

test('marks every unavailable or wrong Foundry runtime as NOT VERIFIED', () => {
  assert.deepEqual(runtimeSmoke({ version: '14.366' }), { status: 'NOT VERIFIED', reason: 'Foundry build must be exactly 14.367' });
  assert.deepEqual(runtimeSmoke({ version: '14.367' }), { status: 'NOT VERIFIED', reason: 'Foundry runtime command is unavailable' });
});

test('threat gates reject repository selectors and mutable or empty commit state', () => {
  for (const selector of ['git -C other', 'relative/repository', '/absolute/repository']) assert.equal(validateRepositorySelector(selector), false);
  assert.equal(validateRepositorySelector({ root: '/repo', repositoryId: 'expected', expectedRepositoryId: 'expected' }), true);
  for (const state of [
    { taggedTree: 'a', headTree: 'a', staged: true, commitAll: false, indexEntries: 1 },
    { taggedTree: 'a', headTree: 'a', staged: false, commitAll: true, indexEntries: 1 },
    { taggedTree: 'a', headTree: 'a', staged: false, commitAll: false, indexEntries: 0 },
  ]) assert.equal(validateCommitState(state), false);
  assert.equal(validateCommitState({ taggedTree: 'a', headTree: 'a', staged: false, commitAll: false, indexEntries: 1 }), true);
});

test('package audit rejects protected adventure and executable content before mutation', () => {
  assert.equal(auditPackageContents(['dist/system.json']), true);
  assert.equal(auditPackageContents(['dist/adventure/scene.json']), false);
  assert.equal(auditPackageContents(['dist/README.sh']), false);
});
