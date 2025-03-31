
/**
 * ESLint configuration for the project
 * @file eslint.config.js
 */
import {
  baseConfig,
  constants,
  drawingModeValidation,
  exportValidationRule,
  gridFabricRules,
  gridRules,
  ignores,
  importRules,
  jsdocRules,
  prettierRules,
  reactRules,
  sentryRules,
  typeSafetyRules
} from './eslint/index.js';
import typeScriptRules from './eslint/typescript-rules.js';

export default [
  ignores,
  baseConfig,
  importRules,
  reactRules,
  ...typeScriptRules, // Use the new TypeScript rules collection
  typeSafetyRules,
  gridRules,
  gridFabricRules,
  drawingModeValidation, // Add our new drawing mode validation rules
  jsdocRules,
  prettierRules,
  exportValidationRule,
  sentryRules,
];
