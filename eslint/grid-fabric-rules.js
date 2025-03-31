
/**
 * ESLint rules specifically for Fabric.js usage with the grid system
 * Prevents common errors in Fabric.js usage patterns
 * @module eslint/grid-fabric-rules
 */
export const gridFabricRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent using fabric namespace directly
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='fabric']",
        "message": "Don't use the fabric namespace directly. Import specific components from 'fabric'."
      },
      {
        "selector": "TSQualifiedName[left.name='fabric']",
        "message": "Don't use fabric namespace in type annotations. Import types from 'fabric' directly."
      }
    ],
    
    // Enforce proper imports for Fabric.js
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "fabric",
        "importNames": ["fabric"],
        "message": "Import specific components: import { Canvas, Line } from 'fabric' instead of 'fabric'"
      }]
    }],
    
    // Check for commonly misused Fabric patterns
    "@typescript-eslint/consistent-type-imports": ["error", { 
      "prefer": "type-imports",
      "disallowTypeAnnotations": false
    }],
    
    // Make sure we're using proper types for Fabric objects
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "typeParameter",
        "format": ["PascalCase"],
        "prefix": ["T"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": false
        }
      }
    ]
  }
};
