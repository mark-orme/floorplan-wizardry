
/**
 * ESLint configuration specifically for AI development
 * This configuration helps prevent common issues when generating code
 */
module.exports = {
  extends: [
    './eslintrc.json',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import'
  ],
  rules: {
    // Strict type safety
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    
    // Prevent importing non-existent modules
    'import/no-unresolved': 'error',
    
    // Ensure all imports are used
    'import/no-unused-modules': 'error',
    
    // Ensure components follow naming conventions
    'react/display-name': 'error',
    
    // Ensure proper hook usage
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Custom rules for Fabric.js
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'fabric',
            importNames: ['FabricEventNames', 'FabricEventTypes'],
            message: "Import FabricEventNames and FabricEventTypes from '@/types/fabric-types' instead."
          }
        ]
      }
    ],
    
    // Custom rule to ensure we use the correct event names
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[object.name='FabricEventNames']",
        message: "Use FabricEventNames from '@/types/fabric-types' to ensure type safety."
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {} // this loads tsconfig.json to eslint
    }
  }
};
