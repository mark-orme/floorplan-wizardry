
/**
 * ESLint rules collection
 * Exports all rule sets for centralized configuration
 * @module eslint/index
 */

// Import individual rule sets
const baseConfig = require('./base-config');
const importRules = require('./import-rules');
const reactRules = require('./react-rules');
const typeSafetyRules = require('./typescript-strict-rules');
const gridRules = require('./grid-rules');
const gridFabricRules = require('./grid-fabric-rules');
const jsdocRules = require('./jsdoc-rules');
const prettierRules = require('./prettier-config');
const exportValidationRule = require('./export-validation');
const sentryRules = require('./sentry-rules');
const drawingModeValidation = require('./drawing-mode-validation');
const fabricTypesRules = require('./fabric-types-rules');
const constants = require('./constants');
const ignores = require('./ignores');
const functionArgumentRules = require('./function-argument-rules');
const aiDevRules = require('./typescript/ai-dev-rules');
const fabricEventTypingRules = require('./typescript/fabric-event-typing-rules');
const strictFabricTypes = require('./typescript/strict-fabric-types');
const aiCodeSafetyRules = require('./typescript/ai-code-safety-rules');
const lucideReactPreventionRule = require('./lucide-react-prevention');

// Export all rule sets and configurations
module.exports = {
  baseConfig,
  importRules,
  reactRules,
  typeSafetyRules,
  gridRules,
  gridFabricRules,
  jsdocRules,
  prettierRules,
  exportValidationRule,
  sentryRules,
  drawingModeValidation,
  fabricTypesRules,
  constants,
  ignores,
  functionArgumentRules,
  aiDevRules,
  fabricEventTypingRules,
  strictFabricTypes,
  aiCodeSafetyRules,
  lucideReactPreventionRule
};
