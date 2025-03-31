
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console for now
    
    // Enforce using FabricEventTypes for fabric.js events
    'no-restricted-syntax': [
      'error',
      {
        'selector': "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name=/on|off|fire/] > Literal:first-child",
        'message': "Use FabricEventTypes enum instead of string literals for event names."
      }
    ],
    
    // Enforce proper cleanup in useEffect hooks
    'react-hooks/exhaustive-deps': 'error',
    
    // Prevent direct DOM manipulation in React components
    'no-restricted-syntax': [
      'error', 
      {
        'selector': "CallExpression[callee.object.property.name='current'][callee.property.name=/querySelector|getElementById/]",
        'message': "Don't directly manipulate DOM in React components."
      }
    ],
    
    // Enforce proper nullish checks
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
  overrides: [
    {
      files: ['**/grid/**/*.{ts,tsx,js,jsx}'],
      rules: require('./src/eslint/grid-constant-validation').rules,
    },
    {
      files: ['**/canvas/**/*.{ts,tsx}', '**/hooks/**/*.{ts,tsx}'],
      rules: require('./src/eslint/canvas-event-handling-rules').rules,
    },
    {
      // Apply stricter TypeScript rules to specific files
      files: ['**/*.{ts,tsx}'],
      rules: require('./src/eslint/typescript-strict-rules').rules,
    },
  ],
};
