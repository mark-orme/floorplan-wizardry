
/**
 * Enhanced ESLint rules to enforce safety in AI-generated code
 * Helps prevent common issues in AI-assisted development
 * 
 * @module eslint/typescript/ai-code-safety-enhanced-rules
 */
export const aiCodeSafetyEnhancedRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent type confusion in AI-generated code
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Ensure type safety for canvas operations
    "no-restricted-syntax": [
      "error",
      // Prevent improper Canvas usage
      {
        "selector": "CallExpression[callee.object.name='canvas'][callee.property.name='add'][arguments.length=0]",
        "message": "Canvas.add() requires at least one object"
      },
      // Enforce proper event listeners
      {
        "selector": "CallExpression[callee.property.name='on'][arguments.0.type='Literal']:not([arguments.1.type='ArrowFunctionExpression']):not([arguments.1.type='FunctionExpression'])",
        "message": "Event listeners should use arrow functions or function expressions"
      },
      // Prevent improper Line constructors
      {
        "selector": "NewExpression[callee.name='Line']:not([arguments.0.type='ArrayExpression'])",
        "message": "Line constructor requires coordinates array [x1, y1, x2, y2]"
      },
      // Enforce proper tests
      {
        "selector": "CallExpression[callee.name='describe'][arguments.length<2]",
        "message": "describe() requires a test name and a callback function"
      },
      {
        "selector": "CallExpression[callee.name='it'][arguments.length<2]",
        "message": "it() requires a test name and a callback function"
      },
      // Enforce proper component props
      {
        "selector": "JSXElement[openingElement.name.name=/^[A-Z]/][openingElement.attributes.length=0]:not([openingElement.name.name=/^(Fragment|>|React.Fragment)$/])",
        "message": "Component is missing props. Check if required props should be provided."
      },
      // Prevent common Fabric.js errors
      {
        "selector": "MemberExpression[object.name='FabricEventTypes']",
        "message": "Use FabricEventNames from '@/types/fabric-events' instead of FabricEventTypes"
      }
    ],
    
    // Enforce proper test patterns
    "testing-library/no-wait-for-empty-callback": "error",
    "testing-library/prefer-screen-queries": "error",
    "testing-library/no-node-access": "error",
    
    // Enforce proper hook patterns
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    
    // Enforce proper typing in tests
    "@typescript-eslint/explicit-function-return-type": ["error", { 
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true 
    }],
    
    // Prevent using undeclared variables in tests
    "no-undef": "error",
    
    // Enforce proper vi usage
    "vitest/no-identical-title": "error",
    "vitest/prefer-to-be": "error",
    "vitest/valid-expect": "error",
    
    // Ban problematic types
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Object": { "message": "Use 'object' or '{}' instead" },
          "Function": { "message": "Use specific function type instead" },
          "any": { "message": "Use unknown instead" }
        }
      }
    ],
    
    // Enforce proper imports
    "import/no-duplicates": "error",
    "import/no-unresolved": "error",
    "import/named": "error",
    
    // Enforce consistent naming
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"]
      },
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      },
      {
        "selector": "enum",
        "format": ["PascalCase"]
      }
    ],
    
    // Prevent common prop errors
    "react/prop-types": "off", 
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    
    // Prevent non-existent exports
    "import/named": "error",
    "import/default": "error",
    "import/namespace": "error"
  }
};
