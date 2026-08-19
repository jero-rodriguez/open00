import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative, sep } from 'path';

function copyDir(src: string, dest: string) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    if (entry === '.gitkeep') continue;
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/** Recursively find all .ts files (excluding .d.ts) in a directory */
function findTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...findTsFiles(fullPath));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

function foundryAssets() {
  return {
    name: 'copy-foundry-assets',
    closeBundle() {
      // Copy system manifest
      copyFileSync(resolve('src/system.json'), resolve('dist/system.json'));
      // Copy static asset folders
      copyDir(resolve('src/lang'), resolve('dist/lang'));
      copyDir(resolve('src/templates'), resolve('dist/templates'));
      copyDir(resolve('src/styles'), resolve('dist/styles'));
    },
  };
}

// Collect all TypeScript source entries under src/module/
const moduleEntries = findTsFiles('src/module');

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        'open00-system': resolve('src/open00-system.ts'),
        ...Object.fromEntries(
          moduleEntries.map(file => {
            // src/module/models/actor/character.ts -> module/models/actor/character
            const key = relative(resolve('src'), resolve(file))
              .split(sep)
              .join('/')
              .replace(/\.ts$/, '');
            return [key, resolve(file)];
          }),
        ),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].mjs',
        chunkFileNames: 'module/[name].mjs',
      },
    },
  },
  plugins: [
    foundryAssets(),
  ],
});
