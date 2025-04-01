
/**
 * Custom ESLint plugin to validate grid constants usage
 * Prevents common errors with grid constant properties
 */
module.exports = {
  rules: {
    "grid-constant-checker/ensure-valid-properties": {
      create(context) {
        // Define all valid GRID_CONSTANTS properties
        const validProperties = [
          "SMALL_GRID_SIZE",
          "LARGE_GRID_SIZE",
          "SMALL_GRID_COLOR",
          "LARGE_GRID_COLOR",
          "SMALL_GRID_WIDTH",
          "LARGE_GRID_WIDTH",
          "DEFAULT_VISIBLE",
          "GRID_Z_INDEX",
          "SCALE_FACTOR",
          "MIN_CANVAS_WIDTH",
          "MIN_CANVAS_HEIGHT",
          "PIXELS_PER_METER",
          "MARKER_TEXT_SIZE",
          "MARKER_COLOR"
        ];
        
        return {
          MemberExpression(node) {
            // Only check GRID_CONSTANTS property access
            if (node.object.type === 'Identifier' && 
                node.object.name === 'GRID_CONSTANTS' &&
                node.property.type === 'Identifier') {
              
              const propertyName = node.property.name;
              
              // If accessing an invalid property, report an error
              if (!validProperties.includes(propertyName)) {
                context.report({
                  node,
                  message: `Invalid GRID_CONSTANTS property '${propertyName}'. Valid properties are: ${validProperties.join(", ")}`
                });
              }
            }
          }
        };
      }
    }
  }
};
