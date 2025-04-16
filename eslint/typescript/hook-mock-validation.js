
/**
 * ESLint rules for hook mocking validation
 * Ensures proper mocking of React hooks in tests
 * 
 * @module eslint/typescript/hook-mock-validation
 */
export const hookMockValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name=/^vi$/][callee.property.name='mock'][arguments.length=1][arguments.0.value=/useLineState|useStraightLineTool/]",
        "message": "Don't mock custom hooks directly, use vi.mock() with the full path to the hook file"
      },
      {
        "selector": "CallExpression[callee.object.name=/^vi$/][callee.property.name='mock'][arguments.length=1][arguments.0.value=/LineState|StraightLineTool/] > ArrowFunctionExpression[params.length=0]",
        "message": "When mocking hook files, return an object with all required methods and properties"
      },
      {
        "selector": "CallExpression[callee.object.name=/^vi$/][callee.property.name='mockReturnValue'][arguments.length=1] > ObjectExpression:not(:matches(:has(Property[key.name='setInputMethod']), :has(Property[key.name='setIsPencilMode'])))",
        "message": "Hook mock is missing required properties: setInputMethod and setIsPencilMode"
      }
    ],
    
    // Validate that mock objects have required properties
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Ensure proper typing for mocks
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    
    // Enforce correct mock property access
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent incomplete mocks
    "@typescript-eslint/ban-types": ["error", {
      "types": {
        "{}": {
          "message": "Use a more specific type for mocks",
          "fixWith": "Record<string, unknown>"
        }
      }
    }]
  }
};
