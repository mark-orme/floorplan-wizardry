
/**
 * ESLint import/export rules
 * Rules to enforce proper module imports and exports
 * @module eslint/import-rules
 */

export const importExportRules = {
  files: ["**/*.{ts,tsx}"],
  plugins: ["import"],
  rules: {
    // Ensures that all named imports are actually exported from the target module
    "import/named": ["error", { 
      "commonjs": true,
      "checkInTypeImports": true
    }],
    
    // Ensures that a default export is only imported as a default import
    "import/default": "error",
    
    // Ensures that a module with a namespace import has exports
    "import/namespace": ["error", {
      "allowComputed": true
    }],
    
    // Prevent importing modules that you don't have listed in your package.json
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "**/test/**", "**/tests/**"],
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    
    // Report any invalid exports, i.e. re-export of the same name
    "import/export": ["error", {
      "detectAmbiguousExports": true
    }],
    
    // Ensure consistent use of file extension within the import path
    "import/extensions": ["error", "never", { 
      "json": "always", 
      "css": "always", 
      "scss": "always", 
      "svg": "always" 
    }],
    
    // Prefer named exports to be grouped together
    "import/group-exports": "error",
    
    // Make sure imports point to files/modules that can be resolved
    "import/no-unresolved": ["error", {
      "caseSensitive": true,
      "caseSensitiveStrict": true,
      "commonjs": true
    }],
    
    // Prevent unnecessary path segments in import and require statements
    "import/no-useless-path-segments": ["error", {
      "noUselessIndex": true
    }],
    
    // Prevent import of modules using absolute paths
    "import/no-absolute-path": "error",
    
    // Ensure imports point to a file/module that can be resolved
    "import/no-self-import": "error",
    
    // Forbid import of modules using absolute paths
    "import/no-absolute-path": "error",
    
    // Prevent unnecessary path segments in import and require statements
    "import/no-useless-path-segments": ["error", { "commonjs": true }],
    
    // Prevent a module from importing itself
    "import/no-cycle": ["error", { "maxDepth": Infinity }],
    
    // Enforce a consistent style for all imports, allowing caching to be effective
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    
    // Enforce first-level imports to be explicitly sorted according to a convention
    "sort-imports": ["error", {
      "ignoreCase": true,
      "ignoreDeclarationSort": true, // We use import/order for declarations
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": true
    }],
    
    // Prevent using an exported name as the locally imported name of a default export
    "import/no-named-as-default": "error",
    
    // Prevent using a default export as a property of the named import
    "import/no-named-as-default-member": "error",
    
    // Prevent imports to folders without pointing to the index file
    "import/no-useless-path-segments": ["error", { "noUselessIndex": true }],
    
    // Prevent dynamic requires
    "import/no-dynamic-require": "error",
    
    // Enforce all imports to appear before non-import statements
    "import/first": "error",
    
    // Enforce a newline after import statements
    "import/newline-after-import": "error",
    
    // Prevent import statements that don't import anything
    "import/no-empty-named-blocks": "error",
    
    // Prefer named exports
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    
    // Forbid modules without exports, or exports without matching import in another module
    "import/no-unused-modules": ["error", {
      "unusedExports": true,
      "missingExports": true,
      "ignoreExports": ["**/index.ts", "**/*.d.ts"]
    }],
    
    // Prevent ambiguous exports
    "import/export": ["error", { "detectAmbiguousExports": true }],
    
    // Enforce that each module gets re-exported once
    "import/no-duplicates": "error",
    
    // STRENGTHENED: Architectural boundaries
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./src/components/ui/**/*",
          "from": "./src/hooks/canvas**",
          "message": "UI components should not depend on canvas-specific hooks."
        },
        {
          "target": "./src/hooks/**/*",
          "from": "./src/components/**/*",
          "message": "Hooks should not import from components to avoid circular dependencies."
        },
        {
          "target": "./src/utils/**/*",
          "from": "./src/components/**/*",
          "message": "Utilities should not import from components."
        },
        {
          "target": "./src/utils/**/*",
          "from": "./src/hooks/**/*",
          "message": "Utilities should not import from hooks to maintain proper layering."
        }
      ]
    }],
    
    // NEW: Check for absolute paths that should be module paths
    "import/no-absolute-path": "error",
    
    // NEW: Enforce imports from within the same directory to use relative imports
    "import/no-relative-packages": "error",
    
    // NEW: Prevent importing test files in production code
    "import/no-test-files": "error",
    
    // NEW: Prevent importing from devDependencies in production code
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.test.ts", "**/*.spec.ts", "**/tests/**", "**/test/**", "**/*.test.tsx", "**/*.spec.tsx", "vite.config.ts"],
      "optionalDependencies": false,
      "peerDependencies": true
    }],
    
    // STRENGTHENED: Enforce all module exports are valid and exist
    "import/named": ["error", {
      "commonjs": true,
      "checkInTypeImports": true
    }],
    
    // STRENGTHENED: Disallow unresolved imports
    "import/no-unresolved": ["error", {
      "caseSensitive": true,
      "caseSensitiveStrict": true,
      "commonjs": true,
      "amd": true,
      "esmodule": true
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
