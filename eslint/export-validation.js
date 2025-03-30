/**
 * Export validation rules
 * Ensures exported members are properly defined
 * @module eslint/export-validation
 */
export const exportValidationRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Enforce naming conventions for exported items
    "import/named": "error",
    "import/namespace": "error",
    "import/default": "error",
    "import/export": "error",
    "import/no-named-as-default": "warn",
    "import/no-named-as-default-member": "warn",
    
    // Prevent usage of undefined exports
    "import/no-unresolved": ["error", { commonjs: true, caseSensitive: true }],
    
    // Prevent circular dependencies
    "import/no-cycle": ["error", { maxDepth: 10 }],
    
    // Ensure all exports are used somewhere
    "import/no-unused-modules": ["warn", { 
      unusedExports: true,
      missingExports: true,
      ignoreExports: [
        "**/index.{js,ts,tsx}",
        "**/*.d.ts",
        "**/eslint/**",
        "**/*.test.{ts,tsx}",
        "**/__tests__/**"
      ]
    }],
    
    // Prevent exporting mutable values
    "import/no-mutable-exports": "error",
    
    // Ensure consistent export patterns
    "import/no-anonymous-default-export": "error",
    
    // Strict checking for dynamic import expressions
    "import/dynamic-import-chunkname": ["error", {
      webpackChunknameFormat: "[a-zA-Z0-9-/_]+"
    }],
    
    // Ensure exports are sorted alphabetically
    "sort-exports/sort-exports": ["warn", {
      sortDir: "asc",
      ignoreCase: true
    }],
    
    // Enhanced validation for export components
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["*/safeCanvasInitialization"],
          "importNames": ["prepareCanvasForInitialization", "validateCanvasInitialization", "handleInitializationFailure"],
          "message": "These functions must be properly exported from safeCanvasInitialization.ts"
        },
        {
          "group": ["*/gridCreationUtils", "*/gridCreation"],
          "importNames": ["validateGrid", "createGridLayer", "createFallbackGrid", "createBasicEmergencyGrid"],
          "message": "These functions must be properly exported from the grid utilities"
        },
        {
          "group": ["@/types/drawingTypes", "@/types/core/DrawingTool"],
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified type from '@/types/drawing/DrawingToolTypes'"
        }
      ]
    }],
    
    // Rule to specifically target DrawingTool vs DrawingMode imports
    "no-restricted-imports": ["error", {
      "paths": [
        {
          "name": "@/types/drawingTypes",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified types from '@/types/drawing/DrawingToolTypes'"
        },
        {
          "name": "@/types/core/DrawingTool",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified types from '@/types/drawing/DrawingToolTypes'"
        },
        {
          "name": "@/hooks/useCanvasState",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified types from '@/types/drawing/DrawingToolTypes'"
        }
      ]
    }],
    
    // ENHANCED: Prevent duplicate exports
    "no-duplicate-imports": "error",
    
    // ENHANCED: Force all export statements to be at the end of the file
    "import/exports-last": "warn",
    
    // ENHANCED: Custom rule to enforce documentation for exports
    "jsdoc/require-jsdoc": ["warn", {
      publicOnly: true,
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true
      },
      contexts: [
        "ExportNamedDeclaration > FunctionDeclaration",
        "ExportNamedDeclaration > VariableDeclaration",
        "ExportDefaultDeclaration > FunctionDeclaration",
        "ExportDefaultDeclaration > ClassDeclaration"
      ]
    }],
    
    // NEWLY ADDED: Enforce strict TypeScript checking on imports
    "@typescript-eslint/consistent-type-imports": ["error", { 
      prefer: "type-imports",
      disallowTypeAnnotations: true
    }],
    
    // NEWLY ADDED: Enforce strict property access
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // NEWLY ADDED: Prevent accessing properties that don't exist
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // NEWLY ADDED: Check that all imports refer to existing files
    "import/no-unresolved": ["error", { caseSensitive: true }],
    
    // NEW: Explicitly prevent duplicate exports of the same name
    "no-dupe-class-members": "error",
    "no-redeclare": "error",
    
    // NEW: TypeScript specific rules for checking exports
    "@typescript-eslint/no-duplicate-imports": "error",
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      allowArgumentsExplicitlyTypedAsAny: false,
      allowDirectConstAssertionInArrowFunctions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true,
    }],
    
    // NEW: Ensure exported functions have return types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
    }],
    
    // NEW RULES: Added to prevent TypeScript errors and improve code quality
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-optional-chain": "warn",
    
    // NEW: Rules to enforce strict property access and existence
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      allowString: true,
      allowNumber: true,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false
    }],
    
    // NEW: Rule to specifically target DrawingTool vs DrawingMode imports
    "no-restricted-imports": ["error", {
      "paths": [
        {
          "name": "@/types/drawingTypes",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified types from '@/types/drawing/DrawingToolTypes'"
        },
        {
          "name": "@/types/core/DrawingTool",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified types from '@/types/drawing/DrawingToolTypes'"
        },
        {
          "name": "@/hooks/useCanvasState",
          "importNames": ["DrawingTool"],
          "message": "Import DrawingMode from '@/constants/drawingModes' or use the unified types from '@/types/drawing/DrawingToolTypes'"
        }
      ]
    }],
    
    // NEW: Prevent duplicate exports in the same file
    "import/export": "error"
  }
};
