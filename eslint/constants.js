
/**
 * ESLint configuration constants
 * Defines limits and settings for code quality checks
 * @module eslint/constants
 */

/**
 * Maximum line length in characters
 * Prevents excessively long lines that harm readability
 * @constant {number}
 */
export const MAX_LINE_LENGTH = 100;

/**
 * Maximum number of lines per function
 * Encourages breaking down large functions for maintainability
 * @constant {number}
 */
export const MAX_FUNCTION_LINES = 50;

/**
 * Maximum cyclomatic complexity
 * Limits the number of logical paths through a function
 * Prevents overly complex code that's hard to understand and test
 * @constant {number}
 */
export const MAX_COMPLEXITY = 10;

/**
 * Maximum nesting depth
 * Limits how deeply control structures can be nested
 * Prevents code that's difficult to understand and maintain
 * @constant {number}
 */
export const MAX_DEPTH = 3;

/**
 * Prettier formatting options
 * Standard configuration for code formatting
 * @constant {Object}
 */
export const PRETTIER_OPTIONS = {
  /**
   * Whether to use semicolons
   * @constant {boolean}
   */
  semi: true,
  
  /**
   * Whether to use single quotes for strings
   * @constant {boolean}
   */
  singleQuote: false,
  
  /**
   * Maximum line width before wrapping
   * @constant {number}
   */
  printWidth: 100,
  
  /**
   * Trailing comma style
   * @constant {string}
   */
  trailingComma: "all",
  
  /**
   * Number of spaces per indentation level
   * @constant {number}
   */
  tabWidth: 2
};
