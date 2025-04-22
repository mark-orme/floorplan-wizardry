
/**
 * Import/export ESLint rules
 * Controls how modules can be imported and exported
 * @module eslint/import-rules
 */
export const importRules = {
  plugins: ["import"],
  rules: {
    // Prevent importing missing modules
    "import/no-unresolved": "error",
    
    // Ensure named imports exist
    "import/named": "error",
    
    // Ensure proper namespace imports
    "import/namespace": ["error", { allowComputed: true }],
    
    // Prevent duplicate imports
    "import/no-duplicates": "error",
    
    // Control import order
    "import/order": ["error", {
      "groups": [["builtin", "external"], "internal", "parent", "sibling"],
      "pathGroups": [{
        "pattern": "@/**",
        "group": "internal"
      }],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],

    // Prevent importing extraneous dependencies
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/__tests__/**", "**/*.test.{ts,tsx}"]
    }]
  }
};
