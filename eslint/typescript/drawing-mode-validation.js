
/**
 * DrawingMode Validation Rules
 * 
 * Prevents errors related to accessing non-existent properties on DrawingMode enum
 * and ensures proper imports and usage of Fabric.js.
 * 
 * @module eslint/typescript/drawing-mode-validation
 */

export const drawingModeValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Validate DrawingMode property access
    "no-restricted-syntax": [
      "error",
      {
        selector: "MemberExpression[object.name='DrawingMode'][property.name!=/^(SELECT|DRAW|LINE|STRAIGHT_LINE|RECTANGLE|CIRCLE|TEXT|PAN|ZOOM|ERASE|ERASER|MEASURE|WALL|DOOR|WINDOW|ROOM|ROOM_LABEL)$/]",
        message: "Invalid DrawingMode property. Valid properties are: SELECT, DRAW, LINE, STRAIGHT_LINE, RECTANGLE, CIRCLE, TEXT, PAN, ZOOM, ERASE, ERASER, MEASURE, WALL, DOOR, WINDOW, ROOM, ROOM_LABEL"
      },
      {
        selector: "Identifier[name='fabric']:not(ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier)",
        message: "Direct reference to 'fabric' namespace without proper import. Import from 'fabric' package instead: import { Canvas, Circle } from 'fabric'"
      }
    ],
    
    // Enforce proper fabric imports
    "no-restricted-imports": [
      "error", 
      {
        "name": "fabric",
        "importNames": ["default"],
        "message": "Import specific components from fabric instead of default import: import { Canvas, Circle } from 'fabric'"
      }
    ]
  }
};
