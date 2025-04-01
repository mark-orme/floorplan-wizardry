
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
import { aiDevRules } from './eslint/typescript/ai-dev-rules.js';
import { typeAdvancedSafetyRules } from './eslint/type-safety-advanced-rules.js';
import { fabricEventTypingRules } from './eslint/typescript/fabric-event-typing-rules.js';
import { strictFabricTypes } from './eslint/typescript/strict-fabric-types.js';
import { aiCodeSafetyRules } from './eslint/typescript/ai-code-safety-rules.js';

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
  typeAdvancedSafetyRules, // Add our new advanced type safety rules
  gridRules,
  gridFabricRules,
  aiDevRules, // Add our new AI and Developer guidance rules
  drawingModeValidation, // Add our new drawing mode validation rules
  fabricTypesRules, // Add our new Fabric.js type safety rules
  fabricEventTypingRules, // Add our fabric event typing rules
  strictFabricTypes, // Add strict fabric type rules
  aiCodeSafetyRules, // Add AI code safety rules
  jsdocRules,
  prettierRules,
  exportValidationRule,
  sentryRules,
];
