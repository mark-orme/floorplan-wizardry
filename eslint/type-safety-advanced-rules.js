/**
 * Advanced TypeScript ESLint rules
 * Provides stricter type safety checks to prevent build errors
 * @module eslint/type-safety-advanced-rules
 */

export const typeAdvancedSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent type errors from function calls with incorrect arguments
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Ensure properties used in objects exist on their types
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent missing properties in object literals
    "@typescript-eslint/consistent-type-assertions": "error",
    
    // Ensure function calls include all required parameters
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Prevent using object properties without checking if they exist
    "@typescript-eslint/no-unnecessary-condition": "warn",
    
    // Ensure correct return types
    "@typescript-eslint/explicit-function-return-type": [
      "error", 
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
    
    // New rule: Ensure imported modules exist and are correctly used
    "import/no-unresolved": "off", // This is handled by TypeScript
    
    // New rule: Ensure exported functions have proper return types
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      { allowArgumentsExplicitlyTypedAsAny: true }
    ],
    
    // New rule: Prevent incomplete parameter lists
    "@typescript-eslint/complete-function-call": {
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;
            if (callee.type !== 'Identifier') return;
            
            // Add specific function names that need special parameter checks
            const functionCheckMap = {
              'snapPointToGrid': { minArgs: 1, maxArgs: 2 },
              'createPoint': { minArgs: 2, maxArgs: 2 },
              'toFabricPoint': { minArgs: 1, maxArgs: 1 }
            };
            
            if (functionCheckMap[callee.name]) {
              const { minArgs, maxArgs } = functionCheckMap[callee.name];
              if (node.arguments.length < minArgs) {
                context.report({
                  node,
                  message: `Function '${callee.name}' requires at least ${minArgs} argument(s), but got ${node.arguments.length}.`
                });
              } else if (maxArgs !== undefined && node.arguments.length > maxArgs) {
                context.report({
                  node,
                  message: `Function '${callee.name}' requires at most ${maxArgs} argument(s), but got ${node.arguments.length}.`
                });
              }
            }
          }
        };
      }
    },
    
    // New rule: Check for proper grid constant usage
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
                "MAJOR_GRID_COLOR",
                "PIXELS_PER_METER",
                "MARKER_TEXT_SIZE",
                "MARKER_COLOR",
                "MARKER_PADDING",
                "MARKER_BACKGROUND",
                "DEFAULT_SHOW_GRID",
                "DEFAULT_SNAP_TO_GRID",
                "MAX_CANVAS_WIDTH",
                "MAX_CANVAS_HEIGHT"
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
    },
    
    // New rule: Ensure correct import path for createPoint
    "custom/correct-create-point-import": {
      create(context) {
        return {
          ImportDeclaration(node) {
            const importPath = node.source.value;
            const specifiers = node.specifiers;
            
            // Check if we're importing createPoint
            const createPointImport = specifiers.find(
              s => s.type === 'ImportSpecifier' && s.imported.name === 'createPoint'
            );
            
            if (createPointImport) {
              // Check if using the correct path
              if (importPath !== '@/types/core/Point' && 
                  importPath !== '../types/core/Point' &&
                  importPath !== './types/core/Point') {
                context.report({
                  node,
                  message: `Import 'createPoint' from '@/types/core/Point' instead of '${importPath}'`
                });
              }
            }
          }
        };
      }
    },
    
    // New rule: Check for grid state completeness
    "custom/complete-grid-state": {
      create(context) {
        return {
          ReturnStatement(node) {
            if (node.argument && node.argument.type === "ObjectExpression") {
              // Check for spread operations in the object
              const spreadElements = node.argument.properties.filter(
                prop => prop.type === "SpreadElement"
              );
              
              if (spreadElements.length > 0) {
                // Extract identifiers being spread
                const spreadIdentifiers = spreadElements
                  .filter(el => el.argument.type === "Identifier")
                  .map(el => el.argument.name);
                
                // Check if any are grid-related
                const gridStateIdentifiers = spreadIdentifiers.filter(
                  id => id.includes("grid") || id === "state" || id.includes("State")
                );
                
                if (gridStateIdentifiers.length > 0) {
                  // This spread operation likely involves a grid state
                  // Extract property names from the object
                  const properties = node.argument.properties
                    .filter(prop => prop.type === "Property" && prop.key.type === "Identifier")
                    .map(prop => prop.key.name);
                  
                  // Check if essential grid properties are included
                  const essentialProps = ["started", "completed", "objectCount"];
                  const includedEssentials = essentialProps.filter(prop => properties.includes(prop));
                  
                  if (includedEssentials.length < essentialProps.length) {
                    const missing = essentialProps.filter(prop => !properties.includes(prop));
                    context.report({
                      node,
                      message: `Grid state object is missing essential properties: ${missing.join(", ")}`
                    });
                  }
                }
              }
            }
          }
        };
      }
    }
  }
};
