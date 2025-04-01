
/**
 * ESLint rules specifically for Fabric.js event handling
 * Prevents type errors in Fabric.js event handling
 * @module eslint/typescript/fabric-event-typing-rules
 */
module.exports = {
  rules: {
    "fabric-event-typing/correct-types": {
      create(context) {
        return {
          // Check for proper event type imports
          ImportDeclaration(node) {
            if (node.source.value === '@/types/fabric-events') {
              // Make sure we're importing the correct event types
              const importNames = node.specifiers.map(s => s.imported?.name).filter(Boolean);
              const validNames = [
                'FabricEventNames', 'FabricEventTypes', 'TPointerEventInfo', 
                'TPointerEvent', 'FabricPointerEvent', 'TSelectionEventInfo', 
                'TObjectEventInfo', 'FabricEvent'
              ];
              
              for (const name of importNames) {
                if (!validNames.includes(name)) {
                  context.report({
                    node,
                    message: `Invalid import '${name}' from fabric-events. Available types are: ${validNames.join(', ')}`
                  });
                }
              }
            }
          },

          // Check for correct event parameters
          CallExpression(node) {
            if (
              node.callee?.type === 'MemberExpression' &&
              (node.callee.property.name === 'on' || node.callee.property.name === 'off') &&
              (node.callee.object.name === 'canvas' || 
               node.callee.object.name === 'fabricCanvas')
            ) {
              // Check event handler parameter types
              const handler = node.arguments[1];
              if (handler?.type === 'ArrowFunctionExpression' || handler?.type === 'FunctionExpression') {
                if (handler.params.length > 0 && 
                    handler.params[0].typeAnnotation?.typeAnnotation?.typeName?.name !== 'TPointerEventInfo') {
                  context.report({
                    node: handler,
                    message: `Canvas event handlers should use TPointerEventInfo<TPointerEvent> as the parameter type`
                  });
                }
              }
            }
          },
          
          // Check for correct mock usage in tests
          CallExpression(node) {
            if (
              node.callee?.name === 'createMockPointerEvent' || 
              node.callee?.name === 'createMockSelectionEvent'
            ) {
              if (node.arguments.length !== 2) {
                context.report({
                  node,
                  message: `${node.callee.name} requires exactly 2 arguments (x and y coordinates)`
                });
              }
            }
          }
        };
      }
    },
    
    // Ensure consistent event naming
    "fabric-event-typing/consistent-event-names": {
      create(context) {
        return {
          // Check for string literals that should be FabricEventNames
          Literal(node) {
            if (typeof node.value !== 'string') return;
            
            const fabricEventValues = [
              'mouse:down', 'mouse:move', 'mouse:up', 'mouse:wheel',
              'selection:created', 'selection:updated', 'selection:cleared',
              'object:added', 'object:modified', 'object:removed'
            ];
            
            if (fabricEventValues.includes(node.value)) {
              const parent = node.parent;
              if (parent?.type === 'CallExpression' && 
                  parent.callee?.type === 'MemberExpression' &&
                  (parent.callee.property.name === 'on' || parent.callee.property.name === 'off')) {
                context.report({
                  node,
                  message: `Use FabricEventNames.${node.value.toUpperCase().replace(':', '_')} instead of "${node.value}"`
                });
              }
            }
          }
        };
      }
    }
  }
};
