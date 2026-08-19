#!/usr/bin/env node

/**
 * Stamps version and download URL into dist/system.json
 * Usage: node scripts/stamp-release.js <version> <tag-name>
 * Example: node scripts/stamp-release.js 1.12.1 v1.12.1
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const [version, tagName] = process.argv.slice(2);

if (!version || !tagName) {
  console.error('Usage: node scripts/stamp-release.js <version> <tag-name>');
  process.exit(1);
}

const systemJsonPath = resolve('dist/system.json');

try {
  const systemJson = JSON.parse(readFileSync(systemJsonPath, 'utf-8'));

  systemJson.version = version;
  systemJson.download = `https://github.com/jero-rodriguez/open00/releases/download/${tagName}/vsd-system.zip`;

  writeFileSync(systemJsonPath, JSON.stringify(systemJson, null, 2));
  console.log(`✓ Stamped version ${version} and download URL in dist/system.json`);
} catch (error) {
  console.error('Error stamping release:', error.message);
  process.exit(1);
}
