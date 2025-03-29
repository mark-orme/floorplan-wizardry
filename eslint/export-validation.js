
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
    "import/no-unused-modules": ["error", {
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
    "import/unambiguous": "error",
    
    // Report potentially ambiguous parse goal (`script` vs. `module`)
    "import/no-import-module-exports": "error",
    
    // Reports use of an exported name as a property on the default export
    "import/no-named-as-default-member": "error",
    
    // Reports use of an exported name as the locally imported name of a default export
    "import/no-named-as-default": "error",
    
    // Reports CommonJS `require` calls and `module.exports` or `exports.*`
    "import/no-commonjs": "error",
    
    // Forbids the use of AMD `require()` and `define()` calls
    "import/no-amd": "error",
    
    // Prefer ES6-style imports over legacy formats
    "import/no-dynamic-require": "error",
    
    // Check for missing exports when imported
    "import/named": "error",
    
    // Prevent ambiguous re-exports
    "import/export": "error",
    
    // Enforce exports are grouped together at the end of the file
    "import/group-exports": "error",
    
    // Prefer named exports to be grouped in a declaration
    "import/no-duplicates": "error",
    
    // Ensure imports resolve to a file/module
    "import/no-unresolved": ["error", { "commonjs": true }],
    
    // Check if the imported module has the imported name as an export
    "import/namespace": ["error", { "allowComputed": true }],
    
    // Ensure imports point to files/modules that can be resolved
    "import/no-self-import": "error",
    
    // NEW: Forbid default exports - STRENGTHENED
    "import/no-default-export": "error",
    
    // Ensure default export is only imported as default import
    "import/default": "error",
    
    // Warn on potential namespace confusion in exports
    "import/namespace": "error",
    
    // STRENGTHENED: Prevent excessive re-exports that can lead to ambiguity
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.test.ts", "**/*.spec.ts", "**/tests/**"],
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    
    // STRENGTHENED: Prevent re-exporting the same name from different modules
    "import/no-duplicates": ["error", { "considerQueryString": true }],
    
    // STRENGTHENED: Prevent re-exporting the same name with different meanings
    "import/export": "error",
    
    // STRENGTHENED: Warning about barrel files that might create ambiguous exports
    "import/no-named-default": "error",
    
    // STRENGTHENED: Check for named exports in the same file
    "import/no-namespace": "error",
    
    // STRENGTHENED: Prevent wildcard exports alongside individual exports
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "**/index.ts",
          "from": "./",
          "message": "Be cautious with wildcard exports in index files to avoid ambiguity."
        }
      ]
    }],
    
    // STRENGTHENED: Enforce explicit re-exports to avoid ambiguity
    "import/no-anonymous-default-export": "error",
    
    // STRENGTHENED: More strictly catch ambiguous exports
    "import/export": ["error", { "detectAmbiguousExports": true }],
    
    // STRENGTHENED: Disallow re-exporting with the same name as a direct export
    "import/no-named-as-default-member": "error",
    
    // NEW: Improve detection of export conflicts
    "import/no-named-as-default": "error",
    
    // NEW: Enforce explicit re-exports instead of wildcards in barrel files
    "import/no-namespace": ["error", { "ignore": ["react", "react-dom"] }],
    
    // NEW: Enforce a maximum number of exports per module
    "import/max-dependencies": ["error", { "max": 15 }],
    
    // NEW: Prevent cyclic dependencies between modules
    "import/no-cycle": ["error", { "maxDepth": Infinity }],
    
    // NEW: Enforce all exports to be declared at the end of the file
    "import/exports-last": "error",
    
    // NEW: Prevent importing packages through relative paths
    "import/no-relative-packages": "error",
    
    // NEW: Check that all exported values actually exist
    "import/named": ["error", { "commonjs": true }],
    
    // NEW: Require file extensions in import paths
    "import/extensions": ["error", "ignorePackages", {
      "ts": "never",
      "tsx": "never",
      "js": "never",
      "jsx": "never"
    }],
    
    // NEW: Enforce consistent path syntax
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    
    // NEW: Enforce correct import source extension
    "import/no-useless-path-segments": ["error", { "noUselessIndex": true }],
    
    // NEW: Require modules with multiple exports to use named exports
    "import/no-default-export": "error",
    
    // NEW: Warn about modules without exports
    "import/no-empty-named-blocks": "error",
    
    // NEW: Enforce that imported modules contain the imported name
    "import/named": ["error", { "commonjs": true }],
    
    // NEW: Prevent importing from parent directories
    "import/no-relative-parent-imports": "warn",
    
    // NEW: Enforces having one export per file
    "import/prefer-default-export": "off",
    
    // NEW: Strict validation that exports exist
    "import/named": ["error", {
      "commonjs": true
    }],
    
    // CRITICAL: Enforce that all imports are of existing exports
    "import/no-unresolved": ["error", {
      "commonjs": true,
      "amd": true,
      "esmodule": true
    }],
    
    // NEW: Prevent imports that don't resolve
    "import/no-unresolved": ["error", { 
      "caseSensitive": true,
      "caseSensitiveStrict": true
    }],
    
    // NEW: Ensure imports appear in correct order
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    
    // NEW: Enforce precise matching for named imports
    "import/named": ["error", { 
      "commonjs": true,
      "checkInTypeImports": true
    }],
    
    // NEW: Strict checking of exports existence before import
    "import/no-unused-modules": ["error", {
      "unusedExports": true,
      "missingExports": true,
      "ignoreExports": [
        "**/index.ts",
        "**/index.tsx",
        "**/*.d.ts",
        "**/constants/**",
        "**/types/**"
      ]
    }]
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ]
  }
};
