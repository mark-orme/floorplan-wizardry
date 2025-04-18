
import { baseConfig } from './eslint/base-config.js';
import { importRules } from './eslint/import-rules.js';
import { reactRules } from './eslint/react-rules.js';
import { prettierRules } from './eslint/prettier-rules.js';
import typeScriptRules from './eslint/typescript-rules.js';
import { fabricEventTypes } from './eslint/fabric-event-types.js';
import { exportRules } from './eslint/export-rules.js';
import { lineToolValidationRules } from './eslint/typescript/line-tool-validation.js';
import { hookMockValidationRules } from './eslint/typescript/hook-mock-validation.js';
import { importSafetyRules } from './eslint/import-safety-rules.js';
import { gridTypeSafetyRules } from './eslint/grid-type-safety-rules.js';
import { typeSafetyRules } from './eslint/type-safety-rules.js';
import { testMockValidationRules } from './eslint/typescript/test-mock-validation.js';
import { fabricTestTypingRules } from './eslint/fabric-test-typing-rules.js';
import { fabricSafetyRules } from './eslint/typescript/fabric-safety.js';
import { jsxExtensionValidationRule } from './eslint/typescript/jsx-extension-validation.js';
import { accessibilityRules } from './eslint/accessibility-rules.js';

export default [
  baseConfig,
  importRules,
  importSafetyRules, 
  reactRules,
  prettierRules,
  exportRules,
  ...typeScriptRules,
  fabricEventTypes,
  lineToolValidationRules,
  hookMockValidationRules,
  gridTypeSafetyRules,
  typeSafetyRules,
  testMockValidationRules,
  fabricTestTypingRules,
  fabricSafetyRules,
  jsxExtensionValidationRule,
  accessibilityRules
];
