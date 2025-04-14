
import { baseConfig } from './eslint/base-config.js';
import { importRules } from './eslint/import-rules.js';
import { reactRules } from './eslint/react-rules.js';
import { prettierRules } from './eslint/prettier-rules.js';
import typeScriptRules from './eslint/typescript-rules.js';

export default [
  baseConfig,
  importRules,
  reactRules,
  prettierRules,
  ...typeScriptRules
];
