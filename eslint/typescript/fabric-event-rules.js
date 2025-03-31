
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
        "message": "Use FabricEventTypes enum instead of string literals for event names."
      },
      {
        "selector": "MemberExpression[object.name='fabricCanvas'][property.name='_eventListeners']",
        "message": "Don't access private Fabric.js properties like _eventListeners directly. Use the provided API methods."
      },
      {
        "selector": "CallExpression[callee.name='find'][callee.object.property.name='calls'] > BinaryExpression[operator='==='][left.property.name='0'][right.type='Literal']",
        "message": "When extracting event handlers from mocks, use extractFabricEventHandler utility instead of direct array access."
      }
    ],
    
    // Enhanced rules for testing Fabric.js event handlers
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.property.name='mock'][callee.property.name='calls'][arguments.length>0]",
        "message": "Use extractFabricEventHandler utility instead of directly accessing mock.calls for event handlers."
      },
      {
        "selector": "MemberExpression[object.object.name='canvas'][property.name='_eventHandlers']",
        "message": "Don't access private _eventHandlers directly. Use proper testing utilities."
      }
    ],
    
    // Rule to prevent string literals for event names
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name=/on|off|fire/] > Literal:first-child",
        "message": "Use FabricEventTypes enum instead of string literals for event names."
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
    
    // Enforce proper testing of event handlers
    "@typescript-eslint/consistent-type-assertions": [
      "error", 
      {
        "assertionStyle": "as",
        "objectLiteralTypeAssertions": "allow-as-parameter"
      }
    ],

    // New rule to prevent direct mock function call access without proper extraction
    "no-restricted-syntax": [
      "error", 
      {
        "selector": "MemberExpression[object.object.name='vi'][object.property.name='mocked'][property.name='mock']",
        "message": "Don't access vi.mocked().mock directly. Use proper test helper functions."
      },
      {
        "selector": "MemberExpression[object.object.name='vi'][object.property.name='fn'][property.name='mock']",
        "message": "Don't access vi.fn().mock directly. Use proper test helper functions."
      }
    ],
    
    // New rules specific to Fabric event types
    "no-restricted-syntax": [
      "error",
      {
        "selector": "StringLiteral[value=/mouse:down|mouse:move|mouse:up|object:selected|selection:created/]",
        "message": "Use FabricEventTypes enum instead of string literals for Fabric.js event names."
      },
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name=/on|off|fire/][arguments.0.type='StringLiteral']",
        "message": "Use FabricEventTypes enum instead of string literals for event names."
      }
    ],

    // Rule to enforce proper event handler extraction in tests
    "custom/use-handler-extraction": {
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.type === 'MemberExpression' && 
                node.callee.property.name === 'find' &&
                node.arguments.length > 0) {
              // This is attempting to find something
              const testCode = context.getSourceCode().getText(node);
              if (testCode.includes('call[0] ===') || testCode.includes(".calls.find")) {
                context.report({
                  node,
                  message: "Use extractFabricEventHandler utility instead of direct mock.calls access"
                });
              }
            }
          }
        };
      }
    }
  }
};
