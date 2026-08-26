import { afterEach, describe, expect, it } from 'vitest';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copyStaticData } from '../../vite.config';

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('Vite combat-table asset copying', () => {
  it('copies nested src/data files to dist/data and omits placeholders', () => {
    const root = mkdtempSync(join(tmpdir(), 'open00-vite-data-'));
    temporaryDirectories.push(root);
    const sourceRoot = join(root, 'src');
    const outputRoot = join(root, 'dist');
    const attackDirectory = join(sourceRoot, 'data', 'attack-tables');
    mkdirSync(attackDirectory, { recursive: true });
    writeFileSync(join(attackDirectory, 'synthetic.json'), '{"name":"Synthetic"}');
    writeFileSync(join(attackDirectory, '.gitkeep'), '');

    copyStaticData(sourceRoot, outputRoot);

    expect(readFileSync(join(outputRoot, 'data', 'attack-tables', 'synthetic.json'), 'utf8'))
      .toBe('{"name":"Synthetic"}');
    expect(existsSync(join(outputRoot, 'data', 'attack-tables', '.gitkeep'))).toBe(false);
  });
});
