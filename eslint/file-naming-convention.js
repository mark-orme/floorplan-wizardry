
/**
 * ESLint rules for enforcing file naming conventions
 * @module eslint/file-naming-convention
 */

export const fileNamingConventionRules = {
  plugins: ['filenames'],
  rules: {
    // Enforce component files to use PascalCase
    'filenames/match-regex': [
      'error',
      // Allow PascalCase for component files
      // Allow camelCase for utility/hook files
      // Allow kebab-case for config files
      '^([A-Z][a-zA-Z0-9]*)$|^([a-z][a-zA-Z0-9]*)$|^([a-z][a-z0-9]*([-][a-z0-9]+)*)$',
      true
    ],
    
    // Ensure exported values match filename
    'filenames/match-exported': [
      'error',
      'pascalcase',
      '\\.tsx?$' // Only enforce for TypeScript files
    ],
    
    // Custom rule for React component files
    'custom-filename-rules/component-filename-extension': 'error',
    'custom-filename-rules/component-filename-case': 'error',
    
    // React component files should use PascalCase
    'react/jsx-filename-extension': [
      'error',
      {
        'extensions': ['.tsx']
      }
    ],
    
    // Enforce jsx extension for files containing JSX
    'react/jsx-filename-extension-consistency': 'error',
    
    // Prevent importing with wrong case on case-sensitive file systems
    'import/no-unresolved': 'error',
    
    // Prevent imports from non-existing files
    'import/no-useless-path-segments': 'error',
    
    // Specific rules for hook naming
    'react-hooks/hook-naming-convention': [
      'error',
      {
        'filePattern': '^use[A-Z].*\\.tsx?$',
        'exportPattern': '^use[A-Z]'
      }
    ],
    
    // Forbid certain file names to avoid confusion
    'filenames/no-index': 'off', // Allow index files for barrel exports
    
    // Prevent duplicate file names in different cases
    'no-restricted-imports': [
      'error',
      {
        'patterns': [
          {
            'group': ['**/[a-z]*.tsx'],
            'message': 'Import components from PascalCase filenames'
          },
          {
            'group': ['./app', './App'],
            'caseSensitive': false,
            'message': 'Always use PascalCase for App component imports'
          }
        ]
      }
    ]
  },
  overrides: [
    {
      // Rules for component files
      files: ['**/*.tsx'],
      excludedFiles: ['**/hooks/**', '**/utils/**', '**/types/**', '**/context/**'],
      rules: {
        'filenames/match-regex': ['error', '^[A-Z][a-zA-Z0-9]*$', true],
        'filenames/match-exported': 'error'
      }
    },
    {
      // Rules for hook files
      files: ['**/hooks/**/*.ts', '**/hooks/**/*.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^use[A-Z][a-zA-Z0-9]*$', true],
        'filenames/match-exported': 'error'
      }
    }
  ]
};
