
/**
 * Base ESLint configuration
 * @module eslint/base-config
 */
import js from "@eslint/js";
import globals from "globals";
import { MAX_LINE_LENGTH, MAX_FUNCTION_LINES, MAX_COMPLEXITY, MAX_DEPTH } from "./constants.js";

export const baseConfig = {
  extends: [js.configs.recommended],
  languageOptions: {
    ecmaVersion: 2021,
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    "no-unused-expressions": "error",
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "quotes": ["warn", "double", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "comma-dangle": ["warn", "always-multiline"],
    "object-curly-spacing": ["warn", "always"],
    "array-bracket-spacing": ["warn", "never"],
    "max-len": ["warn", { 
      "code": MAX_LINE_LENGTH, 
      "ignoreComments": true, 
      "ignoreUrls": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true,
      "ignoreRegExpLiterals": true
    }],
    "max-lines-per-function": ["error", { 
      "max": MAX_FUNCTION_LINES, 
      "skipBlankLines": true, 
      "skipComments": true 
    }],
    "max-depth": ["error", MAX_DEPTH],
    "complexity": ["error", MAX_COMPLEXITY],
    "prefer-destructuring": ["warn", {
      "array": true,
      "object": true
    }],
    "arrow-body-style": ["warn", "as-needed"],
    "sort-imports": ["warn", {
      "ignoreCase": true,
      "ignoreDeclarationSort": true
    }],
    "promise/catch-or-return": "error",
    "promise/always-return": "error",
  }
};
