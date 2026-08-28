import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceManifestPath = join(root, 'system.json');
const stampScript = join(root, 'tools/stamp-release-manifest.ts');
const tsxCli = fileURLToPath(new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url));

function createDistribution(): { directory: string; dist: string } {
  const directory = mkdtempSync(join(tmpdir(), 'open00-release-stamp-'));
  const dist = join(directory, 'dist');
  mkdirSync(dist);
  writeFileSync(join(dist, 'system.json'), readFileSync(sourceManifestPath));
  return { directory, dist };
}

function stamp(dist: string, arguments_: readonly string[] = []) {
  return spawnSync(process.execPath, [tsxCli, stampScript, '--dist', dist, ...arguments_], { cwd: root, encoding: 'utf8' });
}

test('stamps only the distribution manifest with tag-specific open00 release URLs', () => {
  const sourceBefore = readFileSync(sourceManifestPath, 'utf8');
  const { directory, dist } = createDistribution();
  try {
    const result = stamp(dist, ['--repository', 'jero-rodriguez/open00', '--tag', 'v1.2.3', '--version', '1.2.3']);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(readFileSync(join(dist, 'system.json'), 'utf8')), {
      ...JSON.parse(sourceBefore) as object,
      version: '1.2.3',
      manifest: 'https://github.com/jero-rodriguez/open00/releases/download/v1.2.3/system.json',
      download: 'https://github.com/jero-rodriguez/open00/releases/download/v1.2.3/open00.zip',
    });
    assert.equal(readFileSync(sourceManifestPath, 'utf8'), sourceBefore);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('fails closed for missing files and malformed release identity inputs', () => {
  const { directory, dist } = createDistribution();
  try {
    assert.equal(stamp(join(directory, 'missing'), ['--repository', 'jero-rodriguez/open00', '--tag', 'v1.2.3', '--version', '1.2.3']).status, 1);
    assert.equal(stamp(dist, ['--repository', 'invalid-repository', '--tag', 'v1.2.3', '--version', '1.2.3']).status, 1);
    assert.equal(stamp(dist, ['--repository', 'jero-rodriguez/open00', '--tag', '1.2.3', '--version', '1.2.3']).status, 1);
    assert.equal(stamp(dist, ['--repository', 'jero-rodriguez/open00', '--tag', 'v1.2.3', '--version', '1.2.4']).status, 1);
    assert.equal(stamp(dist, ['--repository', 'jero-rodriguez/open00', '--tag', 'v1.2.3']).status, 1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
