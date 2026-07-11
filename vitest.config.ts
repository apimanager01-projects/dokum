import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * Vitest — dev-only test runner (PRD #28 Testing Decisions; no runtime impact).
 * The pure editor modules run in plain Node; DOM-dependent suites (e.g. the
 * document-json module of slice 7) opt into jsdom per file via a
 * `@vitest-environment` docblock.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
