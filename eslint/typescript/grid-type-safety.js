
/**
 * Grid type safety rules
 * Prevents type errors when working with grid state objects
 * @module eslint/typescript/grid-type-safety
 */
export const gridTypeSafetyRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent using 'any' type with grid state objects
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSTypeReference[typeName.name='any'][parent.parent.expression.object.name=/gridState|GridCreationState/]",
        "message": "Don't use 'any' type with grid state objects. Use specific types from GridCreationState."
      },
      {
        "selector": "TSTypeAssertion > AsExpression[expression.object.name=/gridState|grid/][typeAnnotation.typeName.name='any']",
        "message": "Don't cast grid state properties to 'any'. Use GridCreationState property types."
      }
    ],
    
    // Enforce proper type assertions for grid state
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Prevent using {} for grid state objects
    "@typescript-eslint/ban-types": ["error", {
      "types": {
        "{}": {
          "message": "Use Partial<GridCreationState> instead of {} for grid state objects",
          "fixWith": "Partial<GridCreationState>"
        }
      }
    }]
  }
};
