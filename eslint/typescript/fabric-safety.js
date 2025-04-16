
/**
 * ESLint rules for Fabric.js safety
 * Prevents common errors when working with Fabric.js
 */
export const fabricSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent direct usage of fabric object without import
    "no-undef": "error",
    
    // Prevent wrong parameter counts for common Fabric.js objects
    "no-restricted-syntax": [
      "error",
      {
        "selector": "NewExpression[callee.name='Line'][arguments.length!=2]",
        "message": "Line constructor requires exactly 2 arguments: coordinates array and options"
      },
      {
        "selector": "NewExpression[callee.name='Line'][arguments.0.type!='ArrayExpression']",
        "message": "First argument to Line constructor must be an array of coordinates [x1, y1, x2, y2]"
      },
      {
        "selector": "NewExpression[callee.object.name='fabric'][callee.property.name='Line'][arguments.length!=2]",
        "message": "fabric.Line constructor requires exactly 2 arguments: coordinates array and options"
      },
      {
        "selector": "CallExpression[callee.name='useLineState']:not([arguments.0.type='ObjectExpression'])",
        "message": "useLineState must be called with a single object parameter"
      }
    ],
    
    // Enforce proper imports and usage of fabric
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "fabric" }],
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["fabric"],
            "importNames": ["default"],
            "message": "Import specific objects from fabric instead of the default export"
          }
        ]
      }
    ],
    
    // Enforce proper error handling with canvas operations
    "no-restricted-properties": [
      "error",
      {
        "object": "canvas",
        "property": "add",
        "message": "Always check if canvas exists before calling canvas.add()"
      },
      {
        "object": "canvas",
        "property": "remove",
        "message": "Always check if canvas exists before calling canvas.remove()"
      },
      {
        "object": "canvas",
        "property": "renderAll",
        "message": "Always check if canvas exists before calling canvas.renderAll()"
      }
    ]
  }
};
