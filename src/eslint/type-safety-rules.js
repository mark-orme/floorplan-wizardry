
/**
 * TypeScript safety rules
 * Prevents common errors with type safety
 * @module eslint/type-safety-rules
 */

module.exports = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent missing properties in object literals
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Ensure correctly typed function parameters
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Prevent unsafe member access
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent unsafe function calls
    "@typescript-eslint/no-unsafe-call": "error",
    
    // Ensure explicit return types for functions
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }
    ],
    
    // Prevent the use of any type
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Ensure all properties have defined types
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "no-public",
        "overrides": {
          "properties": "explicit"
        }
      }
    ],
    
    // Ensure proper type imports
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports"
      }
    ],
    
    // Ensure proper handling of promises
    "@typescript-eslint/no-floating-promises": "error",
    
    // Prevent assigning to parameters
    "@typescript-eslint/no-parameter-properties": "off",
    
    // Ensure type compatibility for callbacks
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Function": {
            "message": "Use a more specific type like () => void"
          }
        }
      }
    ]
  }
};
