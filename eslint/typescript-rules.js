
/**
 * TypeScript ESLint rules
 * @module eslint/typescript-rules
 */
import { typescriptRules } from './typescript/index.js';
import { typeAdvancedSafetyRules } from './type-safety-advanced-rules.js';

// Export all TypeScript rules
export default [
  ...typescriptRules,
  typeAdvancedSafetyRules
];
