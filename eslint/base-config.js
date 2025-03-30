/**
 * Base ESLint configuration
 * Shared rules for all files
 * @module eslint/base-config
 */
export const baseConfig = {
  files: ["**/*.{js,ts,jsx,tsx}"],
  rules: {
    // Catching problematic patterns
    "no-console": ["warn", { allow: ["info", "warn", "error", "debug"] }],
    "no-alert": "error",
    "no-debugger": "warn",
    "no-var": "error",
    "prefer-const": "error", // Strengthened from warn to error
    "eqeqeq": ["error", "smart"],
    "curly": ["error", "all"],
    
    // Import rules to prevent runtime errors
    "import/no-unresolved": "error", // Added per request
    "no-unused-vars": "error", // Strengthened from warn to error
    "no-restricted-imports": ["error", {
      "paths": [
        {
          "name": "@/utils/grid/gridDebugUtils",
          "importNames": ["forceCreateGrid"],
          "message": "Make sure this function exists and is exported"
        },
        {
          "name": "@/types/floorPlanTypes",
          "importNames": ["FloorPlan"],
          "message": "Use FloorPlan from @/types/core/FloorPlan instead."
        },
        {
          "name": "@/utils/gridCreationUtils",
          "importNames": ["validateGrid", "createGridLayer", "createFallbackGrid", "createBasicEmergencyGrid"],
          "message": "Ensure these functions are properly exported from gridCreationUtils"
        },
        {
          "name": "./gridCreation",
          "importNames": ["createGridLayer", "createFallbackGrid", "createBasicEmergencyGrid"],
          "message": "Ensure these functions are properly exported from gridCreation"
        },
        {
          "name": "@/hooks/useCanvasState",
          "message": "Use DrawingTool from drawingTypes.ts instead."
        }
      ]
    }],
    
    // Style consistency
    "comma-dangle": ["error", "never"],
    "quotes": ["error", "double", { "avoidEscape": true }], // Strengthened from warn to error
    "semi": ["error", "always"], // Strengthened from warn to error
    
    // Best practices
    "arrow-body-style": ["error", "as-needed"], // Strengthened from warn to error
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "no-duplicate-imports": "error",
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
        "message": "setTimeout must always be invoked with two arguments."
      },
      {
        "selector": "Literal[value='hand']",
        "message": "Use DrawingTool.HAND instead of the string literal 'hand'"
      },
      {
        "selector": "Literal[value='straightLine']",
        "message": "Use DrawingTool.STRAIGHT_LINE instead of the string literal 'straightLine'"
      },
      {
        "selector": "CallExpression[callee.name='setTimeout']",
        "message": "Avoid raw setTimeout – use a util."
      },
      // NEW: Prevent common anti-patterns
      {
        "selector": "CallExpression[callee.name='JSON'][callee.property.name='parse'][arguments.0.type='Literal']",
        "message": "Don't use JSON.parse with a literal value. Use the object directly."
      },
      {
        "selector": "MemberExpression[object.name='document'][property.name='getElementById']",
        "message": "Use React refs instead of direct DOM manipulation."
      },
      {
        "selector": "MemberExpression[object.name='window'][property.name='location'][property.name='href']",
        "message": "Use React Router for navigation instead of directly manipulating window.location."
      },
      // NEW: Prevent direct DOM manipulation
      {
        "selector": "CallExpression[callee.object.name='document'][callee.property.name='querySelector']",
        "message": "Use React refs instead of direct DOM manipulation with querySelector."
      },
      // NEW: Prevent usage of problematic methods
      {
        "selector": "CallExpression[callee.property.name='forEach'][callee.object.property.name='children']",
        "message": "Use React.Children.forEach instead of directly iterating over children."
      },
      // NEW: Enforce architectural boundaries
      {
        "selector": "ImportDeclaration[source.value=/^\\.\\.\\/utils\\/canvas/][parent.source.value=/components\\/ui/]",
        "message": "UI components should not import canvas utilities directly. Use hooks or context instead."
      },
      // NEW: Prevent unsafe React patterns
      {
        "selector": "CallExpression[callee.name='useEffect'][arguments.length=1]",
        "message": "useEffect without dependencies array will run on every render. Add a dependency array."
      },
      // STRICT: No undeclared variables
      {
        "selector": "Identifier[name=/^[a-zA-Z][a-zA-Z0-9_]*$/]:not(ImportSpecifier *):not(ImportDefaultSpecifier *):not(ImportNamespaceSpecifier *):not(Property[method=true] > .key)",
        "message": "All variables must be properly declared before use."
      }
    ],
    
    // Enhancing code readability
    "max-lines-per-function": ["warn", { "max": 100, "skipBlankLines": true, "skipComments": true }],
    "complexity": ["warn", { "max": 10 }],
    
    // NEW: Enforce consistent code clarity
    "max-depth": ["error", 4],
    "max-nested-callbacks": ["error", 3],
    "max-params": ["warn", 5],
    "max-len": ["warn", { "code": 100, "ignoreComments": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
    
    // NEW: Prevent potential issues
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-return-await": "error",
    "no-promise-executor-return": "error",
    "no-param-reassign": "error",
    "no-sequences": "error",
    "no-shadow": "error",
    "no-throw-literal": "error",
    "no-unused-expressions": "error",
    "prefer-template": "warn",
    "prefer-arrow-callback": "warn",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "yoda": "error",
    
    // NEW: File structure rules
    "max-lines": ["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }],
    
    // NEW: Object/array patterns
    "prefer-object-spread": "warn",
    "object-shorthand": "warn",
    "array-callback-return": "error",
    "require-await": "error",
    
    // NEW: Memory leak prevention
    "react-hooks/exhaustive-deps": "error",
    
    // NEW: React performance optimization
    "react/jsx-no-bind": ["warn", {
      "allowArrowFunctions": true,
      "allowFunctions": false,
      "allowBind": false
    }],
    
    // NEW: Error handling
    "no-unsafe-optional-chaining": "error",
    
    // NEW: Early returns for better readability
    "no-else-return": ["error", { "allowElseIf": false }],
    
    // NEW: String concatenation safety
    "no-useless-concat": "error",
    
    // NEW: Async/await consistency
    "no-async-promise-executor": "error",
    "no-await-in-loop": "warn",
    
    // NEW: Prevent common logic errors
    "no-constant-binary-expression": "error",
    "no-constant-condition": "error",
    "no-unreachable-loop": "error",
    "no-template-curly-in-string": "error",
    
    // NEW: Force consistent error handling
    "handle-callback-err": ["error", "^(err|error|errorMessage)$"],
    
    // NEW: Ensure error propagation
    "no-empty-function": ["error", { 
      "allow": ["arrowFunctions", "constructors"] 
    }],
    
    // NEW: Code reliability checks
    "no-constructor-return": "error",
    "no-new-native-nonconstructor": "error",
    "no-obj-calls": "error",
    "no-unmodified-loop-condition": "error",
    "require-atomic-updates": "error",
    
    // STRICT: Enforce explicit boolean comparisons
    "no-implicit-coercion": ["error", {
      "boolean": true,
      "number": true,
      "string": true
    }],
    
    // STRICT: Prevent potential memory leaks with event listeners
    "no-return-assign": ["error", "always"],
    
    // STRICT: Enforce consistent naming conventions
    "camelcase": ["error", { "properties": "never" }],
    
    // STRICT: Prevent assignment in conditionals
    "no-cond-assign": ["error", "always"],
    
    // STRICT: No unused variables with exceptions for prefixed unused params
    "no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used",
      "argsIgnorePattern": "^_",
      "caughtErrors": "all",
      "ignoreRestSiblings": true
    }],
    
    // STRICT: Prevent accidental boolean assignments
    "no-constant-condition": ["error", { "checkLoops": true }],

    // NEW: Enhance error prevention
    "no-fallthrough": "error",
    "no-case-declarations": "error",
    "no-irregular-whitespace": "error",
    "no-loss-of-precision": "error",
    "no-prototype-builtins": "error",
    "no-self-compare": "error",
    "no-unmodified-loop-condition": "error",
    "no-unreachable-loop": "error",
    "require-atomic-updates": "error",
    
    // NEW: Strengthen component architecture
    "react/no-array-index-key": "error",
    "react/jsx-key": "error",
    "react/jsx-fragments": ["error", "syntax"],
    "react/jsx-no-constructed-context-values": "error",
    "react/jsx-no-script-url": "error",
    "react/jsx-no-target-blank": "error",
    "react/no-danger": "error",
    
    // NEW: Enhance code maintainability
    "prefer-template": "error",
    "spaced-comment": ["error", "always"],
    "no-multi-assign": "error",
    "no-nested-ternary": "error",
    "no-unneeded-ternary": "error",
    "multiline-comment-style": ["warn", "starred-block"],
    
    // NEW: Ensure proper callback handling
    "callback-return": ["error", ["callback", "cb", "next", "done"]],
    "handle-callback-err": ["error", "^(err|error|errorMessage)$"],
    "prefer-promise-reject-errors": "error",
    
    // NEW: Enforce consistent module patterns
    "sort-imports": ["error", {
      "ignoreCase": true,
      "ignoreDeclarationSort": true, // We use import/order for declarations
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": true
    }],
    
    // NEW: Prevent React optimization issues
    "react/jsx-no-bind": ["warn", {
      "allowArrowFunctions": true,
      "allowFunctions": false,
      "allowBind": false
    }],
    
    // NEW: Enforce strong typing practices
    "no-implicit-coercion": "error",
    "radix": "error",
    
    // NEW: Enforce proper JSX syntax
    "react/jsx-closing-tag-location": "error",
    "react/jsx-closing-bracket-location": "error",
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
    "react/jsx-curly-spacing": ["error", { "when": "never" }],
    "react/jsx-equals-spacing": ["error", "never"],
    "react/jsx-pascal-case": "error",
    
    // NEW: Prevent common regex issues
    "no-regex-spaces": "error",
    "no-control-regex": "error",
    "no-empty-character-class": "error",
    "no-invalid-regexp": "error",
    
    // NEW: Syntax error prevention
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-func-assign": "error",
    "no-inner-declarations": "error",
    "no-redeclare": "error",
    "no-undef": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    
    // ENHANCED: Syntax and parsing error prevention
    "no-misleading-character-class": "error",
    "no-new-symbol": "error",
    "no-sparse-arrays": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "valid-typeof": ["error", { "requireStringLiterals": true }],
    
    // ENHANCED: Code structure safety
    "no-lone-blocks": "error",
    "no-useless-catch": "error",
    "no-useless-return": "error",
    "require-yield": "error",
    
    // ENHANCED: TypeScript-specific syntax rules (when not using the TypeScript plugin)
    "no-this-before-super": "error",
    "constructor-super": "error",
    "no-class-assign": "error",
    "no-const-assign": "error",
    "no-new-object": "error",
    
    // ENHANCED: React JSX specific rules for syntax correctness
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-unknown-property": "error",
    "react/no-string-refs": "error",
    
    // ENHANCED: Bracket and parenthesis completion rules
    "jsx-quotes": ["error", "prefer-double"],
    "no-extra-parens": ["error", "all", { 
      "ignoreJSX": "all",
      "enforceForArrowConditionals": false,
      "nestedBinaryExpressions": false
    }],
    "no-extra-semi": "error",
    
    // ENHANCED: String syntax validation
    "no-multi-str": "error",
    "no-new-wrappers": "error",
    
    // ENHANCED: Regular expression safety
    "no-div-regex": "error",
    "no-irregular-whitespace": ["error", { 
      "skipStrings": true, 
      "skipComments": true, 
      "skipRegExps": true, 
      "skipTemplates": true 
    }],
    
    // ENHANCED: Prevent syntax errors in JSX
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "off", // for React 17+
    
    // NEW: Enforce balanced JSX tags and parentheses
    "react/jsx-closing-bracket-location": "error",
    "react/jsx-closing-tag-location": "error", 
    "react/jsx-tag-spacing": ["error", {
      "closingSlash": "never",
      "beforeSelfClosing": "always",
      "afterOpening": "never",
      "beforeClosing": "never"
    }],
    
    // NEW: Regular expression validation
    "prefer-regex-literals": "error",
    "no-regex-spaces": "error",
    "no-control-regex": "error",
    
    // NEW: Syntax completeness checks
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "no-unused-expressions": ["error", { 
      "allowShortCircuit": true, 
      "allowTernary": true,
      "allowTaggedTemplates": true 
    }],
    
    // NEW: Enforce proper variable declaration and usage
    "block-scoped-var": "error",
    "guard-for-in": "error",
    "no-use-before-define": ["error", { 
      "functions": false, 
      "classes": true, 
      "variables": true 
    }],
    
    // NEW: Additional JSX syntax checks
    "react/jsx-wrap-multilines": ["error", {
      "declaration": "parens-new-line",
      "assignment": "parens-new-line",
      "return": "parens-new-line",
      "arrow": "parens-new-line",
      "condition": "parens-new-line",
      "logical": "parens-new-line",
      "prop": "parens-new-line"
    }],
    
    // NEW: Regular expression literal safety
    "no-empty-pattern": "error",
    "no-empty-character-class": "error",
    "no-control-regex": "error",
    
    // NEW: Enforcement of proper statement structure
    "no-lone-blocks": "error",
    "no-lone-blocks": "error",
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "space-before-blocks": ["error", "always"],
    
    // NEW: Balancing of brackets and parentheses
    "template-curly-spacing": ["error", "never"],
    "array-bracket-spacing": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "computed-property-spacing": ["error", "never"],
    "no-whitespace-before-property": "error",
    
    // NEW: Prevent JSX in .ts files - require .tsx extension for files with JSX
    "react/jsx-filename-extension": ["error", { "extensions": [".jsx", ".tsx"] }]
  }
};
