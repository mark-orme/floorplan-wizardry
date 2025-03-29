
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
    "prefer-const": "warn",
    "eqeqeq": ["error", "smart"],
    "curly": ["error", "all"],
    
    // Import rules to prevent runtime errors
    "import/no-unresolved": "error",
    "no-unused-vars": "warn",
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "@/utils/grid/gridDebugUtils",
        "importNames": ["forceCreateGrid"],
        "message": "Make sure this function exists and is exported"
      },
      {
        "name": "@/types/floorPlanTypes",
        "importNames": ["FloorPlan"],
        "message": "Use FloorPlan from @/types/core/FloorPlan instead."
      }]
    }],
    
    // Style consistency
    "comma-dangle": ["error", "never"],
    "quotes": ["warn", "double", { "avoidEscape": true }],
    "semi": ["warn", "always"],
    
    // Best practices
    "arrow-body-style": ["warn", "as-needed"],
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
    "require-atomic-updates": "error"
  }
};
