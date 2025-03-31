
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
    ],
    
    // New rule: Check for any type operations with GridCreationState
    "@typescript-eslint/no-explicit-any": ["error", { 
      "ignoreRestArgs": true 
    }],
    
    // Prevent direct property assignments without type checking
    "@typescript-eslint/no-unsafe-assignment": "warn",
    
    // Ensure explicit type casts for mapped types
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Prevent state mutations with incorrect types
    "@typescript-eslint/ban-types": ["error", {
      "types": {
        "{}": {
          "message": "Use Record<string, unknown> or a more specific type instead",
          "fixWith": "Record<string, unknown>"
        }
      }
    }],
    
    // Prevent potential type errors in object property assignments
    "@typescript-eslint/no-unsafe-member-access": "warn"
  }
};
