
/**
 * TypeScript type assertion ESLint rules
 * Enforces safe and consistent type assertions
 * @module eslint/typescript/assertion-rules
 */
export const assertionRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent unnecessary type assertions
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "never"
    }],
    
    // Ensure function parameter types are specified
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowHigherOrderFunctions": true,
      "allowTypedFunctionExpressions": true
    }]
  }
};
