import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      statements: 0.9,
      branches: 0.9,
      functions: 0.9,
      lines: 0.9,
    },
    include: [
      'packages/**/tests/**/*.test.ts',
      'apps/**/tests/**/*.test.ts'
    ],
    exclude: [
      'node_modules',
      'dist'
    ]
  }
});
