
/**
 * Base TypeScript ESLint rules
 * Core rules that apply to all TypeScript files
 * @module eslint/typescript/base-rules
 */
export const baseTypeScriptRules = {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  plugins: ["@typescript-eslint"],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict'
  ],
  rules: {
    // Prevent wrong number of arguments
    "@typescript-eslint/no-extra-args": "error",
    
    // Strict TypeScript validation
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Function signatures and return types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    
    // Type imports and exports
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      fixStyle: "separate-type-imports"
    }],
    "@typescript-eslint/consistent-type-exports": ["error", {
      fixMixedExportsWithInlineTypeSpecifier: true
    }],
    
    // Strict null checks
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Ban problematic patterns
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/ban-types": "error",
    
    // Enforce better typing
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-unnecessary-condition": "error"
  }
};
