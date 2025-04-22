
/**
 * Strict TypeScript ESLint rules
 * Prevents common issues that have caused build errors
 * @module eslint/typescript-strict-rules
 */
export const strictTypeScriptRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent using any type
    "@typescript-eslint/no-explicit-any": "error",
    
    // Prevent accessing properties that might not exist
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Strict function type checking
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      allowArgumentsExplicitlyTypedAsAny: false
    }],

    // Prevent common mistakes
    "@typescript-eslint/no-misused-promises": ["error", {
      checksVoidReturn: false
    }],
    
    // Ensure proper error handling
    "@typescript-eslint/no-floating-promises": "error",
    
    // Type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      fixStyle: "separate-type-imports"
    }]
  }
};
