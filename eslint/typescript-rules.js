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
      },
      // NEW: Enforce consistent component prop naming
      {
        "selector": "parameter",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      // NEW: Enforce consistent hook naming
      {
        "selector": "function",
        "filter": {
          "regex": "^use[A-Z]",
          "match": true
        },
        "format": ["camelCase"],
        "prefix": ["use"]
      },
      // NEW: Enforce consistent event handler naming
      {
        "selector": "function",
        "filter": {
          "regex": "^(handle|on)[A-Z]",
          "match": true
        },
        "format": ["camelCase"]
      },
      // NEW: Enforce consistent context naming
      {
        "selector": "variable",
        "filter": {
          "regex": "Context$",
          "match": true
        },
        "format": ["PascalCase"],
        "suffix": ["Context"]
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
    ],
    
    // NEW: Accessibility rules
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    
    // NEW: Consistent return handling
    "@typescript-eslint/no-confusing-void-expression": ["error", {
      "ignoreArrowShorthand": true,
      "ignoreVoidOperator": true
    }],
    
    // NEW: Prevent accidental Promise rejections
    "@typescript-eslint/no-floating-promises": "error",
    
    // NEW: Prevent accidental Promise returns
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
    
    // NEW: Force usage of Record<> type for objects
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    
    // NEW: Enforce consistent handling of object literal property shorthand
    "@typescript-eslint/object-shorthand": ["error", "properties"],
    
    // NEW: Prevent unnecessary template literals
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    
    // NEW: Enforce readable type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": true,
      "fixStyle": "separate-type-imports"
    }],
    
    // NEW: Force consistent naming for private class members
    "@typescript-eslint/member-naming": ["error", {
      "private": "^_[a-z][a-zA-Z0-9]*$"
    }],
    
    // NEW: Enforce explicit accessibility modifiers
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
      "overrides": {
        "constructors": "no-public"
      }
    }],
    
    // NEW: Enforce consistent generic type parameter usage
    "@typescript-eslint/consistent-generic-constructors": ["error", "type-annotation"],
    
    // NEW: Enforce consistent function overloading
    "@typescript-eslint/adjacent-overload-signatures": "error",
    
    // NEW: Prevent common type errors
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/unbound-method": ["error", { "ignoreStatic": true }],
    
    // NEW: Enforce explicit accessibility
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
      "overrides": {
        "accessors": "explicit",
        "constructors": "no-public",
        "methods": "explicit",
        "properties": "explicit",
        "parameterProperties": "explicit"
      }
    }],
    
    // NEW: Enforce consistent method signature style
    "@typescript-eslint/method-signature-style": ["error", "property"],
    
    // NEW: Prefer interfaces over type aliases for object definitions
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // NEW: Enforce consistent type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": true,
      "fixStyle": "separate-type-imports"
    }],
    
    // NEW: Enforce explicit accessibility modifiers
    "@typescript-eslint/class-literal-property-style": ["error", "fields"],
    
    // NEW: Stronger array type checking
    "@typescript-eslint/array-type": ["error", {
      "default": "array",
      "readonly": "array"
    }],
    
    // NEW: Better promise handling
    "@typescript-eslint/promise-function-async": "error",
    
    // NEW: Naming conventions for private class members
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
      },
      // NEW: Enforce consistent component prop naming
      {
        "selector": "parameter",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      // NEW: Enforce consistent hook naming
      {
        "selector": "function",
        "filter": {
          "regex": "^use[A-Z]",
          "match": true
        },
        "format": ["camelCase"],
        "prefix": ["use"]
      },
      // NEW: Enforce consistent event handler naming
      {
        "selector": "function",
        "filter": {
          "regex": "^(handle|on)[A-Z]",
          "match": true
        },
        "format": ["camelCase"]
      },
      // NEW: Enforce consistent context naming
      {
        "selector": "variable",
        "filter": {
          "regex": "Context$",
          "match": true
        },
        "format": ["PascalCase"],
        "suffix": ["Context"]
      },
      
      // NEW: Enforce prefixes for interfaces
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]
      },
      
      // NEW: Enforce prefixes for private members
      {
        "selector": "memberLike",
        "modifiers": ["private"],
        "format": ["camelCase"],
        "leadingUnderscore": "require"
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
    ],
    
    // NEW: Accessibility rules
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    
    // NEW: Consistent return handling
    "@typescript-eslint/no-confusing-void-expression": ["error", {
      "ignoreArrowShorthand": true,
      "ignoreVoidOperator": true
    }],
    
    // NEW: Prevent accidental Promise rejections
    "@typescript-eslint/no-floating-promises": "error",
    
    // NEW: Prevent accidental Promise returns
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
    
    // NEW: Force usage of Record<> type for objects
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    
    // NEW: Enforce consistent handling of object literal property shorthand
    "@typescript-eslint/object-shorthand": ["error", "properties"],
    
    // NEW: Prevent unnecessary template literals
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    
    // NEW: Enforce readable type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": true,
      "fixStyle": "separate-type-imports"
    }],
    
    // NEW: Force consistent naming for private class members
    "@typescript-eslint/member-naming": ["error", {
      "private": "^_[a-z][a-zA-Z0-9]*$"
    }],
    
    // NEW: Require explicit accessibility modifiers
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
      "overrides": {
        "constructors": "no-public"
      }
    }]
  }
};
