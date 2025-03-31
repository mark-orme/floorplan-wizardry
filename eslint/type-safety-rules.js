
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

    // Enforce null checks before accessing array properties
    "@typescript-eslint/no-unnecessary-condition": ["error", {
      "allowRuntimeChecks": true
    }],

    // Ensure Array.isArray() is used before accessing array methods
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowNullableObject": false,
      "allowNullableBoolean": false,
      "allowAny": false
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
    "@typescript-eslint/explicit-module-boundary-types": "error"
  }
};
