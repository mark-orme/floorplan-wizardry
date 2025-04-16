
/**
 * Import safety ESLint rules
 * Prevents incorrect module imports and non-existent file references
 * @module eslint/import-safety-rules
 */
export const importSafetyRules = {
  plugins: ['import'],
  rules: {
    // Ensure imports point to files/modules that exist
    'import/no-unresolved': 'error',
    
    // Ensure a default export is present, given a default import
    'import/default': 'error',
    
    // Ensure named imports correspond to named exports
    'import/named': 'error',
    
    // Prevent importing the submodules of other modules
    'import/no-internal-modules': 'off',
    
    // Prevent importing packages without specifying a version in package.json
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/tests/**',
        '**/test/**'
      ]
    }],
    
    // Ensure all imports are used
    'import/no-unused-modules': ['warn', {
      unusedExports: true,
      missingExports: true,
      ignoreExports: [
        '**/index.{js,ts,jsx,tsx}',
        '**/*.d.ts',
        '**/eslint/**',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/__tests__/**'
      ]
    }],
    
    // Enforce a consistent import order
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type'
      ],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    
    // Prevent circular dependencies
    'import/no-cycle': ['error', { maxDepth: 10 }],
    
    // Prevent self-imports
    'import/no-self-import': 'error',
    
    // Prevent useless path segments
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }]
  }
};
