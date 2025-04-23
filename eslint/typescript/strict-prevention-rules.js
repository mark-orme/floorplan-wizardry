
/**
 * Strict TypeScript prevention rules
 * Prevents JS in TS files and enforces better TypeScript practices
 */
export const strictPreventionRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent JavaScript in TypeScript files
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/no-require-imports": "error",
    
    // Enforce explicit types
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    
    // Prevent common JavaScript patterns in TypeScript
    "no-var": "error",
    "prefer-const": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-enum-initializers": "error"
  }
};
