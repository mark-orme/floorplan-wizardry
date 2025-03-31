
/**
 * TypeScript function argument validation ESLint rules
 * Prevents errors from incorrect function argument counts and property access
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
      },
      {
        "selector": "CallExpression[callee.name='useCanvasReadyState'][callee.arguments]",
        "message": "useCanvasReadyState hook does not accept arguments."
      },
      // Ensure proper property access on GridCreationState
      {
        "selector": "ObjectExpression[properties.length>0] > Property[key.name=/(visible|visibility)$/][parent.parent.callee.name=/setGridState|setState/]",
        "message": "The 'visible/visibility' property does not exist on GridCreationState. Consider using 'exists' or another appropriate property."
      },
      // Prevent invalid property access on GridCreationState initialization
      {
        "selector": "ObjectExpression[properties.0.key.name=/GridCreationState/] > Property[key.name!=/isCreated|inProgress|attempts|lastAttemptTime|hasError|errorMessage|creationInProgress|consecutiveResets|maxConsecutiveResets|exists|lastCreationTime|throttleInterval|totalCreations|maxRecreations|minRecreationInterval|creationLock|objectCount|started|completed|startTime|endTime|error/]",
        "message": "Invalid property used on GridCreationState. Check src/types/core/GridTypes.ts for valid properties."
      },
      // Prevent using untyped empty objects in grid state operations
      {
        "selector": "VariableDeclarator[init.type='ObjectExpression'][init.properties.length=0][id.name=/grid.*State|.*GridState/]",
        "message": "Don't use empty object literals without types for grid state. Use Partial<GridCreationState> or similar."
      },
      // Prevent assigning to unknown properties in typed objects
      {
        "selector": "AssignmentExpression[left.object.name=/gridState/][left.property.name!=/isCreated|inProgress|attempts|lastAttemptTime|hasError|errorMessage|creationInProgress|consecutiveResets|maxConsecutiveResets|exists|lastCreationTime|throttleInterval|totalCreations|maxRecreations|minRecreationInterval|creationLock|objectCount|started|completed|startTime|endTime|error/]",
        "message": "Invalid property assignment to GridCreationState. Check src/types/core/GridTypes.ts for valid properties."
      }
    ]
  }
};
