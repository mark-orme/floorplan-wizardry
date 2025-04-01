
/**
 * ESLint rules to enforce proper Fabric.js event handling
 * Prevents common errors with Fabric.js events
 * 
 * @module eslint/typescript/fabric-event-type-safety
 */
module.exports = {
  rules: {
    "fabric-event-safety/use-fabric-event-types": {
      create(context) {
        return {
          // Check for string literals in canvas.on/off calls
          CallExpression(node) {
            // Look for canvas.on('event-name', handler)
            if (
              node.callee?.type === 'MemberExpression' &&
              (node.callee.property.name === 'on' || node.callee.property.name === 'off') &&
              (node.callee.object.name === 'canvas' || 
               node.callee.object.name === 'fabricCanvas' ||
               node.callee.object.property?.name === 'current')
            ) {
              // Check if first argument is a string literal
              const firstArg = node.arguments[0];
              if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
                context.report({
                  node: firstArg,
                  message: `Use FabricEventTypes enum instead of string literals for Fabric.js events. Example: FabricEventTypes.MOUSE_DOWN instead of '${firstArg.value}'`
                });
              }
            }
          },
          
          // Check for FabricPointerEvent usage
          TSTypeReference(node) {
            // Look for event handler parameters with non-fabric types
            if (
              node.typeName.type === 'Identifier' &&
              (node.typeName.name === 'Event' ||
               node.typeName.name === 'MouseEvent' ||
               node.typeName.name === 'TouchEvent')
            ) {
              // If this is in a function that seems to handle canvas events
              const fnName = context.getScope().block?.id?.name;
              if (fnName && /handle(Mouse|Canvas|Fabric|Pointer|Object|Selection)/.test(fnName)) {
                context.report({
                  node,
                  message: `Use FabricPointerEvent interface for Fabric.js event handlers instead of ${node.typeName.name}`
                });
              }
            }
          },
          
          // Check for proper canvas event handlers
          FunctionDeclaration(node) {
            if (
              node.id && 
              /handle(Mouse|Canvas|Fabric|Pointer|Object|Selection)/.test(node.id.name) &&
              node.params.length > 0
            ) {
              const param = node.params[0];
              // Check if the parameter has a type annotation
              if (param.typeAnnotation?.typeAnnotation?.typeName?.name !== 'FabricPointerEvent') {
                context.report({
                  node,
                  message: `Canvas event handlers should use FabricPointerEvent as the parameter type for consistency and type safety`
                });
              }
            }
          }
        };
      }
    }
  }
};
