
/**
 * Stricter code rules for preventing common errors
 * Helps catch issues early during development
 * @module eslint/stricter-code-rules
 */

module.exports = {
  rules: {
    // Prevent using the wrong number of arguments in function calls
    "no-unexpected-multiline": "error",
    
    // Ensure all parameters are used in functions
    "no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used",
      "ignoreRestSiblings": true,
      "argsIgnorePattern": "^_" 
    }],
    
    // Prevent misuse of promises
    "no-floating-promises": "error",
    
    // Enforce Promise error handling
    "promise/catch-or-return": "error",
    "promise/no-new-statics": "error",
    "promise/no-return-wrap": "error",
    
    // Prevent common type issues
    "@typescript-eslint/no-misused-promises": "error", 
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-for-in-array": "error",
    
    // Check argument counts and types
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // Prevent referencing undefined variables
    "no-undef": "error",
    
    // Verify callback signature compatibility
    "@typescript-eslint/unbound-method": "error",
    
    // Enforce proper return types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true,
      "allowDirectConstAssertionInArrowFunctions": true
    }],
    
    // Prevent extraneous dependencies
    "import/no-extraneous-dependencies": "error",
    
    // Enforce import order and prevent cycles
    "import/no-cycle": "error",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "pathGroups": [
        {
          "pattern": "@/**",
          "group": "internal"
        }
      ],
      "newlines-between": "always"
    }],
    
    // NEW RULES TO PREVENT SIMILAR ISSUES:
    
    // Ensure that all function calls have the correct number of arguments
    "@typescript-eslint/no-confusing-void-expression": "error",
    
    // Ensure exported types use 'export type' with isolatedModules
    "@typescript-eslint/consistent-type-exports": ["error", { 
      "fixMixedExportsWithInlineTypeSpecifier": true 
    }],
    
    // Prevent missing imports or exports
    "import/named": "error",
    "import/no-unresolved": "error",
    "import/default": "error",
    "import/namespace": "error",
    
    // Ensure components are defined before they are used
    "react/jsx-no-undef": "error",
    
    // Ensure proper promise usage
    "@typescript-eslint/prefer-promise-reject-errors": "error",
    
    // Enforce explicit parameter types in functions
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      "allowArgumentsExplicitlyTypedAsAny": false,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowHigherOrderFunctions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // Enforce consistent function type assertions
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Prevent potential null reference errors
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Enforce consistent export naming
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "exportedFunction",
        "format": ["camelCase", "PascalCase"]
      },
      {
        "selector": "exportedVariable",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"]
      }
    ]
  }
};
