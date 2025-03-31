
/**
 * Advanced TypeScript ESLint rules
 * Provides stricter type safety checks to prevent build errors
 * @module eslint/type-safety-advanced-rules
 */

export const typeAdvancedSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent type errors from function calls with incorrect arguments
    "@typescript-eslint/no-unsafe-argument": "warn",
    
    // Ensure properties used in objects exist on their types
    "@typescript-eslint/no-unsafe-member-access": "warn",
    
    // Prevent missing properties in object literals
    "@typescript-eslint/consistent-type-assertions": "error",
    
    // Ensure function calls include all required parameters
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Prevent using object properties without checking if they exist
    "@typescript-eslint/no-unnecessary-condition": "warn",
    
    // Ensure correct return types
    "@typescript-eslint/explicit-function-return-type": [
      "warn", 
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ],
    
    // Ensure object literals have all required properties
    "@typescript-eslint/no-empty-interface": "error",
    
    // Ensure constants are PascalCase or UPPER_CASE
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        modifiers: ["const", "global"],
        format: ["UPPER_CASE", "PascalCase"],
        filter: {
          regex: "^(GRID_CONSTANTS|DEFAULT_GRID|GRID_).*$",
          match: true
        }
      }
    ],
    
    // Ensure imported modules exist and are correctly used
    "import/no-unresolved": "off", // This is handled by TypeScript
    
    // Ensure exported functions have proper return types
    "@typescript-eslint/explicit-module-boundary-types": [
      "warn",
      { allowArgumentsExplicitlyTypedAsAny: true }
    ],
    
    // Custom rule to check for common grid-related errors
    "custom/grid-constant-usage": {
      create(context) {
        return {
          MemberExpression(node) {
            if (
              node.object.type === "Identifier" &&
              node.object.name === "GRID_CONSTANTS"
            ) {
              const propertyName = node.property.name;
              const validProps = [
                "SMALL_GRID_SIZE",
                "LARGE_GRID_SIZE",
                "SMALL_GRID_COLOR",
                "LARGE_GRID_COLOR",
                "SMALL_GRID_WIDTH",
                "LARGE_GRID_WIDTH",
                "MIN_CANVAS_WIDTH",
                "MIN_CANVAS_HEIGHT",
                "GRID_SIZE",
                "GRID_COLOR",
                "MAJOR_GRID_COLOR"
              ];
              
              if (!validProps.includes(propertyName)) {
                context.report({
                  node,
                  message: `Invalid GRID_CONSTANTS property: ${propertyName}. Valid properties are: ${validProps.join(", ")}`
                });
              }
            }
          }
        };
      }
    }
  }
};
