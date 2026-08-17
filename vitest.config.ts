import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@module': resolve(__dirname, 'src/module'),
      '@utils': resolve(__dirname, 'src/module/utils'),
    },
  },
  test: {
    include: [
      'tests/unit/**/*.test.ts',
      'tests/property/**/*.prop.ts',
      'tests/integration/**/*.test.ts',
    ],
    globals: false,
  },
});
