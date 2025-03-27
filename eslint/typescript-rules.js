
/**
 * TypeScript-specific ESLint rules
 * @module eslint/typescript-rules
 */
import tseslint from "typescript-eslint";

export const typescriptRules = {
  extends: [...tseslint.configs.recommended],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json"
    }
  },
  rules: {
    // TypeScript no-explicit-any and generic type safety
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
    
    // TypeScript function and return types
    "@typescript-eslint/explicit-function-return-type": ["warn", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "warn",
    "@typescript-eslint/explicit-member-accessibility": "warn",
    
    // TypeScript type and pattern rules
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
    "@typescript-eslint/array-type": ["warn", { "default": "array" }],
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    
    // TypeScript banned types and naming
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
    
    // TypeScript naming conventions
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
    ]
  }
};
