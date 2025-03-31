
/**
 * Advanced TypeScript type safety rules
 * Helps prevent common type errors and build failures
 * @module eslint/type-safety-advanced-rules
 */
export const typeAdvancedSafetyRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent using imports that don't exist
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Enforce using type imports to avoid circular dependencies
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": false
    }],
    
    // Enforce consistent interfaces
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Prevent accidental any types
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Ensure function return types are declared
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    
    // Ensure all props are used
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "ignoreRestSiblings": true,
      "argsIgnorePattern": "^_"
    }],
    
    // Enforce naming conventions for increased clarity
    "@typescript-eslint/naming-convention": [
      "error",
      // Interface names must start with I
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]
      },
      // Type names must be PascalCase
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      },
      // Enum names must be PascalCase
      {
        "selector": "enum",
        "format": ["PascalCase"]
      },
      // Boolean props/vars should have is/has/should prefix
      {
        "selector": ["variable", "parameter", "property"],
        "types": ["boolean"],
        "format": ["PascalCase", "camelCase"],
        "prefix": ["is", "has", "should", "can", "did", "will"]
      }
    ],
    
    // Prevent unsafe type assertions
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "never"
    }],
    
    // Prevent assignment to imported variables
    "no-import-assign": "error",
    
    // Ensure proper error handling
    "@typescript-eslint/no-throw-literal": "error",
    
    // Enforce explicit accessibility modifiers
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
      "overrides": {
        "constructors": "no-public"
      }
    }],
    
    // Ensure proper async/await handling
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    
    // Ensure proper React props validation
    "react/prop-types": "off", // Use TypeScript instead
    "react/require-default-props": "off", // TypeScript handles this
    
    // Ensure default props are properly typed
    "react/default-props-match-prop-types": "off", // Use TypeScript instead
    
    // Ensure function components are properly typed
    "react/function-component-definition": ["error", {
      "namedComponents": "arrow-function",
      "unnamedComponents": "arrow-function"
    }],
    
    // Prevent imports/exports from missing files
    "import/no-unresolved": "error",
    
    // Ensure modules can be resolved
    "import/named": "error",
    "import/default": "error",
    "import/namespace": "error",
    
    // Prevent usage of variable before definition
    "no-use-before-define": "off", // TypeScript handles this
    "@typescript-eslint/no-use-before-define": ["error", {
      "functions": false,
      "classes": true,
      "variables": true
    }],
    
    // Prevent duplicate imports
    "import/no-duplicates": "error",
    
    // Ensure imports point to existing files
    "import/no-absolute-path": "error",
    "import/no-self-import": "error",
    "import/no-cycle": "error",
    "import/no-useless-path-segments": "error",
    
    // Enforce file extension consistency
    "import/extensions": ["error", "never", {
      "json": "always",
      "css": "always",
      "scss": "always"
    }],
    
    // Ensure no exported names are shadowed
    "import/export": "error",
    
    // Ensure proper ordering of imports
    "import/order": ["error", {
      "groups": ["builtin", "external", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    
    // Prevent unsafe string manipulation
    "@typescript-eslint/restrict-template-expressions": ["error", {
      "allowNumber": true,
      "allowBoolean": true,
      "allowAny": false,
      "allowNullish": false
    }],
    
    // Ensure correct use of optional chaining
    "@typescript-eslint/prefer-optional-chain": "error",
    
    // Custom rules to prevent specific import errors
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["*/utils/*"],
          "message": "Use specific import paths for utility functions."
        },
        {
          "group": ["@/utils/grid/gridRenderers", "!@/utils/grid/gridRenderers"],
          "message": "Import grid renderer functions directly from exports.ts."
        }
      ]
    }],
    
    // Prevent missing React imports
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    
    // Ensure event handlers are properly typed
    "react/jsx-no-bind": ["error", {
      "allowArrowFunctions": true,
      "allowFunctions": false,
      "allowBind": false
    }],
    
    // Ensure props are properly spread
    "react/jsx-props-no-spreading": "off",
    
    // Ensure components have proper display names
    "react/display-name": "error",
    
    // Ensure null checks before accessing properties
    "@typescript-eslint/no-unnecessary-condition": ["error", {
      "allowRuntimeChecks": true
    }]
  }
};
