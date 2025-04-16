
/**
 * ESLint rules for Fabric.js test typing
 * Prevents type errors in test files that use Fabric.js mocks
 * 
 * @module eslint/fabric-test-typing-rules
 */
module.exports = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Ensure proper use of asMockCanvas utility
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type!='CallExpression'][value.callee.name!='asMockCanvas']",
        "message": "Canvas props in useStraightLineTool must be properly typed with asMockCanvas(mockCanvas)"
      },
      {
        "selector": "CallExpression[callee.name='renderHook'] > ArrowFunctionExpression > CallExpression[callee.name='useStraightLineTool'] > ObjectExpression > Property[key.name='canvas'][value.type!='CallExpression'][value.callee.name!='asMockCanvas']",
        "message": "Canvas props in renderHook must be properly typed with asMockCanvas(mockCanvas)"
      },
      {
        "selector": "VariableDeclarator > ObjectExpression:has(Property[key.name='on'])[parent.id.name=/mockCanvas|canvas/]",
        "message": "Mock canvas objects should be created with createTypedMockCanvas() or properly typed with IMockCanvas"
      },
      {
        "selector": "CallExpression[callee.name='vi'][callee.object.name='vi'][callee.property.name='mock'][arguments.length=1] StringLiteral[value=/useLineState|useStraightLineTool/]",
        "message": "When mocking hooks, ensure all required properties are included in the mock return value"
      }
    ],
    
    // Enforce proper typing for mock canvas objects
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow-as-parameter"
    }],
    
    // Prevent unsafe casts without proper helper functions
    "@typescript-eslint/no-unsafe-assignment": ["error", {
      "allow": ["asMockCanvas", "asMockObject"]
    }],
    
    // Enforce use of proper helper types
    "@typescript-eslint/naming-convention": [
      "error", 
      {
        "selector": "typeAlias",
        "format": ["PascalCase"],
        "prefix": ["I", "T", "Mock"],
        "filter": {
          "regex": "Mock.*",
          "match": true
        }
      }
    ],
    
    // Enforce proper import paths
    "no-restricted-imports": [
      "error", 
      {
        "paths": [
          {
            "name": "fabric",
            "importNames": ["Canvas"],
            "message": "When importing Canvas for tests, use proper typing with asMockCanvas"
          }
        ]
      }
    ]
  }
};
