
/**
 * ESLint rules for Apple Pencil drawing tools
 * Ensures proper property access and function usage
 * 
 * @module eslint/typescript/apple-pencil-tools
 */
export const applePencilToolsRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Ensure measurements have proper types
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Enforce property access on MeasurementData
    "@typescript-eslint/no-unsafe-member-access": ["error", {
      allowIndexAccess: true,
    }],
    
    // Prevent using undeclared properties on hook returns
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Validate hook return values
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useLineState'] > ObjectPattern:not(:has(Property[key.name='setStartPoint'], Property[key.name='setCurrentLine'], Property[key.name='distanceTooltipRef']))",
        "message": "useLineState must include setStartPoint, setCurrentLine, and distanceTooltipRef in destructured properties"
      },
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'] > ObjectPattern:not(:has(Property[key.name='handlePointerDown'], Property[key.name='cancelDrawing']))",
        "message": "useStraightLineTool must include handlePointerDown and cancelDrawing in destructured properties"
      }
    ],
    
    // Validate our MeasurementData type usage
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^[A-Z][a-zA-Z]+Data$|^[A-Z][a-zA-Z]+Props$|^[A-Z][a-zA-Z]+State$|^[A-Z][a-zA-Z]+Result$",
          "match": false
        },
        "filter": {
          "regex": "^MeasurementData$",
          "match": true
        }
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"],
        "filter": {
          "regex": "^LineStateInterface$",
          "match": true
        }
      }
    ]
  }
};
