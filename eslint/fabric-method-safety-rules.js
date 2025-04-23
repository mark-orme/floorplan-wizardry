
/**
 * ESLint rules for safe Fabric.js method usage
 * Helps prevent common errors when using Fabric.js methods
 * @module eslint/fabric-method-safety-rules
 */
export const fabricMethodSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent direct function calls without existence checks
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.property.name=/^(sendToBack|bringToFront|sendObjectToBack|bringObjectToFront)$/]",
        "message": "Always check if this method exists before calling it. Use: if (typeof obj.method === 'function') { obj.method() }"
      },
      {
        "selector": "CallExpression[callee.property.name='renderAll']:not(IfStatement CallExpression[callee.property.name='renderAll'])",
        "message": "Wrap canvas.renderAll() calls in a try/catch block to prevent crashes"
      }
    ],
    
    // Ensure proper error handling for Fabric operations
    "@typescript-eslint/no-unsafe-call": ["error", {
      "avoidErrorLiterals": true
    }],
    
    // Prevent direct property access without checks
    "no-prototype-builtins": "error",
    
    // Encourage using optional chaining for method calls
    "@typescript-eslint/prefer-optional-chain": "warn",
    
    // Ensure type checking before using methods
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }]
  }
};
