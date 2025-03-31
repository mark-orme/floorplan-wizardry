/**
 * TypeScript strict type safety rules
 * Prevents common type errors that have caused build failures
 * @module eslint/type-safety-rules
 */
export const typeSafetyRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent property access on potentially undefined objects
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent calling functions with wrong argument counts
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Enforce explicit checking for property existence
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Strictly enforce typing for point objects to prevent fabric/app type confusion
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["fabric"],
          "importNames": ["Point"],
          "message": "Import Point from 'fabric' as FabricPoint to avoid confusion with our app Point type."
        }
      ]
    }],

    // Enforce proper imports from core types
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["@/types/geometryTypes"],
          "importNames": ["createPoint"],
          "message": "Import createPoint from '@/types/core/Point' instead."
        }
      ]
    }],

    // Enforce null checks before accessing array properties
    "@typescript-eslint/no-unnecessary-condition": ["error", {
      "allowRuntimeChecks": true
    }],

    // Ensure Array.isArray() is used before accessing array methods
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowNullableObject": false,
      "allowNullableBoolean": false,
      "allowAny": false
    }],

    // Prevent incompatible type assignments
    "@typescript-eslint/no-explicit-any": "error",
    
    // Only allow type assertions in very specific cases
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "never"
    }],

    // Enforce proper handling of objects that might be null/undefined
    "@typescript-eslint/prefer-optional-chain": "error",
    
    // Enforce checking for exported types
    "@typescript-eslint/explicit-module-boundary-types": "error",
    
    // Add specific rule to prevent using fabric namespace
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='fabric']",
        "message": "Don't use the fabric namespace directly. Import specific components from 'fabric'."
      }
    ],
    
    // Rule to enforce proper function calls with correct argument counts
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-misused-promises": "error",
    
    // NEW RULES for enforcing DrawingMode enum values
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='DrawingMode'][property.name!=/^(SELECT|DRAW|STRAIGHT_LINE|RECTANGLE|CIRCLE|TEXT|WALL|DOOR|WINDOW|ROOM_LABEL|ROOM|LINE|MEASURE|PAN|HAND|ZOOM|ERASE|ERASER)$/]",
        "message": "Invalid DrawingMode value. Use only values defined in the DrawingMode enum."
      },
      {
        "selector": "MemberExpression[object.name='fabric']",
        "message": "Don't use the fabric namespace directly. Import specific components from 'fabric'."
      },
      {
        "selector": "CallExpression[callee.name='snapPointToGrid'][arguments.length<1]",
        "message": "snapPointToGrid requires at least one argument."
      },
      {
        "selector": "CallExpression[callee.name='createPoint'][arguments.length!=2]",
        "message": "createPoint requires exactly two arguments: x and y."
      }
    ],
    
    // NEW: More specific rules for checking DebugInfoState properties
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.object.name='debugInfo'][object.property.name!=/^(canvasCreated|canvasReady|canvasInitialized|gridCreated|gridObjectCount|dimensionsSet|showDebugInfo|eventHandlersSet|brushInitialized|hasError|errorMessage|lastInitTime|lastGridCreationTime|canvasEventsRegistered|gridRendered|toolsInitialized|performanceStats|objectCount|canvasWidth|canvasHeight|devicePixelRatio|lastError|lastErrorTime|canvasDimensions)$/]",
        "message": "Invalid DebugInfoState property. Make sure all properties are defined in the DebugInfoState interface."
      },
      {
        "selector": "MemberExpression[object.name='DrawingMode'][property.name!=/^(SELECT|DRAW|STRAIGHT_LINE|RECTANGLE|CIRCLE|TEXT|WALL|DOOR|WINDOW|ROOM_LABEL|ROOM|LINE|MEASURE|PAN|HAND|ZOOM|ERASE|ERASER)$/]",
        "message": "Invalid DrawingMode value. Use only values defined in the DrawingMode enum."
      },
      {
        "selector": "MemberExpression[object.object.name='gridState'][object.property.name!=/^(started|completed|objectCount|startTime|endTime|error|inProgress|isCreated|attempts|lastAttemptTime|hasError|errorMessage|creationInProgress|consecutiveResets|maxConsecutiveResets|exists|lastCreationTime|throttleInterval|totalCreations|maxRecreations|minRecreationInterval|creationLock)$/]",
        "message": "Invalid GridCreationState property. Make sure all properties are defined in the GridCreationState interface."
      }
    ],
    
    // Prevent using object properties without checking if they exist
    "@typescript-eslint/no-unnecessary-condition": ["error", {
      "allowRuntimeChecks": true
    }],
    
    // NEW: Enforce type checking for grid operations
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@/constants/drawingModes",
            "importNames": ["DrawingTool"],
            "message": "Import DrawingTool from '@/types/core/DrawingTool' instead."
          }
        ],
        "patterns": [
          {
            "group": ["@/types/gridTypes"],
            "message": "Import grid types from '@/types/core/GridTypes' instead."
          }
        ]
      }
    ]
  }
};
