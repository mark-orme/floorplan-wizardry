/**
 * Import/export ESLint rules
 * Controls how modules can be imported and exported
 * @module eslint/import-rules
 */
export const importExportRules = {
  files: ["**/*.{js,ts,jsx,tsx}"],
  plugins: ["import", "sort-exports"],
  rules: {
    // Ensure imports point to files/modules that exist
    "import/no-unresolved": "error", // Modified to error as per request
    
    // Ensure named imports correspond to a named export
    "import/named": "error",
    
    // Ensure default import corresponds to a default export
    "import/default": "error",
    
    // Ensure imported namespaces contain the properties
    "import/namespace": "error",
    
    // Ensure a default export is present for default imports
    "import/no-default-export": "off",
    
    // Restrict which files can be imported in a given folder
    "import/no-restricted-paths": "off",
    
    // Prevent importing the submodules of other modules
    "import/no-internal-modules": "off",
    
    // Warn on cyclic dependencies
    "import/no-cycle": ["warn", { maxDepth: 10 }],
    
    // Prevent unnecessary path segments
    "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
    
    // Prevent importing packages with peer dependencies problems
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: [
        "**/*.test.{js,ts,jsx,tsx}",
        "**/*.spec.{js,ts,jsx,tsx}",
        "**/__tests__/**/*.{js,ts,jsx,tsx}",
        "**/jest.config.js",
        "**/eslint/**"
      ],
      optionalDependencies: false,
      peerDependencies: false
    }],
    
    // Prevent importing mutables
    "import/no-mutable-exports": "error",
    
    // Control import of specific files
    "import/no-restricted-import": "off",
    
    // Group imports by type
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling"],
        "index",
        "object",
        "type"
      ],
      "pathGroups": [
        { 
          "pattern": "react", 
          "group": "builtin", 
          "position": "before" 
        },
        { 
          "pattern": "@/**", 
          "group": "internal", 
          "position": "after" 
        }
      ],
      "pathGroupsExcludedImportTypes": ["react"],
      "newlines-between": "always",
      "alphabetize": { 
        "order": "asc", 
        "caseInsensitive": true 
      }
    }],
    
    // Prefer named exports
    "import/prefer-default-export": "off",
    
    // Prevent invalid exports (dupe, default, named)
    "import/export": "error",
    
    // ENHANCED: Ensure all exports are used
    "import/no-unused-modules": ["warn", {
      "unusedExports": true,
      "missingExports": true,
      "ignoreExports": [
        "**/index.{js,ts,jsx,tsx}",
        "**/*.d.ts",
        "**/eslint/**",
        "**/*.test.{js,ts,jsx,tsx}",
        "**/__tests__/**",
        "**/types/**"
      ]
    }],
    
    // ENHANCED: Prevent self imports
    "import/no-self-import": "error",
    
    // ENHANCED: Prevent useless re-exports
    "import/no-useless-path-segments": ["error", {
      "noUselessIndex": true
    }],
    
    // ENHANCED: Check for missing file extensions
    "import/extensions": ["error", "ignorePackages", {
      "js": "never",
      "jsx": "never",
      "ts": "never",
      "tsx": "never"
    }],
    
    // ENHANCED: Ensure consistent use of file extension
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    
    // ENHANCED: Sort imports alphabetically within groups
    "sort-imports": ["error", {
      "ignoreCase": true,
      "ignoreDeclarationSort": true,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": true
    }],
    
    // NEW: Prevent importing from same directory with path
    "import/no-relative-parent-imports": "off",
    
    // NEW: Ensure declaration order is correct
    "import/first": "error",
    
    // NEW: Ensure new line after imports
    "import/newline-after-import": ["error", { "count": 1 }],
    
    // NEW: Ensure exports at the end of the file
    "import/exports-last": "warn",
    
    // NEW: Check for missing exports
    "import/default": "error",
    
    // NEW: Check for namespace imports
    "import/namespace": ["error", { "allowComputed": true }],
    
    // NEW: Prefer using the export keyword over module.exports
    "import/no-commonjs": "error",
    
    // NEW: Prevent anonymous default exports
    "import/no-anonymous-default-export": ["error", {
      "allowArray": false,
      "allowArrowFunction": false,
      "allowAnonymousClass": false,
      "allowAnonymousFunction": false,
      "allowCallExpression": true,
      "allowLiteral": false,
      "allowObject": false
    }]
  }
};
