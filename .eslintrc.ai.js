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
    
    // Security: Limit console logs in production to prevent leaking sensitive information
    "no-console": ["error", { allow: ["warn", "error"] }],
    
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
      },
      {
        // Mock canvas check
        selector: "CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type!='CallExpression'][value.callee.name!='asMockCanvas']",
        message: "Canvas props in useStraightLineTool must use asMockCanvas(mockCanvas) to ensure proper typing"
      },
      {
        // Ensure complete mock hook objects
        selector: "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name=/^use/] > CallExpression[callee.property.name='mockReturnValue'] > ObjectExpression[properties.length<10]",
        message: "Hook mocks require all properties to be included. Check for missing properties."
      }
    ],
    
    // Enforce proper typing for tests
    '@typescript-eslint/consistent-type-assertions': ['error', {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'allow-as-parameter'
    }],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    
    // Prevent arrow functions
    "func-style": ["error", "declaration", { 
      "allowArrowFunctions": false 
    }],
    "@typescript-eslint/prefer-function-type": "error",
    "prefer-arrow-callback": "off"
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {} // this loads tsconfig.json to eslint
    }
  },
  overrides: [
    {
      // Test files specific rules
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // Test specific mock rules
        'no-restricted-syntax': [
          'error',
          {
            selector: "TSAsExpression[typeAnnotation.typeName.name='Canvas'][expression.type!='Identifier']",
            message: "Use asMockCanvas() helper instead of direct 'as Canvas' assertions"
          },
          {
            selector: "CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type='AsExpression']",
            message: "Use asMockCanvas() helper instead of direct 'as Canvas' assertions"
          },
          {
            selector: "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'] > ObjectExpression:not(:has(Property[key.name='createLine']))",
            message: "Mock of useLineState is missing the createLine property"
          },
          {
            selector: "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'] > ObjectExpression:not(:has(Property[key.name='createDistanceTooltip']))",
            message: "Mock of useLineState is missing the createDistanceTooltip property"
          }
        ]
      }
    }
  ]
};
