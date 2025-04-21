
/**
 * ESLint rules to ensure proper test mock validation
 * Helps prevent common test mock type errors
 * 
 * @module eslint/typescript/test-mock-validation-rules
 */
export const testMockValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Ensure mocks have correct typing
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='vi.fn'][parent.property.name='withImplementation']",
        "message": "withImplementation must return Promise<void>"
      },
      {
        "selector": "CallExpression[callee.name='createTestMockCanvas']",
        "message": "Use asMockCanvas() to ensure proper type compatibility"
      },
      {
        "selector": "TSAsExpression[typeAnnotation.typeName.name='Canvas'][expression.type!='Identifier']",
        "message": "Use asMockCanvas() helper instead of direct 'as Canvas' assertions"
      },
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type!='CallExpression'][value.callee.name!='asMockCanvas']",
        "message": "Canvas props in useStraightLineTool must use asMockCanvas(mockCanvas) to ensure proper typing"
      }
    ],
    
    // Ensure mocks have the required properties
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Ensure withImplementation returns Promise<void>
    "check-withImplementation-return-type": {
      "create": function(context) {
        return {
          "AssignmentExpression[left.property.name='withImplementation']"(node) {
            if (node.right.type === "CallExpression" &&
                node.right.callee.object &&
                node.right.callee.object.name === "vi" &&
                node.right.callee.property.name === "fn") {
              const mockImpl = node.right.arguments.find(arg => 
                arg.type === "CallExpression" && 
                arg.callee.property && 
                arg.callee.property.name === "mockImplementation"
              );
              
              if (mockImpl) {
                const arrowFunc = mockImpl.arguments[0];
                if (arrowFunc && arrowFunc.body && arrowFunc.body.type !== "BlockStatement") {
                  context.report({
                    node,
                    message: "withImplementation mock must use a block body that returns Promise<void>"
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};
