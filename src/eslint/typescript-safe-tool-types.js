
/**
 * TypeScript safety rules for tool types
 * Prevents common errors related to input methods and event handling
 * @module eslint/typescript-safe-tool-types
 */

module.exports = {
  rules: {
    // Prevent comparisons between incompatible types
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowString": true,
      "allowNumber": true,
      "allowNullableObject": true,
      "allowNullableBoolean": false,
      "allowNullableString": false,
      "allowNullableNumber": false,
      "allowAny": false,
    }],
    
    // Prevent accidental use of 'unknown' string literal in type comparisons 
    "no-restricted-syntax": [
      "error",
      {
        "selector": "BinaryExpression[operator='==='][right.raw='\"unknown\"']",
        "message": "Avoid direct comparison with the string 'unknown'. Use a proper type guard instead."
      },
      {
        "selector": "BinaryExpression[operator='==='][left.raw='\"unknown\"']",
        "message": "Avoid direct comparison with the string 'unknown'. Use a proper type guard instead."
      },
      {
        "selector": "BinaryExpression[operator='!=='][right.raw='\"unknown\"']",
        "message": "Avoid direct comparison with the string 'unknown'. Use a proper type guard instead."
      },
      {
        "selector": "BinaryExpression[operator='!=='][left.raw='\"unknown\"']",
        "message": "Avoid direct comparison with the string 'unknown'. Use a proper type guard instead."
      }
    ],
    
    // Prevent using incompatible InputMethod types
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Ensure function calls have the expected number of arguments
    "@typescript-eslint/no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used",
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    
    // Ensure consistent exports
    "@typescript-eslint/consistent-type-exports": ["error", { 
      "fixMixedExportsWithInlineTypeSpecifier": true 
    }],
    
    // Prevent possible naming collisions in barrel exports
    "import/export": "error",
    "import/named": "error",
    "import/no-duplicates": "error",
    
    // Force explicit return types for functions
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }]
  }
};
