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
  rules: {
    // Strict TypeScript validation
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unused-vars": ["warn"],
    
    // Enforce consistent type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: true
    }],
    
    // Object literal type improvements
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Better error messages
    "@typescript-eslint/unified-signatures": "error",
    
    // Function overloads
    "@typescript-eslint/adjacent-overload-signatures": "error",
    
    // Prevent common mistakes
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/prefer-optional-chain": "warn",

    // Prevent TODO comments in TypeScript files
    "@typescript-eslint/ban-ts-comment": ["error", {
      "ts-ignore": "allow-with-description",
      "ts-expect-error": "allow-with-description",
      "ts-nocheck": true,
      "ts-check": false,
      "minimumDescriptionLength": 10
    }]
  }
};
