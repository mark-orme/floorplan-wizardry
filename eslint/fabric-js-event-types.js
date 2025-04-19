
/**
 * ESLint rules for enforcing proper Fabric.js event handling
 * Prevents common type errors with Fabric.js events
 * @module eslint/fabric-js-event-types
 */
module.exports = {
  rules: {
    "fabric-js/brush-event-properties": {
      meta: {
        type: "problem",
        docs: {
          description: "Ensure Fabric.js brush events have all required properties",
          category: "Type Safety",
          recommended: true
        },
        fixable: "code",
        schema: []
      },
      create(context) {
        return {
          // Check for brush event method calls missing required properties
          CallExpression(node) {
            if (
              node.callee.type === "MemberExpression" &&
              node.callee.object.type === "MemberExpression" &&
              node.callee.object.property.name === "freeDrawingBrush" &&
              ["onMouseDown", "onMouseMove", "onMouseUp"].includes(node.callee.property.name) &&
              node.arguments.length > 1 &&
              node.arguments[1].type === "ObjectExpression"
            ) {
              // Check if the event object has both 'e' and 'pointer' properties
              const eventObj = node.arguments[1];
              const properties = eventObj.properties.map(prop => 
                prop.key.name || prop.key.value
              );
              
              if (!properties.includes("pointer")) {
                context.report({
                  node: eventObj,
                  message: "Fabric.js brush event objects must include 'pointer' property of type Point",
                  fix(fixer) {
                    // Only attempt fix if there's a point argument available
                    if (node.arguments[0] && !properties.includes("pointer")) {
                      const pointVarName = context.getSourceCode().getText(node.arguments[0]);
                      const lastBrace = context.getSourceCode().getLastToken(eventObj);
                      
                      return fixer.insertTextBefore(
                        lastBrace,
                        properties.length > 0
                          ? `, pointer: ${pointVarName}`
                          : `pointer: ${pointVarName}`
                      );
                    }
                    return null;
                  }
                });
              }
              
              if (!properties.includes("e")) {
                context.report({
                  node: eventObj,
                  message: "Fabric.js brush event objects must include 'e' property with the original event"
                });
              }
              
              // Check for non-standard properties
              const validProps = ["e", "pointer"];
              const invalidProps = properties.filter(prop => !validProps.includes(prop));
              
              if (invalidProps.length > 0) {
                context.report({
                  node: eventObj,
                  message: `Invalid properties in Fabric.js brush event: ${invalidProps.join(", ")}. Only use: ${validProps.join(", ")}`
                });
              }
            }
          }
        };
      }
    },
    
    "fabric-js/point-conversion": {
      meta: {
        type: "problem",
        docs: {
          description: "Ensure proper Point object conversion for Fabric.js",
          category: "Type Safety",
          recommended: true
        },
        fixable: "code",
        schema: []
      },
      create(context) {
        return {
          // Check for direct usage of {x,y} objects where fabric.Point is expected
          ObjectExpression(node) {
            // Check if this looks like a simple {x,y} coordinate object
            if (node.properties.length === 2) {
              const propNames = node.properties.map(p => p.key.name).sort().join(',');
              
              if (propNames === 'x,y') {
                // Check if this is being passed to a Fabric method expecting Point
                const parent = node.parent;
                
                if (
                  parent.type === 'CallExpression' &&
                  parent.callee.type === 'MemberExpression' &&
                  (
                    parent.callee.property.name === 'onMouseDown' ||
                    parent.callee.property.name === 'onMouseMove' ||
                    parent.callee.property.name === 'onMouseUp'
                  ) &&
                  parent.arguments[0] === node // Object is first argument
                ) {
                  context.report({
                    node,
                    message: "Use toFabricPoint() to convert coordinate objects to fabric.Point for Fabric.js methods",
                    fix(fixer) {
                      const objectText = context.getSourceCode().getText(node);
                      return fixer.replaceText(node, `toFabricPoint(${objectText})`);
                    }
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
