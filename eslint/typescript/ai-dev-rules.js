
/**
 * AI and Developer TypeScript ESLint rules
 * Special rules to guide AI code generation and human developers
 * @module eslint/typescript/ai-dev-rules
 */
export const aiDevRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Strict TypeScript validation - preventing any and never types
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/ban-types": "error", // Ban {} and Object types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    
    // Prevent type safety issues
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // Enforce proper handling of promises
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    
    // Enforce proper optional chaining and nullish coalescing
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    
    // Enforce proper type assertions with Record<string, unknown> instead of any
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow"
    }],
    
    // New rule to prevent DrawingTool/DrawingMode incompatibility
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSTypeReference[typeName.name='DrawingTool'][typeName.type='Identifier'] + TSTypeReference[typeName.name='DrawingMode'][typeName.type='Identifier']",
        "message": "DrawingTool and DrawingMode should be compatible types. Make sure DrawingTool is defined as type DrawingTool = DrawingMode."
      },
      {
        "selector": "TSTypeReference[typeName.name='DrawingMode'][typeName.type='Identifier'] + TSTypeReference[typeName.name='DrawingTool'][typeName.type='Identifier']",
        "message": "DrawingTool and DrawingMode should be compatible types. Make sure DrawingTool is defined as type DrawingTool = DrawingMode."
      },
      {
        "selector": "ImportDeclaration[source.value=/drawingTypes/] > ImportSpecifier[imported.name='DrawingTool']",
        "message": "Import DrawingTool only from '@/types/core/DrawingTool' for consistency"
      },
      {
        "selector": "MemberExpression[object.name='DrawingTool']",
        "message": "Use DrawingMode enum instead of DrawingTool for consistent typing"
      },
      {
        "selector": "TSTypeReference[typeName.name='DrawingTool'][typeName.type='Identifier']",
        "message": "Use the canonical DrawingTool type from '@/types/core/DrawingTool'"
      },
      {
        "selector": "CallExpression[callee.name='snapPointToGrid'][arguments.length<1]",
        "message": "snapPointToGrid requires at least one point argument."
      },
      {
        "selector": "CallExpression[callee.name='createPoint'][arguments.length!=2]",
        "message": "createPoint requires exactly two arguments: x and y."
      },
      {
        "selector": "MemberExpression[object.name='GRID_CONSTANTS'][property.name!=/^(SMALL_GRID_SIZE|LARGE_GRID_SIZE|SMALL_GRID_COLOR|LARGE_GRID_COLOR|SMALL_GRID_WIDTH|LARGE_GRID_WIDTH|MIN_CANVAS_WIDTH|MIN_CANVAS_HEIGHT|GRID_SIZE|GRID_COLOR|MAJOR_GRID_COLOR|PIXELS_PER_METER|MARKER_TEXT_SIZE|MARKER_COLOR|MARKER_PADDING|MARKER_BACKGROUND|DEFAULT_SHOW_GRID|DEFAULT_SNAP_TO_GRID|MAX_CANVAS_WIDTH|MAX_CANVAS_HEIGHT)$/]",
        "message": "Invalid GRID_CONSTANTS property. Use only defined constants."
      }
    ],
    
    // Hook typing rules
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      "allowArgumentsExplicitlyTypedAsAny": false,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowHigherOrderFunctions": false,
      "allowTypedFunctionExpressions": false
    }],
    
    // Enforce proper use of the useState hook with explicit types
    "react-hooks/rules-of-hooks": "error",
    
    // Custom rule for enforcing proper hook props
    "custom/hook-props-validation": {
      "create": function(context) {
        return {
          "CallExpression[callee.name=/^use[A-Z]/]": function(node) {
            // Check for missing required props in common hooks
            const hookName = node.callee.name;
            const hookProps = node.arguments[0];
            
            // Skip if not an object expression or if there are no arguments
            if (!hookProps || hookProps.type !== "ObjectExpression") return;
            
            // Check for required properties based on hook name
            if (hookName === "useCanvasDrawing" || hookName === "usePathEvents") {
              const properties = hookProps.properties.map(p => p.key.name);
              const requiredProps = ["fabricCanvasRef", "tool"];
              
              for (const prop of requiredProps) {
                if (!properties.includes(prop)) {
                  context.report({
                    node,
                    message: `${hookName} requires the '${prop}' prop.`
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};
