
/**
 * TypeScript Grid State property validation ESLint rules
 * Prevents errors from using incorrect properties on GridCreationState
 * @module eslint/typescript/grid-state-property-rules
 */
module.exports = {
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
      },
      {
        // New rule: Prevent direct assignment to GridCreationState without proper type checking
        "selector": "AssignmentExpression[left.object.name=/gridState|validState|repairedState/][right.type!='Identifier'][right.type!='MemberExpression']",
        "message": "Use proper type assertions when assigning values to GridCreationState properties."
      },
      {
        // Catch cases where a property is accessed that might not exist
        "selector": "MemberExpression[object.name=/gridState|validState|repairedState/][property.type='Identifier'][parent.type!='IfStatement'][parent.parent.type!='IfStatement']",
        "message": "Always check if a property exists on GridCreationState before accessing it to avoid type errors."
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
