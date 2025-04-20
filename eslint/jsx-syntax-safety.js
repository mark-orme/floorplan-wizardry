
/**
 * ESLint rules to catch common JSX syntax errors in TypeScript files
 * @module eslint/jsx-syntax-safety
 */

export const jsxSyntaxSafetyRules = {
  plugins: ["react", "@typescript-eslint"],
  rules: {
    // Validate JSX has closing tags or is self-closed
    "react/jsx-closing-tag-location": "error",
    "react/jsx-closing-bracket-location": "error",
    "react/self-closing-comp": "error",
    
    // Prevent common JSX syntax issues
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",

    // Prevent malformed JSX
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "react/jsx-max-props-per-line": ["error", { "maximum": 1, "when": "multiline" }],
    
    // Enforce proper spread syntax in JSX
    "react/jsx-props-no-spreading": ["warn", {
      "html": "enforce",
      "custom": "ignore",
      "explicitSpread": "ignore",
      "exceptions": ["Component"]
    }],
    
    // Enforce proper React fragment syntax
    "react/jsx-fragments": ["error", "syntax"],
    
    // Validate props indentation
    "react/jsx-indent-props": ["error", 2],
    
    // Prevent common dynamic import syntax errors
    "@typescript-eslint/no-confusing-void-expression": "error",
    
    // Enforce TypeScript import/export syntax rules
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    
    // Prevent import of non-existent modules
    "import/no-unresolved": "error",
    
    // Custom rule for JSX in non-TSX files
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Program > ImportDeclaration[source.value='react'] ~ JSXElement",
        "message": "JSX found in a .ts file. Use .tsx extension for files containing JSX."
      },
      {
        "selector": "JSXOpeningElement[name.name='div']:has(JSXAttribute[name.name='fallback'])",
        "message": "Use proper JSX syntax. Perhaps you meant fallback={<div>...</div>}?"
      },
      {
        "selector": "JSXOpeningElement:has(JSXSpreadAttribute:first-child:last-child)",
        "message": "Be explicit with props. Avoid using standalone spread operator as the only prop."
      },
      {
        "selector": "JSXAttribute[name.name='className'][value.expression.type='TemplateLiteral'][value.expression.expressions.length>3]",
        "message": "Complex className template literals should be extracted to a variable for readability."
      }
    ]
  }
};
