
/**
 * Grid and Fabric.js specific ESLint rules
 * Enforces proper imports and usage of Fabric.js in grid-related files
 * @module eslint/grid-fabric-rules
 */
export const gridFabricRules = {
  files: ["**/grid/**/*.{ts,tsx}"],
  rules: {
    // Enforce direct imports
    "no-restricted-globals": ["error", "fabric"],
    
    // Prevent direct access to fabric namespace
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='fabric']",
        "message": "Don't use the fabric namespace directly. Import specific components from 'fabric'."
      }
    ],
    
    // Ensure proper error handling in canvas operations
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name=/^(add|remove|clear|setWidth|setHeight|setDimensions)$/][arguments.length>0]:not(TryStatement > *)",
        "message": "Canvas operations should be wrapped in try/catch blocks to prevent runtime errors."
      }
    ],
    
    // Ensure proper type imports
    "@typescript-eslint/consistent-type-imports": ["error", { 
      "prefer": "type-imports",
      "disallowTypeAnnotations": true
    }],
    
    // Prevent type errors from accessing fabric properties
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Ensure proper tuple types
    "@typescript-eslint/array-type": ["error", {
      "default": "array",
      "readonly": "array"
    }]
  }
};
