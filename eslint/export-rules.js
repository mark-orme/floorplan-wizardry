
/**
 * ESLint rules for preventing export-related issues
 * Helps catch duplicate exports and type mismatches before they cause build failures
 * @module eslint/export-rules
 */
export const exportRules = {
  plugins: ["@typescript-eslint"],
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent incompatible return types
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }
    ],
    
    // Enforce consistent naming to avoid duplicates
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "exportedFunction",
        "format": ["camelCase"],
        "leadingUnderscore": "forbid"
      },
      {
        "selector": "exportedVariable",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"],
        "leadingUnderscore": "forbid"
      }
    ],
    
    // Prevent duplicate exports in barrel files
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ExportNamedDeclaration > ExportSpecifier[exported.name=/^(snapToGrid|distanceToGrid)$/]",
        "message": "snapToGrid and distanceToGrid are prone to duplicate exports. Use a more specific name or consider re-exporting with a different name."
      },
      {
        "selector": "ExportAllDeclaration[source.value=/grid|snapping/]",
        "message": "Avoid using export * from grid-related modules. Export specific names to prevent duplicates."
      }
    ],
    
    // Prevent invalid return types
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    
    // Enforce explicit return types for hooks
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["**/grid/exports", "**/grid/snapping"],
            "message": "Import specific functions from grid modules to avoid duplicate exports."
          }
        ]
      }
    ]
  }
};
