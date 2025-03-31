
/**
 * ESLint configuration for the project
 * @file eslint.config.js
 */
import {
  baseConfig,
  constants,
  exportValidationRule,
  gridFabricRules,
  gridRules,
  ignores,
  importRules,
  jsdocRules,
  prettierRules,
  reactRules,
  sentryRules,
  typescriptRules,
  typeSafetyRules
} from './eslint/index.js';

export default [
  ignores,
  baseConfig,
  importRules,
  reactRules,
  ...typescriptRules, // Now spread the array of TypeScript rule configurations
  typeSafetyRules,
  gridRules,
  gridFabricRules,
  jsdocRules,
  prettierRules,
  exportValidationRule,
  sentryRules,
];
