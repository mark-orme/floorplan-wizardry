
/**
 * Fabric.js Path Validation Rules
 * 
 * Prevents TypeScript errors related to Fabric.js path data structures
 * and ensures proper Canvas API usage.
 * 
 * @module eslint/typescript/fabric-path-validation
 */

export const fabricPathValidationRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Enforce proper type assertions when working with Fabric.js path data
    "@typescript-eslint/no-explicit-any": ["error", {
      "ignoreRestArgs": true,
      "allow": ["path.path = newPath as any"]
    }],
    
    // Warn about improper type casts with Fabric.js objects
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Identify common Fabric.js path manipulation issues
    "no-restricted-syntax": [
      "error",
      {
        "selector": "AssignmentExpression[left.object.name=/path/][left.property.name='path'][right.type!='AsExpression']",
        "message": "When assigning to path.path, always use proper type assertion (`as any` or specific fabric path type)."
      },
      {
        "selector": "CallExpression[callee.object.name='path'][callee.property.name='setPath'][arguments.length<1]",
        "message": "The path.setPath() method requires a path data argument."
      },
      {
        "selector": "MemberExpression[object.name=/freeDrawingBrush|PencilBrush/][property.name='width'][parent.type='AssignmentExpression'][parent.right.value<0]",
        "message": "Brush width cannot be negative."
      }
    ],
    
    // Prevent misuse of Path constructors
    "no-restricted-imports": [
      "error", 
      {
        "paths": [
          {
            "name": "fabric",
            "importNames": ["Path"],
            "message": "Import Path from fabric and properly type path data to avoid type errors."
          }
        ]
      }
    ],
    
    // Custom rule to validate Fabric.js hook usage
    "@typescript-eslint/naming-convention": [
      "error",
      // Hook return types should follow interface naming conventions 
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"],
        "filter": {
          "regex": "Props$",
          "match": false
        }
      }
    ]
  }
};
