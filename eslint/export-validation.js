/**
 * ESLint rules for export validation
 * Enforces proper module export patterns
 * @module eslint/export-validation
 */

export const exportValidationRules = {
  files: ["**/*.{ts,tsx}"],
  plugins: ["import"],
  rules: {
    // Enforce consistent exports
    "import/no-mutable-exports": "error",
    
    // Ensure all exports are used by an import somewhere
    "import/no-unused-modules": ["warn", {
      "unusedExports": true,
      "ignoreExports": [
        "**/index.ts",
        "**/index.tsx",
        "**/*.d.ts",
        "**/constants/**",
        "**/types/**"
      ]
    }],
    
    // Warn when a module could be mistakenly parsed as a script
    "import/unambiguous": "warn",
    
    // Report potentially ambiguous parse goal (`script` vs. `module`)
    "import/no-import-module-exports": "error",
    
    // Reports use of an exported name as a property on the default export
    "import/no-named-as-default-member": "warn",
    
    // Reports use of an exported name as the locally imported name of a default export
    "import/no-named-as-default": "warn",
    
    // Reports CommonJS `require` calls and `module.exports` or `exports.*`
    "import/no-commonjs": "warn",
    
    // Forbids the use of AMD `require()` and `define()` calls
    "import/no-amd": "error",
    
    // Prefer ES6-style imports over legacy formats
    "import/no-dynamic-require": "warn",
    
    // Check for missing exports when imported
    "import/named": "error",
    
    // Prevent ambiguous re-exports
    "import/export": "error",
    
    // Enforce exports are grouped together at the end of the file
    "import/group-exports": "warn",
    
    // Prefer named exports to be grouped in a declaration
    "import/no-duplicates": "error",
    
    // Ensure imports resolve to a file/module
    "import/no-unresolved": ["error", { "commonjs": true }],
    
    // Check if the imported module has the imported name as an export
    "import/namespace": ["error", { "allowComputed": true }],
    
    // Ensure imports point to files/modules that can be resolved
    "import/no-self-import": "error",
    
    // NEW: Forbid default exports
    "import/no-default-export": "warn",
    
    // Ensure default export is only imported as default import
    "import/default": "error",
    
    // Warn on potential namespace confusion in exports
    "import/namespace": "error",
    
    // Prevent excessive re-exports that can lead to ambiguity
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.test.ts", "**/*.spec.ts", "**/tests/**"],
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    
    // Prevent re-exporting the same name from different modules with stricter settings
    "import/no-duplicates": ["error", { "considerQueryString": true }],
    
    // Prevent re-exporting the same name with different meanings with stricter settings
    "import/export": "error",
    
    // Improved warning about barrel files that might create ambiguous exports
    "import/no-named-default": "error",
    
    // Check for named exports in the same file
    "import/no-namespace": "warn",
    
    // Prevent wildcard exports alongside individual exports to avoid ambiguity
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "**/index.ts",
          "from": "./",
          "message": "Be cautious with wildcard exports in index files to avoid ambiguity."
        }
      ]
    }],
    
    // Enforce explicit re-exports to avoid ambiguity
    "import/no-anonymous-default-export": "error",
    
    // More strictly catch ambiguous exports
    "import/export": ["error", { "detectAmbiguousExports": true }],
    
    // Disallow re-exporting with the same name as a direct export in the same file
    "import/no-named-as-default-member": "error",
    
    // NEW: Improve detection of export conflicts
    "import/no-named-as-default": "error",
    
    // NEW: Enforce explicit re-exports instead of wildcards in barrel files
    "import/no-namespace": ["warn", { "ignore": ["react", "react-dom"] }],
    
    // NEW: Enforce a maximum number of exports per module
    "import/max-dependencies": ["warn", { "max": 20 }],
    
    // NEW: Prevent cyclic dependencies between modules
    "import/no-cycle": ["error", { "maxDepth": 1 }],
    
    // NEW: Enforce all exports to be declared at the end of the file
    "import/exports-last": "warn",
    
    // NEW: Require modules with a single export to use a default export
    "import/prefer-default-export": "off",
    
    // NEW: Prevent importing packages through relative paths
    "import/no-relative-packages": "error",
    
    // NEW: Enforce module boundaries by controlling re-exports
    "import/no-internal-modules": ["error", {
      "allow": ["@/components/*", "@/hooks/*", "@/utils/*", "@/types/*", "@/lib/*"]
    }],
    
    // NEW: Check for absolute paths in imports that should be relative
    "import/no-absolute-path": "error",
    
    // NEW: Prevent importing modules using dynamic expressions
    "import/no-dynamic-require": "error",
    
    // NEW: Prevent webpack loader syntax in imports
    "import/no-webpack-loader-syntax": "error",
    
    // NEW: Ensure consistent import/export style
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    
    // NEW: Prevent too many dependencies in a single file
    "import/max-dependencies": ["warn", { 
      "max": 15,
      "ignoreTypeImports": true
    }],
    
    // NEW: Enforce explicit exports instead of relying on a namespace import
    "import/namespace": ["error", { "allowComputed": false }],
    
    // NEW: Enforce unique export names across the codebase
    "import/export": ["error", { 
      "detectExportNameConflicts": true,
      "detectAmbiguousExports": true
    }],
    
    // NEW: Ensure barrel files are properly maintained
    "import/no-cycle": ["error", { 
      "maxDepth": 1,
      "ignoreExternal": false
    }],
    
    // NEW: Improve module structure
    "import/no-self-import": "error",
    "import/no-cycle": ["error", { "maxDepth": 1 }],
    "import/no-useless-path-segments": ["error", { "noUselessIndex": true }],
    "import/first": "error",
    "import/newline-after-import": "error",
    
    // NEW: Prevent accidental default exports
    "import/no-anonymous-default-export": ["error", {
      "allowArray": false,
      "allowArrowFunction": false,
      "allowAnonymousClass": false,
      "allowAnonymousFunction": false,
      "allowCallExpression": false,
      "allowLiteral": false,
      "allowObject": false
    }],
    
    // NEW: Enforce proper type imports
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    
    // NEW: Enforce architectural boundaries more strictly
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "**/index.ts",
          "from": "./",
          "message": "Be cautious with wildcard exports in index files to avoid ambiguity."
        },
        {
          "target": "./src/utils/**/*",
          "from": "./src/components/**/*",
          "message": "Utils should not import from components. This creates circular dependencies."
        },
        {
          "target": "./src/types/**/*", 
          "from": "./src/**/*",
          "except": ["./src/types/**/*"],
          "message": "Types should only import from other types to prevent circular dependencies."
        },
        {
          "target": "./src/hooks/canvas-resizing/**/*",
          "from": "./src/hooks/canvas-events/**/*",
          "message": "Canvas resizing should not depend on canvas events to maintain proper separation of concerns."
        }
      ]
    }],
    
    // NEW: Warn on potentially problematic imports
    "import/no-deprecated": "warn",
    
    // NEW: Prevent accidental imports from devDependencies in production code
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/*.test.ts", 
        "**/*.test.tsx", 
        "**/*.spec.ts", 
        "**/*.spec.tsx", 
        "**/test/**", 
        "**/tests/**", 
        "vite.config.ts",
        "vitest.config.ts"
      ],
      "optionalDependencies": false,
      "peerDependencies": true
    }]
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  }
};
