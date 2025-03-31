
/**
 * AI and Developer TypeScript ESLint rules
 * Special rules to guide AI code generation and human developers
 * @module eslint/typescript/ai-dev-rules
 */
export const aiDevRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Rules specifically for guiding AI code generation
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // Strongly enforce type safety with DrawingTool/DrawingMode
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportDeclaration[source.value=/drawingTypes/] > ImportSpecifier[imported.name='DrawingTool']",
        "message": "Import DrawingTool only from '@/types/core/DrawingTool' for consistency"
      },
      {
        "selector": "MemberExpression[object.name='DrawingTool']",
        "message": "Use DrawingMode enum instead of DrawingTool for consistent typing"
      },
      {
        "selector": "TSTypeReference[typeName.name='DrawingTool'][typeName.type='Identifier']",
        "message": "Use the canonical DrawingTool type from '@/types/core/DrawingTool'"
      }
    ],
    
    // Clear guidelines for hook typing
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/explicit-module-boundary-types": ["error", {
      "allowArgumentsExplicitlyTypedAsAny": false,
      "allowDirectConstAssertionInArrowFunctions": true,
      "allowHigherOrderFunctions": false,
      "allowTypedFunctionExpressions": false
    }]
  }
};
