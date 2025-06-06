
/**
 * TypeScript ESLint rules collection
 * Exports all TypeScript rule sets for centralized configuration
 * @module eslint/typescript/index
 */

// Import individual rule sets
import { aiDevRules } from './ai-dev-rules.js';
import { fabricEventTypingRules } from './fabric-event-typing-rules.js';
import { strictFabricTypes } from './strict-fabric-types.js';
import { aiCodeSafetyRules } from './ai-code-safety-rules.js';
import { hookMockValidationRules } from './hook-mock-validation.js';
import { lineToolValidationRules } from './line-tool-validation.js';
import { drawingModeValidationRules } from './drawing-mode-validation.js';
import { fabricPathValidationRules } from './fabric-path-validation.js';

// Export all rule sets
export const typescriptRules = [
  aiDevRules,
  fabricEventTypingRules,
  strictFabricTypes,
  aiCodeSafetyRules,
  hookMockValidationRules,
  lineToolValidationRules,
  drawingModeValidationRules,
  fabricPathValidationRules
];

export default typescriptRules;
