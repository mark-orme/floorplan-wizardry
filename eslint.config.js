
/**
 * ESLint configuration for the project
 * Centralizes and organizes all linting rules
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
import fabricTypesRules from './eslint/fabric-types-rules.js';

/**
 * Comprehensive ESLint configuration
 * Combines all rule sets for complete code quality enforcement
 */
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
  fabricTypesRules, // Add our new Fabric.js type safety rules
  jsdocRules,
  prettierRules,
  exportValidationRule,
  sentryRules,
];
