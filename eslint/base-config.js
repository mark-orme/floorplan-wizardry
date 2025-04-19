/**
 * Base ESLint configuration
 * Shared rules for all files
 * @module eslint/base-config
 */
export const baseConfig = {
  files: ["**/*.{js,ts,jsx,tsx}"],
  rules: {
    // Security rules
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-new-buffer": "error",
    
    // Data validation rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    
    // HTML security rules
    "react/no-danger": "error",
    "react/no-unsafe": "error",
    
    // Best practices for security
    "import/no-webpack-loader-syntax": "error",
    "no-secrets/no-secrets": ["error", { 
      "ignoreContent": ["test", "example"]
    }],
    
    // Import rules to prevent runtime errors
    "import/no-unresolved": "error", // Added per request
    "no-unused-vars": "error", // Strengthened from warn to error
    "no-restricted-imports": ["error", {
      "paths": [
        {
          "name": "@/utils/grid/gridDebugUtils",
          "importNames": ["forceCreateGrid"],
          "message": "Make sure this function exists and is exported"
        },
        {
          "name": "@/types/floorPlanTypes",
          "importNames": ["FloorPlan"],
          "message": "Use FloorPlan from @/types/core/FloorPlan instead."
        },
        {
          "name": "@/utils/gridCreationUtils",
          "importNames": ["validateGrid", "createGridLayer", "createFallbackGrid", "createBasicEmergencyGrid"],
          "message": "Ensure these functions are properly exported from gridCreationUtils"
        },
        {
          "name": "./gridCreation",
          "importNames": ["createGridLayer", "createFallbackGrid", "createBasicEmergencyGrid"],
          "message": "Ensure these functions are properly exported from gridCreation"
        },
        {
          "name": "@/hooks/useCanvasState",
          "message": "Use DrawingTool from drawingTypes.ts instead."
        }
      ]
    }],
    
    // Style consistency
    "comma-dangle": ["error", "never"],
    "quotes": ["error", "double", { "avoidEscape": true }], // Strengthened from warn to error
    "semi": ["error", "always"], // Strengthened from warn to error
    
    // Best practices
    "arrow-body-style": ["error", "as-needed"], // Strengthened from warn to error
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "no-duplicate-imports": "error",
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
        "message": "setTimeout must always be invoked with two arguments."
      },
      {
        "selector": "Literal[value='hand']",
        "message": "Use DrawingTool.HAND instead of the string literal 'hand'"
      },
      {
        "selector": "Literal[value='straightLine']",
        "message": "Use DrawingTool.STRAIGHT_LINE instead of the string literal 'straightLine'"
      },
      {
        "selector": "CallExpression[callee.name='setTimeout']",
        "message": "Avoid raw setTimeout – use a util."
      },
      // NEW: Prevent common anti-patterns
      {
        "selector": "CallExpression[callee.name='JSON'][callee.property.name='parse'][arguments.0.type='Literal']",
        "message": "Don't use JSON.parse with a literal value. Use the object directly."
      },
      {
        "selector": "MemberExpression[object.name='document'][property.name='getElementById']",
        "message": "Use React refs instead of direct DOM manipulation."
      },
      {
        "selector": "MemberExpression[object.name='window'][property.name='location'][property.name='href']",
        "message": "Use React Router for navigation instead of directly manipulating window.location."
      }
    ],
    
    // Enhancing code readability
    "max-lines-per-function": ["warn", { "max": 100, "skipBlankLines": true, "skipComments": true }],
    "complexity": ["warn", { "max": 10 }],
    
    // Prevent TODO comments
    "no-warning-comments": ["error", { 
      "terms": ["todo", "fixme", "xxx"],
      "location": "anywhere"
    }]
  }
};
