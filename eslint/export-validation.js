
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
    
    // NEW: Check for missing exports when imported
    "import/named": "error",
    
    // NEW: Prevent ambiguous re-exports
    "import/export": "error",
    
    // NEW: Enforce exports are grouped together at the end of the file
    "import/group-exports": "warn",
    
    // NEW: Prefer named exports to be grouped in a declaration
    "import/no-duplicates": "error",
    
    // NEW: Ensure imports resolve to a file/module
    "import/no-unresolved": ["error", { "commonjs": true }],
    
    // NEW: Check if the imported module has the imported name as an export
    "import/namespace": ["error", { "allowComputed": true }],
    
    // NEW: Ensure imports point to files/modules that can be resolved
    "import/no-self-import": "error",
    
    // ADDED: Prevent duplicate exports across files or within a file
    "import/export": "error",
    
    // ADDED: Enforce naming convention for exports to avoid conflicts
    "import/no-named-export": "off",
    
    // ADDED: Ensure default export is only imported as default import
    "import/default": "error",
    
    // ADDED: Warn on potential namespace confusion in exports
    "import/namespace": "error",
    
    // ADDED: Prevent excessive re-exports that can lead to ambiguity
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.test.ts", "**/*.spec.ts", "**/tests/**"],
      "optionalDependencies": false,
      "peerDependencies": false
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
