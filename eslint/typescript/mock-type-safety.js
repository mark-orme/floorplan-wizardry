
/**
 * ESLint rules to ensure mock objects match their original type interfaces
 * @module eslint/typescript/mock-type-safety
 */
export const mockTypeSafetyRules = {
  plugins: ['@typescript-eslint'],
  rules: {
    // Prevent excess properties in object literals
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Specifically for mocks
    '@typescript-eslint/consistent-type-assertions': ['error', {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'allow-as-parameter'
    }],
    
    // Ensure mock objects have the right properties
    '@typescript-eslint/no-object-literal-type-assertion': 'off', // Allow as any type assertions in tests
    
    // Custom rule for vi.mock implementations
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow flexible return types in mocks
    
    // Enforce proper handling in test files that use mocks
    'no-unused-vars': 'off', // Disable the base no-unused-vars rule
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }]
  },
  overrides: [
    {
      // Apply these rules to test files
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // Allow more flexible typing in test files
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off'
      }
    }
  ]
};
