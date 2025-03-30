
/**
 * Grid and Fabric.js specific ESLint rules
 * Custom rules for dealing with Canvas drawing APIs and components
 * @module eslint/grid-fabric-rules
 */
export const gridFabricRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Enforce consistent type usage for canvas drawing
    "no-restricted-imports": ["error", {
      "paths": [
        {
          "name": "@/types/drawingTypes",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' instead for consistency."
        },
        {
          "name": "@/types/core/DrawingTool",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' instead for consistency."
        }
      ],
      "patterns": [
        {
          "group": ["fabric"],
          "importNames": ["fabric"],
          "message": "Import specific components: import { Canvas, Line, Rect } from 'fabric' - not the entire namespace"
        }
      ]
    }],
    
    // Custom rules to enforce consistent imports
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportDeclaration[source.value='@/types/drawingTypes'] ImportSpecifier[imported.name='DrawingTool']",
        "message": "Import DrawingMode from '@/constants/drawingModes' instead of DrawingTool for consistency."
      },
      {
        "selector": "TSTypeReference[typeName.name='DrawingTool']",
        "message": "Use DrawingMode instead of DrawingTool for consistent typing across the application."
      },
      {
        "selector": "TSPropertySignature[key.name='tool'][typeAnnotation.typeAnnotation.typeName.name='DrawingTool']",
        "message": "Use DrawingMode type for 'tool' properties instead of DrawingTool."
      },
      {
        "selector": "Parameter[typeAnnotation.typeAnnotation.typeName.name='DrawingTool']",
        "message": "Use DrawingMode for parameter type annotations instead of DrawingTool."
      }
    ],
    
    // Canvas-specific validation rules
    "init-declarations": ["error", "always"],
    
    // Fabric-specific rules for better error detection
    "no-unsafe-optional-chaining": "error",
    
    // Ensure proper Fabric.js component usage
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Ensure state values are properly initialized (fixes the setHasError, setErrorMessage errors)
    "@typescript-eslint/no-use-before-define": ["error", {
      "functions": false,
      "classes": true,
      "variables": true,
      "allowNamedExports": false
    }],
    
    // Custom rule to prevent using FabricObject as a type for IText
    "no-restricted-syntax": [
      "error", 
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='add'] > Identifier[name=/^text$/]",
        "message": "Use proper type casting when adding text objects to canvas."
      },
      {
        "selector": "TSTypeAnnotation > TSTypeReference[typeName.name='FabricObject']",
        "message": "Be more specific with Fabric.js object types. Use the exact type (Line, Rect, etc.) when possible."
      }
    ],
    
    // Ensure proper initialization of variables before use
    "no-use-before-define": ["error", { 
      "functions": false, 
      "classes": true, 
      "variables": true 
    }]
  }
};
