import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import reactPlugin from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";

// Constants for ESLint configuration
const MAX_LINE_LENGTH = 100;
const MAX_FUNCTION_LINES = 50;
const MAX_COMPLEXITY = 10;
const MAX_DEPTH = 3;

export default tseslint.config(
  { ignores: ["dist", "node_modules", "build"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...reactHooks.configs.recommended,
      reactPlugin.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsdoc": jsdoc,
      "react": reactPlugin,
      "prettier": prettier,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-magic-numbers": ["error", { 
        "ignore": [0, 1, -1, 2], 
        "ignoreArrayIndexes": true,
        "ignoreDefaultValues": true,
        "ignoreEnums": true,
        "ignoreNumericLiteralTypes": true,
        "ignoreReadonlyClassProperties": true,
        "enforceConst": true,
        "detectObjects": false
      }],
      
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": ["error", {
        "ts-ignore": "true",
        "ts-nocheck": "true",
        "minimumDescriptionLength": 10
      }],
      "@typescript-eslint/explicit-function-return-type": ["warn", {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/explicit-member-accessibility": "warn",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      "@typescript-eslint/array-type": ["warn", { "default": "array" }],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      
      "@typescript-eslint/ban-types": ["error", {
        "types": {
          "Event": {
            "message": "🛑 Never use `Event` alone — always use PointerEvent, MouseEvent, or TouchEvent",
            "fixWith": "PointerEvent | MouseEvent | TouchEvent"
          },
          "any": {
            "message": "🛑 Avoid `any` — strongly type every function",
            "fixWith": "unknown"
          },
          "Object": {
            "message": "Use a more specific type",
            "fixWith": "Record<string, unknown>"
          },
          "Function": {
            "message": "Use a more specific function type",
            "fixWith": "(...args: unknown[]) => unknown"
          }
        }
      }],
      
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
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/no-undefined-types": "warn",
      
      "@typescript-eslint/naming-convention": [
        "error",
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
      
      "react/prop-types": "off",
      "react/display-name": "off",
      
      "no-console": "warn",
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
      "sort-imports": ["warn", {
        "ignoreCase": true,
        "ignoreDeclarationSort": true
      }],
      "complexity": ["error", MAX_COMPLEXITY],
      "no-unused-expressions": "error",
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "quotes": ["warn", "double", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "comma-dangle": ["warn", "always-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "max-depth": ["error", MAX_DEPTH],
      "prefer-destructuring": ["warn", {
        "array": true,
        "object": true
      }],
      "arrow-body-style": ["warn", "as-needed"],
      "promise/catch-or-return": "error",
      "promise/always-return": "error",
      "react/function-component-definition": ["warn", {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function"
      }],
      "react-hooks/exhaustive-deps": "error",
      
      "prettier/prettier": ["warn", {
        "semi": true,
        "singleQuote": false,
        "printWidth": 100,
        "trailingComma": "all",
        "tabWidth": 2
      }]
    },
  }
);
