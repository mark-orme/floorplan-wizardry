
/**
 * Advanced TypeScript ESLint rules
 * Provides stricter type safety checks to prevent build errors
 * @module eslint/type-safety-advanced-rules
 */

export const typeAdvancedSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent type errors from function calls with incorrect arguments
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Ensure properties used in objects exist on their types
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent missing properties in object literals
    "@typescript-eslint/consistent-type-assertions": "error",
    
    // Prevent using 'any' type as requested by the user
    "@typescript-eslint/no-explicit-any": "error",
    
    // Prevent using object properties without checking if they exist
    "@typescript-eslint/no-unnecessary-condition": "warn",
    
    // Ensure correct return types
    "@typescript-eslint/explicit-function-return-type": [
      "error", 
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ],
    
    // Ensure strict mode with noImplicitAny enforcement
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        allowString: true,
        allowNumber: true,
        allowNullableObject: true,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false
      }
    ],
    
    // Enforce strong type checking with unions 
    "@typescript-eslint/restrict-plus-operands": "error",
    
    // Prefer nullish coalescing for null safety
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    
    // Always use optional chaining for potential null/undefined
    "@typescript-eslint/prefer-optional-chain": "error",
    
    // Prevent incorrect type assertions
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    
    // Ban specific type usages (any, Object, Function)
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Object: {
            message: "Use 'object' or '{}' instead",
            fixWith: "object"
          },
          Function: {
            message: "Use specific function type instead, like '() => void'",
          },
          any: {
            message: "Use unknown instead",
            fixWith: "unknown"
          }
        }
      }
    ],
    
    // Prevent assignment to const variables
    "prefer-const": "error",
    
    // Avoid duplicate imports
    "no-duplicate-imports": "error",
    
    // Ensure consistent return types
    "consistent-return": "error",
    
    // New stricter rules
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used",
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-for-in-array": "error"
  }
};
