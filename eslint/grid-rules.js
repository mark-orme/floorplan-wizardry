
/**
 * ESLint rules specific to grid functionality
 * Enforces strict conventions for grid-related code
 * @module eslint/grid-rules
 */

/**
 * Grid ESLint rules
 * Custom rules to enforce proper grid usage patterns
 */
module.exports = {
  // Enforce using constants from GRID_CONSTANTS
  "no-magic-numbers-in-grid": {
    create(context) {
      return {
        Literal(node) {
          // Skip if not in a grid file
          if (!context.getFilename().includes('grid')) {
            return;
          }
          
          // Skip string literals
          if (typeof node.value !== 'number') {
            return;
          }
          
          // Check if inside a comment
          if (node.parent.type === 'JSXText') {
            return;
          }
          
          // Skip common allowed values
          const allowedValues = [0, 1, 2, -1, 100, 0.5, 1.0];
          if (allowedValues.includes(node.value)) {
            return;
          }
          
          // Report error for magic numbers
          context.report({
            node,
            message: 'Avoid magic numbers in grid code. Use GRID_CONSTANTS instead.',
          });
        }
      };
    }
  },
  
  // Enforce proper fabric.js v6 API usage (canvas.sendObjectToBack, not object.sendToBack)
  "fabric-v6-compatibility": {
    create(context) {
      return {
        MemberExpression(node) {
          // Check for method calls that changed in Fabric.js v6
          const incompatibleMethods = ['sendToBack', 'sendBackwards', 'bringToFront', 'bringForward'];
          
          if (incompatibleMethods.includes(node.property.name) &&
              node.parent.type === 'CallExpression') {
            
            // Get the object being called on
            const callee = node.object;
            
            // If it's not the canvas, report an error
            if (callee.type === 'Identifier' && callee.name !== 'canvas') {
              context.report({
                node,
                message: `Use canvas.send* methods instead of object.${node.property.name}() for Fabric.js v6 compatibility. Replace with canvas.sendObjectToBack(object) or similar.`
              });
            }
          }
        }
      };
    }
  },
  
  // Enforce proper grid import usage
  "grid-imports": {
    create(context) {
      return {
        ImportDeclaration(node) {
          // Skip if not a grid file
          if (!context.getFilename().includes('grid')) {
            return;
          }
          
          // Check imports
          if (node.source.value === "@/constants/gridConstants" &&
              node.specifiers.length > 0) {
            
            // Find imported GRID_CONSTANTS
            const gridConstantsSpecifier = node.specifiers.find(
              specifier => specifier.type === 'ImportSpecifier' && 
                          specifier.imported.name === 'GRID_CONSTANTS'
            );
            
            if (gridConstantsSpecifier) {
              // Validate GRID_CONSTANTS usage in the file
              const scope = context.getScope();
              const variable = scope.variables.find(
                v => v.name === gridConstantsSpecifier.local.name
              );
              
              if (variable && variable.references.length === 0) {
                context.report({
                  node,
                  message: 'Imported GRID_CONSTANTS is unused'
                });
              }
            }
          }
        }
      };
    }
  },
  
  // Enforce consistent grid creation patterns
  "consistent-grid-creation": {
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.type === 'Identifier' && 
              (node.callee.name === 'createGrid' || 
               node.callee.name.includes('Grid'))) {
            
            // Check if canvas is first argument
            if (node.arguments.length > 0) {
              const firstArg = node.arguments[0];
              
              // Canvas should be explicitly passed as first argument
              if (firstArg.type === 'Identifier' && 
                  firstArg.name !== 'canvas' && 
                  !firstArg.name.includes('canvas')) {
                context.report({
                  node,
                  message: 'Grid creation functions should receive canvas as first argument'
                });
              }
            }
          }
        }
      };
    }
  },
  
  // Prevent direct canvas dimension usage without validation
  "validate-canvas-dimensions": {
    create(context) {
      return {
        MemberExpression(node) {
          // Check if accessing canvas.width or canvas.height
          if (node.object.type === 'Identifier' && 
              (node.object.name === 'canvas' || node.object.name.includes('canvas')) && 
              (node.property.name === 'width' || node.property.name === 'height')) {
            
            let isInValidation = false;
            let current = node.parent;
            
            // Look up the parent chain to see if it's in a validation condition
            while (current && !isInValidation) {
              if (current.type === 'IfStatement' || 
                  current.type === 'LogicalExpression' ||
                  current.type === 'BinaryExpression') {
                isInValidation = true;
                break;
              }
              current = current.parent;
            }
            
            // If directly using dimension without validation, report
            if (!isInValidation && node.parent.type !== 'BinaryExpression') {
              context.report({
                node,
                message: `Always validate canvas.${node.property.name} before use to avoid errors`
              });
            }
          }
        }
      };
    }
  }
};
