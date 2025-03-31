
/**
 * Grid type validation rules
 * Prevents common errors when working with grid types
 * @module eslint/grid-type-validation
 */
export const gridTypeValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Custom rule to check grid state properties
    "custom/grid-state-properties": {
      create(context) {
        return {
          // Validate properties accessed on GridCreationState objects
          MemberExpression(node) {
            if (
              node.object.type === "Identifier" &&
              (node.object.name === "gridState" || 
               node.object.name === "state" || 
               node.object.name.includes("gridCreation"))
            ) {
              const validGridStateProps = [
                // Core required properties
                "started", "completed", "objectCount", 
                
                // Extended properties
                "startTime", "endTime", "error", 
                "inProgress", "isCreated", "attempts", 
                "lastAttemptTime", "hasError", "errorMessage", 
                "creationInProgress", "consecutiveResets", 
                "maxConsecutiveResets", "exists", "lastCreationTime", 
                "throttleInterval", "totalCreations", "maxRecreations", 
                "minRecreationInterval", "creationLock"
              ];
              
              if (node.property.type === "Identifier" && 
                  !validGridStateProps.includes(node.property.name)) {
                context.report({
                  node,
                  message: `Invalid GridCreationState property: ${node.property.name}. Valid properties are defined in src/types/core/GridTypes.ts.`
                });
              }
            }
          },
          
          // Validate when spreading GridCreationState objects
          SpreadElement(node) {
            // Check for spreading inside return statements that might be updating grid state
            const returnAncestor = context.getAncestors().find(
              ancestor => ancestor.type === "ReturnStatement"
            );
            
            if (returnAncestor && node.argument.type === "Identifier") {
              const varName = node.argument.name;
              if (varName === "state" || varName === "gridState" || varName.includes("grid")) {
                // Remind developers to use the interface
                context.report({
                  node,
                  message: "When spreading grid state objects, ensure all properties conform to the GridCreationState interface."
                });
              }
            }
          },
          
          // Validate object literals that might be GridCreationState
          ObjectExpression(node) {
            // Try to determine if this object is meant to be a GridCreationState
            const isGridStateObject = context.getAncestors().some(ancestor => {
              if (ancestor.type === "VariableDeclarator" && ancestor.id.type === "Identifier") {
                return ancestor.id.name.includes("grid") || ancestor.id.name.includes("state");
              }
              return false;
            });
            
            if (isGridStateObject) {
              // Essential properties that must be present
              const essentialProps = ["started", "completed", "objectCount"];
              
              // Get properties from the object expression
              const props = node.properties
                .filter(prop => prop.type === "Property" && prop.key.type === "Identifier")
                .map(prop => prop.key.name);
              
              // Check for missing essential properties
              const missingProps = essentialProps.filter(prop => !props.includes(prop));
              
              if (missingProps.length > 0) {
                context.report({
                  node,
                  message: `GridCreationState object is missing required properties: ${missingProps.join(", ")}`
                });
              }
            }
          }
        };
      }
    },
    
    // Additional rules for GridCreationState objects
    "custom/grid-state-initialization": {
      create(context) {
        return {
          // Check function calls that might initialize grid state
          CallExpression(node) {
            if (node.callee.type === "Identifier" && 
                (node.callee.name === "getInitialGridState" || 
                 node.callee.name.includes("createGridState"))) {
              
              // Make sure we're importing from the right place
              context.getScope().variables.forEach(variable => {
                if (variable.name === node.callee.name) {
                  variable.references.forEach(ref => {
                    if (ref.identifier === node.callee) {
                      // Reference found, check if there's a nearby comment about grid state
                      const comments = context.getSourceCode().getCommentsBefore(node);
                      const hasGridComments = comments.some(comment => 
                        comment.value.includes("grid") || 
                        comment.value.includes("state"));
                      
                      if (!hasGridComments) {
                        context.report({
                          node,
                          message: "Add documentation about grid state properties when initializing"
                        });
                      }
                    }
                  });
                }
              });
            }
          }
        };
      }
    }
  }
};
