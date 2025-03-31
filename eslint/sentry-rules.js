/**
 * ESLint rules for Sentry usage
 * Ensures consistent usage of Sentry functions across the project
 * @module eslint/sentry-rules
 */
export const sentryRules = {
  rules: {
    // Ensure captureMessage is called with the correct number of arguments
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='captureMessage'][arguments.length<1]",
        "message": "captureMessage requires at least 1 argument (message)"
      },
      {
        "selector": "CallExpression[callee.name='captureMessage'][arguments.length>3]",
        "message": "captureMessage accepts at most 3 arguments (message, messageId, options)"
      },
      // Ensure captureError is called with the correct number of arguments
      {
        "selector": "CallExpression[callee.name='captureError'][arguments.length<1]",
        "message": "captureError requires at least 1 argument (error)"
      },
      {
        "selector": "CallExpression[callee.name='captureError'][arguments.length>3]",
        "message": "captureError accepts at most 3 arguments (error, errorId, options)"
      },
      // Ensure startPerformanceTransaction is called with the correct number of arguments
      {
        "selector": "CallExpression[callee.name='startPerformanceTransaction'][arguments.length<1]",
        "message": "startPerformanceTransaction requires at least 1 argument (name)"
      },
      {
        "selector": "CallExpression[callee.name='startPerformanceTransaction'][arguments.length>2]",
        "message": "startPerformanceTransaction accepts at most 2 arguments (name, options)"
      },
      // Ensure isSentryInitialized is called with no arguments
      {
        "selector": "CallExpression[callee.name='isSentryInitialized'][arguments.length>0]",
        "message": "isSentryInitialized doesn't accept any arguments"
      },
      {
        "selector": "CallExpression[callee.object.property.name='canvas'][callee.property.name='toJSON'][arguments.length>0]",
        "message": "canvas.toJSON() doesn't accept arguments in this Fabric.js version."
      },
      {
        "selector": "CallExpression[callee.property.name='toJSON'][arguments.length>0]",
        "message": "The toJSON() method doesn't accept arguments in this Fabric.js version."
      }
    ],
    // Enforce using proper imports from sentry
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@sentry/react",
            "message": "Import from '@/utils/sentry' instead to ensure consistent usage"
          }
        ],
        "patterns": [
          {
            "group": ["**/sentry/*"],
            "message": "Import from '@/utils/sentry' instead of individual files to ensure consistent usage"
          }
        ]
      }
    ],
    // Make sure the Fabric namespace is properly imported
    "@typescript-eslint/no-namespace": ["error", { "allowDeclarations": true }],
    // Ensure we use proper typing for Fabric.js objects
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    // Enforce using named imports from fabric
    "@typescript-eslint/no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used", 
      "ignoreRestSiblings": true,
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_" 
    }]
  }
};
