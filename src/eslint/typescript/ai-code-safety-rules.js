
/**
 * ESLint rules to enforce safety in AI-generated code
 * Helps prevent common issues in AI-assisted development
 * 
 * @module eslint/typescript/ai-code-safety-rules
 */
module.exports = {
  rules: {
    // Ensure imports use proper type checking
    "ai-code-safety/verify-imports": {
      create(context) {
        return {
          ImportDeclaration(node) {
            // Check if importing from a file that might have type definitions
            const importPath = node.source.value;
            if (
              importPath.includes('/types/') || 
              importPath.includes('.d.ts') ||
              importPath.endsWith('Types')
            ) {
              // Warn about potential type import issues
              const importedTypes = node.specifiers
                .filter(s => s.type === 'ImportSpecifier')
                .map(s => s.imported.name);
              
              // If importing multiple types, suggest using type imports
              if (importedTypes.length > 2 && !node.importKind === 'type') {
                context.report({
                  node,
                  message: `Consider using 'import type { ${importedTypes.join(', ')} } from "${importPath}"' for better type safety`,
                });
              }
            }
          }
        };
      }
    },
    
    // Detect unreferenced imports that might cause runtime errors
    "ai-code-safety/no-unused-type-imports": {
      create(context) {
        return {
          Program(node) {
            const scope = context.getScope();
            const imports = scope.variables.filter(v => v.defs.some(d => d.type === 'ImportBinding'));
            
            imports.forEach(importVar => {
              // Skip if the import is a type-only import
              const def = importVar.defs.find(d => d.type === 'ImportBinding');
              if (!def || !def.node) return;
              
              const importDecl = def.node.parent;
              if (importDecl.importKind === 'type') return;
              
              // Check if this import is only used for types but imported as a value
              if (importVar.references.length === 0) {
                // It's unused, might be a type incorrectly imported
                context.report({
                  node: def.node,
                  message: `Unused import '${importVar.name}'. If this is a type, use 'import type { ${importVar.name} }' instead.`,
                });
              }
            });
          }
        };
      }
    },
    
    // Enforce proper use of Fabric.js events
    "ai-code-safety/fabric-event-safety": {
      create(context) {
        return {
          // Detect when AI code tries to use fabric events without proper types
          CallExpression(node) {
            if (
              node.callee?.type === 'MemberExpression' &&
              (node.callee.property.name === 'on' || node.callee.property.name === 'off') &&
              (node.callee.object.name === 'canvas' || 
               node.callee.object.name === 'fabricCanvas' ||
               node.callee.object.property?.name === 'current')
            ) {
              // Look for arg[0] being a string literal
              const eventArg = node.arguments[0];
              if (eventArg?.type === 'Literal' && typeof eventArg.value === 'string') {
                context.report({
                  node: eventArg,
                  message: `AI-generated code should always use FabricEventTypes enum instead of string literals. Use FabricEventTypes.${eventArg.value.toUpperCase().replace(':', '_')} instead of "${eventArg.value}"`,
                });
              }
            }
          }
        };
      }
    },
    
    // Detect potential AI hallucinations in code generation
    "ai-code-safety/detect-hallucinated-methods": {
      create(context) {
        const knownFabricMethods = [
          'add', 'remove', 'renderAll', 'getObjects', 'setActiveObject',
          'discardActiveObject', 'getActiveObject', 'getActiveObjects',
          'on', 'off', 'fire', 'dispose', 'clear', 'toJSON', 'loadFromJSON'
        ];
        
        return {
          MemberExpression(node) {
            // Check if accessing a potentially hallucinated fabric canvas method
            if (
              (node.object.name === 'canvas' || 
               node.object.name === 'fabricCanvas' ||
               (node.object.property && node.object.property.name === 'current'))
            ) {
              const methodName = node.property.name;
              
              // If method is not in our list of known fabric methods, warn about it
              if (!knownFabricMethods.includes(methodName) && 
                  !methodName.startsWith('get') && 
                  !methodName.startsWith('set') &&
                  !methodName.startsWith('_')) {
                context.report({
                  node,
                  message: `Possible hallucinated method '${methodName}' called on Fabric canvas. Verify this method exists in the Fabric.js documentation.`,
                });
              }
            }
          }
        };
      }
    }
  }
};
