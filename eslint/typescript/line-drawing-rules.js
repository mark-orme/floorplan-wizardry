
/**
 * Line drawing ESLint rules
 * Ensures proper handling of line drawing operations
 * @module eslint/typescript/line-drawing-rules
 */
export const lineDrawingRules = {
  rules: {
    // Prevent common issues in line drawing
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='add'][arguments.length<1]",
        "message": "canvas.add() requires at least one object to add."
      },
      {
        "selector": "NewExpression[callee.name='Line'][arguments.length<1]",
        "message": "new Line() requires at least one argument for the points array."
      },
      {
        "selector": "CallExpression[callee.name='startDrawing'][arguments.length<1]",
        "message": "startDrawing() requires a point argument."
      },
      {
        "selector": "CallExpression[callee.name='endDrawing'][arguments.length<1]",
        "message": "endDrawing() requires a point argument."
      }
    ],
    
    // Ensure proper type usage in line drawing
    "@typescript-eslint/no-unsafe-argument": ["error", {
      "suggest": true
    }]
  }
};

