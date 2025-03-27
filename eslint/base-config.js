
/**
 * Base ESLint configuration
 * Shared rules for all files
 * @module eslint/base-config
 */
export const baseConfig = {
  files: ["**/*.{js,ts,jsx,tsx}"],
  rules: {
    // Catching problematic patterns
    "no-console": ["warn", { allow: ["info", "warn", "error", "debug"] }],
    "no-alert": "error",
    "no-debugger": "warn",
    "no-var": "error",
    "prefer-const": "warn",
    "eqeqeq": ["error", "smart"],
    "curly": ["error", "all"],
    
    // Import rules to prevent runtime errors
    "import/no-unresolved": "error",
    "no-unused-vars": "warn",
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "@/utils/grid/gridDebugUtils",
        "importNames": ["forceCreateGrid"],
        "message": "Make sure this function exists and is exported"
      }]
    }],
    
    // Style consistency
    "comma-dangle": ["error", "never"],
    "quotes": ["warn", "double", { "avoidEscape": true }],
    "semi": ["warn", "always"],
    
    // Best practices
    "arrow-body-style": ["warn", "as-needed"],
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "no-duplicate-imports": "error",
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
        "message": "setTimeout must always be invoked with two arguments."
      }
    ],
    
    // Enhancing code readability
    "max-lines-per-function": ["warn", { "max": 100, "skipBlankLines": true, "skipComments": true }],
    "complexity": ["warn", { "max": 10 }]
  }
};
