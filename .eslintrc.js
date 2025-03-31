
/**
 * ESLint configuration
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    // Import custom TypeScript safety rules
    ...require('./src/eslint/typescript-safety-rules.js').rules,
    
    // Import custom grid type validation rules
    ...require('./eslint/grid-type-validation').gridTypeValidationRules.rules,
    
    // Additional core rules
    "prefer-const": "error",
    "no-duplicate-imports": "error",
    "consistent-return": "error",
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    
    // React specific rules
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error" // Changed from warn to error
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"]
};
