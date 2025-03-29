
/**
 * TypeScript ESLint rules
 * @module eslint/typescript-rules
 */
export const typescriptRules = {
  files: ["**/*.{ts,tsx}"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  rules: {
    // Base rules
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": ["error", { "default": "array" }],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/ban-tslint-comment": "error",
    "@typescript-eslint/ban-types": "error",
    
    // Class/method rules
    "@typescript-eslint/class-literal-property-style": ["error", "fields"],
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow"
    }],
    
    // Type definition rules
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/consistent-type-exports": ["error", { "fixMixedExportsWithInlineTypeSpecifier": true }],
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowHigherOrderFunctions": true,
      "allowTypedFunctionExpressions": true,
      "allowDirectConstAssertionInArrowFunctions": true
    }],
    
    // Class member rules
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
      "overrides": {
        "constructors": "no-public"
      }
    }],
    
    // Module rules
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      "allowArgumentsExplicitlyTypedAsAny": false,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowHigherOrderFunctions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // Method rules
    "@typescript-eslint/method-signature-style": ["error", "property"],
    "@typescript-eslint/naming-convention": ["error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]
      },
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      },
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE", "PascalCase"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "function",
        "format": ["camelCase", "PascalCase"]
      },
      {
        "selector": "method",
        "format": ["camelCase"]
      },
      {
        "selector": "property",
        "format": ["camelCase", "UPPER_CASE", "PascalCase"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "parameterProperty",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "parameter",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "class",
        "format": ["PascalCase"]
      }
    ],
    
    // Import/export rules
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    
    // Error prevention rules
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unsafe-declaration-merging": "error",
    "@typescript-eslint/no-var-requires": "error",
    
    // Type annotation rules
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-enum-initializers": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-literal-enum-member": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    
    // Code style rules
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/unified-signatures": "error",
    
    // NEW: Stricter exports check
    "@typescript-eslint/consistent-type-exports": ["error", {
      "fixMixedExportsWithInlineTypeSpecifier": true
    }],
    
    // NEW: Ensure exported functions have return types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowConciseArrowFunctionExpressionsStartingWithVoid": false
    }],
    
    // NEW: Ensure module boundary types
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      "allowArgumentsExplicitlyTypedAsAny": false,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowHigherOrderFunctions": true,
      "allowTypedFunctionExpressions": true
    }],
    
    // NEW: Enforce function overloads
    "@typescript-eslint/unified-signatures": "error",
    
    // NEW: Prevent invalid imports
    "@typescript-eslint/no-useless-empty-export": "error",
    
    // NEW: Restricted explicit any
    "@typescript-eslint/no-explicit-any": "warn",
    
    // NEW: No unsafe return
    "@typescript-eslint/no-unsafe-return": "error",
    
    // NEW: No unsafe call
    "@typescript-eslint/no-unsafe-call": "error",
    
    // NEW: No unsafe member access
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // NEW: No unsafe assignment
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // NEW: Ensure export exists and is correct
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "ignoreRestSiblings": true,
      "argsIgnorePattern": "^_",
      "destructuredArrayIgnorePattern": "^_"
    }]
  }
};
