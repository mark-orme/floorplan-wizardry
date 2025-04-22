
/**
 * TypeScript safety rules
 * Prevents common errors with type safety
 * @module eslint/type-safety-rules
 */

export const typeSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Function argument validation
    "@typescript-eslint/no-extra-args": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Enforce correct function signatures
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true
    }],
    
    // Prevent accessing non-existent properties
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // Strict null checks
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      allowString: true,
      allowNumber: true,
      allowNullableObject: false,
      allowNullableBoolean: false
    }],
    
    // Enforce better typing
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    
    // Prevent type widening
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // Enforce consistent imports/exports
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: true
    }],
    "@typescript-eslint/consistent-type-exports": ["error", {
      fixMixedExportsWithInlineTypeSpecifier: true
    }]
  }
};
