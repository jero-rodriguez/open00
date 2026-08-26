import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.property.test.ts'],
    globals: true,
    setupFiles: ['tests/foundry-shim.ts', 'tests/setup.ts'],
  },
});
