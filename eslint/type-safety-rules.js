
/**
 * TypeScript strict type safety rules
 * Prevents common type errors that have caused build failures
 * @module eslint/type-safety-rules
 */
export const typeSafetyRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Prevent property access on potentially undefined objects
    "@typescript-eslint/no-unsafe-member-access": "error",
    
    // Prevent calling functions with wrong argument counts
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    
    // Enforce explicit checking for property existence
    "@typescript-eslint/no-unsafe-assignment": "error",
    
    // Strictly enforce typing for point objects to prevent fabric/app type confusion
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["fabric"],
          "importNames": ["Point"],
          "message": "Import Point from 'fabric' as FabricPoint to avoid confusion with our app Point type."
        }
      ]
    }],

    // Prevent incompatible type assignments
    "@typescript-eslint/no-explicit-any": "error",
    
    // Only allow type assertions in very specific cases
    "@typescript-eslint/consistent-type-assertions": ["error", {
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "never"
    }],

    // Enforce proper handling of objects that might be null/undefined
    "@typescript-eslint/prefer-optional-chain": "error",
    
    // Enforce checking for exported types
    "@typescript-eslint/explicit-module-boundary-types": "error",
    
    // Rule to enforce proper function calls with correct argument counts
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-misused-promises": "error",
    
    // Enforce proper type checking
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-for-in-array": "error",
    
    // Prevent use of banned types like Object, Function, etc.
    "@typescript-eslint/ban-types": ["error", {
      "types": {
        "Object": {
          "message": "Use 'object' or '{}' instead",
          "fixWith": "object"
        },
        "Function": {
          "message": "Use specific function type instead, like '() => void'"
        }
      }
    }],
    
    // Enforce proper type guards for arrays and objects
    "@typescript-eslint/no-unnecessary-condition": ["error", {
      "allowRuntimeChecks": true
    }]
  }
};
