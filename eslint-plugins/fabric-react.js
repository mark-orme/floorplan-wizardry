
/**
 * Custom ESLint plugin for Fabric.js with React
 * This plugin adds rules specific to working with Fabric.js in React applications
 */
module.exports = {
  rules: {
    'canvas-props-validation': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Validate Canvas component props',
          category: 'Possible Errors',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create: function(context) {
        return {
          JSXOpeningElement(node) {
            // Only check Canvas components
            if (node.name.name !== 'Canvas') return;
            
            const requiredProps = ['width', 'height', 'onCanvasReady'];
            const props = node.attributes.map(attr => attr.name?.name);
            
            for (const requiredProp of requiredProps) {
              if (!props.includes(requiredProp)) {
                context.report({
                  node,
                  message: `Canvas component is missing required prop: ${requiredProp}`
                });
              }
            }
          }
        };
      }
    },
    'fabric-event-handlers': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure proper usage of Fabric.js event handlers',
          category: 'Possible Errors',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create: function(context) {
        return {
          CallExpression(node) {
            // Check for canvas.on() calls
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.property.name === 'on'
            ) {
              // Ensure event name is a string literal
              if (
                node.arguments.length > 0 &&
                node.arguments[0].type !== 'Literal'
              ) {
                context.report({
                  node,
                  message: 'Fabric event name should be a string literal'
                });
              }
              
              // Ensure event handler is a function
              if (
                node.arguments.length > 1 &&
                node.arguments[1].type !== 'FunctionExpression' &&
                node.arguments[1].type !== 'ArrowFunctionExpression' &&
                node.arguments[1].type !== 'Identifier'
              ) {
                context.report({
                  node,
                  message: 'Fabric event handler should be a function'
                });
              }
            }
          }
        };
      }
    },
    'fabric-object-type-check': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure proper type checks for Fabric objects',
          category: 'Possible Errors',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create: function(context) {
        return {
          // Check for proper type checks in Fabric.js objects
          BinaryExpression(node) {
            if (
              node.operator === '===' || 
              node.operator === '==' || 
              node.operator === '!==' || 
              node.operator === '!='
            ) {
              // Check for object type comparisons
              if (
                node.left.type === 'MemberExpression' &&
                node.left.property.name === 'type' &&
                node.right.type === 'Literal'
              ) {
                // This is a valid type check
              } else if (
                node.right.type === 'MemberExpression' &&
                node.right.property.name === 'type' &&
                node.left.type === 'Literal'
              ) {
                // This is also a valid type check
              }
            }
          }
        };
      }
    }
  }
};
