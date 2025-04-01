
/**
 * ESLint rules for strict Fabric.js type safety
 * @module eslint/typescript/strict-fabric-types
 */
module.exports = {
  rules: {
    // Enforce proper Fabric object type checking
    "fabric-types/proper-object-types": {
      create(context) {
        return {
          // Check for property access on Fabric objects
          MemberExpression(node) {
            if (node.object?.type === 'Identifier' && 
                (node.object.name === 'fabricObject' || 
                 node.object.name === 'canvasObject')) {
              
              // Make sure we're not accessing non-standard properties directly
              const dangerousProps = ['_objects', '_stateProperties', '_private'];
              if (dangerousProps.includes(node.property.name)) {
                context.report({
                  node,
                  message: `Avoid accessing private Fabric.js property "${node.property.name}". Use public methods instead.`
                });
              }
            }
          },
          
          // Enforce proper IText creation
          NewExpression(node) {
            if (node.callee.name === 'IText') {
              if (node.arguments.length < 2) {
                context.report({
                  node,
                  message: `Fabric.js IText constructor requires at least 2 arguments: text and options`
                });
              }
            }
          },
          
          // Check for proper point usage
          CallExpression(node) {
            if (
              node.callee?.type === 'MemberExpression' &&
              node.callee.property.name === 'set' &&
              node.callee.object?.type === 'Identifier' &&
              node.callee.object.name === 'point'
            ) {
              context.report({
                node,
                message: `Fabric.js Point objects are immutable. Create a new Point instead of trying to modify existing ones.`
              });
            }
          }
        };
      }
    },
    
    // Enforce proper type imports
    "fabric-types/proper-imports": {
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value === 'fabric') {
              // Make sure we're importing properly
              const importSpecifiers = node.specifiers.filter(s => s.type === 'ImportSpecifier');
              
              for (const specifier of importSpecifiers) {
                if (specifier.imported.name === 'Point') {
                  const local = specifier.local.name;
                  if (local === 'Point') {
                    context.report({
                      node: specifier,
                      message: `Import Point from fabric as FabricPoint to avoid confusion with app Point type`
                    });
                  }
                }
              }
            }
          }
        };
      }
    }
  }
};
