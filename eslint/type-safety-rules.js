
/**
 * TypeScript ESLint strict type safety rules
 * @module eslint/type-safety-rules
 */

export const typeSafetyRules = {
  plugins: ['@typescript-eslint'],
  rules: {
    // Enforce explicit property access
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    
    // Prevent accessing non-existent properties
    '@typescript-eslint/no-unsafe-argument': 'error',
    
    // Enforce consistent exports
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    
    // Require explicit types
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    
    // Prevent type widening and unnecessary type assertions
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    
    // Ensure proper property definitions
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    
    // Prevent missing properties and methods
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/class-literal-property-style': 'error',
    
    // Ensure completeness when adding object properties
    '@typescript-eslint/no-object-literal-type-assertion': 'error'
  }
};

