
/**
 * ESLint rules for line drawing and Fabric.js event handling
 * Prevents common issues with line drawing implementation
 * 
 * @module eslint/typescript/line-drawing-rules
 */

module.exports = {
  rules: {
    // Enforce proper Line constructor usage
    "no-restricted-syntax": [
      "error",
      {
        "selector": "NewExpression[callee.name='Line'] > ArrayExpression:first-child[elements.length!=4]",
        "message": "Fabric.js Line constructor requires exactly 4 numbers as first argument (x1, y1, x2, y2)"
      },
      {
        "selector": "NewExpression[callee.name='Line'][arguments.length<1]",
        "message": "Fabric.js Line constructor requires at least one argument (points array)"
      }
    ],
    
    // Enforce proper event handler cleanup in useEffect
    "react-hooks/exhaustive-deps": ["error"],
    
    // Enforce proper nullish checking
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Enforce specific rule for straight line tool event handling
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name=/canvas|fabricCanvas/][callee.property.name='on'][arguments.length>0][arguments.0.value=/mouse|Mouse/]",
        "message": "Use FabricEventTypes enum constants instead of string literals for mouse events"
      }
    ],
    
    // Enforce consistent type checking for canvas references
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name=/currentLineRef|distanceTooltipRef/][property.name='current'][parent.type!='IfStatement']",
        "message": "Always check if currentLineRef.current or distanceTooltipRef.current exists before using it"
      }
    ],
    
    // Enforce proper Line coordinate updating
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.object.name='currentLineRef'][callee.object.property.name='current'][callee.property.name='set'][arguments.0.properties.length<2]",
        "message": "When updating a line, make sure to set both coordinates (x2, y2)"
      }
    ],
    
    // Enforce proper distance calculation
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='calculateDistance'][arguments.length!=2]",
        "message": "calculateDistance function requires exactly two Point arguments"
      }
    ],
    
    // Ensure proper tool validation
    "no-restricted-syntax": [
      "error",
      {
        "selector": "IfStatement[test.left.name='tool'][test.right.object.name!='DrawingMode']",
        "message": "Always use DrawingMode enum for tool comparison"
      }
    ]
  }
};
