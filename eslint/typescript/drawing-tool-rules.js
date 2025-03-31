
/**
 * TypeScript DrawingTool/DrawingMode ESLint rules
 * Enforces consistent usage of drawing-related types
 * @module eslint/typescript/drawing-tool-rules
 */
export const drawingToolRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Add strict type compatibility checking between DrawingTool and DrawingMode
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSTypeReference[typeName.name='DrawingTool']",
        "message": "Use DrawingMode instead of DrawingTool for consistent typing across the application."
      },
      {
        "selector": "ImportSpecifier[imported.name='DrawingTool'][local.name!='DrawingMode']",
        "message": "Import DrawingMode instead of DrawingTool for consistent typing across the application."
      },
      {
        "selector": "VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='DrawingTool']",
        "message": "Use DrawingMode type instead of DrawingTool for consistent typing across the application."
      }
    ]
  }
};
