
/**
 * ESLint rules for Fabric.js event handling
 * @module eslint/typescript/fabric-event-rules
 */
export const fabricEventRules = {
  plugins: ["@typescript-eslint"],
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Custom rule for Fabric.js event handling
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent comparison of event types with string literals
    "no-restricted-syntax": [
      "error",
      {
        "selector": "BinaryExpression[operator='==='][left.object.name='fabricCanvas'][left.property.name='on'][right.type='Literal']",
        "message": "Don't compare fabricCanvas.on with string literals directly. The on() method returns the canvas instance, not an event type."
      },
      {
        "selector": "CallExpression[callee.object.name='fabricCanvas'][callee.property.name='on'] > Literal:first-child",
        "message": "When using fabricCanvas.on(), ensure you're passing a proper event handler as the second argument."
      },
      {
        "selector": "MemberExpression[object.name='fabricCanvas'][property.name='_eventListeners']",
        "message": "Don't access private Fabric.js properties like _eventListeners directly. Use the provided API methods."
      }
    ],
    
    // Prevent incorrect event handler extraction in tests
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.object.name='vi'][callee.object.property.name='mocked'][callee.property.name='calls'][arguments.length>0]",
        "message": "When mocking with vi.mocked(), use proper typing for the mock calls."
      }
    ],
    
    // Enforce proper event object typing
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^(Fabric)?(Canvas|Mouse|Pointer|Touch|Key)(Event|Handler)$",
          "match": true
        },
        "filter": {
          "regex": "(Event|Handler)$",
          "match": true
        }
      }
    ],
    
    // Enforce explicit type casting for event objects
    "@typescript-eslint/consistent-type-assertions": [
      "error", 
      {
        "assertionStyle": "as",
        "objectLiteralTypeAssertions": "allow-as-parameter"
      }
    ]
  }
};
