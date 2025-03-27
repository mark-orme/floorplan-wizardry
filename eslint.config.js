import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

// Constants for ESLint configuration
const MAX_LINE_LENGTH = 100;
const MAX_FUNCTION_LINES = 50;
const MAX_COMPLEXITY = 10;
const MAX_DEPTH = 3;

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsdoc": jsdoc,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "error", // Keep as error
      "@typescript-eslint/no-magic-numbers": ["error", { // Keep as error
        "ignore": [0, 1, -1, 2], // Common values that don't need explaining
        "ignoreArrayIndexes": true,
        "ignoreDefaultValues": true,
        "ignoreEnums": true,
        "ignoreNumericLiteralTypes": true,
        "ignoreReadonlyClassProperties": true,
        "enforceConst": true,
        "detectObjects": false
      }],
      
      // New typing-specific rules
      "@typescript-eslint/no-explicit-any": "error", // Prohibit using 'any' type
      "@typescript-eslint/ban-ts-comment": ["error", {  // Prohibit @ts-ignore and similar
        "ts-ignore": "true",
        "ts-nocheck": "true",
        "minimumDescriptionLength": 10 // Require explanation if using ts-expect-error
      }],
      "@typescript-eslint/explicit-function-return-type": ["error", { // Require return types
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }],
      "@typescript-eslint/explicit-member-accessibility": "error", // Require explicit accessibility modifiers
      "@typescript-eslint/no-non-null-assertion": "error", // Avoid non-null assertions (!)
      "@typescript-eslint/prefer-as-const": "error", // Prefer as const to literal type
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Use interface instead of type where possible
      "@typescript-eslint/array-type": ["error", { "default": "array" }], // Consistent array type syntax
      "@typescript-eslint/consistent-type-imports": "error", // Consistent type imports
      "@typescript-eslint/no-unnecessary-type-assertion": "error", // Avoid unnecessary type assertions
      
      // JSDoc rules (already in place)
      "jsdoc/require-jsdoc": ["warn", {
        "publicOnly": true,
        "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": true,
          "ArrowFunctionExpression": true,
          "FunctionExpression": true
        }
      }],
      "jsdoc/require-description": ["warn", {
        "contexts": ["FunctionDeclaration", "ClassDeclaration", "ArrowFunctionExpression", "FunctionExpression", "MethodDefinition"]
      }],
      "jsdoc/require-param": "warn",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-param-name": "error", // Keep as error
      "jsdoc/require-param-type": "warn",
      "jsdoc/require-returns": "warn",
      "jsdoc/require-returns-description": "warn",
      "jsdoc/require-returns-type": "warn",
      "jsdoc/check-param-names": "error", // Keep as error
      "jsdoc/check-tag-names": "error", // Keep as error
      "jsdoc/check-types": "error", // Keep as error
      "jsdoc/valid-types": "error", // Keep as error
      "jsdoc/no-undefined-types": "warn",
      
      // Naming conventions and other rules (already in place)
      "@typescript-eslint/naming-convention": [
        "error", // Keep as error
        {
          "selector": "variable",
          "format": ["camelCase", "UPPER_CASE", "PascalCase"]
        },
        {
          "selector": "function",
          "format": ["camelCase", "PascalCase"]
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        },
        {
          "selector": "interface",
          "format": ["PascalCase"],
          "prefix": ["I"]
        }
      ],
      
      // Other rules (already in place)
      "max-len": ["warn", { 
        "code": MAX_LINE_LENGTH, 
        "ignoreComments": true, 
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }],
      "max-lines-per-function": ["error", { // Keep as error
        "max": MAX_FUNCTION_LINES, 
        "skipBlankLines": true, 
        "skipComments": true 
      }],
      "sort-imports": ["warn", {
        "ignoreCase": true,
        "ignoreDeclarationSort": true
      }],
      "complexity": ["error", MAX_COMPLEXITY], // Keep as error
      "no-unused-expressions": "error", // Keep as error
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "quotes": ["warn", "double", { "avoidEscape": true }],
      "semi": ["error", "always"], // Keep as error
      "comma-dangle": ["warn", "always-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "max-depth": ["error", MAX_DEPTH], // Keep as error
      "prefer-destructuring": ["warn", {
        "array": true,
        "object": true
      }],
      "arrow-body-style": ["warn", "as-needed"],
      "promise/catch-or-return": "error", // Keep as error
      "promise/always-return": "error", // Keep as error
      "react/function-component-definition": ["warn", {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function"
      }],
      "react-hooks/exhaustive-deps": "error" // Keep as error
    },
  }
);
