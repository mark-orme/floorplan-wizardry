
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent usage of lucide-react icons',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'lucide-react') {
          context.report({
            node,
            message: 'Use icons from react-icons/ai instead of lucide-react',
            fix(fixer) {
              return fixer.replaceText(
                node.source,
                "'react-icons/ai'"
              );
            }
          });
        }
      }
    };
  }
};
