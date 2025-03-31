
/**
 * TypeScript naming convention ESLint rules
 * Enforces consistent naming patterns across the codebase
 * @module eslint/typescript/naming-rules
 */
export const namingRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Enhanced protection for fabric components
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "typeLike",
        "format": ["PascalCase"],
        "filter": {
          "regex": "^(Canvas|Object|Line|Rect|Circle|Ellipse|Polygon|Polyline|Path|Group|Text|IText|Textbox|Image|Triangle|Point)$",
          "match": true
        }
      },
      {
        "selector": "variable",
        "types": ["boolean"],
        "format": ["PascalCase"],
        "prefix": ["is", "has", "can", "should", "will", "did"]
      },
      {
        "selector": "property",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"],
        "filter": {
          "regex": "^(data-|aria-|type|id|[a-zA-Z]+Image|key|name|role|placeholder|label|title|alt|src|href|target|rel|value|min|max|required|disabled|readonly|checked|selected|multiple|size|pattern|minLength|maxLength|step|rows|cols|for|className|style)$",
          "match": false
        }
      }
    ]
  }
};
