
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
  
  // Enforce proper sendToBack usage (using canvas.sendToBack, not object.sendToBack)
  "correct-sendtoback-usage": {
    create(context) {
      return {
        MemberExpression(node) {
          if (node.property.name === 'sendToBack' &&
              node.parent.type === 'CallExpression') {
            
            // Get the object being called on
            const callee = node.object;
            
            // If it's not the canvas, report an error
            if (callee.type === 'Identifier' && callee.name !== 'canvas') {
              context.report({
                node,
                message: 'Use canvas.sendToBack(object) instead of object.sendToBack()'
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
  }
};
