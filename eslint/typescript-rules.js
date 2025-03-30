
/**
 * TypeScript specific ESLint rules
 * Enforces strict type checking and code quality for TypeScript files
 * @module eslint/typescript-rules
 */
export const typescriptRules = {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // Strict TypeScript validation
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-explicit-any": ["warn", { 
      ignoreRestArgs: true,
      allowExplicitAny: false
    }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { 
      ignoreRestSiblings: true,
      argsIgnorePattern: "^_" 
    }],
    
    // Enforce consistent type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: true
    }],
    
    // Property access safety
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // Promise handling
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    
    // Type assertion checks
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // Null checking
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    
    // Object literal type improvements
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Better error messages
    "@typescript-eslint/unified-signatures": "error",
    
    // Function overloads
    "@typescript-eslint/adjacent-overload-signatures": "error",
    
    // Prevent common mistakes
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/prefer-optional-chain": "warn",
    
    // Extra safety for grid and canvas operations
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      allowString: true,
      allowNumber: true,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false
    }],
    
    // Prevent duplicate exports
    "no-dupe-class-members": "error",
    "import/export": "error",
    "import/no-duplicates": "error",
    
    // NEW: Stricter grid-specific rules
    "@typescript-eslint/no-unnecessary-condition": ["warn", {
      allowConstantLoopConditions: true
    }],
    
    // NEW: Better type narrowing
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    
    // NEW: Property existence checking
    "@typescript-eslint/no-unnecessary-type-arguments": "warn",
    
    // NEW: Prevent potential bugs in grid code
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    
    // NEW: Prevent using non-existent properties on objects
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // NEW: Prevent type errors
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // NEW: Prevent array vs tuple confusion
    "@typescript-eslint/array-type": ["error", {
      "default": "array",
      "readonly": "array"
    }],
    
    // NEW: Require explicit tuple types when needed
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
    
    // NEW: Stricter property existence checking
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // NEW: Ensure optional chain usage where appropriate
    "@typescript-eslint/prefer-optional-chain": "warn",
    
    // NEW: Enforces exact object shapes
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    
    // NEW: Prevent explicit any
    "@typescript-eslint/no-explicit-any": ["warn", {
      "ignoreRestArgs": true
    }],
    
    // NEW: Ensure function parameter types are specified
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowHigherOrderFunctions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // NEW: Prevent unnecessary type assertions
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "never"
    }],
    
    // Enhanced property checking
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "property",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"],
        "filter": {
          "regex": "^(data-|aria-|type|id|[a-zA-Z]+Image|key|name|role|placeholder|label|title|alt|src|href|target|rel|value|min|max|required|disabled|readonly|checked|selected|multiple|size|pattern|minLength|maxLength|step|rows|cols|for|className|style)$",
          "match": false
        }
      }
    ],
    
    // NEW: Ensure proper Fabric.js imports
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='fabric']",
        "message": "Don't use the fabric namespace directly. Import specific components from 'fabric'."
      }
    ],
    
    // NEW: Enforce direct component imports for fabric.js
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["fabric"],
          "importNames": ["fabric"],
          "message": "Import specific components: import { Canvas, Line, Rect } from 'fabric' - not 'fabric.*'"
        }
      ]
    }],
    
    // NEW: Enhanced protection for fabric components
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "typeLike",
        "format": ["PascalCase"],
        "filter": {
          "regex": "^(Canvas|Object|Line|Rect|Circle|Ellipse|Polygon|Polyline|Path|Group|Text|IText|Textbox|Image|Triangle|Point)$",
          "match": true
        }
      },
      {
        "selector": "variable",
        "types": ["boolean"],
        "format": ["PascalCase"],
        "prefix": ["is", "has", "can", "should", "will", "did"]
      },
      {
        "selector": "property",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"],
        "filter": {
          "regex": "^(data-|aria-|type|id|[a-zA-Z]+Image|key|name|role|placeholder|label|title|alt|src|href|target|rel|value|min|max|required|disabled|readonly|checked|selected|multiple|size|pattern|minLength|maxLength|step|rows|cols|for|className|style)$",
          "match": false
        }
      }
    ],
    
    // NEW: Add strict type compatibility checking between DrawingTool and DrawingMode
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSTypeReference[typeName.name='DrawingTool']",
        "message": "Use DrawingMode instead of DrawingTool for consistent typing across the application."
      },
      {
        "selector": "ImportSpecifier[imported.name='DrawingTool'][local.name!='DrawingMode']",
        "message": "Import DrawingMode instead of DrawingTool for consistent typing across the application."
      },
      {
        "selector": "VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='DrawingTool']",
        "message": "Use DrawingMode type instead of DrawingTool for consistent typing across the application."
      }
    ],
    
    // NEW: Add rule to enforce using defined state initializers
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unnecessary-initializer": "warn",
    
    // NEW: Ensure all object properties are defined before use
    "@typescript-eslint/no-object-literal-type-assertion": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // NEW: Enforce checking for undefined values
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      "allowString": true,
      "allowNumber": true,
      "allowNullableObject": true,
      "allowNullableBoolean": false,
      "allowNullableString": false,
      "allowNullableNumber": false
    }]
  }
};
