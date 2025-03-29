
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
    "import/no-unresolved": "error",
    
    // NEW: Prevent circular dependencies
    "import/no-cycle": ["error", { maxDepth: 10 }],
    
    // NEW: Ensure all exports are used somewhere
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
    
    // NEW: Prevent exporting mutable values
    "import/no-mutable-exports": "error",
    
    // NEW: Ensure consistent export patterns
    "import/no-anonymous-default-export": "error",
    
    // NEW: Ensure all imported modules can be resolved to a module on the local filesystem
    "import/no-unresolved": ["error", { caseSensitive: true }],
    
    // NEW: Strict checking for dynamic import expressions
    "import/dynamic-import-chunkname": ["error", {
      webpackChunknameFormat: "[a-zA-Z0-9-/_]+"
    }],
    
    // NEW: Ensure exports are sorted alphabetically
    "sort-exports/sort-exports": ["warn", {
      sortDir: "asc",
      ignoreCase: true
    }],
    
    // NEW: Custom rule to check for exports usage
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
        }
      ]
    }],
    
    // NEW: Custom rule to enforce documentation for exports
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
    }]
  }
};
