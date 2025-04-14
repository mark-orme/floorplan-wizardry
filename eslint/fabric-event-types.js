
/**
 * ESLint rules for fabric.js event handling
 * Ensures proper type checking for fabric.js event objects
 * @module eslint/fabric-event-types
 */

module.exports = {
  rules: {
    // Prevent direct property access without type guards
    "no-unsafe-fabric-event-access": {
      create: function(context) {
        return {
          // Check for unsafe access to event properties
          MemberExpression(node) {
            if (
              node.object.type === "Identifier" &&
              node.object.name === "e" &&
              node.property.type === "Identifier" &&
              node.property.name === "pointer"
            ) {
              // Check if we're inside a fabric event handler
              let isFabricEvent = false;
              let parentFunc = node;
              
              // Walk up the AST to find if we're in a fabric event handler
              while (parentFunc && parentFunc.type !== "FunctionExpression" && parentFunc.type !== "ArrowFunctionExpression") {
                parentFunc = parentFunc.parent;
              }
              
              if (parentFunc && parentFunc.params && parentFunc.params.length > 0) {
                const paramType = context.getScope().variables.find(v => 
                  v.name === parentFunc.params[0].name
                );
                
                if (paramType && paramType.defs.length > 0) {
                  const typeAnnotation = paramType.defs[0].node.typeAnnotation;
                  if (
                    typeAnnotation && 
                    typeAnnotation.typeAnnotation && 
                    typeAnnotation.typeAnnotation.typeName &&
                    (
                      typeAnnotation.typeAnnotation.typeName.name === "TEvent" || 
                      /Event/.test(typeAnnotation.typeAnnotation.typeName.name)
                    )
                  ) {
                    isFabricEvent = true;
                  }
                }
              }
              
              if (isFabricEvent) {
                context.report({
                  node,
                  message: "Access fabric.js event properties safely! Use 'e.absolutePointer' for Fabric v6 or add proper type guards.",
                });
              }
            }
          }
        };
      }
    },
    
    // Enforce proper Fabric.js event typing
    "fabric-event-type-check": {
      create: function(context) {
        return {
          // Check function parameters for proper typing
          FunctionDeclaration(node) {
            checkFunctionParams(node, context);
          },
          FunctionExpression(node) {
            checkFunctionParams(node, context);
          },
          ArrowFunctionExpression(node) {
            checkFunctionParams(node, context);
          }
        };
      }
    }
  }
};

function checkFunctionParams(node, context) {
  // Check for canvas event handler functions
  if (
    node.params &&
    node.params.length > 0 &&
    node.params[0].typeAnnotation &&
    node.params[0].typeAnnotation.typeAnnotation
  ) {
    const typeAnnotation = node.params[0].typeAnnotation.typeAnnotation;
    
    // Get the function body text
    const sourceCode = context.getSourceCode().getText(node.body);
    
    // Check if this looks like a Fabric.js event handler
    if (
      typeAnnotation.typeName &&
      /Event/.test(typeAnnotation.typeName.name) &&
      (
        /pointer/.test(sourceCode) ||
        /\.e\./.test(sourceCode) ||
        /canvas/.test(sourceCode) ||
        /fabric/.test(sourceCode)
      )
    ) {
      // Verify proper type guard usage
      if (
        !/if\s*\(\s*!e\s*\)/.test(sourceCode) &&
        !/if\s*\(\s*!e\.e\s*\)/.test(sourceCode) &&
        (
          /e\.pointer/.test(sourceCode) ||
          /e\.absolutePointer/.test(sourceCode)
        )
      ) {
        context.report({
          node,
          message: "Always check fabric.js event objects before accessing properties",
        });
      }
    }
  }
}
