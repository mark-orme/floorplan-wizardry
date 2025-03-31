
/**
 * TypeScript safety-focused ESLint rules
 * Rules that help prevent runtime errors and type-related bugs
 * @module eslint/typescript/safety-rules
 */
export const typeSafetyRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Property access safety
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Promise handling
    "@typescript-eslint/no-misused-promises": ["error", { 
      "checksVoidReturn": true 
    }],
    "@typescript-eslint/no-floating-promises": "error",
    
    // Type assertion checks
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // Null checking
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    
    // Extra safety for grid and canvas operations
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      allowString: true,
      allowNumber: true,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false
    }],
    
    // Better type narrowing
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    
    // Property existence checking
    "@typescript-eslint/no-unnecessary-type-arguments": "warn",
    
    // Prevent potential bugs
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    
    // Require explicit tuple types when needed
    "@typescript-eslint/typedef": ["error", {
      "arrayDestructuring": false,
      "arrowParameter": false,
      "memberVariableDeclaration": false,
      "objectDestructuring": false,
      "parameter": false,
      "propertyDeclaration": false,
      "variableDeclaration": false,
      "variableDeclarationIgnoreFunction": false
    }],
    
    // Ensure optional chain usage where appropriate
    "@typescript-eslint/prefer-optional-chain": "warn",
    
    // Enforces exact object shapes
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    
    // Prevent explicit any
    "@typescript-eslint/no-explicit-any": ["warn", {
      "ignoreRestArgs": true
    }]
  }
};
