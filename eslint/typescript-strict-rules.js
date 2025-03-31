
/**
 * Stricter TypeScript rules for the project
 * Enforces stronger type checking and prevents common pitfalls
 * 
 * @module eslint/typescript-strict-rules
 */

module.exports = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent using [] empty arrays where specific array types are expected
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/no-explicit-any": ["error", { "ignoreRestArgs": true }],
    
    // Ensure proper typing with generics
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // Enforce explicit return types for functions
    "@typescript-eslint/explicit-function-return-type": [
      "error", 
      { 
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }
    ],
    
    // Prevent mismatch in types for function parameters
    "@typescript-eslint/unified-signatures": "error",
    
    // Prevent misuse of Promises
    "@typescript-eslint/no-misused-promises": "error",
    
    // Enforce consistent type assertions
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        "assertionStyle": "as",
        "objectLiteralTypeAssertions": "never"
      }
    ],
    
    // Ensure array types are correctly defined
    "@typescript-eslint/array-type": ["error", { "default": "array" }],
    
    // Prevent accidental type widening
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    
    // Enforce proper nullish checking
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Prevent using object literals with incorrect property names
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Force explicit typing for object literals
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Check for missing exported types
    "@typescript-eslint/explicit-module-boundary-types": "error",
    
    // Check for unused variables
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    
    // Consistent indexed object style
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    
    // Enforce proper type checking
    "@typescript-eslint/no-floating-promises": "error",
    
    // Detect type imports that don't exist in the referenced module
    "@typescript-eslint/no-import-type-side-effects": "error",
    
    // Prevent implicit any
    "@typescript-eslint/no-implicit-any": "error",
    
    // Enforce const when variable is not reassigned
    "prefer-const": "error",
    
    // Prevent duplicate imports
    "no-duplicate-imports": "error",
    
    // Ensure return values are consistent
    "consistent-return": "error",
    
    // Prevent circular references
    "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }],
    "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }],
    
    // Prevent dynamic property access without type checking
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    
    // Prevent mutation of state objects without proper typing
    "no-restricted-syntax": [
      "error",
      {
        "selector": "AssignmentExpression[left.object.name=/state|setState/][left.property.name]",
        "message": "Use proper type assertion with 'as keyof StateType' when accessing dynamic properties on state objects"
      },
      {
        "selector": "MemberExpression[object.name='Line'] > ArrayExpression:first-child[elements.length!=4]",
        "message": "Fabric.js Line constructor requires exactly 4 numbers as first argument: [x1, y1, x2, y2]"
      },
      {
        "selector": "MemberExpression[property.name='set'][object.type='Identifier'][object.name=/^(point|Point)$/]",
        "message": "Fabric.js Point objects are immutable and don't have a 'set' method. Create a new Point instead."
      },
      {
        "selector": "BinaryExpression[operator='instanceof'][right.name='Touch']",
        "message": "Use type guards with proper interface matching instead of 'instanceof Touch'. Touch objects have specific required properties."
      },
      {
        "selector": "VariableDeclarator[id.name=/TouchRecord/] > ObjectExpression:not(:has(Property[key.name='identifier'])):not(:has(Property[key.name='clientX'])):not(:has(Property[key.name='clientY']))",
        "message": "Touch-like objects must include proper Touch properties (identifier, clientX, clientY)."
      },
      {
        "selector": "ImportDeclaration[source.value='@/types/core/Geometry'] > ImportSpecifier[imported.name=/^((?!Point|Size|Rectangle|Line|CanvasDimensions).)*$/]",
        "message": "Only import types that exist in Geometry.ts: Point, Size, Rectangle, Line, CanvasDimensions"
      }
    ]
  }
};
