
/**
 * ESLint configuration
 * Modular configuration split into logical categories
 */
import tseslint from "typescript-eslint";
import { ignores } from "./eslint/ignores.js";
import { baseConfig } from "./eslint/base-config.js";
import { typescriptRules } from "./eslint/typescript-rules.js";
import { reactRules } from "./eslint/react-rules.js";
import { jsdocRules } from "./eslint/jsdoc-rules.js";
import { prettierRules } from "./eslint/prettier-rules.js";
import { importExportRules } from "./eslint/import-rules.js";
import { exportValidationRules } from "./eslint/export-validation.js";
import { gridFabricRules } from "./eslint/grid-fabric-rules.js";

// Export the combined configuration
export default tseslint.config(
  ignores,
  baseConfig,
  typescriptRules,
  reactRules,
  jsdocRules,
  prettierRules,
  importExportRules,
  exportValidationRules,
  gridFabricRules
);
