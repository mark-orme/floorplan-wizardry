
/**
 * Advanced drawing tool ESLint rules
 * Prevents common errors with DrawingMode and DrawingTool
 * @module eslint/drawing-tool-rules
 */

module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    /**
     * Enforces consistent imports of DrawingMode and DrawingTool
     */
    "drawing-tools/consistent-imports": {
      create(context) {
        return {
          ImportDeclaration(node) {
            // Check for DrawingMode imports from wrong location
            if (
              node.source.value !== '@/constants/drawingModes' &&
              node.specifiers.some(s => 
                s.type === 'ImportSpecifier' && 
                s.imported.name === 'DrawingMode'
              )
            ) {
              context.report({
                node,
                message: `Import DrawingMode only from '@/constants/drawingModes' for consistency`
              });
            }
            
            // Check for DrawingTool imports from wrong location
            if (
              node.source.value !== '@/types/core/DrawingTool' &&
              node.specifiers.some(s => 
                s.type === 'ImportSpecifier' && 
                s.imported.name === 'DrawingTool'
              )
            ) {
              context.report({
                node,
                message: `Import DrawingTool only from '@/types/core/DrawingTool' for consistency`
              });
            }
          }
        };
      }
    },
    
    /**
     * Prevents direct usage of string literals instead of DrawingMode enum values
     */
    "drawing-tools/no-string-literals": {
      create(context) {
        const forbiddenValues = [
          'select', 'draw', 'erase', 'hand', 'wall', 'pencil', 'room', 'text',
          'shape', 'line', 'rectangle', 'circle', 'door', 'window', 'straight_line',
          'pan', 'eraser', 'measure', 'dimension', 'stair', 'column'
        ];
        
        return {
          Literal(node) {
            if (
              typeof node.value === 'string' && 
              forbiddenValues.includes(node.value.toLowerCase())
            ) {
              context.report({
                node,
                message: `Use DrawingMode.${node.value.toUpperCase()} instead of string literal '${node.value}'`
              });
            }
          }
        };
      }
    },
    
    /**
     * Enforces consistent typing in functions using DrawingMode
     */
    "drawing-tools/consistent-typing": {
      create(context) {
        return {
          TSTypeAnnotation(node) {
            // Check for direct string union types where DrawingMode should be used
            if (
              node.typeAnnotation.type === 'TSUnionType' &&
              node.typeAnnotation.types.some(t => 
                t.type === 'TSLiteralType' && 
                t.literal.type === 'Literal' &&
                typeof t.literal.value === 'string' &&
                ['select', 'draw', 'line', 'rectangle', 'circle'].includes(t.literal.value)
              )
            ) {
              context.report({
                node,
                message: `Use DrawingMode enum instead of string union types for drawing tools`
              });
            }
          },
          
          // Check function parameters and return types
          FunctionDeclaration(node) {
            if (node.params) {
              node.params.forEach(param => {
                if (
                  param.typeAnnotation &&
                  param.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral'
                ) {
                  // Look for object properties that might be drawing tool related
                  const properties = param.typeAnnotation.typeAnnotation.members;
                  properties.forEach(prop => {
                    if (
                      prop.key.name === 'tool' || 
                      prop.key.name === 'mode' ||
                      prop.key.name === 'drawingMode'
                    ) {
                      // Check if it's using string type instead of DrawingMode
                      if (
                        prop.typeAnnotation.typeAnnotation.type === 'TSStringKeyword' ||
                        (
                          prop.typeAnnotation.typeAnnotation.type === 'TSUnionType' &&
                          prop.typeAnnotation.typeAnnotation.types.some(t => 
                            t.type === 'TSLiteralType' && 
                            t.literal.type === 'Literal'
                          )
                        )
                      ) {
                        context.report({
                          node: prop,
                          message: `Use DrawingMode type for '${prop.key.name}' property instead of string or string literals`
                        });
                      }
                    }
                  });
                }
              });
            }
          }
        };
      }
    },
    
    /**
     * Ensures all DrawingMode-related hooks have proper return types
     */
    "drawing-tools/typed-hooks": {
      create(context) {
        return {
          FunctionDeclaration(node) {
            // Check custom hook declarations
            if (
              node.id && 
              node.id.name.startsWith('use') && 
              node.id.name.includes('Tool') &&
              (!node.returnType || node.returnType.typeAnnotation.type !== 'TSTypeAnnotation')
            ) {
              context.report({
                node,
                message: `Drawing tool hooks must have explicit return type annotations`
              });
            }
          },
          
          VariableDeclarator(node) {
            // Check arrow function hooks
            if (
              node.id.type === 'Identifier' && 
              node.id.name.startsWith('use') && 
              node.id.name.includes('Tool') &&
              node.init && 
              (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression') &&
              (!node.id.typeAnnotation)
            ) {
              context.report({
                node,
                message: `Drawing tool hooks must have explicit return type annotations`
              });
            }
          }
        };
      }
    }
  }
};
