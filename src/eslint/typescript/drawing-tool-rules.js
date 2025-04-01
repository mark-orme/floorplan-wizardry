
/**
 * ESLint rules for enforcing proper DrawingMode usage
 * @module eslint/typescript/drawing-tool-rules
 */
module.exports = {
  rules: {
    // Enforce using DrawingMode enum for tool selection
    "drawing-tool-usage/use-drawing-mode-enum": {
      create(context) {
        return {
          // Check calls to setTool or onToolChange
          CallExpression(node) {
            if (
              node.callee.type === "Identifier" && 
              (node.callee.name === "setTool" || node.callee.name === "onToolChange" || 
               node.callee.name === "handleToolChange")
            ) {
              const argument = node.arguments[0];
              
              // If argument is a string literal
              if (argument && argument.type === "Literal" && typeof argument.value === "string") {
                context.report({
                  node,
                  message: `Use DrawingMode enum instead of string literal for tool selection. Replace "${argument.value}" with DrawingMode.${argument.value.toUpperCase().replace(/-/g, '_')}`
                });
              }
              
              // If argument is a variable that's not a member expression (DrawingMode.X)
              if (argument && argument.type === "Identifier") {
                context.report({
                  node,
                  message: `Variable "${argument.name}" used for tool selection. Make sure it comes from DrawingMode enum`
                });
              }
            }
          },
          
          // Check for correct property access on DrawingMode
          MemberExpression(node) {
            if (
              node.object.type === "Identifier" && 
              node.object.name === "DrawingMode" &&
              node.property.type === "Identifier"
            ) {
              const validModeNames = [
                'SELECT', 'DRAW', 'STRAIGHT_LINE', 'RECTANGLE', 'CIRCLE', 
                'TEXT', 'WALL', 'DOOR', 'WINDOW', 'ROOM_LABEL', 'ROOM',
                'LINE', 'MEASURE', 'PAN', 'HAND', 'ZOOM', 'ERASE', 'ERASER'
              ];
              
              if (!validModeNames.includes(node.property.name)) {
                context.report({
                  node,
                  message: `Invalid DrawingMode: "${node.property.name}". Valid modes are: ${validModeNames.join(', ')}`
                });
              }
            }
          }
        };
      }
    },
    
    // Prevent hardcoded tool strings
    "drawing-tool-usage/no-hardcoded-tool-strings": {
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === "string") {
              const knownToolNames = [
                'select', 'draw', 'straight-line', 'rectangle', 'circle', 
                'text', 'wall', 'door', 'window', 'room-label', 'room',
                'line', 'measure', 'pan', 'hand', 'zoom', 'erase', 'eraser'
              ];
              
              if (knownToolNames.includes(node.value)) {
                context.report({
                  node,
                  message: `Hardcoded tool string "${node.value}" found. Use DrawingMode enum instead: DrawingMode.${node.value.toUpperCase().replace(/-/g, '_')}`
                });
              }
            }
          }
        };
      }
    },
    
    // Enforce consistent DrawingMode enum usage
    "drawing-tool-usage/consistent-drawing-mode": {
      create(context) {
        return {
          // Check component props that might be drawing tools
          JSXAttribute(node) {
            if (
              node.name && 
              (node.name.name === "tool" || 
               node.name.name === "activeTool" ||
               node.name.name === "drawingTool")
            ) {
              if (node.value && node.value.type === "Literal" && typeof node.value.value === "string") {
                context.report({
                  node,
                  message: `Use DrawingMode enum for "${node.name.name}" prop instead of string literal: "${node.value.value}"`
                });
              }
            }
          },
          
          // Check tool comparisons to ensure they use DrawingMode
          BinaryExpression(node) {
            if (
              (node.operator === "===" || node.operator === "==" || 
               node.operator === "!==" || node.operator === "!=")
            ) {
              // Check if one operand is a string that could be a drawing tool
              if (node.right.type === "Literal" && typeof node.right.value === "string") {
                const knownToolNames = [
                  'select', 'draw', 'straight-line', 'rectangle', 'circle', 
                  'text', 'wall', 'door', 'window', 'room-label', 'room',
                  'line', 'measure', 'pan', 'hand', 'zoom', 'erase', 'eraser'
                ];
                
                if (knownToolNames.includes(node.right.value)) {
                  context.report({
                    node,
                    message: `Comparing with hardcoded tool string "${node.right.value}". Use DrawingMode enum instead.`
                  });
                }
              }
              
              if (node.left.type === "Literal" && typeof node.left.value === "string") {
                const knownToolNames = [
                  'select', 'draw', 'straight-line', 'rectangle', 'circle', 
                  'text', 'wall', 'door', 'window', 'room-label', 'room',
                  'line', 'measure', 'pan', 'hand', 'zoom', 'erase', 'eraser'
                ];
                
                if (knownToolNames.includes(node.left.value)) {
                  context.report({
                    node,
                    message: `Comparing with hardcoded tool string "${node.left.value}". Use DrawingMode enum instead.`
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
