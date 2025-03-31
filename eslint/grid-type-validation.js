
/**
 * ESLint rules for grid type validation
 * @type {Object}
 */
exports.gridTypeValidationRules = {
  rules: {
    // Prevent incorrect grid state property assignments
    "no-restricted-syntax": [
      "error",
      {
        "selector": "AssignmentExpression[left.object.name=/gridState|state/][left.property.name][right.type!='Identifier'][left.computed=false]",
        "message": "For grid state assignment, make sure properties are valid and use proper type casting"
      },
      {
        "selector": "MemberExpression[computed=true][property.type='Literal'][object.name=/gridState|GridCreationState/]",
        "message": "Use type-safe property access with proper key typing: 'key as keyof GridCreationState'"
      },
      {
        "selector": "AssignmentExpression[left.object.name='gridState'][left.property.name!=/isLocked|lockedBy|lockedAt|maxLockTime|started|completed|objectCount|startTime|endTime|error|inProgress|isCreated|attempts|lastAttemptTime|hasError|errorMessage|creationInProgress|consecutiveResets|maxConsecutiveResets|exists|lastCreationTime|throttleInterval|totalCreations|maxRecreations|minRecreationInterval|creationLock/]",
        "message": "Invalid GridCreationState property. Check for typos or use correct property names."
      }
    ]
  }
};
