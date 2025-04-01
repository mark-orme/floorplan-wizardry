
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',  // Enable rules that require type information
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Add stricter type checking
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    // Base ESLint rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // TypeScript specific rules
    '@typescript-eslint/explicit-module-boundary-types': 'error', // Require explicit return types
    '@typescript-eslint/no-explicit-any': 'error', // Disallow any type
    '@typescript-eslint/no-non-null-assertion': 'error', // Disallow non-null assertions
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Require all variables to be used
    
    // Strict type checking rules to prevent similar issues
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/unbound-method': 'error',
    
    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error', // Update to error to catch all missing dependencies
    
    // Custom rules to prevent type confusion
    'no-unsafe-type-cast': 'off', // Custom rule that would need to be implemented
    
    // Additional rules for consistent code
    'consistent-return': 'error', // Ensure function returns are consistent
    'no-duplicate-imports': 'error', // Prevent duplicate imports
    'prefer-const': 'error', // Use const when variable isn't reassigned
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'node_modules', 'public', '*.js', '*.d.ts'],
};
