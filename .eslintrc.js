
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'fabric-react'  // Add our custom plugin
  ],
  rules: {
    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    
    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // Hook rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Custom Fabric.js rules
    'fabric-react/canvas-props-validation': 'error',
    'fabric-react/fabric-event-handlers': 'warn',
    'fabric-react/fabric-object-type-check': 'warn',
    
    // Grid constants validation rules
    './src/eslint/grid-constant-checker/ensure-valid-properties': 'error',
    
    // Additional AI safety rules
    'no-undef': 'error',
    'no-unused-expressions': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
    'prefer-const': 'warn',
    
    // Enhanced TypeScript strictness
    '@typescript-eslint/strict-boolean-expressions': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-ignore': 'allow-with-description',
      minimumDescriptionLength: 10
    }],
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      }
    ]
  }
};
