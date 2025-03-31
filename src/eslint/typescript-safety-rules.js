
/**
 * Custom TypeScript safety ESLint rules
 * Helps prevent common TypeScript errors
 * @module eslint/typescript-safety-rules
 */

module.exports = {
  rules: {
    // Prevent usage of any - changed from warn to error as requested
    "@typescript-eslint/no-explicit-any": "error",
    
    // NEW: Prevent implicit any types
    "@typescript-eslint/no-implicit-any": "error",
    
    // Ensure proper typing of params and return values
    "@typescript-eslint/explicit-function-return-type": ["warn", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // Ensure consistent type definitions
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Prevent invalid type declarations
    "@typescript-eslint/no-invalid-void-type": "error",
    
    // Ensure proper async return types
    "@typescript-eslint/promise-function-async": "warn",
    
    // Prevent unsafe index access
    "@typescript-eslint/no-unsafe-member-access": "warn",
    
    // Prevent unnecessary type assertions
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    
    // Ensure proper property access
    "@typescript-eslint/restrict-template-expressions": ["error", {
      "allowNumber": true,
      "allowBoolean": true,
      "allowNullish": false
    }],
    
    // Ensure consistent type assertions
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow"
    }],
    
    // Enforce explicit accessibility modifiers
    "@typescript-eslint/explicit-member-accessibility": ["warn", {
      "accessibility": "explicit",
      "overrides": {
        "constructors": "no-public"
      }
    }],
    
    // Prevent type errors in dynamic property access
    "@typescript-eslint/dot-notation": ["error", {
      "allowIndexSignaturePropertyAccess": false
    }],
    
    // Ensure proper handling of optional properties
    "@typescript-eslint/no-unnecessary-condition": ["warn", {
      "allowConstantLoopConditions": true
    }],
    
    // NEW: Enforce prefer-const as requested
    "prefer-const": "error",
    
    // NEW: Prevent duplicate imports as requested
    "no-duplicate-imports": "error",
    
    // NEW: Ensure consistent return values as requested
    "consistent-return": "error",
    
    // NEW: Add rule to prevent property access without type assertion
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[computed=true][property.type='Identifier'][object.type=/ObjectExpression|ArrayExpression/]",
        "message": "Use proper type assertion when accessing properties dynamically: (obj as Record<string, unknown>)[key]"
      },
      {
        "selector": "AssignmentExpression[left.type='MemberExpression'][left.computed=true][left.property.type='Identifier'][left.object.type=/ObjectExpression|ArrayExpression/]",
        "message": "Use proper type assertion when assigning to dynamic properties: (obj as Record<string, unknown>)[key] = value"
      },
      {
        "selector": "ForOfStatement > MemberExpression[computed=true]",
        "message": "Use proper type assertion in loop iterations: (obj as Record<string, unknown>)[key]"
      },
      {
        "selector": "ForInStatement > AssignmentExpression[left.type='MemberExpression'][left.computed=true]",
        "message": "Use proper type assertion in for-in loops: (obj as Record<string, unknown>)[key]"
      }
    ]
  }
};
