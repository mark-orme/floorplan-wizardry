
/**
 * DrawingMode Validation Rules
 * 
 * Prevents errors related to accessing non-existent properties on DrawingMode enum
 * and ensures proper imports and usage of Fabric.js.
 * 
 * @module eslint/typescript/drawing-mode-validation
 */

module.exports = {
  rules: {
    // Validate DrawingMode property access
    "drawing-mode-validation/enforce-valid-properties": {
      create(context) {
        return {
          MemberExpression(node) {
            if (node.object.type === 'Identifier' && 
                node.object.name === 'DrawingMode') {
              
              // List of valid DrawingMode properties
              const validModes = [
                'SELECT', 'DRAW', 'LINE', 'STRAIGHT_LINE', 'RECTANGLE', 
                'CIRCLE', 'TEXT', 'PAN', 'ZOOM', 'ERASE', 'ERASER',
                'MEASURE', 'WALL', 'DOOR', 'WINDOW', 'ROOM', 'ROOM_LABEL'
              ];
              
              // Check if property is in valid list
              if (node.property.type === 'Identifier' && 
                  !validModes.includes(node.property.name)) {
                context.report({
                  node,
                  message: `Invalid DrawingMode property: '${node.property.name}'. Valid properties are: ${validModes.join(', ')}`
                });
              }
            }
          }
        };
      }
    },
    
    // Enforce proper Fabric.js imports and references
    "drawing-mode-validation/enforce-fabric-imports": {
      create(context) {
        return {
          // Detect references to unimported fabric namespace
          Identifier(node) {
            if (node.name === 'fabric' && node.parent.type === 'MemberExpression') {
              // Get all import declarations in file
              const importDeclarations = context.getSourceCode().ast.body.filter(
                node => node.type === 'ImportDeclaration'
              );
              
              // Check if fabric is properly imported
              const hasFabricImport = importDeclarations.some(importDecl => {
                return importDecl.source.value === 'fabric' || 
                       (importDecl.specifiers && importDecl.specifiers.some(
                         spec => spec.local && spec.local.name === 'fabric'
                       ));
              });
              
              if (!hasFabricImport) {
                context.report({
                  node,
                  message: "Direct reference to 'fabric' namespace without proper import. Import from 'fabric' package instead."
                });
              }
            }
          },
          
          // Enforce proper import format for Fabric.js
          ImportDeclaration(node) {
            if (node.source.value === 'fabric') {
              const hasNamespaceImport = node.specifiers.some(
                spec => spec.type === 'ImportNamespaceSpecifier'
              );
              
              const hasDefaultImport = node.specifiers.some(
                spec => spec.type === 'ImportDefaultSpecifier'
              );
              
              if (hasNamespaceImport || hasDefaultImport) {
                context.report({
                  node,
                  message: "Import specific components from fabric instead of namespace or default import: import { Canvas, Circle } from 'fabric'"
                });
              }
            }
          }
        };
      }
    }
  }
};
