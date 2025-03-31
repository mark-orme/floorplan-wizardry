
/**
 * TypeScript function argument validation ESLint rules
 * Prevents errors from incorrect function argument counts
 * @module eslint/typescript/function-argument-rules
 */
export const functionArgumentRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Ensure function calls have correct argument counts
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Prevent calling functions with incorrect number of arguments
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.property.name=/^(setCanvasCreated|setCanvasInitialized|setGridLoaded|setToolsRegistered)$/][arguments.length>0]",
        "message": "Canvas ready state setters do not accept arguments. Remove any arguments passed to this function."
      },
      {
        "selector": "CallExpression[callee.name='createCompleteGrid'][arguments.length<1]",
        "message": "createCompleteGrid requires at least a canvas parameter."
      },
      {
        "selector": "CallExpression[callee.name='setGridVisibility'][arguments.length!=3]",
        "message": "setGridVisibility requires exactly 3 arguments: canvas, gridObjects, and visible."
      },
      {
        "selector": "MemberExpression[object.property.name='GridCreationState'][property.name='created']",
        "message": "Use 'isCreated' instead of 'created' on GridCreationState objects."
      }
    ]
  }
};
