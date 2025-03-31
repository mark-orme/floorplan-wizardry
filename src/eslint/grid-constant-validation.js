
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
    },
    "grid-constant-validation/use-grid-constants": {
      meta: {
        fixable: "code"
      },
      create(context) {
        return {
          // Check for usages of deprecated properties from numerics.ts
          MemberExpression(node) {
            const numericsProps = ['GRID_SPACING', 'SNAP_THRESHOLD', 'PIXELS_PER_METER'];
            
            if (node.object.type === 'Identifier' && 
                numericsProps.includes(node.object.name)) {
              
              const sourceCode = context.getSourceCode();
              const mappings = {
                'GRID_SPACING.SMALL': 'GRID_CONSTANTS.SMALL_GRID_SIZE',
                'GRID_SPACING.LARGE': 'GRID_CONSTANTS.LARGE_GRID_SIZE',
                'PIXELS_PER_METER': 'GRID_CONSTANTS.PIXELS_PER_METER'
              };
              
              // Check if we have a mapping
              const fullPath = `${node.object.name}${node.property ? `.${node.property.name}` : ''}`;
              if (mappings[fullPath]) {
                context.report({
                  node,
                  message: `Use ${mappings[fullPath]} instead of ${fullPath} for better consistency`,
                  fix: (fixer) => {
                    return fixer.replaceText(node, mappings[fullPath]);
                  }
                });
              }
            }
          }
        };
      }
    }
  }
};
