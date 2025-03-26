
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

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
      "@typescript-eslint/no-unused-vars": "error", // Changed from off to error
      "@typescript-eslint/no-magic-numbers": ["warn", {
        "ignore": [0, 1, -1, 2], // Common values that don't need explaining
        "ignoreArrayIndexes": true,
        "ignoreDefaultValues": true,
        "ignoreEnums": true,
        "ignoreNumericLiteralTypes": true,
        "ignoreReadonlyClassProperties": true,
        "enforceConst": true,
        "detectObjects": false
      }],
      
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
      "jsdoc/require-param-name": "error",
      "jsdoc/require-param-type": "warn",
      "jsdoc/require-returns": "warn",
      "jsdoc/require-returns-description": "warn",
      "jsdoc/require-returns-type": "warn",
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/check-types": "warn",
      "jsdoc/valid-types": "warn",
      "jsdoc/no-undefined-types": "warn",
      
      // New rules for code quality
      
      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "warn",
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
      
      // Maximum line length
      "max-len": ["warn", { 
        "code": 100, 
        "ignoreComments": true, 
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }],
      
      // Maximum function length
      "max-lines-per-function": ["warn", { 
        "max": 50, 
        "skipBlankLines": true, 
        "skipComments": true 
      }],
      
      // Import order
      "sort-imports": ["warn", {
        "ignoreCase": true,
        "ignoreDeclarationSort": true
      }],
      
      // Complexity limits
      "complexity": ["warn", 10],
      
      // Unused variables and imports (typescript-eslint handles no-unused-vars)
      "no-unused-expressions": "error",
      
      // Consistent spacing and formatting
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "quotes": ["warn", "double", { "avoidEscape": true }],
      "semi": ["warn", "always"],
      "comma-dangle": ["warn", "always-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      
      // Prevent deeply nested code
      "max-depth": ["warn", 3],
      
      // Encourage consistent use of destructuring
      "prefer-destructuring": ["warn", {
        "array": true,
        "object": true
      }],
      
      // Enforce consistent arrow function syntax
      "arrow-body-style": ["warn", "as-needed"],
      
      // Enforce consistent use of promise methods
      "promise/catch-or-return": "warn",
      "promise/always-return": "warn",
      
      // Enforce consistent React component definitions
      "react/function-component-definition": ["warn", {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function"
      }],
      
      // Enforce consistent React Hook usage
      "react-hooks/exhaustive-deps": "warn"
    },
  }
);
