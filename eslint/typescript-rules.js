
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
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
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
      "minimumDescriptionLength": 20
    }],
    "@typescript-eslint/consistent-type-assertions": "error",
    
    // TypeScript function and return types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": false,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/explicit-member-accessibility": "error",
    
    // TypeScript type and pattern rules
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/array-type": ["error", { "default": "array" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/no-duplicate-imports": "error",
    
    // Additional strict rules requested
    "@typescript-eslint/no-misused-promises": ["error", { 
      "checksVoidReturn": { 
        "attributes": false 
      } 
    }],
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "@typescript-eslint/no-redundant-type-constituents": "error",
    
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
      },
      // NEW: Enforce enum naming conventions
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      // NEW: Enforce class naming conventions
      {
        "selector": "class",
        "format": ["PascalCase"]
      },
      // NEW: Enforce type parameter naming
      {
        "selector": "typeParameter",
        "format": ["PascalCase"],
        "prefix": ["T"]
      }
    ],
    
    // NEW: Prevent specific patterns
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
        "message": "setTimeout must always be invoked with two arguments."
      },
      {
        "selector": "IfStatement > ExpressionStatement > AssignmentExpression",
        "message": "Assignment in if statement is error-prone, move to a line before the if."
      },
      {
        "selector": "FunctionDeclaration:not([returnType])",
        "message": "All functions must declare an explicit return type."
      }
    ],
    
    // NEW: Maximum nesting depth to prevent deeply nested code
    "max-depth": ["error", 4],
    
    // NEW: Maximum number of lines per function to prevent large functions
    "max-lines-per-function": ["warn", { 
      "max": 50, 
      "skipBlankLines": true, 
      "skipComments": true 
    }],
    
    // NEW: Maximum complexity to prevent overly complex functions
    "complexity": ["warn", 10],
    
    // NEW: Force array callbacks to return values
    "@typescript-eslint/array-callback-return": "error",
    
    // NEW: Enforce consistent arrow function body style
    "arrow-body-style": ["error", "as-needed"],
    
    // NEW: Enforce default parameters to be last
    "default-param-last": "error",
    
    // NEW: Enforce safe rule for object destructuring
    "prefer-destructuring": ["warn", {
      "array": false,
      "object": true
    }],
    
    // NEW: Enforce consistent function style for anonymous functions
    "func-style": ["warn", "expression"],
    
    // NEW: Prevent conditionals that can be simplified
    "@typescript-eslint/no-unnecessary-condition": "warn",
    
    // NEW: Require type annotations in all appropriate locations
    "@typescript-eslint/typedef": ["error", {
      "arrayDestructuring": false,
      "arrowParameter": false,
      "memberVariableDeclaration": true,
      "objectDestructuring": false,
      "parameter": true,
      "propertyDeclaration": true,
      "variableDeclaration": false
    }],
    
    // NEW: Enforce consistent array sort() usage
    "@typescript-eslint/require-array-sort-compare": ["error", {
      "ignoreStringArrays": true
    }],
    
    // NEW: Require promise-like values to be handled appropriately
    "@typescript-eslint/no-misused-promises": "error",
    
    // NEW: Check for potentially unsafe object & array spreading
    "@typescript-eslint/no-unsafe-argument": "warn",
    
    // ✅ Prevent importing missing exports
    "import/named": "error",
    
    // ✅ Disallow unused imports
    "@typescript-eslint/no-unused-vars": ["error"],
    
    // ✅ Prevent fabric, lodash, etc. usage without import
    "no-undef": "error",
    
    // ✅ Ensure all enum usage is from correct import
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@/hooks/useCanvasState",
            "importNames": ["DrawingTool"],
            "message": "Use DrawingTool from @/types/core/DrawingTool instead."
          },
          {
            "name": "fabric",
            "importNames": ["fabric"],
            "message": "Use default import for fabric: import fabric from 'fabric';"
          },
          {
            "name": "@/types/floorPlanTypes",
            "importNames": ["FloorPlan"],
            "message": "Use FloorPlan from @/types/core/FloorPlan instead."
          }
        ]
      }
    ]
  }
};
