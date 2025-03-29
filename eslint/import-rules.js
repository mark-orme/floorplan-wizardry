
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
    "import/named": "error",
    
    // Ensures that a default export is only imported as a default import
    "import/default": "error",
    
    // Ensures that a module with a namespace import has exports
    "import/namespace": "error",
    
    // Prevent importing modules that you don't have listed in your package.json
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "**/test/**", "**/tests/**"],
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    
    // Report any invalid exports, i.e. re-export of the same name
    "import/export": "error",
    
    // Ensure consistent use of file extension within the import path
    "import/extensions": ["error", "never", { 
      "json": "always", 
      "css": "always", 
      "scss": "always", 
      "svg": "always" 
    }],
    
    // Prefer named exports to be grouped together
    "import/group-exports": "warn",
    
    // Make sure imports point to files/modules that can be resolved
    "import/no-unresolved": "error",
    
    // Prevent unnecessary path segments in import and require statements
    "import/no-useless-path-segments": "error",
    
    // Prevent import of modules using absolute paths
    "import/no-absolute-path": "error",
    
    // Ensure imports point to a file/module that can be resolved
    "import/no-self-import": "error",
    
    // Forbid import of modules using absolute paths
    "import/no-absolute-path": "error",
    
    // Forbid a module from importing itself
    "import/no-self-import": "error",
    
    // Prevent unnecessary path segments in import and require statements
    "import/no-useless-path-segments": ["error", { "commonjs": true }],
    
    // Prevent a module from importing itself
    "import/no-cycle": ["error", { "maxDepth": 1 }],
    
    // NEW: Enforce a consistent style for all imports, allowing caching to be effective
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    
    // NEW: Enforce first-level imports to be explicitly sorted according to a convention
    "sort-imports": ["error", {
      "ignoreCase": true,
      "ignoreDeclarationSort": true, // We use import/order for declarations
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": true
    }],
    
    // NEW: Prevent using an exported name as the locally imported name of a default export
    "import/no-named-as-default": "error",
    
    // NEW: Prevent using a default export as a property of the named import
    "import/no-named-as-default-member": "error",
    
    // NEW: Prevent imports to folders without pointing to the index file
    "import/no-useless-path-segments": ["error", { "noUselessIndex": true }],
    
    // NEW: Prevent dynamic requires
    "import/no-dynamic-require": "error",
    
    // NEW: Enforce all imports to appear before non-import statements
    "import/first": "error",
    
    // NEW: Enforce a newline after import statements
    "import/newline-after-import": "error",
    
    // NEW: Prevent import statements that don't import anything
    "import/no-empty-named-blocks": "error",
    
    // NEW: Prevent importing the submodules of other modules
    "import/no-internal-modules": ["error", {
      "allow": ["@/*/**", "**/index", "**/dist/**"]
    }],
    
    // NEW: Prefer named exports
    "import/prefer-default-export": "off",
    "import/no-default-export": "warn",
    
    // NEW: Forbid modules without exports, or exports without matching import in another module
    "import/no-unused-modules": ["warn", {
      "unusedExports": true,
      "missingExports": true,
      "ignoreExports": ["**/index.ts", "**/*.d.ts"]
    }],
    
    // NEW: Prevent ambiguous exports
    "import/export": ["error", { "detectAmbiguousExports": true }],
    
    // NEW: Enforce that each module gets re-exported once
    "import/no-duplicates": "error"
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
