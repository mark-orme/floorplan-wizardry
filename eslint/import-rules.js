
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
    "import/no-cycle": ["error", { "maxDepth": 1 }]
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
