
/**
 * ESLint rule to prevent the use of lucide-react in favor of react-icons
 * This helps maintain consistent icon usage across the application
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent importing from lucide-react in favor of react-icons',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noLucideReact: "Import from 'react-icons/ai' instead of 'lucide-react'",
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // Check if the import source is lucide-react
        if (node.source.value === 'lucide-react') {
          context.report({
            node,
            messageId: 'noLucideReact',
            fix(fixer) {
              // We can't automatically fix this since there's no one-to-one mapping
              // between lucide-react and react-icons/ai icons
              return null;
            }
          });
        }
      }
    };
  }
};
