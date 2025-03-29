
/**
 * TypeScript specific ESLint rules
 * Enforces strict type checking and code quality for TypeScript files
 * @module eslint/typescript-rules
 */
export const typescriptRules = {
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
    "@typescript-eslint/no-explicit-any": ["warn", { 
      ignoreRestArgs: true,
      allowExplicitAny: false
    }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { 
      ignoreRestSiblings: true,
      argsIgnorePattern: "^_" 
    }],
    
    // Enforce consistent type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: true
    }],
    
    // Property access safety
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // NEW: Promise handling
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    
    // NEW: Type assertion checks
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // NEW: Null checking
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    
    // NEW: Object literal type improvements
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // NEW: Better error messages
    "@typescript-eslint/unified-signatures": "error",
    
    // NEW: Function overloads
    "@typescript-eslint/adjacent-overload-signatures": "error",
    
    // NEW: Prevent common mistakes
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/prefer-optional-chain": "warn",
    
    // NEW: Extra safety for grid and canvas operations
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      allowString: true,
      allowNumber: true,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false
    }]
  }
};
