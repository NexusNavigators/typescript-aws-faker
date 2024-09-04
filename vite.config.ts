// @ts-expect-error moduleResolution:nodenext issue 54523
// eslint-disable-next-line import-x/no-unresolved
import { defineConfig } from 'vitest/config'
import inspector from 'inspector'
// If we are debugging then extend the timeout to max value, otherwise use the default.
const testTimeout = inspector.url() ? 1e8 : 15e3

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*'],
      clean: true,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    include: ['test/**/*.test.mts'],
    reporters: ['verbose'],
    mockReset: true,
    restoreMocks: true,
    testTimeout,
    hookTimeout: testTimeout,
    teardownTimeout: testTimeout,
    pool: 'forks',
    globals: true,
  },
})
