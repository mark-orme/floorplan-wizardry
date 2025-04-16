
/**
 * ESLint rules for hook mocking validation
 * Ensures proper typing and implementation of hook mocks
 * 
 * @module eslint/typescript/hook-mock-validation
 */
export const hookMockValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useLineState'] > Literal",
        "message": "useLineState must be called with an object of parameters"
      },
      {
        "selector": "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'][arguments.0.type='ObjectExpression']:not(:has(Property[key.name='distanceTooltip']))",
        "message": "Mock of useLineState is missing the distanceTooltip property"
      },
      {
        "selector": "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'][arguments.0.type='ObjectExpression']:not(:has(Property[key.name='startDrawing']))",
        "message": "Mock of useLineState is missing the startDrawing method"
      },
      {
        "selector": "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'][arguments.0.type='ObjectExpression']:not(:has(Property[key.name='completeDrawing']))",
        "message": "Mock of useLineState is missing the completeDrawing method"
      },
      {
        "selector": "CallExpression[callee.object.name='vi'][callee.property.name='mocked'][arguments.0.name='useLineState'] > CallExpression[callee.property.name='mockReturnValue'][arguments.0.type='ObjectExpression']:not(:has(Property[key.name='cancelDrawing']))",
        "message": "Mock of useLineState is missing the cancelDrawing method"
      },
      {
        "selector": "TSAsExpression[typeAnnotation.typeName.name='Canvas'][expression.callee.name!='createTypedMockCanvas']",
        "message": "Use createTypedMockCanvas() instead of casting to Canvas type directly"
      }
    ],
    
    // Enforce proper typing for mock canvas
    "@typescript-eslint/naming-convention": [
      "error", 
      {
        "selector": "variable",
        "types": ["function"],
        "format": ["camelCase"],
        "prefix": ["create", "mock", "use"]
      }
    ],
    
    // Check function parameter types
    "@typescript-eslint/explicit-function-return-type": ["error", { 
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // Ensure hooks are called with correct arguments
    "no-restricted-imports": [
      "error", 
      {
        "paths": [
          {
            "name": "../useLineState",
            "message": "When importing useLineState, ensure you pass an object with required properties"
          }
        ]
      }
    ]
  },
  overrides: [
    {
      "files": ["**/__tests__/**/*.ts", "**/__tests__/**/*.tsx", "**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        // Additional strict rules for test files
        "@typescript-eslint/no-unsafe-argument": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unsafe-member-access": "error",
        "@typescript-eslint/no-unsafe-call": "error",
        "@typescript-eslint/no-unsafe-return": "error"
      }
    }
  ]
};
