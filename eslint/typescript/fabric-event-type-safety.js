
/**
 * Fabric.js event type safety rules
 * Ensures proper type usage with Fabric.js events
 * @module eslint/typescript/fabric-event-type-safety
 */
export const fabricEventTypeSafety = {
  rules: {
    // Prevent unsafe accessor usage in Fabric.js events
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.object.name='event'][callee.object.property.name='pointer'][callee.property.name=/^(x|y)$/]",
        "message": "Accessing event.pointer.x/y directly is unsafe. Use getPointer() to ensure correct coordinate transformation."
      },
      {
        "selector": "MemberExpression[object.object.name='event'][object.property.name='pointer'][property.name=/^(x|y)$/]",
        "message": "Accessing event.pointer.x/y directly is unsafe. Use getPointer() to ensure correct coordinate transformation."
      },
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='on'][arguments.length<2]",
        "message": "canvas.on() requires at least two arguments: event name and handler."
      },
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='fire'][arguments.length<1]",
        "message": "canvas.fire() requires at least one argument: event name."
      }
    ],
    
    // Special rule for handling Fabric.js events in TypeScript
    "@typescript-eslint/no-unsafe-member-access": ["error", {
      "suggest": true,
      "exceptions": [
        "e.target.type",
        "e.target.id",
        "e.pointer"
      ]
    }]
  }
};
