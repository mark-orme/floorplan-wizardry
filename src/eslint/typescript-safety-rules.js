
/**
 * Custom TypeScript safety ESLint rules
 * Helps prevent common TypeScript errors
 * @module eslint/typescript-safety-rules
 */

module.exports = {
  rules: {
    // Prevent usage of any
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Ensure proper typing of params and return values
    "@typescript-eslint/explicit-function-return-type": ["warn", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // Ensure consistent type definitions
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Prevent invalid type declarations
    "@typescript-eslint/no-invalid-void-type": "error",
    
    // Ensure proper async return types
    "@typescript-eslint/promise-function-async": "warn",
    
    // Prevent unsafe index access
    "@typescript-eslint/no-unsafe-member-access": "warn",
    
    // Prevent unnecessary type assertions
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    
    // Ensure proper property access
    "@typescript-eslint/restrict-template-expressions": ["error", {
      "allowNumber": true,
      "allowBoolean": true,
      "allowNullish": false
    }],
    
    // Ensure consistent type assertions
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow"
    }],
    
    // Enforce explicit accessibility modifiers
    "@typescript-eslint/explicit-member-accessibility": ["warn", {
      "accessibility": "explicit",
      "overrides": {
        "constructors": "no-public"
      }
    }],
    
    // Prevent type errors in dynamic property access
    "@typescript-eslint/dot-notation": ["error", {
      "allowIndexSignaturePropertyAccess": false
    }],
    
    // Ensure proper handling of optional properties
    "@typescript-eslint/no-unnecessary-condition": ["warn", {
      "allowConstantLoopConditions": true
    }]
  }
};
