
/**
 * Grid Type Safety ESLint Rules
 * Prevents common errors with grid-related properties and types
 * @module eslint/grid-type-safety-rules
 */

export const gridTypeSafetyRules = {
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent direct access to grid constants without proper property paths
    "no-restricted-syntax": [
      "error",
      {
        "selector": "MemberExpression[object.name='GRID_SPACING'][property.name!='SMALL'][property.name!='LARGE'][property.name!='DEFAULT']",
        "message": "Access GRID_SPACING with proper property names: SMALL, LARGE, or DEFAULT."
      },
      {
        "selector": "MemberExpression[object.name='GRID_SPACING'][property.name='SMALL']",
        "message": "Use GRID_SPACING.SMALL for grid properties."
      },
      {
        "selector": "MemberExpression[object.name='SMALL_GRID'][property.object.name!='SMALL_GRID_PROPS']",
        "message": "Use SMALL_GRID_PROPS.SMALL or SMALL_GRID_PROPS.DEFAULT for grid properties."
      },
      {
        "selector": "MemberExpression[object.name='LARGE_GRID'][property.object.name!='LARGE_GRID_PROPS']",
        "message": "Use LARGE_GRID_PROPS.LARGE or LARGE_GRID_PROPS.DEFAULT for grid properties."
      },
      // Type safety for numerics constants
      {
        "selector": "ImportDeclaration[source.value='@/constants/numerics'] > ImportSpecifier[imported.name=/^(?!GRID_SPACING|SMALL_GRID_PROPS|LARGE_GRID_PROPS|PIXELS_PER_METER|DEFAULT_LINE_THICKNESS|AREA_PRECISION|DISTANCE_PRECISION|FLOATING_POINT_TOLERANCE|MIN_LINE_LENGTH|MIN_SHAPE_AREA|CLOSE_POINT_THRESHOLD|SHAPE_CLOSE_THRESHOLD|SNAP_THRESHOLD|LARGE_GRID_LINE_WIDTH|SMALL_GRID_LINE_WIDTH|STANDARD_ANGLES|ANGLE_SNAP_THRESHOLD|ZOOM_CONSTRAINTS|MAX_SMALL_GRID_LINES|MAX_LARGE_GRID_LINES|GRID_EXTENSION_FACTOR).*/]",
        "message": "Import only defined constants from numerics.ts. Check that the constant exists before importing."
      }
    ],
    // Enforce proper type imports
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports",
      "disallowTypeAnnotations": true
    }],
    // Prevent usage of 'any' type
    "@typescript-eslint/no-explicit-any": "error",
    // Prevent usage of non-null assertion
    "@typescript-eslint/no-non-null-assertion": "error",
    // Enforce usage of optional chaining
    "@typescript-eslint/prefer-optional-chain": "error"
  }
};
