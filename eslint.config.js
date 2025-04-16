
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

export default [
  baseConfig,
  importRules,
  importSafetyRules, // Add the new import safety rules
  reactRules,
  prettierRules,
  exportRules,
  ...typeScriptRules,
  fabricEventTypes,
  lineToolValidationRules,
  hookMockValidationRules
];
