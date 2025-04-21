module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'fabric-react',
    'security',
    'import',
    'promise',
    'prettier',
    'jsx-a11y',
    'filenames'
  ],
  rules: {
    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-useless-fragment': 'warn',
    'react/no-array-index-key': 'warn',
    
    // File naming convention rules
    'filenames/match-regex': [
      'error',
      '^([A-Z][a-zA-Z0-9]*)$|^([a-z][a-zA-Z0-9]*)$|^([a-z][a-z0-9]*([-][a-z0-9]+)*)$',
      true
    ],
    'filenames/match-exported': [
      'error', 
      null, 
      '\\.tsx?$'
    ],
    
    // Import path case-sensitivity rules
    'import/no-unresolved': 'error',
    
    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true
        }
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      },
      {
        selector: 'enum',
        format: ['PascalCase']
      },
      {
        selector: 'function',
        format: ['camelCase'],
        filter: {
          regex: '^use[A-Z]',
          match: true
        }
      },
      {
        selector: 'function',
        format: ['PascalCase'],
        filter: {
          regex: '^[A-Z]',
          match: true
        }
      }
    ],
    
    // Import rules
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'warn',
    'import/no-duplicates': 'warn',
    'import/order': ['warn', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc', caseInsensitive: true }
    }],
    
    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    
    // Hook rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Custom Fabric.js rules
    'fabric-react/canvas-props-validation': 'error',
    'fabric-react/fabric-event-handlers': 'warn',
    'fabric-react/fabric-object-type-check': 'warn',
    
    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-pseudo-random-bytes': 'error',
    'security/detect-possible-timing-attacks': 'warn',
    
    // Promise handling
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    
    // Additional AI safety rules
    'no-undef': 'error',
    'no-unused-expressions': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
    'prefer-const': 'warn',
    
    // Grid constants validation rules
    './src/eslint/grid-constant-checker/ensure-valid-properties': 'error',
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      excludedFiles: ['**/hooks/**', '**/utils/**', '**/types/**', '**/context/**'],
      rules: {
        'filenames/match-regex': ['error', '^[A-Z][a-zA-Z0-9]*$', true],
        'filenames/match-exported': 'error'
      }
    },
    {
      files: ['**/hooks/**/*.ts', '**/hooks/**/*.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^use[A-Z][a-zA-Z0-9]*$', true],
        'filenames/match-exported': 'error'
      }
    }
  ]
};
