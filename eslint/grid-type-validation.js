
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
                "started", "completed", "objectCount", "startTime", "endTime", 
                "error", "inProgress", "isCreated", "attempts", "lastAttemptTime", 
                "hasError", "errorMessage", "creationInProgress", "consecutiveResets", 
                "maxConsecutiveResets", "exists", "lastCreationTime", "throttleInterval", 
                "totalCreations", "maxRecreations", "minRecreationInterval", "creationLock"
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
          }
        };
      }
    }
  }
};
