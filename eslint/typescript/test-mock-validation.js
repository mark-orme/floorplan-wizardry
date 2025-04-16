
/**
 * ESLint rules for test mock validation
 * Ensures consistent and type-safe mocking in tests
 * 
 * @module eslint/typescript/test-mock-validation
 */
export const testMockValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type!='CallExpression'][value.callee.name!='asMockCanvas']",
        "message": "Canvas props must be properly typed with asMockCanvas(mockCanvas)"
      },
      {
        "selector": "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'] > ObjectExpression:not(:has(Property[key.name='createLine']))",
        "message": "Mock of useLineState is missing the createLine property"
      },
      {
        "selector": "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'] > ObjectExpression:not(:has(Property[key.name='createDistanceTooltip']))",
        "message": "Mock of useLineState is missing the createDistanceTooltip property"
      },
      {
        "selector": "VariableDeclarator > CallExpression[callee.name='createMockCanvas'] > ArrowFunctionExpression > BlockStatement > VariableDeclaration:has(VariableDeclarator[id.name='mockCanvas'])[init.type!='TypeCastExpression']",
        "message": "Explicitly type mockCanvas with 'as IMockCanvas' or use createTypedMockCanvas()"
      },
      {
        "selector": "CallExpression[callee.name='renderHook'] > ArrowFunctionExpression > CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas']:not(:has(CallExpression[callee.name='asMockCanvas']))",
        "message": "Use asMockCanvas(mockCanvas as unknown as Canvas) to properly type canvas props"
      },
      {
        "selector": "TSAsExpression[typeAnnotation.typeName.name='Canvas'][expression.type!='Identifier'][expression.type!='CallExpression']",
        "message": "Use createTypedMockCanvas() or asMockCanvas() helper instead of direct 'as Canvas' assertions"
      },
      {
        "selector": "VariableDeclarator[id.name=/canvas|mockCanvas/][init.type!='CallExpression']",
        "message": "Use createTypedMockCanvas() to create properly typed mock canvas objects"
      }
    ]
  },
  overrides: [
    {
      // Apply these rules to test files
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // Ensure proper canvas typing in tests
        "@typescript-eslint/consistent-type-assertions": ["error", {
          "assertionStyle": "as",
          "objectLiteralTypeAssertions": "allow-as-parameter"
        }],
        
        // Enforce usage of helper type functions in tests
        "no-restricted-syntax": [
          "error",
          {
            "selector": "TSAsExpression[typeAnnotation.typeName.name='Canvas'][expression.type!='Identifier']",
            "message": "Use asMockCanvas() helper instead of direct 'as Canvas' assertions"
          },
          {
            "selector": "CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type='AsExpression']",
            "message": "Use asMockCanvas() helper instead of direct 'as Canvas' assertions"
          },
          {
            "selector": "NewExpression[callee.name='Canvas']",
            "message": "Don't use real Canvas instances in tests. Use createTypedMockCanvas() instead."
          }
        ]
      }
    }
  ]
};
