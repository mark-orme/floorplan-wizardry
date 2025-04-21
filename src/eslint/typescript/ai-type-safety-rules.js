
/**
 * Enhanced ESLint rules to enforce safety in AI-generated TypeScript code
 * Prevents common type-related issues that occur in AI-generated code
 * 
 * @module eslint/typescript/ai-type-safety-rules
 */
export const aiTypeSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent type confusion in AI-generated code
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Ensure proper type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports"
    }],
    
    // Prevent missing required properties in objects
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ObjectExpression[properties.length>2]:not(:has(Property[key.name='id']))",
        "message": "Objects representing domain entities should include an 'id' property"
      },
      {
        "selector": "ObjectExpression:has(Property[key.name='type'][value.raw=/floor|room|wall|stroke/i]):not(:has(Property[key.name='id']))",
        "message": "Domain objects must have an 'id' property"
      },
      {
        "selector": "ObjectExpression:has(Property[key.name='type'][value.raw='wall']):not(:has(Property[key.name='start']))",
        "message": "Wall objects must have 'start', 'end', and 'thickness' properties"
      },
      {
        "selector": "ObjectExpression:has(Property[key.name='type'][value.raw='room']):not(:has(Property[key.name='vertices']))",
        "message": "Room objects must have 'vertices', 'area', and 'perimeter' properties"
      },
      {
        "selector": "CallExpression[callee.name=/validate(FloorPlan|Wall|Room|Stroke)/][arguments.length=0]",
        "message": "Validation functions require an argument"
      }
    ],
    
    // Enforce proper adapter usage
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "function",
        "format": ["camelCase"],
        "filter": {
          "regex": "^adapt[A-Z]",
          "match": true
        }
      }
    ],
    
    // Ensure proper typing in adapter functions
    "consistent-return": "error",
    
    // Enforce explicit typing
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // Ensure type safety in test fixtures
    "vitest/consistent-test-it": ["error", {"fn": "it"}],
    
    // Ban problematic types
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Object": { "message": "Use 'object' or '{}' instead" },
          "Function": { "message": "Use specific function type instead" },
          "any": { "message": "Use unknown instead" }
        }
      }
    ],
    
    // Prevent unnecessary type assertions
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    
    // Custom rule to check for proper adapters usage
    "custom-rules/proper-adapter-usage": {
      "create": function(context) {
        return {
          "BinaryExpression[operator='as'][right.typeName.name=/FloorPlan|Wall|Room|Stroke/]"(node) {
            context.report({
              node,
              message: "Use an adapter function like adaptFloorPlan() instead of type assertion with 'as'"
            });
          }
        };
      }
    }
  }
};
