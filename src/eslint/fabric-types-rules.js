
/**
 * ESLint rules for Fabric.js type safety
 * Prevents common errors with Fabric.js types and objects
 * 
 * @module eslint/fabric-types-rules
 */
module.exports = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent fabric.Point related issues
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportDeclaration[source.value='fabric'] > ImportSpecifier[imported.name='Point']",
        "message": "Import Point from fabric as FabricPoint to avoid confusion with our app Point type. Example: import { Point as FabricPoint } from 'fabric';"
      },
      {
        "selector": "CallExpression[callee.name='toFabricPoint'][arguments.length!=1]",
        "message": "toFabricPoint requires exactly one argument of type Point"
      },
      {
        "selector": "CallExpression[callee.name='fromFabricPoint'][arguments.length!=1]",
        "message": "fromFabricPoint requires exactly one argument of type fabric.Point"
      },
      // Line constructor validation
      {
        "selector": "NewExpression[callee.name='Line'] > ArrayExpression:first-child[elements.length!=4]",
        "message": "Fabric.js Line constructor requires exactly 4 numbers as first argument: [x1, y1, x2, y2]"
      },
      // Touch handling validation
      {
        "selector": "BinaryExpression[operator='instanceof'][right.name='Touch']",
        "message": "Use type guards with proper interface matching instead of 'instanceof Touch'. Touch objects have specific required properties."
      },
      // Extra fabric-related type checks
      {
        "selector": "MemberExpression[object.name='canvas'][property.name='freeDrawingBrush'][parent.type!='MemberExpression'][parent.type!='OptionalMemberExpression']",
        "message": "Check if freeDrawingBrush exists before using it directly. Use optional chaining: canvas.freeDrawingBrush?.color"
      }
    ]
  }
};
