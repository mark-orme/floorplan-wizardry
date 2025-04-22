
/**
 * Base TypeScript ESLint rules
 * Core rules that apply to all TypeScript files
 * @module eslint/typescript/base-rules
 */
export const baseTypeScriptRules = {
  files: ["**/*.{ts,tsx}"],
  plugins: ["@typescript-eslint"],
  rules: {
    // Type safety
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",

    // Prevent incorrect function calls
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      allowString: false,
      allowNumber: false,
      allowNullableObject: false,
      allowNullableBoolean: false
    }],

    // Ensure proper typing
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true
    }],

    // Prevent type errors
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error"
  }
};
