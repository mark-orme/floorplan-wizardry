
/**
 * ESLint rule to enforce proper file extensions for JSX and TSX content
 * Helps prevent syntax errors related to JSX in .ts files
 * 
 * @module eslint/typescript/jsx-extension-validation
 */
export const jsxExtensionValidationRule = {
  plugins: ["@typescript-eslint", "react"],
  rules: {
    // Enforce .tsx extension for files containing JSX
    "react/jsx-filename-extension": [
      "error", 
      { "extensions": [".jsx", ".tsx"] }
    ],
    
    // Prevent JSX syntax in .ts files
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSXElement",
        "message": "JSX/TSX syntax found in a .ts file. Use .tsx extension for files containing JSX."
      },
      {
        "selector": "JSXElement",
        "message": "JSX/TSX syntax found in a .ts file. Use .tsx extension for files containing JSX."
      },
      {
        "selector": "CallExpression[callee.name='createPortal']",
        "message": "React createPortal calls should be in .tsx files. Consider changing file extension."
      }
    ]
  }
};
