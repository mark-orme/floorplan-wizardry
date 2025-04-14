
/**
 * TypeScript safety rules for Fabric.js events
 * Ensures proper typing and safety for fabric.js events
 * @module eslint/typescript/fabric-event-typing-rules
 */

module.exports = {
  rules: {
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-explicit-any": "error",

    // Custom rules for Fabric.js event handling
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='e'][property.name='pointer']",
        "message": "Don't access e.pointer directly. Access the correct property based on Fabric.js version and add type guards."
      },
      {
        "selector": "MemberExpression[object.name='e'][property.name='absolutePointer']",
        "message": "Don't access e.absolutePointer directly. Add proper type guards before accessing."
      },
      {
        "selector": "TSTypeReference[typeName.name='IEvent']",
        "message": "Use TEvent instead of IEvent for Fabric.js events in v6+"
      },
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='on'] > :first-child[value=/mouse:/]",
        "message": "Always add proper type guards when handling canvas mouse events."
      },
      {
        "selector": "ArrowFunctionExpression[params.0.typeAnnotation.typeAnnotation.typeName.name=/Event/] > BlockStatement:not(:has(IfStatement[test.type='UnaryExpression'][test.operator='!'][test.argument.type='Identifier']))",
        "message": "Always check event objects before use with a guard like 'if (!e) return;'"
      }
    ],

    // Enforce consistent event naming and typing
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "parameter",
        "format": ["camelCase"],
        "filter": {
          "regex": "^e$",
          "match": true
        }
      },
      {
        "selector": "typeParameter",
        "format": ["PascalCase"],
        "prefix": ["T"]
      }
    ],

    // Prevent type-unsafe operations on pointer events
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],

    // Ensure proper event type handling
    "@typescript-eslint/ban-types": ["error", {
      "types": {
        "IEvent": {
          "message": "Use TEvent for Fabric.js v6+ events",
          "fixWith": "TEvent"
        }
      }
    }]
  }
};
