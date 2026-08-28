import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function buildPackage(root = fileURLToPath(new URL('..', import.meta.url))) {
  const dist = resolve(root, 'dist');
  mkdirSync(dist, { recursive: true });
  cpSync(resolve(root, 'system.json'), resolve(dist, 'system.json'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) buildPackage();
