
/**
 * ESLint rules for AI-assisted code safety
 * Enforces patterns that prevent common AI-generated code issues
 * @module eslint/typescript/ai-code-safety-rules
 */
module.exports = {
  rules: {
    // Prevent missing type imports
    "ai-code-safety/complete-imports": {
      create(context) {
        return {
          // Check that we're importing all types needed
          ImportDeclaration(node) {
            if (node.specifiers.some(s => 
              s.imported?.name === 'Canvas' || 
              s.imported?.name === 'IText' || 
              s.imported?.name === 'Line')
            ) {
              // Check if we're also importing Object when dealing with these types
              const hasObject = node.specifiers.some(s => s.imported?.name === 'Object');
              if (!hasObject && node.source.value === 'fabric') {
                context.report({
                  node,
                  message: `When importing Fabric.js components, consider importing Object as FabricObject for type safety`
                });
              }
            }
          }
        };
      }
    },
    
    // Enforce proper prop typing
    "ai-code-safety/complete-props": {
      create(context) {
        // Map of component names to their required props
        const componentPropMap = {
          'Canvas': ['width', 'height', 'onCanvasReady'],
          'DrawingToolbar': [
            'tool', 'onToolChange', 'onUndo', 'onRedo', 'onClear', 'onZoom', 'onSave',
            'gia', 'onGiaChange', 'showControls', 'lineThickness', 'lineColor',
            'onLineThicknessChange', 'onLineColorChange'
          ]
        };
        
        return {
          JSXOpeningElement(node) {
            const componentName = node.name.name;
            
            if (typeof componentName === 'string' && componentPropMap[componentName]) {
              const requiredProps = componentPropMap[componentName];
              const providedProps = node.attributes
                .filter(attr => attr.type === 'JSXAttribute')
                .map(attr => attr.name.name);
              
              const missingProps = requiredProps.filter(prop => !providedProps.includes(prop));
              
              if (missingProps.length > 0) {
                context.report({
                  node,
                  message: `Component <${componentName}> is missing required props: ${missingProps.join(', ')}`
                });
              }
            }
          }
        };
      }
    },
    
    // Enforce proper mock usage in tests
    "ai-code-safety/test-mocks": {
      create(context) {
        return {
          // Check that we're properly mocking dependencies in tests
          CallExpression(node) {
            if (node.callee.name === 'vi' && node.callee.property?.name === 'mock') {
              // Check if we've handled returns in the mock
              const args = node.arguments;
              if (args.length > 1 && args[1].type === 'ArrowFunctionExpression') {
                const body = args[1].body;
                if (body.type !== 'BlockStatement' || 
                    !body.body.some(stmt => 
                      stmt.type === 'ReturnStatement' || 
                      stmt.expression?.type === 'ReturnStatement'
                    )) {
                  context.report({
                    node,
                    message: `Mocks should return a value to prevent undefined errors in tests`
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
