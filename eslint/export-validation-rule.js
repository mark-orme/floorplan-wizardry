
/**
 * Export validation ESLint rule
 * Ensures exports are properly defined before being imported
 * @module eslint/export-validation-rule
 */

export const exportValidationRule = {
  plugins: [],
  rules: {
    "export-validation/no-undefined-exports": {
      create(context) {
        const exportedNames = new Set();
        const pendingImports = [];
        
        return {
          // Track all exported items
          ExportNamedDeclaration(node) {
            if (node.declaration) {
              if (node.declaration.type === "FunctionDeclaration" && node.declaration.id) {
                exportedNames.add(node.declaration.id.name);
              } else if (node.declaration.type === "VariableDeclaration") {
                node.declaration.declarations.forEach(decl => {
                  if (decl.id.type === "Identifier") {
                    exportedNames.add(decl.id.name);
                  }
                });
              }
            }
            
            if (node.specifiers) {
              node.specifiers.forEach(specifier => {
                if (specifier.exported.type === "Identifier") {
                  exportedNames.add(specifier.exported.name);
                }
              });
            }
          },
          
          // Check import statements for undefined exports
          ImportSpecifier(node) {
            pendingImports.push({
              name: node.imported.name,
              node
            });
          },
          
          // Report on undefined exports in the source file
          "Program:exit"() {
            pendingImports.forEach(({ name, node }) => {
              if (!exportedNames.has(name)) {
                // Allow some known global objects that might be imported
                const allowedGlobals = ["useState", "useEffect", "useRef", "useCallback"];
                if (!allowedGlobals.includes(name)) {
                  context.report({
                    node,
                    message: `Imported name '${name}' is not exported by this module`,
                  });
                }
              }
            });
          }
        };
      }
    }
  }
};
