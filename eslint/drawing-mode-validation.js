
/**
 * Drawing mode validation ESLint rule
 * Ensures that DrawingMode enum values are used correctly
 */
module.exports = {
  rules: {
    "drawing-mode-validation/valid-modes-only": {
      create(context) {
        return {
          MemberExpression(node) {
            // Only check property access on DrawingMode
            if (node.object.type === 'Identifier' && 
                node.object.name === 'DrawingMode') {
              
              // Check if the property being accessed is in our whitelist
              const validModes = [
                'SELECT', 'DRAW', 'STRAIGHT_LINE', 'RECTANGLE', 'CIRCLE', 
                'TEXT', 'WALL', 'DOOR', 'WINDOW', 'ROOM_LABEL', 'ROOM',
                'LINE', 'MEASURE', 'PAN', 'HAND', 'ZOOM', 'ERASE', 'ERASER'
              ];
              
              if (node.property.type === 'Identifier' && 
                  !validModes.includes(node.property.name)) {
                context.report({
                  node,
                  message: `Invalid DrawingMode: '${node.property.name}'. Valid modes are: ${validModes.join(', ')}`
                });
              }
            }
          }
        };
      }
    },
    
    // Ensure DrawingTool is imported from the correct location
    "drawing-mode-validation/correct-import-path": {
      create(context) {
        return {
          ImportDeclaration(node) {
            const importPath = node.source.value;
            const specifiers = node.specifiers;
            
            // Check if we're importing DrawingTool
            const drawingToolImport = specifiers.find(
              s => s.type === 'ImportSpecifier' && s.imported.name === 'DrawingTool'
            );
            
            if (drawingToolImport) {
              // Check if using the correct path
              if (importPath !== '@/types/core/DrawingTool') {
                context.report({
                  node,
                  message: `Import 'DrawingTool' from '@/types/core/DrawingTool' instead of '${importPath}'`
                });
              }
            }
          }
        };
      }
    },
    
    // Ensure consistent usage between DrawingMode and DrawingTool
    "drawing-mode-validation/consistent-usage": {
      create(context) {
        return {
          MemberExpression(node) {
            // Check if we're accessing a property on DrawingTool
            if (node.object.type === 'Identifier' && 
                node.object.name === 'DrawingTool') {
              
              // Check if we should be using DrawingMode instead
              context.report({
                node,
                message: "Consider using DrawingMode instead of DrawingTool for consistency"
              });
            }
          }
        };
      }
    }
  }
};
