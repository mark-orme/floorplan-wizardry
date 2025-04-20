
/**
 * ESLint rule to check for proper DrawingMode usage
 * This rule helps enforce consistent usage of DrawingMode across the application
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure consistent usage of DrawingMode enums',
      category: 'TypeScript',
      recommended: true
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    return {
      // Check for enum inconsistencies
      TSEnumDeclaration(node) {
        if (node.id.name === 'DrawingMode') {
          // Check if values use the correct format
          node.members.forEach(member => {
            if (member.initializer && member.initializer.type === 'Literal') {
              const keyName = member.id.name;
              const value = member.initializer.value;
              
              if (typeof value === 'string') {
                // Check if the key and value don't match in casing
                const expectedValue = keyName.toLowerCase();
                if (value !== expectedValue && value !== keyName) {
                  context.report({
                    node: member,
                    message: `DrawingMode value "${value}" should be consistent with the key name "${keyName}"`,
                    fix(fixer) {
                      return fixer.replaceText(member.initializer, `'${expectedValue}'`);
                    }
                  });
                }
              }
            }
          });
        }
      },
      
      // Check for DrawingMode imports
      ImportDeclaration(node) {
        const source = node.source.value;
        const specifiers = node.specifiers;
        
        // Find DrawingMode imports
        const drawingModeImport = specifiers.find(s => 
          s.imported && s.imported.name === 'DrawingMode'
        );
        
        if (drawingModeImport) {
          // Suggest using the appropriate import source
          if (!source.includes('UnifiedDrawingMode') && 
              !source.includes('constants/drawingModes') &&
              !source.includes('types/FloorPlan') &&
              !source.includes('types/canvasStateTypes')) {
            context.report({
              node,
              message: `Consider importing DrawingMode from a consistent source like '@/types/drawing/UnifiedDrawingMode'`
            });
          }
        }
      }
    };
  }
};
