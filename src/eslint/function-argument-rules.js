
/**
 * ESLint rules for function argument validation
 * Prevents errors from incorrect function argument counts
 * 
 * @module eslint/function-argument-rules
 */
module.exports = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent calling functions with incorrect argument counts
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
      }
    ],
    
    // Add specific checks for key functions
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='setCanvasCreated'][arguments.length>0]",
        "message": "setCanvasCreated does not accept arguments."
      },
      {
        "selector": "CallExpression[callee.name='setCanvasInitialized'][arguments.length>0]",
        "message": "setCanvasInitialized does not accept arguments."
      },
      {
        "selector": "CallExpression[callee.name='setGridLoaded'][arguments.length>0]",
        "message": "setGridLoaded does not accept arguments."
      },
      {
        "selector": "CallExpression[callee.name='setToolsRegistered'][arguments.length>0]",
        "message": "setToolsRegistered does not accept arguments."
      }
    ],
    
    // Check for GridCreationState properties
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='gridState'][property.name='created']",
        "message": "Use 'isCreated' instead of 'created' for GridCreationState."
      },
      {
        "selector": "ObjectExpression > Property[key.name='created']",
        "message": "Check if you meant to use 'isCreated' instead of 'created'."
      }
    ]
  }
};
