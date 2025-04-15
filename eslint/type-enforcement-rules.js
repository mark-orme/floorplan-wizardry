
/**
 * Strict TypeScript ESLint rules
 * Prevents common type issues that have caused build errors
 * @module eslint/type-enforcement-rules
 */

module.exports = {
  rules: {
    // Prevent using any type
    "@typescript-eslint/no-explicit-any": "error",
    
    // Prevent accessing properties that might not exist
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent using non-null assertion operator
    "@typescript-eslint/no-non-null-assertion": "error",
    
    // Enforce explicit return types
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    
    // Enforce proper nullish checking
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    
    // Ensure exported functions have return types
    "@typescript-eslint/explicit-module-boundary-types": "error",
    
    // Prevent implicit boolean conversions
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowString": false,
      "allowNumber": false,
      "allowNullableObject": false,
      "allowNullableBoolean": false,
      "allowNullableString": false,
      "allowNullableNumber": false,
      "allowAny": false
    }],
    
    // Enforce consistent naming patterns
    "@typescript-eslint/naming-convention": [
      "error",
      // Interface names should be prefixed with 'I'
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]
      },
      // Type aliases should use PascalCase
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      },
      // Enums should use PascalCase
      {
        "selector": "enum",
        "format": ["PascalCase"]
      }
    ],
    
    // Prevent type errors in object access
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    
    // Prevent missing properties errors
    "@typescript-eslint/no-missing-required-properties": "error",
    
    // Type guards enforcement
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    
    // Enforce consistent imports
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": true
    }],
    
    // Prevent importing dependencies that don't exist
    "import/no-unresolved": "error",
    
    // Ensure exports named in barrel files exist
    "import/named": "error",
    
    // Custom rules for type checking specific project issues
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportDeclaration[source.value=/drawingTypes/] > ImportSpecifier[imported.name='DebugInfoState']",
        "message": "DebugInfoState should be imported from '@/types/core/DebugInfo' not from drawingTypes"
      },
      {
        "selector": "ImportDeclaration[source.value=/drawingTypes/] > ImportSpecifier[imported.name='CanvasDimensions']",
        "message": "CanvasDimensions should be imported from '@/types/core/Geometry' not from drawingTypes"
      },
      {
        "selector": "TSPropertySignature[key.name=/performanceStats/][typeAnnotation.typeAnnotation.members.length<5]",
        "message": "performanceStats type must include all required properties: fps, frameTime, maxFrameTime, droppedFrames, longFrames"
      },
      {
        "selector": "VariableDeclarator[id.name=/drawing(State|Context)/] > ObjectExpression:not(:has(Property[key.name='distance']))",
        "message": "Drawing state must include distance property"
      },
      {
        "selector": "VariableDeclarator[id.name=/drawing(State|Context)/] > ObjectExpression:not(:has(Property[key.name='cursorPosition']))",
        "message": "Drawing state must include cursorPosition property"
      },
      {
        "selector": "VariableDeclarator[id.name=/drawing(State|Context)/] > ObjectExpression:not(:has(Property[key.name='currentZoom']))",
        "message": "Drawing state must include currentZoom property"
      }
    ]
  }
};
