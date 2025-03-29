
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
    "import/no-dynamic-require": "warn"
  }
};
