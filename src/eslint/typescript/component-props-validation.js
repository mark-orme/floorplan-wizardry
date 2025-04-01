
/**
 * ESLint rules to enforce strict component props validation
 * Helps prevent common issues with component props
 * 
 * @module eslint/typescript/component-props-validation
 */
export const componentPropsValidationRules = {
  plugins: ["react", "@typescript-eslint"],
  rules: {
    // Validate component props
    "react/prop-types": "off", // Disable React prop-types in favor of TypeScript
    
    // Ensure components correctly use their props
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    
    // Prevent passing invalid props to components
    "react/jsx-no-undef": "error",
    
    // Enhanced component props validation
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    
    // Ensure props interface naming convention
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "filter": {
          "regex": "Props$",
          "match": true
        },
        "format": ["PascalCase"],
        "custom": {
          "regex": "Props$",
          "match": true
        }
      }
    ],
    
    // Prevent using non-existent props
    "no-restricted-syntax": [
      "error",
      {
        "selector": "JSXAttribute[name.name!=/^(className|style|id|data-|aria-|role|key|ref|dangerouslySetInnerHTML)/] > JSXExpressionContainer > Identifier",
        "message": "Verify this prop exists in the component's props interface"
      },
      {
        "selector": "JSXElement[openingElement.name.name=/^[A-Z]/] > JSXOpeningElement[attributes.length=0]",
        "message": "Component is rendered without props. Verify if required props are missing."
      }
    ],
    
    // Enforce consistent props usage
    "react/jsx-props-no-spreading": [
      "warn", 
      {
        "html": "ignore",
        "custom": "enforce", 
        "explicitSpread": "enforce"
      }
    ],
    
    // Enforce explicit return types for components
    "@typescript-eslint/explicit-function-return-type": [
      "error", 
      { 
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true,
        "allowConciseArrowFunctionExpressionsStartingWithVoid": false,
        "allowDirectConstAssertionInArrowFunctions": true,
        "allowFunctionsWithoutTypeParameters": false
      }
    ],
    
    // Enforce props destructuring
    "react/destructuring-assignment": ["warn", "always"],
    
    // Ensure prop types are sorted alphabetically for readability
    "react/jsx-sort-props": [
      "warn",
      {
        "callbacksLast": true,
        "shorthandFirst": true,
        "reservedFirst": true
      }
    ]
  }
};
