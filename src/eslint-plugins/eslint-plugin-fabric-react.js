
/**
 * ESLint Plugin for Fabric.js and React
 * 
 * This plugin implements stricter rules for Fabric.js and React integration
 * to prevent common issues and type errors.
 */

module.exports = {
  rules: {
    // Rule to enforce proper Canvas prop usage
    'canvas-props-validation': {
      create: function(context) {
        return {
          JSXOpeningElement(node) {
            // Check if this is a Canvas component
            if (
              node.name.type === 'JSXIdentifier' && 
              (node.name.name === 'Canvas' || node.name.name.endsWith('Canvas'))
            ) {
              // Verify required props are present
              const hasWidth = node.attributes.some(
                attr => attr.type === 'JSXAttribute' && attr.name.name === 'width'
              );
              
              const hasHeight = node.attributes.some(
                attr => attr.type === 'JSXAttribute' && attr.name.name === 'height'
              );
              
              const hasOnCanvasReady = node.attributes.some(
                attr => attr.type === 'JSXAttribute' && attr.name.name === 'onCanvasReady'
              );
              
              if (!hasWidth || !hasHeight || !hasOnCanvasReady) {
                context.report({
                  node,
                  message: 'Canvas component must have width, height, and onCanvasReady props'
                });
              }
            }
          }
        };
      }
    },
    
    // Rule to prevent incorrect Fabric event handlers
    'fabric-event-handlers': {
      create: function(context) {
        return {
          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.property.name === 'on' &&
              node.arguments.length >= 2
            ) {
              // Check if this is likely a Fabric.js event
              const fabricEventPattern = /^(mouse|selection|object|path|text):/;
              const firstArg = node.arguments[0];
              
              if (
                firstArg.type === 'Literal' &&
                typeof firstArg.value === 'string' &&
                fabricEventPattern.test(firstArg.value)
              ) {
                // Check if second argument is a function
                const secondArg = node.arguments[1];
                if (secondArg.type !== 'ArrowFunctionExpression' && 
                    secondArg.type !== 'FunctionExpression' &&
                    secondArg.type !== 'Identifier') {
                  context.report({
                    node,
                    message: 'Fabric.js event handler should be a function'
                  });
                }
              }
            }
          }
        };
      }
    },
    
    // Rule to ensure proper Fabric.js object type checking
    'fabric-object-type-check': {
      create: function(context) {
        return {
          MemberExpression(node) {
            if (
              node.property.name === 'objectType' &&
              node.parent.type === 'BinaryExpression' &&
              node.parent.operator === '==='
            ) {
              // This is checking objectType property, which is good
              return;
            }
            
            if (
              node.property.name === 'type' &&
              node.parent.type === 'BinaryExpression' &&
              node.parent.operator === '===' &&
              context.getScope().through.some(ref => 
                ref.identifier.name === 'FabricObject' || 
                ref.identifier.name === 'fabric'
              )
            ) {
              // Suggest using objectType for custom properties
              context.report({
                node,
                message: 'Consider using objectType instead of type for custom object identification'
              });
            }
          }
        };
      }
    }
  }
};
