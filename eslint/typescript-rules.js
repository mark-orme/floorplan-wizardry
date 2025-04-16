
/**
 * TypeScript ESLint rules
 * @module eslint/typescript-rules
 */
import { typescriptRules } from './typescript/index.js';
import { typeAdvancedSafetyRules } from './type-safety-advanced-rules.js';
import { accessibilityRules } from './accessibility-rules.js';
import { typeSafetyRules } from './type-safety-rules.js';
import { typeEnforcementRules } from './type-enforcement-rules.js';
import { mockTypeSafetyRules } from './typescript/mock-type-safety.js';

// Export all TypeScript rules
export default [
  ...typescriptRules,
  typeAdvancedSafetyRules,
  accessibilityRules,
  typeSafetyRules,
  typeEnforcementRules,
  mockTypeSafetyRules
];
