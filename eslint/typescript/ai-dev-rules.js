/**
 * AI development ESLint rules
 * Enforces stricter checks for AI-assisted development
 * @module eslint/typescript/ai-dev-rules
 */
export const aiDevRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Enforce comprehensive type checking
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // Enforce explicit typing
    "@typescript-eslint/explicit-function-return-type": [
      "error", 
      { 
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ],
    
    // Prevent usage of any
    "@typescript-eslint/no-explicit-any": "error",
    
    // Ensure proper null checking
    "@typescript-eslint/no-unnecessary-condition": [
      "error", 
      { allowRuntimeChecks: true }
    ],
    
    // Enforce strict boolean expressions
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        allowString: true,
        allowNumber: true,
        allowNullableObject: true,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false,
        allowAny: false
      }
    ],
    
    // Prevent common AI-generated issues
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Object: { message: "Use 'object' or '{}' instead", fixWith: "object" },
          Function: { message: "Use specific function type instead, like '() => void'" },
          any: { message: "Use unknown instead", fixWith: "unknown" }
        }
      }
    ],
    
    // Additional strict rules for AI-generated code
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    
    // Canvas-specific rules
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='getContext']",
        "message": "Don't use canvas.getContext() directly. Use Fabric.js canvas methods instead."
      },
      {
        "selector": "MemberExpression[object.name='fabric'][property.name='Canvas']",
        "message": "Import Canvas directly from fabric instead of using the fabric namespace."
      }
    ],
    
    // Prevent arrow functions in favor of standard function declarations
    "prefer-arrow-callback": "off",
    "@typescript-eslint/prefer-function-type": "error",
    "func-style": ["error", "declaration", { 
      "allowArrowFunctions": false 
    }],
    
    // Additional rules to discourage arrow functions
    "no-confusing-arrow": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"]
  }
};
