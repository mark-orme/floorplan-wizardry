
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.ts',
  },
  tsconfigFile: 'tsconfig.json',
  checkers: ['typescript'],
  coverageAnalysis: 'perTest',
  mutate: [
    'src/utils/security/**/*.ts',
    'src/utils/security/**/*.tsx',
    '!src/utils/security/**/*.d.ts',
    '!src/utils/security/**/*.test.ts',
    '!src/utils/security/**/*.spec.ts',
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  timeoutMS: 60000,
  concurrency: 4,
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
};
