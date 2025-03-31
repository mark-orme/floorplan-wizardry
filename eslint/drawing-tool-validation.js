
/**
 * DrawingTool validation ESLint rules
 * Ensures consistent usage of DrawingTool and DrawingMode
 * @module eslint/drawing-tool-validation
 */
module.exports = {
  rules: {
    "drawing-tool-validation/consistent-import": {
      create(context) {
        return {
          ImportDeclaration(node) {
            // Check if importing DrawingTool from the wrong location
            if (node.source.value !== '@/types/core/DrawingTool') {
              const hasDrawingToolImport = node.specifiers.some(
                specifier => 
                  specifier.type === 'ImportSpecifier' && 
                  specifier.imported.name === 'DrawingTool'
              );
              
              if (hasDrawingToolImport) {
                context.report({
                  node,
                  message: "Import DrawingTool only from '@/types/core/DrawingTool' for consistency"
                });
              }
            }
            
            // Check if importing DrawingMode from the wrong location
            if (node.source.value !== '@/constants/drawingModes') {
              const hasDrawingModeImport = node.specifiers.some(
                specifier => 
                  specifier.type === 'ImportSpecifier' && 
                  specifier.imported.name === 'DrawingMode'
              );
              
              if (hasDrawingModeImport) {
                context.report({
                  node,
                  message: "Import DrawingMode only from '@/constants/drawingModes' for consistency"
                });
              }
            }
          }
        };
      }
    },
    
    "drawing-tool-validation/prevent-string-literals": {
      create(context) {
        const drawingModeValues = [
          'select', 'draw', 'straight_line', 'rectangle', 'circle', 
          'text', 'wall', 'door', 'window', 'room_label', 'room',
          'line', 'measure', 'pan', 'hand', 'zoom', 'erase', 'eraser'
        ];
        
        return {
          Literal(node) {
            if (typeof node.value === 'string' && 
                drawingModeValues.includes(node.value.toLowerCase())) {
              context.report({
                node,
                message: `Use DrawingMode enum value instead of string literal '${node.value}'`
              });
            }
          }
        };
      }
    },
    
    "drawing-tool-validation/enforce-enum-values": {
      create(context) {
        return {
          TSTypeReference(node) {
            if (node.typeName.type === 'Identifier' && 
                node.typeName.name === 'DrawingTool') {
              const parent = node.parent;
              
              // Check if we're using string literals for DrawingTool type
              if (parent && 
                  parent.type === 'TSUnionType' && 
                  parent.types.some(t => t.type === 'TSLiteralType')) {
                context.report({
                  node,
                  message: "Use DrawingTool type directly instead of union of string literals"
                });
              }
            }
          }
        };
      }
    },
    
    "drawing-tool-validation/hook-return-types": {
      create(context) {
        return {
          FunctionDeclaration(node) {
            // Check if this is a hook (name starts with "use")
            if (node.id && 
                node.id.name.startsWith('use') && 
                (!node.returnType || node.returnType.typeAnnotation.type !== 'TSTypeAnnotation')) {
              context.report({
                node,
                message: "Custom hooks must have explicit return type annotations"
              });
            }
          },
          
          ArrowFunctionExpression(node) {
            // Check parent to see if this is a hook variable declaration
            const parent = node.parent;
            if (parent && 
                parent.type === 'VariableDeclarator' && 
                parent.id.type === 'Identifier' && 
                parent.id.name.startsWith('use') && 
                (!parent.id.typeAnnotation)) {
              context.report({
                node: parent,
                message: "Custom hooks must have explicit return type annotations"
              });
            }
          }
        };
      }
    }
  }
};
