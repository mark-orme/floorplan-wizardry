
/**
 * JSDoc-specific ESLint rules
 * @module eslint/jsdoc-rules
 */
import jsdoc from "eslint-plugin-jsdoc";

export const jsdocRules = {
  plugins: {
    "jsdoc": jsdoc,
  },
  rules: {
    "jsdoc/require-jsdoc": ["warn", {
      "publicOnly": true,
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true,
        "FunctionExpression": true
      }
    }],
    "jsdoc/require-description": ["warn", {
      "contexts": ["FunctionDeclaration", "ClassDeclaration", "ArrowFunctionExpression", "FunctionExpression", "MethodDefinition"]
    }],
    "jsdoc/require-param": "warn",
    "jsdoc/require-param-description": "warn",
    "jsdoc/require-param-name": "error",
    "jsdoc/require-param-type": "warn",
    "jsdoc/require-returns": "warn",
    "jsdoc/require-returns-description": "warn",
    "jsdoc/require-returns-type": "warn",
    "jsdoc/check-param-names": "error",
    "jsdoc/check-tag-names": "error",
    "jsdoc/check-types": "error",
    "jsdoc/valid-types": "error",
    "jsdoc/no-undefined-types": "warn",
  }
};
