
/**
 * TypeScript Fabric.js-specific ESLint rules
 * Ensures proper usage of Fabric.js library
 * @module eslint/typescript/fabric-rules
 */
export const fabricRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Enforce direct component imports for fabric.js
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["fabric"],
          "importNames": ["fabric"],
          "message": "Import specific components: import { Canvas, Line, Rect } from 'fabric' - not 'fabric.*'"
        }
      ],
      "paths": [{
        "name": "@/hooks/useCanvasState",
        "message": "Use DrawingTool from drawingTypes.ts instead."
      }]
    }],
    
    // Prevent using fabric namespace directly
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='fabric']",
        "message": "Don't use the fabric namespace directly. Import specific components from 'fabric'."
      },
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='toJSON'][arguments.length>0]",
        "message": "canvas.toJSON() doesn't accept arguments in this Fabric.js version."
      }
    ],
    
    // Enforce Array vs Tuple types
    "@typescript-eslint/array-type": ["error", {
      "default": "array",
      "readonly": "array"
    }]
  }
};
