
/**
 * TypeScript ESLint rules
 * @module eslint/typescript-rules
 */
import { typescriptRules } from './typescript/index.js';
import { typeAdvancedSafetyRules } from './type-safety-advanced-rules.js';
import { accessibilityRules } from './accessibility-rules.js';

// Export all TypeScript rules
export default [
  ...typescriptRules,
  typeAdvancedSafetyRules,
  accessibilityRules
];
