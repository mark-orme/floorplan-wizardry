
/**
 * ESLint rules for Canvas event handling
 * Ensures consistent event handling across canvas-related code
 * 
 * @module eslint/canvas-event-handling-rules
 */

module.exports = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Ensure fabricCanvas.on() uses FabricEventTypes enum
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name='on'] > Literal:first-child",
        "message": "Use FabricEventTypes enum instead of string literals for event names. Example: FabricEventTypes.MOUSE_DOWN instead of 'mouse:down'"
      },
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name='off'] > Literal:first-child",
        "message": "Use FabricEventTypes enum instead of string literals for event names. Example: FabricEventTypes.MOUSE_DOWN instead of 'mouse:down'"
      },
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name='fire'] > Literal:first-child",
        "message": "Use FabricEventTypes enum instead of string literals for event names. Example: FabricEventTypes.MOUSE_DOWN instead of 'mouse:down'"
      }
    ],
    
    // Prevent accessing private Fabric.js properties
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name=/canvas|fabricCanvas/][property.name=/^_/]",
        "message": "Avoid accessing private Fabric.js properties (those starting with _). Use public methods instead."
      }
    ],
    
    // Ensure event handlers are properly cleaned up
    "react-hooks/exhaustive-deps": ["error", {
      "additionalHooks": "(useEffect|useLayoutEffect|use(.*?)Effect)"
    }],
    
    // Prevent incorrect use of event handlers
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    
    // Enforce proper typing for event handlers
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }
    ],
    
    // Enforce proper naming for event handler functions
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "function",
        "format": ["camelCase"],
        "filter": {
          "regex": "^(handle|on)[A-Z]",
          "match": true
        }
      }
    ],
    
    // Prevent use of any in event handlers
    "@typescript-eslint/no-explicit-any": ["error", {
      "ignoreRestArgs": false,
      "fixToUnknown": false
    }],
    
    // Enforce proper event handler cleanup
    "react-hooks/exhaustive-deps": ["error"],
    
    // Enforce proper nullish checking
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Prevent infinite loops in useEffect that could be caused by event handlers
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useEffect'] > ArrowFunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression[left.name=/handle|on/]",
        "message": "Don't create event handlers inside useEffect. Define them outside useEffect and add them to the dependency array."
      }
    ],
    
    // Enforce proper object destructuring for events
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name=/on|off/] > ArrowFunctionExpression[params.length=1][params.0.type!='ObjectPattern']",
        "message": "Use object destructuring for Fabric.js event parameters. Example: (e) => {...} should be ({ e, pointer }) => {...}"
      }
    ],
    
    // Enforce proper typing of Fabric.js events
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSTypeReference[typeName.name!=/Fabric.*Event|Fabric.*Handler/][typeName.name=/.*Event|.*Handler/]",
        "message": "Use proper Fabric event types from fabric-events.d.ts for event handling."
      }
    ],
    
    // Ensure clean up of event handlers in useEffect
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useEffect'] > ArrowFunctionExpression > BlockStatement:not(:has(ReturnStatement))",
        "message": "Always include a cleanup function in useEffect when adding event listeners to prevent memory leaks."
      }
    ]
  }
};
