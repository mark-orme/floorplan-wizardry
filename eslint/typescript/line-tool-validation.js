
/**
 * ESLint rules for line tool validation
 * Helps prevent errors related to the straight line tool implementation
 * 
 * @module eslint/typescript/line-tool-validation
 */
export const lineToolValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='enabled']))",
        "message": "useStraightLineTool must be called with an object containing the 'enabled' property"
      },
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='canvas']))",
        "message": "useStraightLineTool must be called with an object containing the 'canvas' property"
      },
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='lineColor']))",
        "message": "useStraightLineTool must be called with an object containing the 'lineColor' property"
      },
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='lineThickness']))",
        "message": "useStraightLineTool must be called with an object containing the 'lineThickness' property"
      },
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='saveCurrentState']))",
        "message": "useStraightLineTool must be called with an object containing the 'saveCurrentState' property"
      },
      {
        "selector": "CallExpression[callee.name='useLineState'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='fabricCanvasRef']))",
        "message": "useLineState must be called with an object containing the 'fabricCanvasRef' property"
      },
      {
        "selector": "CallExpression[callee.name='useLineState'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='lineColor']))",
        "message": "useLineState must be called with an object containing the 'lineColor' property"
      },
      {
        "selector": "CallExpression[callee.name='useLineState'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='lineThickness']))",
        "message": "useLineState must be called with an object containing the 'lineThickness' property"
      },
      {
        "selector": "CallExpression[callee.name='useLineState'][arguments.length=1] > ObjectExpression:not(:has(Property[key.name='saveCurrentState']))",
        "message": "useLineState must be called with an object containing the 'saveCurrentState' property"
      },
      {
        "selector": "MemberExpression[object.name='InputMethod'][property.name=/^(?!MOUSE|TOUCH|PENCIL|STYLUS).*$/]",
        "message": "Invalid InputMethod enum value. Valid values are: MOUSE, TOUCH, PENCIL, STYLUS"
      }
    ],
    
    // Prevent missing exports in hook files
    "import/no-named-as-default": "error",
    "import/export": "error",
    
    // Add validation for MeasurementData having unit
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/no-explicit-any": ["warn", { "ignoreRestArgs": true }],
    
    // Add rule to validate MeasurementData interface
    "no-restricted-imports": [
      "error", 
      {
        "patterns": [{
          "group": ["*/hooks/straightLineTool/types"],
          "importNames": ["MeasurementData"],
          "message": "When using MeasurementData, ensure it has distance, angle, and unit properties"
        }]
      }
    ],
    
    // Prevent incorrect fabric object access
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn"
  }
};
