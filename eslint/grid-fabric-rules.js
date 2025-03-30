
/**
 * Grid and Fabric specific ESLint rules
 */

/** @type {import('eslint').Linter.FlatConfig} */
export const gridFabricRules = {
  name: "grid-fabric-rules",
  rules: {
    // Prevent duplicate exports
    "no-dupe-class-members": "error",
    "import/export": "error",
    "import/no-duplicates": "error",
    "no-redeclare": "error", // Add this rule to prevent redeclarations
    "no-dupe-exports": "error", // Add a specific rule for duplicate exports
    
    // Grid-specific rules
    "no-empty-function": ["error", { "allow": ["arrowFunctions"] }],
    "no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used", 
      "ignoreRestSiblings": true,
      "argsIgnorePattern": "^_"
    }],
    
    // Prevent mistypes in grid objects
    "no-dupe-keys": "error",
    
    // Enforce proper function returns
    "consistent-return": ["error", { "treatUndefinedAsUnspecified": true }],
    
    // Enforce proper TypeScript typing
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-duplicate-exports": "error", // Add this rule to prevent duplicate exports in TS
    
    // Enforce proper Canvas API usage
    "no-undef": "error"
  }
};
