
/**
 * TypeScript React-specific ESLint rules
 * Enforces best practices for React with TypeScript
 * @module eslint/typescript/react-rules
 */
export const reactTypescriptRules = {
  files: ["**/*.tsx"],
  rules: {
    // Add rule to enforce React hooks dependencies
    "react-hooks/exhaustive-deps": "warn",
    
    // Prevent JSX in .ts files - require .tsx extension
    "react/jsx-filename-extension": ["error", { "extensions": [".jsx", ".tsx"] }]
  }
};
