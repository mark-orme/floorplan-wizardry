
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
      },
      {
        "selector": "ImportDeclaration[source.value=/\\.tsx?$/] JSXElement",
        "message": "JSX syntax should only be in .tsx files. Check imports and file extensions."
      },
      {
        "selector": "ExportNamedDeclaration > FunctionDeclaration:has(JSXElement)",
        "message": "Functions that return JSX should be in .tsx files."
      }
    ],
    
    // Additional rule to catch React.createElement in .ts files that should be .tsx
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "react",
            "importNames": ["createElement"],
            "message": "React.createElement should only be used in .tsx files when creating elements."
          }
        ],
        "patterns": [
          {
            "group": ["react"],
            "importNames": ["createElement"],
            "message": "React.createElement should only be used in .tsx files when creating elements."
          }
        ]
      }
    ]
  },
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            "patterns": [
              {
                "group": ["react-dom"],
                "importNames": ["createPortal"],
                "message": "React createPortal should only be imported in .tsx files"
              }
            ]
          }
        ]
      }
    }
  ]
};
