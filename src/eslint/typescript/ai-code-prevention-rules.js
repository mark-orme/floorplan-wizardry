
/**
 * ESLint rules to catch AI fallback/assistant mistakes and missing imports
 * @module eslint/typescript/ai-code-prevention-rules
 */
module.exports = {
  rules: {
    // Prevent import of symbols that don't exist (common AI hallucinations)
    "no-missing-imports-ai": {
      create(context) {
        return {
          ImportSpecifier(node) {
            const importName = node.imported.name;
            // Known likely mistakes
            if (["isValidRoom", "isValidFloorPlan", "isValidWall", "isValidStroke"].includes(importName)) {
              context.report({
                node,
                message: `Importing binding name '${importName}' is not found. Check your available exports.`
              });
            }
          }
        };
      }
    },
    // Prevent default or named imports from non-existent files
    "no-ai-fallbacks": {
      create(context) {
        return {
          ImportDeclaration(node) {
            const value = node.source.value;
            if (typeof value === "string" && value.match(/ai(ai|assistant|code|utils)/i)) {
              context.report({
                node,
                message: `AI fallback or hallucinated import detected: '${value}'`
              });
            }
          }
        };
      }
    }
  }
};
