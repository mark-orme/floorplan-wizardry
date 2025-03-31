
/**
 * Grid constant validation ESLint rule
 * Ensures that properties accessed on GRID_CONSTANTS actually exist
 */
module.exports = {
  rules: {
    "grid-constant-validation/valid-property-access": {
      create(context) {
        return {
          MemberExpression(node) {
            // Only check property access on GRID_CONSTANTS
            if (node.object.type === 'Identifier' && 
                node.object.name === 'GRID_CONSTANTS') {
              
              // Check if the property being accessed is in our whitelist
              const validProperties = [
                'SMALL_GRID_SIZE', 'LARGE_GRID_SIZE', 
                'SMALL_GRID_COLOR', 'LARGE_GRID_COLOR', 'MAJOR_GRID_COLOR',
                'SMALL_GRID_WIDTH', 'LARGE_GRID_WIDTH',
                'MIN_CANVAS_WIDTH', 'MIN_CANVAS_HEIGHT',
                'SMALL_GRID', 'LARGE_GRID',
                'GRID_SIZE', 'GRID_COLOR',
                'MAX_GRID_LINES', 'MAX_OBJECTS_PER_CANVAS',
                'GRID_RENDER_THROTTLE', 'GRID_CHECK_INTERVAL',
                'PIXELS_PER_METER', 'MARKER_TEXT_SIZE', 'MARKER_COLOR'
              ];
              
              if (node.property.type === 'Identifier' && 
                  !validProperties.includes(node.property.name)) {
                context.report({
                  node,
                  message: `Property '${node.property.name}' does not exist on GRID_CONSTANTS. Available properties are: ${validProperties.join(', ')}`
                });
              }
            }
          }
        };
      }
    }
  }
};
