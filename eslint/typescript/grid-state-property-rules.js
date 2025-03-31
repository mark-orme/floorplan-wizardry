
/**
 * TypeScript Grid State property validation ESLint rules
 * Prevents errors from using incorrect properties on GridCreationState
 * @module eslint/typescript/grid-state-property-rules
 */
export const gridStatePropertyRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent using incorrect properties on GridCreationState
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ObjectExpression > Property[key.name='visible'][parent.parent.object.name='gridState']",
        "message": "The 'visible' property does not exist on GridCreationState. Use 'exists' instead."
      },
      {
        "selector": "ObjectExpression > Property[key.name='visibility'][parent.parent.object.name='gridState']",
        "message": "The 'visibility' property does not exist on GridCreationState. Use 'exists' instead."
      },
      {
        "selector": "MemberExpression[object.name='gridState'][property.name='visible']",
        "message": "The 'visible' property does not exist on GridCreationState. Use 'exists' instead."
      },
      {
        "selector": "MemberExpression[object.name='gridState'][property.name='created']",
        "message": "The 'created' property does not exist on GridCreationState. Use 'isCreated' instead."
      }
    ]
  }
};
